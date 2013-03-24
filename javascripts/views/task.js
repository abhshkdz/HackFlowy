var app = app || {};

(function() {

  app.TaskView = Backbone.View.extend({

    tagName: 'li',
    template: $('#taskTemplate').html(),

    render: function() {
      var tmpl = _.template(this.template);
      this.$el.html(tmpl(this.model.toJSON()));
      return this;
    }

  });

}());