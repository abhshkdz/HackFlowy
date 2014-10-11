$(function(){
	//alert("jquery works"); 
	INPUT_PROCESSED = true; 
	// editing = false; 

	myRouter = new AppRouter; 
	Backbone.history.start();
	//this calls initialize twice. 

	setTimeout(function(){
		$(".toggleSidebar").click();
	}, 2); 


});






function createPathMenu(event){
	//console.log($(event.target).attr("data-id"));
	var pathDiv = $(event.target).parent().children("#pathDiv")
	console.log(pathDiv); 
	if(pathDiv.length != 0){pathDiv.remove(); return; } 
	var curId = $(event.target).attr("data-id"); 
	var parents = nodesCollection.findWhere({_id:curId}).get("parents"); 
	var html = $("<div id='pathDiv' class='dropdown-toggle'><ul></ul></div>");
	console.log("parents="); 
	console.log(parents); 
	if(parents.length == 1){
		var parentId = parents[0]; 
		var grandParentId = nodesCollection.findWhere({_id:parentId}).get("parents"); 
		html.append($("<li><a href=#/" + parentId + ">"+parentId+"</a></li>")); 
		html.append($("<li><a href=#/" + grandParentId + ">"+grandParentId+"</a></li>")); 
	}
	console.log(html); 
	// alert("something"); 
	$(event.target).parent().append(html); 

}

Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};

//http://stackoverflow.com/questions/500606/javascript-array-delete-elements
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

function hasDuplicates(array) {
    var valuesSoFar = {};
    for (var i = 0; i < array.length; ++i) {
        var value = array[i];
        if (Object.prototype.hasOwnProperty.call(valuesSoFar, value)) {
            return true;
        }
        valuesSoFar[value] = true;
    }
    return false;
}

Array.prototype.removeOne = function(parId){
	var parIndex = this.indexOf(parId);
	this.remove(parIndex);
}

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
	vo.lastBullet = ( $(that).closest("li").is(":first-child") && vo.rootLevel);
	vo.thisLI = $(event.target).closest("li");
	vo.thisId = vo.thisLI.attr("data-id"); //data-id. 
	vo.thisIndex = vo.thisLI.index(); //returns -1 if there's no match. 
	vo.thisModel = nodesCollection.findWhere({_id: vo.thisId});
	vo.thisView = vo.thisModel.get("views").slice(-1)[0]; //we're assuming a tree. 
	//(also, I'm not garbage collecting extra views when you zoom in/out, so we have to grab last element). 

	//alert(thisIndex)
	//thisModel = nodesCollection.get(thisId);
	vo.siblingLI = vo.thisLI.prev();
	vo.siblingIndex = vo.siblingLI.index();
	vo.siblingId = vo.siblingLI.attr("data-id");
	vo.siblingModel = nodesCollection.findWhere({_id: vo.siblingId});

	// console.log(nodesCollection);
	// console.log(vo.thisModel);

	// if(!editing){
	// 	// alert("editing!"); 
	// 	socket.emit("editing", [vo.thisId, CurrentUser.google.name]);
	// 	editing=true; 
	// }
	
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















