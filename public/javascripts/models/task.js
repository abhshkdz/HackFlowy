define(
['backbone',
'localforage',
'localforagebackbone'
],

function(
Backbone,
localforage,
localforageBackbone
) {

  var TaskModel = Backbone.Model.extend({

    offlineSync: Backbone.localforage.sync('TaskModel'),
    /** switches sync between server and local databases **/
    sync: function(){
              if (window.hackflowyOffline)
                  return this.offlineSync.apply(this,arguments);
              else
                  return Backbone.sync.apply(this, arguments);
    },

    defaults: {
	  parentId: 0,
      content: '',
      isCompleted: 0,
      priority: 0
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
    	});
    }

 });

return TaskModel;

});
