var listView = Backbone.View.extend({

	initialize: function(options){
		var that = this;
		that.metaCollection = options["metaCollection"]; 
		that.snapView = options["snapView"]; 

		this.viewWindow = $(options["viewWindow"]);
		that.model = options["model"];
		(that.model.attributes["views"] = this.model.attributes["views"] || []).push(that);
		that.$el.attr("data-id", that.model.get("_id")); 
		this.childViews = [];

		this.render();
	}, 

	tagName: 'ul', 
	className: 'root subList dd-list', 
 
	render: function(){
		var that = this;

		that.renderChildren();
		that.renderPath();

		return that;
	}, 

	findModel: function(id){
		if(this.snapView){
			return this.metaCollection.findWhere({cur_id: id}); 
		}
		else{
			return this.metaCollection.findWhere({_id: id}); 
		}
	},


	renderPath: function(){
		var that = this; 
		var pathDiv = ""; 

		var ancestry = []; 
		var parents = that.model.get("parents"); 
		while(parents.length != 0){
			ancestry.push(parents); 
			parents = that.findModel(parents[0]).get("parents"); 
			//making the assumption/simplification that it's a tree. Not a graph. 
		}

		_.each(ancestry.reverse(), function(parent){
			var parentModel = that.findModel(parent[0]); 
			pathDiv += "<a class='pathLink' href='#"+ parentModel.get("_id") + "'>" + parentModel.get("text") + "</a>"; 
			pathDiv += " -- "; 
		}); 
		if(ancestry.length == 0){pathDiv += "  "}

		
		$("#pathDiv").html(pathDiv); 
	},

	//identical except for the .$el part at the end. 
	renderChildren: function(){
		var that = this; 
		
		var childrenIds = that.model.get("children");
		_.each(childrenIds, function(childId, index){
			var childModel = that.findModel(childId); 

			 var tempView = new showView({
				depth: 0, 
				model: childModel, 
				metaCollection: that.metaCollection, 
				snapView: that.snapView
			});

			var tempLI = tempView.render().$el; 
			tempLI.children("textarea").textareaAutoExpand(); 
			that.$el.append(tempLI);
			that.childViews.push(tempView);
		});
		that.viewWindow.html(that.$el);
	}, 

	//adds a CHILD node. 
	addNode: function(newNode, index, cur){
 		var that = this; 
  		var newView = new showView({
  			model: newNode, 
  			depth: 0, 
  			metaCollection: that.metaCollection, 
  			snapView: that.snapView
  		});
  		var newLI = newView.render().$el;

  		if(index == 0){	//just handles edge case where you're using this for indent
  			that.$el.prepend(newLI);
			}else{
				that.$el.children(":nth-child(" + (index) + ")").after(newLI);
			}
  		//that.$el.children(":nth-child(" + (index) + ")").after(newLI);

  		that.childViews.insert(index , newView);
  		cur = true; 
  		if(cur){
				newLI.children().children("textarea").focus();
			}
			else{
				newView.lock();
			}
  		return newView;
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

	removeNode: function(index){
		var that = this; 

		console.log(that.childViews);
		that.childViews[index].remove();
		that.childViews.remove(index);
	}, 
	pushView: function(view){
		this.childViews.push(view);
		this.$el.children().last().after(view.$el);
	}
});