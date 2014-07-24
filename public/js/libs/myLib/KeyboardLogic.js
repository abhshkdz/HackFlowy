voInitializer = function(that, event){
	
	vo = {};
	vo.hitEnter = (event.which == 13);
	vo.hitTab = (event.which ==9); 
	vo.atEnd = ( $(that).getSelection().end == $(that).val().length);
	vo.atBeg = ( $(that).getSelection().start == 0);
	//cursor = $(this).getSelection().start;
	vo.hitBack = (event.which ==8);
	vo.empty = ($(that).val().length ==0);
	
	vo.rootLevel = $(that).closest("ul").is(".root")
	vo.lastBullet = ( $(that).closest("li").is(":first-child") && vo.rootLevel);
	vo.thisLI = $(event.target).closest("li");
	vo.thisId = vo.thisLI.attr("data-id"); //data-id. 
	vo.thisIndex = vo.thisLI.index(); //returns -1 if there's no match. 
	vo.thisModel = nodesCollection.findWhere({_id: vo.thisId});

	vo.siblingLI = vo.thisLI.prev();
	vo.siblingIndex = vo.siblingLI.index();
	vo.siblingId = vo.siblingLI.attr("data-id");
	vo.siblingModel = nodesCollection.findWhere({_id: vo.siblingId});

	console.log(nodesCollection);
	console.log(vo.thisModel);



	
	if(vo.rootLevel){
			vo.parentLI = undefined;
			vo.parentId = (vo.thisLI.closest("ul").attr("data-id"))
			vo.grandParentId = undefined; // won't matter since outTab prevents it. //unless programattic.
	}
	else{ //not root level.
		vo.parentLI = vo.thisLI.parent().closest("li");
		vo.parentId = (vo.parentLI.attr("data-id"));
		if(vo.parentLI.attr("data-depth") == 0){ //could test this another way. 
			vo.grandParentId = vo.parentLI.closest("ul").attr("data-id");
		}
		else{
			vo.grandParentId = (vo.parentLI.parent().closest("li").attr('data-id'));
		}
	}
	vo.grandParentModel = nodesCollection.findWhere({_id: vo.grandParentId});
	vo.parentModel = nodesCollection.findWhere({_id: vo.parentId});
}


keydownHandler = function(event){ //the entire body is wrapped in this. 
	var that = this;
	//
	if(event.which == undefined){ return; }
	
	voInitializer(that, event);

	//minor-bug
	//event.preventDefault();
	//http://stackoverflow.com/questions/20964729/run-keydown-event-handler-after-the-value-of-a-textarea-has-been-changed
	//keyupp fixes this, but causes other problems. 
	if( !(vo.hitTab || vo.hitEnter || (vo.hitBack && vo.empty))){
		//The reason this isn't syncing perfectly between bullets is that...
		//... the text-area val hasn't updated at this point. 
		vo.thisModel.set("text", $(that).val());
		_.each(vo.thisModel.get("views"), function(view){
			view.updateText()
		});
	}

	if(vo.hitEnter){
			event.preventDefault();
			
			if(event.shiftKey){
				_.each(vo.thisModel.get("views"), function(view){
					view.collapse(); 
				}); 
				event.preventDefault();
				alert("Temporarily is used for expand/collapse (instead of clicking)")
			}
			
			if(!event.shiftKey){
				event.preventDefault();
				if(vo.empty){
					addNode("");
					return;
				}//if(empty)
				else{//!empty
					if(vo.atEnd){
						//alert("CORRECT!")
						addNode("");
						return;
					}//
					if(!vo.atEnd && !vo.atBeg){ //split bullet
						var topStr = '';
						var botStr = '';
						splitText(that, botStr, topStr, addNode);
						return;
						//addNode(botStr, topStr);
					}
					if(!vo.atEnd && vo.atBeg){//addNode (before). (equivalent to splitting bullet)
						var topStr = '';
						var botStr = '';
						splitText(that, botStr, topStr, addNode);
						return;
						//addNode(botStr, topStr);
					}
				}//!empty
				
			}			
	} //hitEnter

	if(vo.hitBack && vo.empty){
		event.preventDefault();
		removeNode(vo);

	}//hitBack. 

if((vo.hitTab && !event.shiftKey) || (event.keyCode == 39 && event.shiftKey)){ //INDENT
	event.preventDefault();
	var hasAboveSibling = (vo.thisIndex != 0);
		if(hasAboveSibling){
			var newIndex = vo.siblingModel.get("children").length; // no need for a + 1, because 0 index + insert (duh)
			moveNode(vo.thisModel, vo.thisIndex, vo.parentModel, vo.siblingModel, newIndex, true);
		}
}
if((vo.hitTab && event.shiftKey) || (event.keyCode == 37 && event.shiftKey)){// OUTDENT!!
	if (($(this).parent().parent().parent().hasClass("root"))) {
				// do nothing. //alert() //IT USED TO BE ID = 'ROOT' // we use 'root SubList' because it has two classes. 
	}
	else { 
		var newSiblingUL = $(this).parent().parent().parent(); 
		var newIndex = newSiblingUL.closest("li").index();
		moveNode(vo.thisModel, vo.thisIndex, vo.parentModel, vo.grandParentModel, newIndex+1, true);
		setTimeout(function(){ //(MoveNode is asynchronous, so you need to wait a little bit.). 
			newSiblingUL.parent().next().children().children("textarea").focus(); 
		}, 100); 
	}//if->else
}//if

	if(event.keyCode == 38 && event.shiftKey && !vo.thisLI.is(":first-child")) { 
			moveNode(vo.thisModel, vo.thisIndex, vo.parentModel, vo.parentModel, vo.thisIndex-1, true);
			return; 
	}
	if(event.keyCode == 40 && event.shiftKey && !vo.thisLI.is(":last-child")) { 
			moveNode(vo.thisModel, vo.thisIndex, vo.parentModel, vo.parentModel, vo.thisIndex+1, true);
			return; 
	}

}//vo-initializer

Array.prototype.removeOne = function(parId){
	var parIndex = this.indexOf(parId);
	this.remove(parIndex);
}










