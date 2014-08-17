var //cookie = require('cookie'), 
   crypto = require('crypto')
  //, exchange = require('./exchange')
  , express = require('express')
  , http = require('http')
  , MemoryStore = express.session.MemoryStore
  , ObjectID = require('mongodb').ObjectID, 
  cookie = require('cookie');
  
var mongoose = require('mongoose'); 
var User = mongoose.model('User'); 
var Node = require('../models/Node.js');
var sessionStore = new MemoryStore();
var io;
var online = [];
var lastExchangeData = {};
var makeCommit = require("./makeCommit.js").makeCommit; 
var getAndSendRevHistory = require("./revAlgorithm.js").getAndSendRevHistory; 


console.log("\n\nLOOK HERE!!")
// console.log(revAlg);

// var revAlg = require('./revControlAlg.js');
// var getTimeHash = revAlg.getTimeHash;
console.log("\n\n");


module.exports = {
  // createUser: function(username, email, password, callback) {
  //   var user = {username: username, email: email
  //     , password: encryptPassword(password)};
  //   db.insertOne('users', user, callback);
  // },
  createUser: function(username, password, callback){
    User.addUser(username, password, callback);
  },  

  getSessionStore: function(){
    return sessionStore;
  },

  createSocket: function(server) {
    io = require('socket.io').listen(server);
    io.sockets.on('connection', function(socket){

      socket.on("COMMIT", function(){
        makeCommit(); 
        socket.emit("commitReceived"); 
      }); 

      socket.on("revHistoryRequest", function(subRootId){
        getAndSendRevHistory(subRootId, socket); 
      }); 

      //socket.emit('news', {hello: "world"}); 
      socket.on('nodeRequest', function(data){
        var nodes = Node.findAndSendSocket(socket); //finds, then sends through socket. 
        //var nodes = {'keep': 'calm'};
        //socket.emit('nodeData', nodes); (emit is in findNodes);
      })

      socket.on("edit", function(data){
        var id = data[0];
        var newText = data[1];
        console.log("\n\n\n\n edit received:" + newText);
        Node.updateText(id, newText);
        socket.broadcast.emit("edit", [id, newText]);

      });

      //This works for all ids except negative ids. 
      socket.on("editing", function(id){
        socket.broadcast.emit("editing", id);
      });


      socket.on("blurred", function(data){
        // console.log('\nBLURRED\n')
        socket.broadcast.emit("blurred", data);
        var id = data[0];
        var text = data[1];
        Node.updateText(id, text);
      });

      //I'm pretty sure i don't use this anywhere. 
      socket.on('nodeInsert', function(data){
        Node.addNode("testText", [], [], function(){});
      }); 

      socket.on("transclude", function(data){
        var parId = data[0]; 
        var transcludeId = data[2]; 
        var newIndex = data[1]; 
        var now = Date.now();
         Node.updateParent(parId, transcludeId ,newIndex, now );
      })
      


      socket.on("newNode", function(data){
        //data[0] = [parID, newindex] . data[1] = 
        var modelJson = data[1]; //(includes the negative ID to find later);
        var parId = data[0][0];
        var newIndex = data[0][1];

        var now = Date.now();
        var callback = function(err, instance, now){
          socket.emit("updateReceived", [modelJson._id ,instance, data[0]]); 
          socket.broadcast.emit("newNode", [ data[0] ,instance]);
          //io.sockets.emit("newNode", [data[0], instance])
          //I'm going to have to update the parent Model on this as well...
          //(and therefore, broadcast the array...)
          Node.updateParent(parId, instance._id ,newIndex, now );
        }
        Node.addNode(modelJson.text, modelJson.children, modelJson.parents, callback);
        
      });

      socket.on("removeNode", function(data){
        // console.log("removeNode!!!"); 
        var thisId = data[0];
        var thisIndex = data[1];
        var parId = data[2];
        socket.broadcast.emit("removeNode", data);
        Node.removeNode(thisId, thisIndex, parId);

      });

      socket.on("movedNode", function(data){
        // var ids = [thisModel.get("_id"), oldParModel.get("_id"), newParModel.get("_id")];
        // var arrays = [thisModel.get("parents"), oldParModel.get("children"), newParModel.get("children")];
        // var data = [ids, arrays];
        Node.moveNode(data[0], data[1]);
        socket.broadcast.emit("movedNode", [data[0], data[2]]);

        

      });

      socket.on("getTimeHash", function(){
        var timeHash = getTimeHash();

        socket.emit("timeHash", timeHash);
      })


    }); 
    // io.configure(function (){
    //   io.set('authorization', function (handshakeData, callback) {
    //     if (handshakeData.headers.cookie) {
    //       handshakeData.cookie = cookie.parse(decodeURIComponent(handshakeData.headers.cookie));
    //       handshakeData.sessionID = handshakeData.cookie['connect.sid'];
    //       sessionStore.get(handshakeData.sessionID, function (err, session) {
    //         if (err || !session) {
    //           return callback(null, false);
    //         } else {
    //           handshakeData.session = session;
    //           console.log('session data', session);
    //           return callback(null, true);
    //         }
    //       });
    //     }
    //     else {
    //       return callback(null, false);
    //     }
    //   });
    // });
  },

  setUpDB: function(){
    Node.setUpDB();
    //getTimeHash();
  }




}

