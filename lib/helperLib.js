var crypto = require('crypto')
  , express = require('express')
  , http = require('http')
  , ObjectID = require('mongodb').ObjectID, 
  cookie = require('cookie');
  
var mongoose = require('mongoose'); 
var User = mongoose.model('User'); 
var Node = require('../models/Node.js');

var io;
var online = [];
var lastExchangeData = {};
var makeCommit = require("./makeCommit.js").makeCommit; 
var getAndSendRevHistory = require("./revAlgorithm.js").getAndSendRevHistory; 

var MessageQueue =require("./MessageQueue.js"); 
console.log("MessageQueue"); 
console.log(MessageQueue); 

module.exports = {

  iterateQueue: MessageQueue.iterateQueue, 

  safeConnectToDB: function(){
    var url = require("../config/config.js").DB_URL; 
    try {  mongoose.connect(url); }
    catch(err) { console.log("Error: Sign In to MongoLab") }
  },

  createSocket: function(server) {
    io = require('socket.io').listen(server, {log: false});
    io.sockets.on('connection', function(socket){

      socket.AUTHOR = {}; //anonymous. 

      socket.on("logIn", function(data){
        socket.AUTHOR = data; 
        attachLogInListeners(socket); 
        console.log("logIn + attachLogInListeners")
      }); 

      socket.on('nodeRequest', function(data){
        var nodes = Node.findAndSocketSend(socket); //finds, then sends through socket. 
      }); 

      socket.on("revHistoryRequest", function(subRootId){
        getAndSendRevHistory(subRootId, socket); 
      }); 

    }); 

  },
  setUpDB: function(){
    Node.setUpDB();
    //getTimeHash();
  }
}













function attachLogInListeners(socket){
  socket.on("COMMIT", function(){
    makeCommit(); 
    socket.emit("commitReceived"); 
  }); 

  //Used when a node is split...
  socket.on("edit", function(data){
    var id = data[0];
    var newText = data[1];
    console.log("\n\n\n\n edit received:" + newText);
    Node.updateText(id, newText);
    socket.broadcast.emit("edit", [id, newText]);

  });

  //This works for all ids except negative ids. 
  socket.on("editing", function(data){ //data=[id, Author.name]
    socket.broadcast.emit("editing", data);
  });


  socket.on("blurred", function(data){
    socket.broadcast.emit("blurred", data);

    var id = data[0];
    var text = data[1];
    var author = data[2]; 

    Node.updateText(id, text, author._id);
  });




  // ADD AUTHOR INFORMATION
  // socket.on("transclude", function(data){
  //   var parId = data[0]; 
  //   var transcludeId = data[2]; 
  //   var newIndex = data[1]; 
  //   var now = Date.now();
  //    Node.updateParent(parId, transcludeId ,newIndex, now );
     
  // });


  //maybe emit sooner...
  //need to broadcast parentArray. 
  socket.on("newNode", function(data){
    MessageQueue.queueOrDo(['newNode', data, socket])
  });
  

  socket.on("removeNode", function(data){ 
    socket.broadcast.emit("removeNode", data);
    MessageQueue.queueOrDo(['removeNode', data, socket])
  });

  socket.on("movedNode", function(data){
    socket.broadcast.emit("movedNode", [data[0], data[2]]);
    MessageQueue.queueOrDo(['movedNode', data, socket])
  });

}
