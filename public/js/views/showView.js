var showView = Backbone.View.extend({
	initialize: function(options){
		var that = this;

		this.model = options["model"];
		this.depth = options["depth"];
		(that.model.attributes["views"] = this.model.attributes["views"] || []).push(that);
		that.$el.attr("data-id", that.model.get("_id")); //booya!
		this.childViews = [];

	},

	tagName: 'li',
	className: "herez node",


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
		console.log("about to render textarea")
		
		that.renderChildren();

		return that;
	},
	renderChildren: function(){
		var that = this;
		var childrenIds = that.model.get("children");

		_.each(childrenIds, function(childId, index){
			var childModel = nodesCollection.findWhere({_id: childId});
			var tempView = new showView({
				depth: 0,
				model: childModel
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

 	addNode: function(newNode, index, cur){
 		var that = this;
 		console.log("addNodeText" + newNode.get("text"))
  		var newView = new showView({
  			model: newNode,
  			depth: that.depth +1
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
  			newLI.children().children("textarea").focus();
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
 	lock: function(){
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
