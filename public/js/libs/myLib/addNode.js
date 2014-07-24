addNode = function(botStr, topStr){
	console.log("ADDNODE (LOGIC)");
	console.log(vo);

	var randomId = ( -1 * Math.floor( Math.random() * 100000000) )
	var modelJSON = {
		_id: randomId 
	  , text: botStr 
	  , parents: [vo.parentId]
	  , children: []
	};

	
	if(topStr){
		console.log("TOPSTR IS");
		console.log(topStr);
		vo.thisModel.set("text", topStr);
		_.each(vo.thisModel.get("views"), function(view){
			view.updateText(topStr);
		});
		socket.emit("edit", [vo.thisId, topStr]);
	}

	
	var newNode = new NodeModel(modelJSON);
	nodesCollection.add(newNode);

	vo.parentModel.get("children").insert(vo.thisIndex + 1, randomId);
	
	socket.emit("newNode", [[vo.parentId, vo.thisIndex+1], modelJSON ]);
	
	var parentViews = vo.parentModel.get("views");
	
	var tempIndex = vo.thisIndex+1; //adding nodes alters the index.
	_.each(parentViews, function(parentView){
		parentView.addNode(newNode, tempIndex, true);
	});
	vo.thisLI.next().children().children("textarea").focus();
}

//topStr is to the left. (also, the bottom part will be to the right. )
splitText = function(that, botStr, topStr, callback){
	var cur = $(that).getSelection().start;
	var cur1 = cur;
	var len = $(that).val().length;
	var bigStr = $(that).val();
	// var botStr = '';
	// var topStr = '';
	var x =0;

	//this is the first half of the string. 
	while(x<cur){
		topStr+=bigStr[x];
		x++;
	}
	//this is the second half of the string. 
	//copies from the beginning of the cursor to the end of the textarea. 
	while(cur<len) {
		botStr += bigStr[cur];
		cur++;
	}

	callback(botStr, topStr); //addNode();		
}

transclude = function(){
	vo.parentModel.get("children").insert(vo.thisIndex+1, vo.thisId); 
	var modelJSON = {
		_id: vo.thisId
		, text: vo.thisModel.get("text")
		, parents: vo.thisModel.get("parents")
		, children: vo.thisModel.get("children")
	}
	socket.emit("transclude" , [vo.parentId, vo.thisIndex+1, vo.thisId]); 
	var parentViews = vo.parentModel.get("views"); 
	var tempIndex = vo.thisIndex+1; //adding nodes alters the index.
	_.each(parentViews, function(parentView){
		parentView.addNode(vo.thisModel, tempIndex, true);
	});
	vo.thisLI.next().children().children("textarea").focus();


}


