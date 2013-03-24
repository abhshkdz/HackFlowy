var app = app || {};

(function() {

  app.TaskView = Backbone.View.extend({

    tagName: 'li',
    template: $('#taskTemplate').html(),

    events: {
      'click .task': 'edit',
      'blur .edit': 'close',
      'keypress .edit': 'add'
    },

    render: function() {
      var tmpl = _.template(this.template);
      this.$el.html(tmpl(this.model.toJSON()));
      this.$input = this.$('.edit');
      return this;
    },

    edit: function() {
      this.$el.addClass('editing');
      this.$input.focus();
    },

    close: function() {
      var value = this.$input.val().trim();
      this.model.save({content: value});
      this.$el.removeClass('editing');
    },

    add: function(e) {
      if (e.which === ENTER_KEY) {
        this.$input.blur();
        var render = new app.TaskView({model: new app.Task()}).render();
        render.$el.insertAfter(this.$el);
        render.$input.focus();
      }
    }

  });

}());