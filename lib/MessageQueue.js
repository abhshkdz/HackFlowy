var Node = require("../models/Node.js"); 

var MessageQueue = []; 

module.exports.iterateQueue = function(){
  // console.log("iteratingQueue"); 
  MessageQueue.shift(); //remove the finished operation. 
  if(MessageQueue.length == 0){return;}

  var nextOperation = MessageQueue[0]; 
  executeOperation(nextOperation); 
}

//queueLength needs to be != 0 if there's an operation occuring. 
module.exports.queueOrDo = function(operation){
  if(MessageQueue.length == 0){
    MessageQueue.push(operation); 
    executeOperation(operation); 
  }
  else{
    // console.log("QUEUE BEING USED!!!"); 
    MessageQueue.push(operation); 
  }
}






function executeOperation(operation){
  var type = operation[0]; 
  var data = operation[1]; 
  var socket = operation[2]; 

  switch(type){
    case "newNode": 
      addNode(data, socket); break;
    case "removeNode":
      removeNode(data, socket); break;
    case "movedNode": 
      moveNode(data, socket); break;
    default: 
      break;
  }
}


function moveNode(data, socket){
    // var ids = [thisModel.get("_id"), oldParModel.get("_id"), newParModel.get("_id")];
    // var arrays = [thisModel.get("parents"), oldParModel.get("children"), newParModel.get("children")];
    // var indices = [dragIndex, dropIndex];
    // var data = [ids, arrays, indices, CurrentUser];

    Node.moveNode(data[0], data[1],data[3]._id);
}


function removeNode(data, socket){
    var thisId = data[0];
    var thisIndex = data[1];
    var parId = data[2];
    var author = data[3];
    // data[3] = null; //improve efficiency. 
    
    Node.removeNode(thisId, thisIndex, parId, author._id);
}


//need to broadcast parentArray. 
function addNode(data, socket){
  var modelJson = data[1]; //(includes the negative ID to find later);
  var parId = data[0][0];
  var newIndex = data[0][1];
  var Author = data[2]; 

  var now = Date.now();

  var callback = function(err, instance, now){
    socket.emit("updateReceived", [modelJson._id ,instance, data[0]]); //(update the ID)
    socket.broadcast.emit("newNode", [ [parId,newIndex]  , instance ]);

    
    Node.updateParent(parId, instance._id ,newIndex, now );
  }

  // console.log("newNode"); 
  Node.addNode(modelJson.text, modelJson.children, modelJson.parents, modelJson.author._id ,callback);
  
}
