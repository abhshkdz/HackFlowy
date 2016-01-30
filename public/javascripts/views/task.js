

define(
    ['jquery',
        'backbone',
        'socket',
        'util/constants',
        'text!../../templates/task.html',
        'marionette',
    ],

    function (
        $,
        Backbone,
        io,
        constants,
        taskTemplate,
        Marionette
    ) {
        // The recursive tree view http://jsfiddle.net/wassname/zf61mLvh/2/
        var TaskView = Backbone.Marionette.CompositeView.extend({

            template: '#task-view-template',
            tagName: 'ul',
            className: "shift",

            ui: {
                input: '.task input',
                options: '.task .options:first'
            },

            events: {
                'click .task:first': 'edit',
                'blur .edit:first': 'close',
                'keydown .edit:first': 'handleKey',
                'keypress .edit:first': 'handleKey',
                'mouseover .link:first': 'showOptions',
                'mouseout .link:first': 'hideOptions',
                'click .complete:first': 'markComplete',
                'click .uncomplete:first': 'unmarkComlete',
                'click .note:first': 'addNote',
                'click .mouse-tip:first': 'foldChildren'
            },

            initialize: function () {
                var task = this;

                // backlink
                this.model.view = this;

                this.collection = this.model.collection;

                // events
                this.listenTo(this.model, 'change', this.render);
                this.listenTo(this.model, 'destroy', this.remove);

                // updates from server
                if (!window.hackflowyOffline){
                    this.socket = io.connect();
                    this.socket.on('task', function (data) {
                        if (task.model.id == data.id) {
                            task.model.set({
                                'content': data.content,
                                'isCompleted': data.isCompleted
                            });
                        } else {
                            console.error("task.model.id != data.id",task.model.id , data.id);
                        }
                    });
                }

            },

            // Only show direct children
            filter: function (child, index, collection) {
              return child.get('parentId') === this.model.get('id');
            },

            edit: function () {
                this.$el.addClass('editing');
                this.$('.edit:first').focus();
            },

            handleKey: function (e) {
                if (e.keyCode === constants.ENTER_KEY)
                    this.addNote(e.currentTarget);
                if (e.keyCode == constants.DOWN_ARROW)
                    this.$el.next('li').find('input').focus();
                else if (e.keyCode == constants.UP_ARROW)
                    this.$el.prev('li').find('input').focus();

                // shift and tab
                if (e.shiftKey && e.keyCode == constants.TAB) {
                    e.preventDefault();
                    var newParentId = this.$el.parents('ul:first').find('input:first').data('parent-id');
                    if (newParentId === null) newParentId = 0;
                    this.model.set('parentId', newParentId);
                    this.model.save();
                    Tasks.get(newParentId).view.render()
                    this.model.view.ui.input.focus();
                }
                else if (e.keyCode == constants.TAB) {
                    e.preventDefault();
                    var newParentId = this.$el.prev('ul').find('input:first').data('id');
                    this.model.set('parentId', newParentId);
                    this.model.save();
                    this.model.view.remove();
                    Tasks.get(newParentId).view.render();
                    this.model.view.ui.input.focus();
                }

                if (!window.hackflowyOffline){
                    this.socket.emit('task', {
                        id: this.model.id,
                        parentId: this.model.parentId,
                        content: this.$('.edit:first').val().trim(),
                        isCompleted: this.model.toJSON().isCompleted
                    });
                } else {

                }
            },

            /** Finish editing an item **/
            close: function () {
                var value = this.$('.edit:first').val().trim();
                if (value === '')
                    // remove empty items
                    this.model.destroy();
                else
                    this.model.save({content: value});
                this.$el.removeClass('editing');
            },

            showOptions: function () {
                this.ui.options.show();
            },

            hideOptions: function () {
                this.ui.options.hide();
            },

            markComplete: function () {
                this.model.toggelCompletedStatus(true);
                this.socket.emit('task', {
                    id: this.model.id,
                    parentId: this.model.parentId,
                    content: this.model.toJSON().content,
                    isCompleted: this.model.toJSON().isCompleted
                });
            },

            unmarkComlete: function () {
                this.model.toggelCompletedStatus(false);
                this.socket.emit('task', {
                    id: this.model.id,
                    parentId: this.model.parentId,
                    content: this.model.toJSON().content,
                    isCompleted: this.model.toJSON().isCompleted
                });
            },

            /** Add a new blank note **/
            addNote: function () {
                var currentId = this.ui.input.data('id') || 0;
                parentId = this.ui.input.data('parent-id');

                var task = Tasks.add({
                    parentId: parentId
                });
                this.ui.input.blur();
                task.view.ui.input.focus();
            },

            /** Fold children of the clicked element */
            foldChildren: function(){
                this.$el.find('ul').toggle();
                this.$el.find('li').toggleClass('folded');
            },
        });

        return TaskView;

    });
