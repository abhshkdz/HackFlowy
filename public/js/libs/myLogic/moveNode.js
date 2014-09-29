//Handles indenting,outdenting,moving up/down, and drag-n-drop. 
var moveNode = function(thisModel, dragIndex, oldParModel, newParModel, dropIndex, chr){
	//removeNode from OldParent part 1 = #models
	console.log("\n\n");
	console.log(dragIndex);
	console.log(oldParModel.get("children"));
	oldParModel.get("children").remove(dragIndex);
	thisModel.get("parents").removeOne(oldParModel.get("_id"));
	console.log(oldParModel.get("children"));
	console.log("\n\n");

	//removeNode from OldParent part 2 = #views
	_.each(oldParModel.get("views"), function(oldParView){
		oldParView.removeNode(dragIndex);
	});

	//add the Node to the newParent part 1 = #models
	newParModel.get("children").insert(dropIndex, thisModel.get("_id"));
	thisModel.get("parents").push(newParModel.get("_id"));

	//add the node to the newParent part 2 = #views
	_.each(newParModel.get("views"), function(newParView){
		newParView.addNode(thisModel, dropIndex, chr);
	});

	var ids = [thisModel.get("_id"), oldParModel.get("_id"), newParModel.get("_id")];
	var arrays = [thisModel.get("parents"), oldParModel.get("children"), newParModel.get("children")];
	var indices = [dragIndex, dropIndex];
	var data = [ids, arrays, indices, CurrentUser];

	if(chr){ 
		socket.emitWrapper("movedNode", data);
	}
	
	INPUT_PROCESSED=true; 
}