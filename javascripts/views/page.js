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

      // stop browser going back a page when jamming backspace
      window.addEventListener('keydown',function(e){if(e.keyIdentifier=='U+0008'||e.keyIdentifier=='Backspace'){if(e.target==document.body){e.preventDefault();}}},true);

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
