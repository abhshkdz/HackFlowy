$(function(){
	$("#COMMIT").click(function(){
		socket.emitWrapper("COMMIT"); 
	}); 

	$(".getRevHistory").click(function(e){
		var rootId = $(".root").attr("data-id")
		socket.emitWrapper("revHistoryRequest", rootId); 
		$(e.target).attr("data-id", rootId); 
	});

	var currentSelected;
	$("body").on("click", ".snapLI", function(e){
		if(!currentSelected){currentSelected=$(e.target)}//initialization
		currentSelected.removeClass("selectedSnap"); 
		currentSelected=$(e.target); 
		currentSelected.addClass("selectedSnap"); 

		displaySnapInfo(currentSelected.parent().parent()); 
	});

	var displaySnapInfo = function(snapLI){
		debugger; 
		var snapModel = snapCollection.findWhere({_id: snapLI.attr("data-id")}); 
		$('#authorLI').html("author:" + UserHash[snapModel.get("authorId")]); 
		$('#timestampLI').html("timestamp:" + snapModel.get("timestamp")); 
	}

	$(".toggleSidebar").click(function(){
		$("#mainPanel").toggleClass("floatRight centering"); 
		$("#metaSidebar").toggleClass("hideBar"); 
	}); 

	$("#revTimestamps").on("click", "a.timestamp", function(event){
	// debugger; 
		var a = event.target; 
		var timestamp = parseInt($(a).html()); 
		var subRootId = $(".getRevHistory").attr("data-id"); 

		snapCollection = renderRevControl(subRootId, timestamp); 

		thisTimeStampSnaps =[]; 
		_.each(snapCollection.models, function(model){
			if(model.get("timestamp") == timestamp){thisTimeStampSnaps.push(model.get("cur_id"))}
		});

		myRouter.viewRoot(subRootId, snapCollection);
	}); 
})