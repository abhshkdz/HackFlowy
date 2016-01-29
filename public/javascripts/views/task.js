var demoData = '[{"id":44,"content":"Welcome to HackFlowy!","parent":0,"isCompleted":false,"createdAt":"2016-01-29T00:24:42.661Z","updatedAt":"2016-01-29T01:07:02.189Z"},{"id":45,"content":"An open-source WorkFlowy clone","parent":0,"isCompleted":false,"createdAt":"2016-01-29T00:24:42.661Z","updatedAt":"2016-01-29T01:07:06.453Z"},{"id":46,"content":"Built using Backbone + Socket.IO","parent":0,"isCompleted":false,"createdAt":"2016-01-29T00:24:42.661Z","updatedAt":"2016-01-29T01:09:10.862Z"},{"id":47,"content":"I pulled this together in a few hours to learn Backbone","parent":0,"isCompleted":false,"createdAt":"2016-01-29T00:24:42.661Z","updatedAt":"2016-01-29T01:07:47.734Z"},{"id":48,"content":"Feel free to try it out and hack on it","parent":0,"isCompleted":false,"createdAt":"2016-01-29T00:24:42.661Z","updatedAt":"2016-01-29T01:07:42.292Z"},{"id":49,"content":"Good Luck!","parent":0,"isCompleted":true,"createdAt":"2016-01-29T00:24:42.661Z","updatedAt":"2016-01-29T01:08:00.533Z"},{"id":50,"content":"uyi","parent":0,"isCompleted":false,"createdAt":"2016-01-29T01:14:22.854Z","updatedAt":"2016-01-29T01:14:22.854Z"},{"id":51,"content":"uyk","parent":0,"isCompleted":false,"createdAt":"2016-01-29T01:14:25.406Z","updatedAt":"2016-01-29T01:14:25.406Z"},{"id":72,"content":"uu","parent":null,"isCompleted":false,"createdAt":"2016-01-29T02:09:38.202Z","updatedAt":"2016-01-29T02:09:38.202Z"},{"id":73,"content":"yu","parent":null,"isCompleted":false,"createdAt":"2016-01-29T02:09:39.450Z","updatedAt":"2016-01-29T02:09:39.450Z"}]';

define(
    ['jquery',
        'backbone',
        'socket',
        'util/constants',
        'text!../../templates/task.html'
    ],

    function (
        $,
        Backbone,
        io,
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
                'mouseover .link': 'showOptions',
                'mouseout .link': 'hideOptions',
                'click .complete': 'markComplete',
                'click .uncomplete': 'unmarkComlete',
                'click .note': 'addNote'
            },

            initialize: function () {
                this.listenTo(this.model, 'change', this.render);
                this.listenTo(this.model, 'destroy', this.remove);
                this.socket = io.connect();
                var task = this;
                this.socket.on('task', function (data) {
                    if (task.model.id == data.id) {
                        task.model.set({
                            'content': data.content,
                            'isCompleted': data.isCompleted
                        });
                    }
                });

            },

            render: function () {
                var tmpl = _.template(this.template);
                var task = this;
                this.$el.html(tmpl({
                    model: this.model.toJSON()
                }));
                if (this.model.get('parentId') != 0) {
                    // add a shift[n] class for n-indents
                    this.$el.addClass('shift1');
                    var className = $('*[data-id="' + this.model.get('parentId') + '"]').parents('li:first').attr('class');
                    if (className != undefined && className != 0 && className.substring(0, 5) == 'shift') {
                        this.$el.removeClass();
                        this.$el.addClass('shift' + (parseInt(className.charAt(5)) + 1));
                    }
                }
                this.$input = this.$('.edit:first');

                return this;
            },

            edit: function () {
                this.$el.addClass('editing');
                this.$input.focus();
            },

            handleKeyup: function (e) {
                // down arrow
                if (e.keyCode == 40)
                    this.$el.next('li').find('input').focus();
                // Up arrow
                else if (e.keyCode == 38)
                    this.$el.prev('li').find('input').focus();

                // shift and tab
                if (e.shiftKey && e.keyCode == 9) {
                    var model = this.$el.next('li').find('input').data('id');
                    model = Tasks.get(model);
                    var old_parent = model.get('parentId');
                    old_parent = Tasks.get(old_parent);
                    var new_parent = old_parent.get('parentId');
                    if (new_parent == null) new_parent = 0;
                    model.set('parentId', new_parent);
                    model.save({
                        content: model.get('content'),
                        parentId: model.get('parentId')
                    });
                }
                // tab
                else if (e.keyCode == 9) {
                    var parent = this.$el.prev('li').prev('li').find('input').data('id');
                    var current = this.$el.prev('li').find('input').data('id');
                    var model = Tasks.get(current);
                    model.set('parentId', parent);
                    model.save({
                        content: model.get('content'),
                        parentId: model.get('parentId')
                    });
                }

                this.socket.emit('task', {
                    id: this.model.id,
                    parentId: this.model.parentId,
                    content: this.$input.val().trim(),
                    isCompleted: this.model.toJSON().isCompleted
                });
            },

            update: function (e) {
                if (e.which === constants.ENTER_KEY) {
                    this.addNote(e.currentTarget);
                }

            },
            /** Finish editing an item **/
            close: function () {
                var value = this.$input.val().trim();
                if (value === '') {
                    this.model.destroy();
                } else {
                    this.model.save({
                        content: value,
                        parentId: this.model.attributes.parentId
                    });
                }
                this.$el.removeClass('editing');
            },

            showOptions: function () {
                this.$el.find('.options').show();
            },

            hideOptions: function () {
                this.$el.find('.options').hide();
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

            /**
             * Add a new blank note
             * @param {object} inputEle Input elelement from current item
             */
            addNote: function (inputEle) {
                var $inputEle = $(inputEle);
                var currentId = $inputEle.data('id') || 0;
                parentId = currentId !== 0 ? Tasks.get(currentId).get('parentId') : 0;

                Tasks.add({
                    content: '',
                    parentId: parentId
                });
                $inputEle.blur();
                $inputEle.closest('li').next('li').find('input').focus();
            }

        });

        return TaskView;

    });
