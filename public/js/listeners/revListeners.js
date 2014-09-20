$(function(){
	$("#COMMIT").click(function(){
		socket.emit("COMMIT"); 
	}); 

	$(".getRevHistory").click(function(e){
		var rootId = $(".root").attr("data-id")
		socket.emit("revHistoryRequest", rootId); 
		$(e.target).attr("data-id", rootId); 
	});

	$("body").on("click", ".snapLI", function(e){
		$(e.target).addClass("selectedSnap"); 
	});

	$(".toggleSidebar").click(function(){
		$("#mainPanel").toggleClass("floatRight centering"); 
		$("#metaSidebar").toggleClass("hideBar"); 
	}); 
})