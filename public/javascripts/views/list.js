var app = app || {};

(function() {

  app.ListView = Backbone.View.extend({

    el: $("#main .children"),

    events: {
      'click #add': 'addTask'
    },

    initialize: function() {
      this.collection = new app.List();
      this.collection.fetch();
      this.render();

      this.listenTo(this.collection, 'add', this.renderTask);
    },

    addTask: function() {
      console.log('yes');
      //var view = new app.TaskView({model: task})
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