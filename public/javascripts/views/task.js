define(
    ['jquery',
        'backbone',
        'socket',
        'collections/list',
        'util/constants',
        'text!../../templates/task.html',
        'marionette'
    ],

    function (
        $,
        Backbone,
        io,
        List,
        constants,
        taskTemplate,
        Marionette
    ) {
        // The recursive tree view. Ref:http://jsfiddle.net/wassname/zf61mLvh/2/
        var TaskView = Backbone.Marionette.CompositeView.extend({

            template: _.template(taskTemplate),
            tagName: 'ul',
            className: "task-view",
            viewComparator: List.prototype.comporator,
            childView: TaskView,
            childViewContainer: '.children',
            childViewOptions: {
                reorderOnSort: true
            },

            ui: {
                input: '.task input:first',
                options: '.task .options:first',
                // ui elements are bound before child render
                // so the below child hashes are only available because
                // render:collection triggers this.bindUIElements
                children: '.children>ul',
                descendants: '.children ul',
            },

            events: {
                'click .task:first': 'edit',
                'blur .edit:first': 'close',
                'keyup .edit:first': 'handleKeyUp',
                'keydown .edit:first': 'handleKeyDown',
                'keypress .edit:first': 'handleKeyPress',
                'mouseover .link:first': 'showOptions',
                'mouseout .link:first': 'hideOptions',
                'click .complete:first': 'markComplete',
                'click .uncomplete:first': 'unmarkComlete',
                'click .note:first': 'addNote',
                'click .fold-button:first': 'foldChildren',
                'click .fold:first': 'foldChildren',
                // TODO make this destroy children too
                'click .destroy:first': 'destroy',
                // custom events
                'focus': 'this.model.focusOnView',

            },

            collectionEvents: {
            },

            childEvents: {},

            initialize: function (options) {
                var task = this;

                // backlink
                this.model.view = this;

                // get only direct children from all tasks in pageView.collection
                var children = pageView.collection.filter(
                    function (child, index, collection) {
                        return child.get('parentId') === this.model.id;
                    }, this);
                this.collection = new List(children);

                // there is probobly a better way to do this
                if (this.isEmpty()){
                    this.$el.addClass('empty');
                }

                // events
                this.listenTo(this.model, 'change', this.render);
                this.listenTo(this.model, 'destroy', this.remove);
                // refresh ui hashes after children are rendered
                this.listenTo(this, 'render:collection', this.bindUIElements);
                // custom event
                this.listenTo(this, 'focus', this.model.focusOnView);

                // updates from server
                if (!window.hackflowyOffline) {
                    this.socket = io.connect();
                    this.socket.on('task', function (data) {
                        if (task.model.id == data.id) {
                            task.model.set({
                                'content': data.content,
                                'isCompleted': data.isCompleted
                            });
                        }
                    });
                }

            },

            // override marionette filter to filter displayed children
            // filterDirectChildren: function (child, index, collection) {
            //     return child.get('parentId') === this.model.get('id');
            // },

            edit: function () {
                this.$el.addClass('editing');
                this.$('.edit:first').focus();
            },

            /** Get the parent view or root view **/
            getParentView: function () {
                var parent = pageView.collection.get(this.model.get('parentId'));
                if (parent) return parent.view;
                else return pageView.listView;
            },

            /** Update parentId when added to collection **/
            onAddChild: function(childView){
                if (childView.model.get('parentId')!==this.model.id)
                    childView.model.save({parentId: this.model.id});
            },

            /** Focus on the next visible element down despite list level **/
            focusOnPrev: function () {
                var all = pageView.listView.$el.find('ul:visible');
                var prev = $(all[all.index(this.$el) - 1]);
                if (prev.length){
                    prev.find('input:first').focus();
                }
                return prev;
            },

            focusOnNext: function () {
                var all = pageView.listView.$el.find('ul:visible');
                var next = $(all[all.index(this.$el) + 1]);
                if (next)
                    next.find('input:first').focus();
                return next;
            },

            handleKeyUp: function(e){
            },

            handleKeyPress: function(e){
            },

            handleKeyDown: function (e) {
                if (e.keyCode == constants.BACKSPACE) {
                    // remove if backspace pressed on empty/soon-to-be-empty item
                    if (this.ui.input.val().length < 2 && this.$('.children>ul').length===0) {
                        e.preventDefault();
                        prev = this.focusOnPrev();
                        this.model.destroy();
                        this.destroy();
                        // set the cursor to the end of the previous input
                        prev.find('input:first').focus();
                        var input = prev.find('input:first')[0];
                        input.selectionStart = input.selectionEnd = input.value.length;
                        return false;
                    }
                }
                if (e.keyCode === constants.ENTER_KEY)
                    this.addNote(e.currentTarget);
                else if (e.ctrlKey && e.keyCode == constants.DOWN_ARROW) {
                    // move down list by swapping priority with next sibling
                    e.preventDefault();
                    this.getParentView().collection.moveDown(this.model);
                    this.model.focusOnView();
                } else if (e.ctrlKey && e.keyCode == constants.UP_ARROW) {
                    // move up the list
                    e.preventDefault();
                    this.getParentView().collection.moveUp(this.model);
                    this.model.focusOnView();
                } else if (e.keyCode == constants.DOWN_ARROW) {
                    this.focusOnNext();
                } else if (e.keyCode == constants.UP_ARROW) {
                    this.focusOnPrev();
                } else if (e.shiftKey && e.keyCode == constants.TAB) {
                    // indent one less, by changing parent
                    e.preventDefault();
                    var parentId = this.$el.parents('ul:first').find('input:first').data('id');
                    if (parentId===0){

                    } else if (parentId){
                        parentModel = pageView.collection.get(parentId);
                        this.getParentView().collection.remove(this.model);
                        var index = parentModel.view.getParentView().collection.indexOf(parentModel);
                        if (index<0) index=this.getParentView().collection.length-1;
                        parentModel.view.getParentView().collection.add(this.model, {at:index+1});
                        this.model.focusOnView();
                    } else {
                        console.warn("Can't untab any further");
                    }
                } else if (e.keyCode == constants.TAB) {
                    // indent one more, by changing parent
                    e.preventDefault();
                    var prevSibling = this.$el.prev('ul');
                    if (prevSibling.length) {
                        var prevSibId = prevSibling.find('input:first').data('id');
                        var prevSibView =pageView.collection.get(prevSibId).view;
                        this.getParentView().collection.remove(this.model);
                        prevSibView.collection.add(this.model);
                        this.model.focusOnView();
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
                if (this.model.get('content')!=value)
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
                if (!window.hackflowyOffline) this.socket.emit('task', {
                    id: this.model.id,
                    parentId: this.model.parentId,
                    content: this.model.toJSON().content,
                    isCompleted: this.model.toJSON().isCompleted
                });
            },

            unmarkComlete: function () {
                this.model.toggelCompletedStatus(false);
                if (!window.hackflowyOffline)  this.socket.emit('task', {
                    id: this.model.id,
                    parentId: this.model.parentId,
                    content: this.model.toJSON().content,
                    isCompleted: this.model.toJSON().isCompleted
                });
            },

            /** Add a new blank note below this **/
            addNote: function () {
                // var currentId = this.ui.input.data('id') || 0;
                parentId = this.ui.input.data('parent-id');
                var index= this.getParentView().collection.indexOf(this.model);
                var task = pageView.collection.add({parentId: this.model.get('parentId')});
                task.save();
                if (index>=0)
                    this.getParentView().collection.add(task, {at:index+1});
                else
                    this.getParentView().collection.add(task);
                this.$('input:first').blur();
                task.focusOnView();
            },

            /** Fold children of the clicked element */
            foldChildren: function () {
                var folded = this.$el.find('li:first').hasClass('folded');
                this.model.save({isFolded: !folded});
            },
        });

        return TaskView;

    });
