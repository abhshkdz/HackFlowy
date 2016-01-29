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
      if (a.model.get('parentId')===0)
        this.$el.append(a.el);
      else
        a.$el.insertAfter($('*[data-id="'+a.model.get('parentId')+'"]').parents('li:first'));
    }

 });

return ListView;

});
