define(
['backbone'
],

function(
Backbone
) {
	
  var TaskModel = Backbone.Model.extend({

    defaults: {
      parentId: 0,
      content: '',
      isCompleted: 0
    },

    toggelCompletedStatus:function(isCompleted){
    	var prev_isCompleted = isCompleted,
    		self = this;
    	this.save({'isCompleted':isCompleted},
    	{
    		success:function(){},
    		error:function(){
    			//REVERT BACK ON ERROR
    			self.set({'isCompleted':prev_isCompleted});
    		}
    	})
    }

 });

return TaskModel;

});
