var guidGenerator = function() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

addNode = function(botStr, topStr){
	var randomId = guidGenerator(); 
	var modelJSON = {
		_id: randomId 
	  , text: botStr 
	  , parents: [vo.parentId]
	  , children: []
	  , author: CurrentUser
	};

	
	if(topStr || topStr==""){
		console.log("TOPSTR IS");
		console.log(topStr);
		vo.thisModel.set("text", topStr);
		_.each(vo.thisModel.get("views"), function(view){
			view.updateText(topStr);
		});
		socket.emitWrapper("edit", [vo.thisId, topStr]);
	}

	
	var newNode = new NodeModel(modelJSON);
	nodesCollection.add(newNode);

	vo.parentModel.get("children").insert(vo.thisIndex + 1, randomId);
	
	var data = [ [vo.parentId, vo.thisIndex+1] , modelJSON ]; 
	console.log("AddNode DATA"); console.log(data); 
	socket.emitWrapper("newNode", data);
	
	var parentViews = vo.parentModel.get("views");
	
	var tempIndex = vo.thisIndex+1; //adding nodes alters the index.
	_.each(parentViews, function(parentView){
		parentView.addNode(newNode, tempIndex, true);
	});
	// vo.thisLI.next().children().children("textarea").focus();
	INPUT_PROCESSED=true; 
	console.log("FINISHED- ADD NODE")

}
/*
topStr is to the left. (also, the bottom part will be to the right. )
before: Textarea= topStr + botStr
after: 
-T1: TopStr
-T2: BotStr
*/
splitText = function(that, callback){
	var topStr = ''; var botStr=''; 
	var cur = $(that).getSelection().start;
	var cur1 = cur;
	var len = $(that).val().length;
	var bigStr = $(that).val();
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
	callback(botStr, topStr); //addNode(botStr, topStr);		
}

transclude = function(){
	vo.parentModel.get("children").insert(vo.thisIndex+1, vo.thisId); 
	var modelJSON = {
		_id: vo.thisId
		, text: vo.thisModel.get("text")
		, parents: vo.thisModel.get("parents")
		, children: vo.thisModel.get("children")
	}
	socket.emitWrapper("transclude" , [vo.parentId, vo.thisIndex+1, vo.thisId]); 
	var parentViews = vo.parentModel.get("views"); 
	var tempIndex = vo.thisIndex+1; //adding nodes alters the index.
	_.each(parentViews, function(parentView){
		parentView.addNode(vo.thisModel, tempIndex, true);
	});
	vo.thisLI.next().children().children("textarea").focus();

	INPUT_PROCESSED=true; 
}


