var showView = Backbone.View.extend({
	initialize: function(options){
		var that = this;
		that.metaCollection = options["metaCollection"]; 
		that.snapView = options["snapView"]; 

		this.model = options["model"];
		this.depth = options["depth"];
		(that.model.attributes["views"] = this.model.attributes["views"] || []).push(that);
		that.$el.attr("data-id", that.model.get("_id")); //booya!
		this.childViews = [];

	},

	tagName: 'li',
	className: "herez node",
	events: {"click .markdown" : "showMarkDownEditor"}, 


	findModel: function(id){
		if(this.snapView){
			return this.metaCollection.findWhere({cur_id: id}); 
		}
		else{
			return this.metaCollection.findWhere({_id: id}); 
		}
	},


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
		if(that.snapView){
			that.$el.children().children("textarea").prop("disabled", true);
			that.$el.addClass("snapLI"); 
		}
		console.log("about to render textarea")
		
		that.renderChildren(); 

		return that;
	},
	renderChildren: function(){
		var that = this;
		var childrenIds = that.model.get("children");

		_.each(childrenIds, function(childId, index){
			var childModel = that.findModel(childId); 
			var tempView = new showView({
				depth: that.depth + 1,
				model: childModel, 
				metaCollection: that.metaCollection, 
				snapView: that.snapView
			});
			that.childViews.push(tempView)
			that.$el.children("ul").append(tempView.render().$el);
		}); 

	},

	unhide: function(){
		alert("bleh"); 
	}, 

	//Moved to app.js to handle bubbling issues. 
	// collapse: function(){
	// 	var that = this;
	// 	that.$el.children("ul").slideToggle(110);
	// 	that.$el.children(".zoomButton").toggleClass("collapsed"); 
	// },

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

 	addNode: function(newNode, index, cur){
 		var that = this;
 		console.log("addNodeText" + newNode.get("text"))
  		var newView = new showView({
  			model: newNode,
  			depth: that.depth +1, 
  			metaCollection: that.metaCollection, 
  			snapView: that.snapView

  		});

  		var newLI = newView.render().$el;


  		//var empty = (that.$el.children("ul").children().length == 0);
	  	if(index == 0){	//just handles edge case where you're using this for indent
  			that.$el.children("ul").prepend(newLI);
  		}else{
  			that.$el.children("ul").children(":nth-child(" + (index) + ")").after(newLI);
  		}

  		that.childViews.insert(index , newView);
  		if(cur){
  			newLI.children().children("textarea").focus().textareaAutoExpand(); 
  		}
  		else{
  			newView.lock();
  		}
  		return newView; 
 	},

 	updateId: function(newId){
  		this.$el.attr("data-id", newId);
  		this.$el.children("ul").attr("data-id", newId);
 	},
 	updateText: function(newText){
 		var that = this;
 		this.$el.children().children("textarea").val(that.model.get("text"));
 	},
 	lock: function(){ //for concurrent editing...
 		this.$el.children().children("textarea").attr("readonly", "readonly");
 		this.$el.children().children("textarea").val("editing....")
 	},
 	unlock: function(){
 		this.$el.children().children("textarea").removeAttr("readonly");
 		this.$el.children().children("textarea").val(this.model.get("text"));
 	},
 	removeNode: function(index){
 		var that = this;
 		that.childViews[index].remove();
 		that.childViews.remove(index);
 	},
 	pushView: function(view){
 		this.childViews.push(view);
 		this.$el.children("ul").children().last().after(view.$el);
 	}









});
