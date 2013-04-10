var app = app || {};

(function() {

  app.TaskView = Backbone.View.extend({

    tagName: 'li',
    template: $('#taskTemplate').html(),

    events: {
      'click .task': 'edit',
      'blur .edit': 'close',
      'keyup .edit': 'handleKeyup',
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

    handleKeyup: function(e) {
      if (e.keyCode == 40)
        this.$el.next('li').find('input').focus();
      else if (e.keyCode == 38)
        this.$el.prev('li').find('input').focus();

      if (e.shiftKey && e.keyCode == 9) {
        var model = this.$el.next('li').find('input').data('id');
        model = app.Tasks.get(model);
        var old_parent = model.get('parent_id');
        old_parent = app.Tasks.get(old_parent);
        var new_parent = old_parent.get('parent_id');
        if (new_parent == null) new_parent = 0;
        model.set('parent_id',new_parent);
        model.save({content: model.get('content'), parent_id: model.get('parent_id')});
      }
      else if (e.keyCode == 9) {
        var parent = this.$el.prev('li').prev('li').find('input').data('id');
        var current = this.$el.prev('li').find('input').data('id');
        var model = app.Tasks.get(current);
        model.set('parent_id',parent);
        model.save({content: model.get('content'), parent_id: model.get('parent_id')});
      }
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
      if (value === '') {
        this.model.destroy();
      }
      else {
        this.model.save({content: value, parent_id: this.model.attributes.parent_id});
      }
      this.$el.removeClass('editing');
    }

  });

}());