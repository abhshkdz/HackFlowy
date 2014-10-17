renderRevControl = function(rootNode, timeStamp){
	rootSnap = fetchLTE(rootNode, timeStamp ); //var?

	var finalCollection = []; 

	var queue = [rootSnap]; 
	while(queue.length > 0){
		snap = queue.shift(); 
		finalCollection.push(snap); 
		childrenSnaps = fetchChildren(snap,timeStamp); 
		_.each(childrenSnaps, function(childSnap){queue.push(childSnap)}); 
	} 


	return new NodesCollection(finalCollection); //snapCollection
}


//we want the first snap that has a timestamp lessThan or Equal to this. 
//(if none exists, then this call is made in error!). 
function fetchLTE(nodeId, timeStamp){ 
	var snapList = snapHash[nodeId]; //sorted, [0] is smallest
	for(var i = snapList.length-1 ; i >= 0; i--){ //start with biggest/mostRecent. 
		if(snapList[i].timestamp <= timeStamp){
			return snapList[i]; 
		}
	}
	alert("error!!"); 
}

function fetchChildren(subRootSnap,timeStamp){
	childrenSnaps = []; 
	// var timeStamp = snap.timestamp; 
	_.each(subRootSnap.children, function(childId){
		childrenSnaps.push( fetchLTE(childId, timeStamp) );
	}); 
	return childrenSnaps; 
}