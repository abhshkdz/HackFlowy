var app = app || {};

(function() {

  app.TaskView = Backbone.View.extend({

    tagName: 'li',
    template: $('#taskTemplate').html(),

    events: {
      'click .task': 'edit',
      'blur .edit': 'close',
      'keyup .edit': 'broadcast',
      'keypress .edit': 'update'
    },

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function() {
      var tmpl = _.template(this.template);
      var task = this;
      this.$el.html(tmpl(this.model.toJSON()));
      if (this.model.get('parent_id')!=0) {
        this.$el.addClass('shift1');
        var className = $('*[data-id="'+this.model.get('parent_id')+'"]').parents('li:first').attr('class');
        if (className!=undefined && className!=0 && className.substring(0,5) == 'shift') {
          this.$el.removeClass();
          this.$el.addClass('shift' + (parseInt(className.charAt(5))+1));
        }
      }
      this.$input = this.$('.edit:first');
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
    },

    broadcast: function() {
      socket.emit('task', { 
        id: this.model.id, 
        parent_id: this.model.parent_id, 
        content: this.$input.val().trim() 
      });
    },

    update: function(e) {
      if ( e.which === ENTER_KEY ) {
        app.Tasks.add({content:'', parent_id: this.model.get('parent_id')});
        this.$input.blur();
        this.$el.next('li').find('input').focus();
      }
    },

    close: function() {
      var value = this.$input.val().trim();
      console.log(this.model);
      if (value === '') {
        this.model.destroy();
      }
      else
        this.model.save({content: value, parent_id: this.model.get('parent_id')});
      this.$el.removeClass('editing');
    }

  });

}());