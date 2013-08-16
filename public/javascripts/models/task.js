define(
['backbone'
],

function(
Backbone
) {
	
  var TaskModel = Backbone.Model.extend({

    defaults: {
      parent_id: '',
      content: ''
    },

 });

return TaskModel;

});