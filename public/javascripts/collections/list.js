define(
[
'backbone',
'models/task'
],

function(
Backbone,
Task
) {

  var List = Backbone.Collection.extend({

    model: Task,
    url: '/tasks'
    
 });

return List;

});