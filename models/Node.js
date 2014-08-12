var mongoose = require('mongoose'); 

var NodeSchema = new mongoose.Schema({
    text: {type: String}, 
    children: {type: Array}, 
    parents: {type: Array}, 
    markdown: {type: Boolean},
    timestamp: {type: Number}
}); 

var MyNode = mongoose.model('nodes', NodeSchema);

var snapModule = require('./Snap.js');
var MySnap = snapModule.MySnap; 
var addSnap = snapModule.addSnap; 



// Exports
module.exports.MyNode = MyNode; 

module.exports.findAndSendSocket = findAndSendSocket
module.exports.setUpDB = setUpDB;

module.exports.moveNode = moveNode;
module.exports.removeNode = removeNode;
module.exports.updateParent = updateParent;
module.exports.updateText = updateText;
module.exports.addNode = addNode;




// module.exports.rootNodeId = rootNodeId;

// var rootID;
// function rootNodeId(){
//   return rootID;
// }

function findAndSendSocket(socket){
  var nodes = {'keeping': 'calm'}
  MyNode.find(function(err, nodes){
    if(!err){
      socket.emit('nodeData', nodes)
      return {'hell': 'yes'}
    }else{
      socket.emit('nodeData', "error!!!")
     return {'hell': 'no'}
    }

    
  }); 
}


function setUpDB(){
  MyNode.remove({}, function(err) { console.log('collection removed') });
  MySnap.remove({}, function(err) { console.log('collection removed') });

  // addNode("0root", [], ["123456"]); 
  // addNode("Welcolme!", [], [rootNode._id]); 

  addNode("0root", [], ["123456"], function(err, rootNode){ 
    addNode("Welcolme!", [], [rootNode._id], function(err, firstBullet){
      rootNode.children = [firstBullet._id]
      var now = rootNode.timestamp = firstBullet.timestamp
      addSnap(rootNode, now); 
      addSnap(firstBullet, now);
    }); 
  }); 
}









function moveNode(ids, arrays){
  var thisId = ids[0]; //draggedId
  var now = Date.now();
  MyNode.findById(thisId, null, function(err, node){
    node.timestamp = now; 
    node.parents = arrays[0];
    node.save();
  });
  var oldParId = ids[1];
  MyNode.findById(oldParId, null, function(err, node){
    node.timestamp = now; 
    node.children = arrays[1];
    node.save();
  });
  var newParId = ids[2];
  MyNode.findById(newParId, null, function(err, node){
    node.timestamp = now; 
    node.children = arrays[2];
    node.save();
  });
}

function removeNode(thisId, thisIndex, parId){
  var now = Date.now();
  MyNode.findById(parId, null, function(err, parNode){
    if(err || parNode == null){
      return;
    }
    var temp = parNode.children;
    temp.splice(thisIndex, 1); //remove thisIndex. 
    parNode.children = temp;
    parNode.timestamp = now; 

    parNode.save();
  });
  MyNode.findById(thisId, null, function(err, delNode){
    if(err || delNode == null){
      return;
    }
    delNode.timestamp = now; 
    if(delNode.parents.length ==1 ){//(this if statement is technically redundant)
      // delNode.remove();
      delNode.parnets = []; //(this is how deletion is represented). 
      delNode.save(); 
    }
    else{ //this is the condition that we'll have to take care of if there are dups. 
      delNode.parents = _.without(parents, parId);
      delNode.save();
    }
  })
}

function updateText(id, newText){
  MyNode.findById(id, null, function(err, node){
    if(err || node == null){
      return;
    }
    node.timestamp = Date.now();
    node.text = newText;
    node.save();
  });
}

function updateParent(parId, newId ,newIndex, now){
  MyNode.findById(parId, null, function(err, parNode){
    if(err || parNode == null){
      return;
    }
    parNode.children.insert(newIndex, newId);
    parNode.timestamp = Date.now(); 
    parNode.save();
  })
}
//add Node to the DB. 
function addNode(text, children, parents, callback){
  var instance = new MyNode();
  instance.text = text; 
  instance.children = children;
  instance.parents = parents;
  instance.markdown = 0; 
  instance.timestamp = Date.now(); 

  instance.save(function (err) { 
    if (err) {
      callback(err);
    }
  else {
      callback(null, instance); 
    }
  }); 
}












Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
