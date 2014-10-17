var _ = require('underscore'); 
var MySnap = require('../models/Snap.js').MySnap; 
var User = require('../models/User.js');
module.exports.getAndSendRevHistory = getAndSendRevHistory; 


function getAndSendRevHistory(subRootId, sock){
	globalList = []; 
	snapHash = {}; 
	timeHash = {};  
	depth = 0; 
	socket = sock; 

	User.find({}, '_id google.name' , function(err, users){
		socket.emit("UserList", users); 
	}); 

	// subRootId = "53f10817cb52c1e31cf45d94"; 
	// FetchSelfAndChildrenBack(rootId, asyncLoopGetChildren); 
	asyncLoopGetChildren([subRootId]); 
}

//This is all the backSnaps for ONE rootId. 
function updateGlobals(rootSnaps){
	var rootId = rootSnaps[0].cur_id; 
	snapHash[rootId] = snapHash[rootId] || rootSnaps; 
	//snapHash[rootId] = rootSnaps; //should be equivalent. 

	_.each(rootSnaps, function(snap){
		(timeHash[snap.timestamp] = timeHash[snap.timestamp] || []).push(snap);
	}); 

	globalList.push(rootId); 
}

//This should only be called once per ID. 
function FetchSelfAndChildrenBack(rootId, callback){
	/*populate('authorId','_id google.name' ).*/
	MySnap.find({cur_id: rootId}).sort({timestamp: 1}).
	exec(function(err, rootSnaps){
		if(err){console.log("ERROR HERE")}

		updateGlobals(rootSnaps); 

		var metaArray = []; 
		_.each(rootSnaps,function(snap){metaArray.push(snap.children)})

		mergeArrays(metaArray, callback); //(mergeArrays, then get children)
	}); 
}

function mergeArrays(metaArray, callback){
	// console.log("MERGE_SNAPs_CHILDREN"); 
	// console.log("metaArray")
	// console.log(metaArray); 
	mergedArray = _.union(_.flatten(metaArray)); 
	mergedArray = mergedArray.filter( function(a){if (!this[a]) {this[a] = 1; return a;}},{});
	// console.log("mergedArray"); 
	// console.log(mergedArray); 

	callback(mergedArray); //d2temp.push(merged); loopStep(); 
}


//d2=nodes in the next depth.//(maybe been FetchSelfAndChildrenBack'd)
//globalList=nodes in this depth. //(have bene fetch'd)
//temp = nodes to fetch next. 
function MergeAndDiffArraysSync(d2){
	var temp = []; 
	_.each(d2, function(el){
		if(globalList.indexOf(el) == -1){
			temp.push(el); 
		}
	}); 
	console.log("d2"); 
	console.log(d2); 
	globalList = _.union(globalList, temp); 
	return temp
}


//BFS from one node to all of its adjacents. 
//d1Union has all the unique nodes that have ever been a child of root. 
function asyncLoopGetChildren(d1Union){
	var i = 0; 
	var numTimes = d1Union.length; 
	var nextDepthList = []; 
	

	if(typeof d1Union == 'undefined' || d1Union.length == 0){//bottomed out recursion = end of bfs
		// console.log("finished!!!!")
		// console.log("snapHash"); 
		// console.log(snapHash); 
		// console.log("timeHash"); 
		// console.log(timeHash); 
		// console.log("globalList"); 
		// console.log(globalList); 

		socket.emit("revHistory", [snapHash, timeHash]); 
		return; 
	}

	function loopStep(){
		if(i == numTimes){//call completion function
			d2Union = _.union(_.flatten(nextDepthList)); //array of arrays. 

			//these can easily be done using callbacks if this causes a bug. 
			var temp =  MergeAndDiffArraysSync(d2Union);
			asyncLoopGetChildren(temp); 

			return; 
		}

		// fn(loopStep); 
		FetchSelfAndChildrenBack(d1Union[i], function(mergedArray){
			nextDepthList.push(mergedArray); 
			loopStep(); 
		}); 
		i+=1; 
	}




	loopStep(); 
}



