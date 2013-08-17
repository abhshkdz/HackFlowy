define(
['jquery',
'backbone',
'collections/list',
'views/task'
],

function(
$,
Backbone,
List,
TaskView
) {

  var ListView = Backbone.View.extend({

    el: $("#main .children"),

    events: {
      'click #add': 'addTask'
    },

    initialize: function() {
      Tasks = this.collection = new List();
      this.collection.fetch();
      this.listenTo(this.collection, 'add', this.renderTask);
    },

    render: function() {
      this.collection.each(function(task) {
        this.renderTask(task);
      }, this);
    },

    renderTask: function(task) {
      var taskView = new TaskView({
        model: task
      });
      var a = taskView.render();
      if (a.model.get('parent_id')!=0)
        a.$el.insertAfter($('*[data-id="'+a.model.get('parent_id')+'"]').parents('li:first'));
      else
        this.$el.append(a.el);
    }

 });

return ListView;

});