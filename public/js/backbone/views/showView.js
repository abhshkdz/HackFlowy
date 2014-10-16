var showView = Backbone.View.extend({
	initialize: function(options){
		//that.UL; 
		assignProperties(this, options); 
	},

	tagName: 'li',
	className: "herez node",
	events: {"click .markdown" : "showMarkDownEditor"},

	//todo = refactor this function.
	render: function(){
		var that = this;
		that.$el.html("");

		var id = that.model.get("_id");
		var text = that.model.get("text");

		var html = that.createUIBullet(id, text, that.depth); 
		that.$el.children("ul").addClass("collapsed");
		that.$el.attr("data-depth", that.depth);
		that.$el.attr("data-id", id);

		that.$el.html(html);
		that.UL = that.$el.children("ul"); 
		if(that.snapView){
			that.$el.children().children("textarea").prop("disabled", true);
			that.$el.addClass("snapLI"); 
		}
		// console.log("about to render textarea")
		
		that.renderChildren(); 

		return that;
	},

	// Moved to app.js to handle bubbling issues. 
	collapse: function(){
		var that = this;
		that.$el.children("ul").slideToggle(110);
		that.$el.children(".zoomButton").toggleClass("collapsed"); 
	},

	createUIBullet: function( id , text, depth) {
		var that = this;
	  	var textArea = "<textarea height='10px' class='js-auto-expand content' style='background:none'>" + text + "</textarea>";

		var expandCollapse = "<a class='expandCollapse'>+</a>"
		// var aButton = "<a href='#/" + id + "'" + "class='nodeLink'>" + "</a>";
	  // var handle = "<span class=\"handle\"><img src=\"img/bullet-8.png\" /></span>"
	 	var zoomButton = "<a href='#/" +that.model.get("_id") + "' class='zoomButton handle'></a>"
	 	// var buttonHoist = "<a href='#' class='buttonHoist'></a>"

	  	var subList = "<ul class ='subList dd-list' data-id="+ id + "></ul>"
	  	var bullet =  expandCollapse + zoomButton + "<span class='hoverWrap content'>" +  textArea + "</span>" + subList;
	  	return bullet;
  	},

	  //text-area => MarkDownEditor. 
	createMarkDownBullet: function(){
	  	var that = this; 
	  	var textarea = that.$el.children(".hoverWrap").children("textarea"); 

	  	var newDiv = "<div><p>" + textarea.val() + "</p></div>"; 
	  	textarea.remove(); 

	  	that.$el.children(".hoverWrap").html(newDiv); 

	  	that.showMarkDownEditor(); 
	  	return; 
	}, 

	showMarkDownEditor: function(){
		var that = this; 
		var hoverWrap = that.$el.children(".hoverWrap").removeClass("markdown"); 


		hoverWrap.children("div").attr("id", "marked-mathjax-preview"); 

		var buffer = '<div class="preview content" id="marked-mathjax-preview-buffer" style="display:none; position:absolute; top:0; left: 0"> </div>'; 
	  	var textareaInput = '<textarea id="marked-mathjax-input" onkeyup="Preview.Update()" name="comment" "autofocus"></textarea>'; 
		hoverWrap.append(buffer+textareaInput); 
		debugger; 
		setTimeout(function(){
			Preview.Init();
	  		Preview.Update();
	  		hoverWrap.children("textarea").val(that.model.get("text")).focus(); 
		}, 200); 
	  	// setTimeout(function(){ MathJax.Callback(["CreatePreview",Preview]); }, 300); 
	},

 	updateId: function(newId){
  		this.$el.attr("data-id", newId);
  		this.$el.children("ul").attr("data-id", newId);
 	},
 	updateText: function(newText){
 		var that = this;
 		this.$el.children().children("textarea").val(that.model.get("text"));
 	},
 	lock: function(name){ //for concurrent editing...
 		this.$el.children().children("textarea").attr("readonly", "readonly");
 		this.$el.children().children("textarea").val(name + " is editing."); 
 		this.$el.addClass("editing"); 
 	},
 	unlock: function(){
 		this.$el.children().children("textarea").removeAttr("readonly");
 		this.$el.children().children("textarea").val(this.model.get("text"));
 		this.$el.removeClass("editing"); 
 	}









});
