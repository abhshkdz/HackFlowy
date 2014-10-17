var NodeModel = Backbone.Model.extend({

	getAncestry: function(){
		var that = this; 

		var ancestry = []; 
		var parents = that.get("parents"); 
		while( !(parents[0] == "a42a" || parents[0]=="42" || parents.length==0) ) {
			ancestry.push(parents); 
			parents = nodesCollection.findWhere({_id: parents[0]}).get("parents"); 
			// parents = that.findModel(parents[0]).get("parents"); 
			//making the assumption/simplification that it's a tree. Not a graph. 
		}
		return ancestry; 
	}

});