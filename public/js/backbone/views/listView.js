var listView = Backbone.View.extend({
	initialize: function(options){
		this.UL = this.$el; 
		assignProperties(this, options); 
	},

	tagName: 'ul', 
	className: 'root subList dd-list', 
 
	render: function(){
		var that = this;

		that.renderChildren();
		that.renderPath();

		return that;
	}, 

	renderPath: function(){
		var that = this; 
		var pathDiv = ""; 

		var ancestry = that.model.getAncestry();

		_.each(ancestry.reverse(), function(parent){
			var parentModel = that.findModel(parent[0]); 
			pathDiv += "<a class='pathLink' href='#"+ parentModel.get("_id") + "'>" + parentModel.get("text") + "</a>"; 
			pathDiv += " -- "; 
		}); 
		if(ancestry.length == 0){pathDiv += "  "}

		
		$("#pathDiv").html(pathDiv); 
	},

	
	updateId: function(newId){
		that.$el.attr("data-id", newId);
	}, 
	
	updateText: function(newText){
		var that = this;
		$("#rootTitle").html(that.model.get("text"));
	}, 

	lock: function(){
		console.log("ROOT LOCKED");
	}, 
	unlock: function(){
		console.log("ROOT UNLOCKED");
	}, 
});