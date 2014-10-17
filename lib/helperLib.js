var crypto = require('crypto')
  , express = require('express')
  , http = require('http')
  , ObjectID = require('mongodb').ObjectID, 
  cookie = require('cookie');
  
var mongoose = require('mongoose'); 
var User = mongoose.model('User'); 
var Node = require('../models/Node.js');

var io = "uninitialized..."; 
var online = [];
var lastExchangeData = {};
var makeCommit = require("./makeCommit.js").makeCommit; 
var getAndSendRevHistory = require("./revAlgorithm.js").getAndSendRevHistory; 

var MessageQueue =require("./MessageQueue.js"); 
console.log("MessageQueue", MessageQueue); 

var CURRENT_TIMESTAMP = Date.now(); 

module.exports = {

  validateParArr: function(parId, parArr){
    io.sockets.emit("VALIDATE", [parId, parArr]); 
  }, 

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
        console.log("NodeRequst, CURRENT_TIMESTAMP", CURRENT_TIMESTAMP); 
        var nodes = Node.findAndSocketSend(socket, CURRENT_TIMESTAMP); //finds, then sends through socket. 
      }); 

      socket.on("revHistoryRequest", function(subRootId){
        getAndSendRevHistory(subRootId, socket); 
      }); 

      socket.on('disconnect', function(){
        console.log("DISCONNECT", socket.CUR_ID); 
        if(!(socket.CUR_ID == undefined)){
          io.sockets.emit("blurred", [socket.CUR_ID, null]); 
        }
      })

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
  //Maybe set CurID
  socket.on("edit", function(data){
    var id = data[0];
    var newText = data[1];
    console.log("\n\n\n\n edit received:" + newText);
    Node.updateText(id, newText);
    socket.broadcast.emit("edit", [id, newText]); 
  });

  //This works for all ids except negative ids. 
  socket.on("editing", function(data){ //data=[id, Author.name]
    console.log("EDITING received!"); 
    console.log(data); 
    socket.broadcast.emit("editing", data);
    socket.CUR_ID = data[0]; //(used for disconnecting on browserClose); 
  });


  socket.on("blurred", function(data){
    console.log("BLURRED , CUR_ID", socket.CUR_ID);  
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


  var syncValidation = function(data, timestampData, queueData, emitData){
    if(timestampData[1] != CURRENT_TIMESTAMP){
      socket.emit("OFF_SYNC"); 
    }
    else{
      CURRENT_TIMESTAMP = timestampData[0]; 
      socket.broadcast.emit(emitData[0], emitData[1], CURRENT_TIMESTAMP); 
      MessageQueue.queueOrDo(queueData); 
    }
  }
  //maybe emit sooner...
  //need to broadcast parentArray. 
  //timestampData=[CURRENT_TIMESTAMP, oldTime]
  socket.on("newNode", function(data, timestampData){ 
    var queueData = ['newNode', data, socket]; 
    var emitData = ['newNode', data]; 
    syncValidation(data, timestampData, queueData, emitData); 
    //(todo = set IDs on client (instead of negative Ids)); 
  });
  

  socket.on("removeNode", function(data, timestampData){ 
    console.log("removeNode", data); 
    var queueData = ['removeNode', data, socket]; 
    var emitData = ["removeNode", data]; 
    syncValidation(data, timestampData, queueData, emitData); 
  });

  socket.on("movedNode", function(data, timestampData){
    var queueData = ['movedNode', data, socket]; 
    var emitData = [ "movedNode", [data[0],data[2]] ]; 
    syncValidation(data, timestampData, queueData, emitData); 
  });

}
