

searchHandler = function(event){
	console.log("searchHandler");
	if(event.which != 13){return;}
	event.preventDefault();
	var search = event.target.value; 

	var SUBSET = nodesCollection.filter(function(model){
		return model.get('text').indexOf(search) != -1;
	});  
	myRouter.viewSearchSubset(SUBSET); 
	
}

keydownHandler = function(event){ //the entire body is wrapped in this. 
	var that = this;
	// console.log("keyDownHandler"); 

	INPUT_PROCESSED=true; 
	if(event.target.id == 'searchBar'){searchHandler(event); return;}
	if(event.which == undefined){ console.log("ABORTED- event.which==undefined"); return; }
	if(!CurrentUser){ alert("only logged in users can edit"); return;}//prevent non-logged in users from editing. 

	if(!INPUT_PROCESSED){console.log("ABORT- INPUT_PROCESSED=false"); return;}//hitting-enter too quickly causes bugs. Need to make sure nodes have been added. 
	if(event.which == 13){event.preventDefault();}

	voInitializer(that, event);
	// console.log("ABOUT TO PROCESS INPUT"); 

	/*
	// INPUT_PROCESSED = false; 
	I was having trouble figuring out all the places I needed to set it back to true, SO,
	I just got rid of this constraint. It actually seems to work just fine.
	*/

	//event.preventDefault();
	//http://stackoverflow.com/questions/20964729/run-keydown-event-handler-after-the-value-of-a-textarea-has-been-changed
	//keyupp fixes this, but causes other problems.  
	var moveOperation = (vo.hitTab || vo.hitEnter || (vo.hitBack && vo.atBeg && !vo.highLighted)); 
	var arrowOperation = (event.keyCode <= 40 && event.keyCode >= 37)
	if( !(moveOperation || arrowOperation) ){
		//The reason this isn't syncing perfectly between bullets is that...
		//... the text-area val hasn't updated at this point. 
		vo.thisModel.set("text", $(that).val());
		_.each(vo.thisModel.get("views"), function(view){
			view.updateText()
		});
		INPUT_PROCESSED = true; 
		return; 
	}

	if(vo.hitEnter){
			event.preventDefault();
			
			if(event.shiftKey){ //(expand/collapse)
				_.each(vo.thisModel.get("views"), function(view){
					view.collapse(); 
				}); 
				event.preventDefault();
				INPUT_PROCESSED=true; 
				return;
			}
			
			if(!event.shiftKey){
				event.preventDefault();

				if(vo.empty){
					addNode("");
					return;
				}//if(empty)

				else{//!empty
					if(vo.atEnd){
						addNode("");
						return;
					}//
					if(!vo.atEnd && !vo.atBeg){ //split bullet(Works correctly)
						splitText(that, addNode);
						return;
					}
					if(!vo.atEnd && vo.atBeg){//addNode (before). (equivalent to splitting bullet)
						vo.thisIndex--; //a hack that works.
						//var myLI = vo.thisLI; 
						// setTimeout(function(){myLI.children().children("textarea").focus()}, 3); 
						addNode(""); 
						
						return;
					}
				}//!empty
				
			}			
	} //hitEnter

	if(vo.hitBack && vo.empty){ 
		if(vo.rootLevel && vo.parentModel.get("children").length == 1){return;}
		if(vo.thisModel.get('children').length != 0){INPUT_PROCESSED=true; return;}
		event.preventDefault();
		removeNode(vo);
		return; 
	}//hitBack. 
	if(vo.hitBack && vo.atBeg && !vo.highLighted){
		event.preventDefault();
		if(vo.siblingModel.get("text")==""){
			if(vo.siblingModel.get('children').length != 0){INPUT_PROCESSED=true; return;}
			var tempVo = {};
			tempVo.thisId = vo.siblingModel.get("_id"); 
			tempVo.thisIndex = vo.thisIndex-1; 
			tempVo.thisModel = vo.siblingModel; 
			tempVo.thisLI = vo.siblingLI; 
			tempVo.parentModel = vo.parentModel; 
			tempVo.parentId = vo.parentId; 
			tempVo.cursorHack = true; 
			removeNode(tempVo); 
		}

	}

	// // START ON HIT TAB
// 	if (vo.hitTab) {
		
// 		event.preventDefault();

// 		if (event.shiftKey) {
// 			event.preventDefault();


// 			if (($(this).parent().parent().parent().hasClass("root"))) {
// 				// do nothing. //alert() //IT USED TO BE ID = 'ROOT' // we use 'root SubList' because it has two classes. 
// 			}
// 			else { // OUTDENT!!
// 				var newIndex = $(this).parent().parent().parent().closest("li").index();
// 				debugger;
// 				moveNode(vo.thisModel, vo.thisIndex, vo.parentModel, vo.grandParentModel, newIndex+1, true);
// 			}
// 		}
// 		var hasAboveSibling = (vo.thisIndex != 0);
// 		if(!event.shiftKey && (hasAboveSibling) ){
// 			var newIndex = vo.siblingModel.get("children").length; // no need for a + 1, because 0 index + insert (duh)
// 			moveNode(vo.thisModel, vo.thisIndex, vo.parentModel, vo.siblingModel, newIndex, true);
// 		}
// 	}// END ON HIT TAB
if((vo.hitTab && !event.shiftKey) || (event.keyCode == 39 && event.shiftKey)){ //INDENT
	event.preventDefault();
	var hasAboveSibling = (vo.thisIndex != 0);
		if(hasAboveSibling){
			var newIndex = vo.siblingModel.get("children").length; // no need for a + 1, because 0 index + insert (duh)
			moveNode(vo.thisModel, vo.thisIndex, vo.parentModel, vo.siblingModel, newIndex, true);
			setTimeout(function(){
				
			}, 100); 
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
		

	}
}

	if(event.keyCode == 38 && event.shiftKey) { //move up
			if(vo.thisLI.isFirstViz()){return;}//don't factor this out into the above if-statement
			moveNode(vo.thisModel, vo.thisIndex, vo.parentModel, vo.parentModel, vo.thisIndex-1, true);
			return; 
	}
	if(event.keyCode == 40 && event.shiftKey) { //move down
			if( vo.thisLI.isLastViz() ){return;}
			moveNode(vo.thisModel, vo.thisIndex, vo.parentModel, vo.parentModel, vo.thisIndex+1, true);
			return; 
	}


	if(event.keyCode == 38){//cursor Up
		debugger; 
		if( vo.thisLI.isFirstViz()){
			vo.thisLI.parent().parent().children().children("textarea").focus();
		}
		else{
			vo.thisLI.prev().children().children("textarea").focus();
		}
	}
	if(event.keyCode == 40){ //down
		debugger; 
		if(vo.thisLI.children("ul").children(":visible").length != 0){
			vo.thisLI.children("ul").children(":first").children().children("textarea").focus();
		}
		else{
			vo.thisLI.next().children().children("textarea").focus();
		}

	}

	// if(event.keyCode)



}//keyboardHandler