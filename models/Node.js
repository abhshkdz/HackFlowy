var mongoose = require('mongoose'); 

var NodeSchema = new mongoose.Schema({
    text: {type: String}, 
    children: {type: Array}, 
    parents: {type: Array}, 
    markdown: {type: Boolean}
})

var SnapSchema = new mongoose.Schema({
    text: {type: String}, 
    children: {type: Array}, 
    parents: {type: Array}, 
    timestamp: {type: Number}, 
    cur_id: {type: String}
});



var rootID;

var MySnap = mongoose.model('snaps', SnapSchema);
var MyNode = mongoose.model('nodes', NodeSchema);

// Exports
module.exports.addNode = addNode;
module.exports.findNodes = findNodes;
module.exports.updateParent = updateParent;
module.exports.updateText = updateText;
module.exports.setUpDB = setUpDB;
module.exports.removeNode = removeNode;
module.exports.moveNode = moveNode;
module.exports.rootNodeId = rootNodeId;
module.exports.MySnap = MySnap; 

function rootNodeId(){
  return rootID;
}

function moveNode(ids, arrays){
  var thisId = ids[0]; //draggedId
  var now = Date.now();
  MyNode.findById(thisId, null, function(err, node){
    addSnap(node, now);
    node.parents = arrays[0];
    node.save();
  });
  var oldParId = ids[1];
  MyNode.findById(oldParId, null, function(err, node){
    addSnap(node, now);
    node.children = arrays[1];
    node.save();
  });
  var newParId = ids[2];
  MyNode.findById(newParId, null, function(err, node){
    addSnap(node, now);
    node.children = arrays[2];
    node.save();
  });
}

function addSnap(node, now, callback){
  var instance = new MySnap();
  instance.text = node.text;
  instance.children = node.children;
  instance.parents = node.parents;
  instance.cur_id = node._id;
  instance.timestamp = now;
  instance.save(function(err){
    if(err){
      //callback(err);
    }
    else{
      //callback(null, instance);
    }
  });
  
}













//this is technically not good asynchronous code. 
//this coulde be made into a recursive function which takes an array of todo-strings. 
function addListOfNodes(){
  addNode("0root", [], [], function(err, rootNode){
    rootID = rootNodeId._id;
    var parId = rootNode._id;
    addNode("Todos", [], [parId], function(err, vadar){ //called vadar because it is the parent/father
      var vadarId = vadar._id;
      var childArray = []; 
      addNode("Revision Control", [], [vadarId], function(err, child){
        childArray.push(child._id); 
      }); 
      addNode("LatexEditor", [], [vadarId], function(err, child){
        childArray.push(child._id); 
      }); 
      addNode("Lots of other stuff", [], [vadarId], function(err, child){
        childArray.push(child._id); 
        vadar.children = childArray; 
        vadar.save(); 
      }); 
      rootNode.children = [vadarId];
      rootNode.save();
    }); 
  });
}


function setUpDB(){
  MyNode.remove({}, function(err) { console.log('collection removed') });
  MySnap.remove({}, function(err) { console.log('collection removed') });
  addListOfNodes(); 
}

function removeNode(thisId, thisIndex, parId){
  var now = Date.now();
  MyNode.findById(parId, null, function(err, parNode){
    if(err || parNode == null){
      return;
    }
    addSnap(parNode, now);
    var temp = parNode.children;
    console.log(temp.splice(thisIndex, 1));
    console.log(temp);
    parNode.children = temp;

    parNode.save();
  });
  MyNode.findById(thisId, null, function(err, delNode){
    if(err || delNode == null){
      return;
    }
    addSnap(delNode, now);
    if(delNode.parents.length ==1 ){
      delNode.remove();
    }
    else{ //this is the condition that we'll have to take care of if there are dups. 
      delNode.parents = _.without(parents, parId);
      delNode.save();
    }
  })
}

function updateText(id, newText){
  console.log("\nUPDATE TEXT\n" + id + newText);
  var now = Date.now();
  MyNode.findById(id, null, function(err, node){
    if(err || node == null){
      return;
    }
    addSnap(node, now);
    node.text = newText;
    node.save();
  });
}

function updateParent(parId, newId ,newIndex, now){
  MyNode.findById(parId, null, function(err, parNode){
    if(err || parNode == null){
      return;
    }
    addSnap(parNode, now);
    parNode.children.insert(newIndex, newId);
    parNode.save();
  })
}

//add Node to the DB. 
function addNode(text, children, parents, callback){
  var now = Date.now();
  var instance = new MyNode();
  instance.text = text; 
  instance.children = children;
  instance.parents = parents;
  instance.markdown = 0; 
  addSnap(instance, now);

  instance.save(function (err) { 
    if (err) {
      callback(err);
    }
  else {
      callback(null, instance, now);
    }
  }); 
}


function findNodes(socket){
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

Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
