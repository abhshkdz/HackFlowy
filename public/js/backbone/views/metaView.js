function assignProperties(object, options){ //object is a showView or listView
	var that = object; 
	that.metaCollection = options["metaCollection"]; 
	that.snapView = options["snapView"]; 

	that.model = options["model"];
	that.depth = options["depth"];
	(that.model.attributes["views"] = that.model.attributes["views"] || []).push(that);
	that.$el.attr("data-id", that.model.get("_id")); //booya!
	that.childViews = [];

	that.searchSet = options["searchSet"]; 

	object.renderChildren = function(){
		var that = object; 
		
		var childrenIds = that.model.get("children");
		_.each(childrenIds, function(childId, index){
			var childModel = that.findModel(childId); 
			 var tempView = new showView({
				depth: that.depth + 1,
				model: childModel, 
				metaCollection: that.metaCollection, 
				snapView: that.snapView, 
				searchSet: that.searchSet
			});
			that.pushView(tempView, childId); 
		});
	}

	object.pushView = function(tempView, childId){
		debugger; 
		var searchSet= object.searchSet; 
		that.childViews.push(tempView);
		var tempLI = tempView.render().$el
		that.UL.append(tempLI);
		if(searchSet && !_.contains(searchSet, childId)){
			$(tempLI).hide();
		}
	}

	object.findModel = function(id){
		if(object.snapView){
			return object.metaCollection.findWhere({cur_id: id}); 
		}
		else{
			return object.metaCollection.findWhere({_id: id}); 
		}
	}

	object.removeNode = function(index){
 		var that = this;
 		that.childViews[index].remove();
 		that.childViews.remove(index);
	}

	object.addNode = function(newNode, index, cur){
 		var that = this;
  		var newView = new showView({
  			model: newNode,
  			depth: that.depth +1, 
  			metaCollection: that.metaCollection, 
  			snapView: that.snapView

  		});

  		var newLI = newView.render().$el;


  		//var empty = (that.$el.children("ul").children().length == 0);
	  	if(index == 0){	//just handles edge case where you're using this for indent
  			that.UL.prepend(newLI);
  		}else{
  			that.UL.children(":nth-child(" + (index) + ")").after(newLI);
  		}

  		that.childViews.insert(index , newView);
  		if(cur){
  			newLI.children().children("textarea").focus().textareaAutoExpand(); 
  		}
  		else{
  			newView.lock();
  		}
  		return newView; 
 	}



}