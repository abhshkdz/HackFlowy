define(
['backbone'
],

function(
Backbone
) {
	
  var TaskModel = Backbone.Model.extend({

    defaults: {
      parent_id: '',
      content: '',
      is_completed:'n'
    },

    toggelCompletedStatus:function(isCompleted){
    	var prev_isCompleted = isCompleted,
    		self = this;
    	this.save({'is_completed':isCompleted},
    	{
    		success:function(){},
    		error:function(){
    			//REVERT BACK ON ERROR
    			self.set({'is_completed':prev_isCompleted});
    		}
    	})
    }

 });

return TaskModel;

});