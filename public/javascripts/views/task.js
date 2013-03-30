var app = app || {};

(function() {

  app.TaskView = Backbone.View.extend({

    tagName: 'li',
    template: $('#taskTemplate').html(),

    events: {
      'click .task': 'edit',
      'blur .edit': 'close'
    },

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function() {
      var tmpl = _.template(this.template);
      var task = this;
      this.$el.html(tmpl(this.model.toJSON()));
      this.$input = this.$('.edit');
      socket.on('task', function(data){
        if (task.model.id == data.id) {
          if (task.$input.val != data.content)
            task.$input.val(data.content);
        }
      });
      return this;
    },

    edit: function() {
      this.$el.addClass('editing');
      this.$input.focus();
      var id = (this.model.id === undefined) ? '' : this.model.id;
      var parent_id = (this.model.parent_id === undefined) ? '' : this.model.parent_id;
      this.$input.on('keyup',function(){
        var value = $(this).val().trim();
        socket.emit('task', { 
          id: id, 
          parent_id: parent_id, 
          content: value 
        });
      });
    },

    close: function() {
      var value = this.$input.val().trim();
      if (value === '') {
        this.model.destroy();
      }
      else
        this.model.save({content: value});
      this.$el.removeClass('editing');
    }

  });

}());