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
      this.$el.append(a.el);
      a.$input.focus();
      console.log(a.$input.prop('selectionStart'));
    }

  });

}());