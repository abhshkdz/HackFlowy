define(
['jquery',
'backbone',
'socket',
'util/constants',
'text!../../templates/task.html'
],

function(
$,
Backbone,
socket,
constants,
taskTemplate
) {

  var TaskView = Backbone.View.extend({

    tagName: 'li',
    template: taskTemplate,

    events: {
      'click .task': 'edit',
      'blur .edit': 'close',
      'keyup .edit': 'handleKeyup',
      'keypress .edit': 'update',
      'mouseover .link':'showOptions',
      'mouseout .link':'hideOptions',
      'click .complete':'markComplete',
      'click .uncomplete':'unmarkComlete',
      'click .note':'addNote'
    },

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
      this.socket = io.connect();
      
    },

    render: function() {
      var tmpl = _.template(this.template);
      var task = this;
      this.$el.html(tmpl({model:this.model.toJSON()}));
      if (this.model.get('parent_id')!=0) {
        this.$el.addClass('shift1');
        var className = $('*[data-id="'+this.model.get('parent_id')+'"]').parents('li:first').attr('class');
        if (className!=undefined && className!=0 && className.substring(0,5) == 'shift') {
          this.$el.removeClass();
          this.$el.addClass('shift' + (parseInt(className.charAt(5))+1));
        }
      }
      this.$input = this.$('.edit:first');
      this.socket.on('task', function(data){
        if (task.model.id == data.id) {
          if (task.$input.val != data.content)
            task.$input.val(data.content);
        }
      });
      return this;
    },

    edit: function() {
      console.log("function");
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
        model = Tasks.get(model);
        var old_parent = model.get('parent_id');
        old_parent = Tasks.get(old_parent);
        var new_parent = old_parent.get('parent_id');
        if (new_parent == null) new_parent = 0;
        model.set('parent_id',new_parent);
        model.save({content: model.get('content'), parent_id: model.get('parent_id')});
      }
      else if (e.keyCode == 9) {
        var parent = this.$el.prev('li').prev('li').find('input').data('id');
        var current = this.$el.prev('li').find('input').data('id');
        var model = Tasks.get(current);
        model.set('parent_id',parent);
        model.save({content: model.get('content'), parent_id: model.get('parent_id')});
      }
      this.socket.emit('task', { 
        id: this.model.id, 
        parent_id: this.model.parent_id, 
        content: this.$input.val().trim() 
      });
    },

    update: function(e) {
      if ( e.which === constants.ENTER_KEY ) {
        Tasks.add({content:'', parent_id: this.model.get('parent_id')});
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
    },

    showOptions:function(){
      this.$el.find('.options').show();
    },

    hideOptions:function(){
      this.$el.find('.options').hide();
    },

    markComplete:function(){
       this.model.toggelCompletedStatus('Y');
    },
    
    unmarkComlete:function(){
       this.model.toggelCompletedStatus('N');
    },

    addNote:function(){
      this.$el.find('.divNote').show();
    }

 });

return TaskView;

});