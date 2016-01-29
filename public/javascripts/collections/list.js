define(
[
'backbone',
'models/task',
'localstorage',
],

function(
Backbone,
Task,
LocalStorage
) {

  var List = Backbone.Collection.extend({

    localStorage: new Backbone.LocalStorage("tasks"),
    model: Task,
    url: '/tasks'

 });

return List;

});
