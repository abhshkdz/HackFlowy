/*
I realize that a lot of this logic depends on the UI.
This is an unfortunate consequence of the fact that when I was originally
doing this, I wasn't using back-bone, and wasn't using models. 
*/
voInitializer = function(that, event){
	//var that = this;
	vo = {};
	vo.hitEnter = (event.which == 13);
	vo.hitTab = (event.which ==9); 
	vo.atEnd = ( $(that).getSelection().end == $(that).val().length);
	vo.atBeg = ( $(that).getSelection().start == 0);

	//cursor = $(this).getSelection().start;
	vo.hitBack = (event.which ==8);
	vo.empty = ($(that).val().length ==0);
	vo.highLighted = !vo.empty && ( $(that).getSelection().end != $(that).getSelection().start )
	
	vo.rootLevel = $(that).closest("ul").is(".root")
	vo.lastBullet = ( $(that).closest("li").isFirstViz() && vo.rootLevel); //(not useful)
	vo.thisLI = $(event.target).closest("li");
	vo.thisId = vo.thisLI.attr("data-id"); //data-id. 
	vo.thisIndex = vo.thisLI.index(); //returns -1 if there's no match. 
	vo.thisModel = nodesCollection.findWhere({_id: vo.thisId});
	vo.thisView = vo.thisModel.get("views").slice(-1)[0]; //we're assuming a tree. 
	//(also, I'm not garbage collecting extra views when you zoom in/out, so we have to grab last element). 

	vo.siblingLI = vo.thisLI.prevAll(":visible:first"); 
	vo.siblingIndex = vo.siblingLI.index();
	vo.siblingId = vo.siblingLI.attr("data-id");
	vo.siblingModel = nodesCollection.findWhere({_id: vo.siblingId});



	
	if(vo.rootLevel){
			vo.parentLI = undefined;
			vo.parentId = (vo.thisLI.closest("ul").attr("data-id"))
			vo.grandParentId = undefined; // won't matter since outTab prevents it. //unless programattic.
	}
	else{ //not root level.
		//debugger;
		vo.parentLI = vo.thisLI.parent().closest("li");
		vo.parentId = (vo.parentLI.attr("data-id"));
		if(vo.parentLI.attr("data-depth") == 0){ //could test this another way. 
			vo.grandParentId = vo.parentLI.closest("ul").attr("data-id");
			//console.log("grandParentId" + grandParentId)
		}
		else{
			vo.grandParentId = (vo.parentLI.parent().closest("li").attr('data-id'));
			//console.log("grandParentId" + grandParentId)
		}
	}
	vo.grandParentModel = nodesCollection.findWhere({_id: vo.grandParentId});
	vo.parentModel = nodesCollection.findWhere({_id: vo.parentId});

	vo.cursorHack = false; 
} //(vo-initializer)