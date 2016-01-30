define(
['jquery',
'backbone',
'views/list',
'models/task'
],

function(
$,
Backbone,
ListView,
Task
) {

  var PageView = Backbone.View.extend({

    el: $("#main"),

    events: {
      'keypress #newTask': 'createNewTask',
      'blur #newTask': 'createNewTask'
    },

    initialize: function() {
      listView = this.listView = new ListView();
      this.input = $('#newTask');
    },

    createNewTask: function(e) {
      if (e.keyCode != 13) return;
      if (!this.input.val().trim()) return;
      this.listView.collection.add(new Task({content: this.input.val().trim() }));
      this.input.val('');
    }

 });

return PageView;

});
