var app = app || {};

(function() {

  app.ListView = Backbone.View.extend({

    el: $("#main .children"),

    events: {
      'click #add': 'addTask'
    },

    initialize: function() {
      app.Tasks = this.collection = new app.List();
      this.collection.fetch();
      this.listenTo(this.collection, 'add', this.renderTask);
    },

    render: function() {
      this.collection.each(function(task) {
        this.renderTask(task);
      }, this);
    },

    renderTask: function(task) {
      var taskView = new app.TaskView({
        model: task
      });
      var a = taskView.render();
      if (a.model.get('parent_id')!=0)
        a.$el.insertAfter($('*[data-id="'+a.model.get('parent_id')+'"]').parents('li:first'));
      else
        this.$el.append(a.el);
    }

  });

}());