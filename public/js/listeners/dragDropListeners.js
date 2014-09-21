function returnDropEntry(eventY){
	// for(var i = 0; i<liHeights.length; i++){
	// 	if(eventHeight < liHeights[i][0]) return liHeights[i][1]
	// }
	// return liHeights[liHeights.length-1][1]; 
	for(var i = containerArray.length-1; i>=0; i--){
		if(containerArray[i][0] < eventY) return containerArray[i]
	}
	// return containerArray[containerArray.length-1]; 
}     


$(function(){
	liHeights = []; containerArray = []; 
var numMoves = 0; 
tempEvents = []; 
tempEntries = []; 
selectedLI = $($(".node")[0]); //random initialization
clicking=false;


$('body').on("mousedown", ".handle", function(e){
	containerArray = []; 
    clicking = true;
    e.preventDefault(); 
    $('.clickStatus').text('mousedown');


    var firstLI = $(".root").children(":first-child"); 
	var firstEntry = [0, firstLI, "above"]; 
	containerArray.push(firstEntry); 

    //initialize liHeights
    //_.each(containerArray, function(el){ console.log(el[0], el[2]); console.log(el[1].context); } );
    //(Useful statement for Debugging...)
    //(make doc smaller, and use debugger. )
    $(".node").each(function(i, li){ 
    	// debugger; 

    	var rec = li.getBoundingClientRect(); 
		var thisTop = $(li).offset().top; //rec.top; 

		// var thisBottom = $(window).height() - $(li).height() - thisTop; 
        var thisBottom = thisTop + $(li).outerHeight(); 
        //http://stackoverflow.com/questions/9872128/get-bottom-and-right-position-of-an-element

		li = $(li); 
        var collapsed = (li.children(".zoomButton").hasClass("collapsed") || li.children("ul").children().length == 0); 
		var opened = !collapsed; 
    	var last = li.is(":last-child"); 

    	if( !(opened || last) ){
    		var entry = [ thisTop , li , "below" ]; 
    		containerArray.push(entry); 
    	}
    	else{
    		if(opened){
    			console.log("opened"); 
    			var firstChild = li.children("ul").children(":first-child")
    			var firstEntry = [ thisTop , firstChild, "above"]; 
    			containerArray.push(firstEntry); 
    			
    			//more entries will go between these two. 
    			
    			var bottomEntry = [thisBottom, li, "below"]; 
    			containerArray.push(bottomEntry); 
                console.log("bottomEntry")
                console.log(bottomEntry); 
    		}
    		else{ //(last && !opened)
    			var entry = [thisTop , li , "below"]; 
    			containerArray.push(entry); 
    		}
    	}
    	// var height = li.getBoundingClientRect().top //rec.top, rec.bottom
    	// liHeights.push([height, li]); 
    	$(li).children().children("textarea").val(thisTop); 
    });//.each
	
	//http://stackoverflow.com/questions/5435228/sort-an-array-with-arrays-in-it-by-string
	containerArray.sort(function(a,b){
		return a[0] > b[0] ? 1 : -1;
	}); 

});//.mouseDown


$(document).mouseup(function(){
    clicking = false;
    $('.clickStatus').text('mouseup');
});

$(document).on("mousemove" ,function(e){
	numMoves++; 
    if(clicking == false){
    	// $('.clickStatus').text('WHAT' + numMoves);
    	return; 
    }
    $(selectedLI).removeClass("selectedAboveDrop")
    $(selectedLI).removeClass("selectedBelowDrop"); 
    tempEvents.push(e.pageY); //why? //(simple debugging)
    $('.clickStatus').text('mouse moving' + numMoves);

    var entry = returnDropEntry(e.pageY); 
    selectedLI = entry[1]; //global
    var aboveOrBelow = entry[2]; 
    if(aboveOrBelow == "above"){selectedLI.addClass("selectedAboveDrop")}
    else{
    	selectedLI.addClass("selectedBelowDrop"); 
    	console.log("SELECTED-BELOW"); 
    }
	tempEntries.push(entry); 


    // var li = returnDropLI(e.pageY);
    // selectedLI = li; 
    // tempLIs.push(li); 
    // $(li).addClass("selectedDrop"); 

});//mousemove
});//documentReady
