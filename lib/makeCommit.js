var MyNode = require('../models/Node.js').MyNode; 
var snapMoudule = require('../models/Snap.js'); 
var MySnap = snapMoudule.MySnap; 
var addSnap = snapMoudule.addSnap;
var _ = require("underscore");  

module.exports.makeCommit = makeCommit; 



//http://stackoverflow.com/questions/750486/javascript-closure-inside-loops-simple-practical-example
function createCallback(node, now){
	return function(err,snapTimestamp){
				console.log("\t\tSNAPTIMESTAMP"); 
				console.log(snapTimestamp); 
				console.log("\t\tsnapNode"); 
				console.log(node); 

				if(snapTimestamp.length == 0){//noSnaps in DB means MyNode is newNode. 
					if(node.parents.length == 0){node.remove();}//(node was created and deleted before being committed)
					else{addSnap(node, now);}
					return; //just returns from callback, not from the _.each function. 
				}

				snapTimestamp = snapTimestamp[0].timestamp; 
				if(snapTimestamp == node.timestamp){} //no edits have happened for this node. 
				else{//edits have occurred, and we need to save them. 
					if(node.parents.length == 0){
						addSnap(node,now,1); //remove the node with no parents (from NodeCollection).
					}
					else{
						addSnap(node, now); 
					}
				}//else
			}//findSnapTimeStamp => saveSnap.
}

function makeCommit(){
	var now = Date.now(); 
	MyNode.find(function(err,nodes){
		_.each(nodes, function(node){
			console.log("NODE"); 
			console.log(node)
			MySnap.find({cur_id: node._id}, 'timestamp')
			.sort({timestamp: -1}).limit(1).exec(createCallback(node, now));
		});//.each
	}); 
}//function