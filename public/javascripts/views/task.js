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
                if (!window.hackflowyOffline) {
                    this.socket = io.connect();
                    this.socket.on('task', function (data) {
                        if (task.model.id == data.id) {
                            task.model.set({
                                'content': data.content,
                                'isCompleted': data.isCompleted
                            });
                        } else {
                            console.error("task.model.id != data.id", task.model.id, data.id);
                        }
                    });
                }

            },

            // override marionette filter to filter displayed children
            filter: function (child, index, collection) {
                return child.get('parentId') === this.model.get('id');
            },

            /** Get the parent view or root view **/
            getParentView: function(){
                var parentId = this.model.get('parentId');
                if (parentId>0) return Tasks.get(parentId).view;
                else return listView;
            },

            edit: function () {
                this.$el.addClass('editing');
                this.$('.edit:first').focus();
            },

            handleKey: function (e) {
                if (e.keyCode === constants.ENTER_KEY)
                    this.addNote(e.currentTarget);
                else if (e.ctrlKey && e.keyCode == constants.DOWN_ARROW){
                    e.preventDefault();
                    this.model.save({priority: this.model.get('priority')-1});
                    this.getParentView().collection.sortBy();
                    this.getParentView().resortView();
                    this.model.view.ui.input.focus();
                } else if (e.ctrlKey && e.keyCode == constants.UP_ARROW){
                    e.preventDefault();
                    this.model.save({priority: this.model.get('priority')+1});
                    this.getParentView().collection.sortBy();
                    this.getParentView().resortView();
                    this.model.view.ui.input.focus();
                } else if (e.keyCode == constants.DOWN_ARROW){
                    var all = listView.$el.find('ul:visible');
                    var next = $(all[all.index(this.$el)+1]);
                    if (next)
                        next.find('input:first').focus();
                }  else if (e.keyCode == constants.UP_ARROW){
                    var all = listView.$el.find('ul:visible');
                    var prev = $(all[all.index(this.$el)-1]);
                    if (prev)
                        prev.find('input:first').focus();
                }
                // indent one less, by changing parent
                else if (e.shiftKey && e.keyCode == constants.TAB) {
                    e.preventDefault();
                    var parent = this.$el.parents('ul:first');
                    var grandparentId = parent.find('input:first').data('parent-id') || 0;
                    if (this.model.get('parentId') !== grandparentId) {
                        this.model.save({parentId: grandparentId});
                        this.getParentView().render();
                        this.model.view.ui.input.focus();
                    } else {
                        console.warn("Can't untab any further");
                    }
                }
                // indent one more, by changing parent
                else if (e.keyCode == constants.TAB) {
                    e.preventDefault();
                    var prevSibling = this.$el.prev('ul');
                    if (prevSibling.length > 0) {
                        var siblingId = prevSibling.find('input:first').data('id');
                        this.model.save({parentId: siblingId});
                        this.model.view.remove();
                        this.getParentView().render();
                        this.model.view.ui.input.focus();
                    } else {
                        console.warn("Can't tab any further");
                    }
                }

                if (!window.hackflowyOffline) {
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
                    // TODO let us tab and untab empty ones
                    this.model.destroy();
                else
                    this.model.save({
                        content: value
                    });
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
                // TODO add it after the current one
                var currentId = this.ui.input.data('id') || 0;
                parentId = this.ui.input.data('parent-id');

                var task = Tasks.add({
                    parentId: parentId
                });
                this.ui.input.blur();
                task.view.ui.input.focus();
            },

            /** Fold children of the clicked element */
            foldChildren: function () {
                this.$el.find('ul').toggle();
                this.$el.find('li').toggleClass('folded');
            },
        });

        return TaskView;

    });
