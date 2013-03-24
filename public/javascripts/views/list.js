var app = app || {};

(function() {

  app.ListView = Backbone.View.extend({

    el: $("#main .children"),
    initialize: function(initialTasks) {
      this.collection = new app.List(initialTasks);
      this.render();
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
      this.$el.append(taskView.render().el);
    }

  });

}());