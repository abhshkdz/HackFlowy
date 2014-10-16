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
	vo = {};
});


(function($) {

	$.fn.isFirstViz = function(){
		return $(this).is($(this).parent().children(":visible:first")); 
	}
	$.fn.isLastViz = function(){
		return $(this).is($(this).parent().children(":visible:last")); 
	}
}(jQuery));






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

















