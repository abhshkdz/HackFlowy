define(
    ['jquery',
        'backbone',
        'collections/list',
        'views/task',
        'data/demo'
    ],

    function (
        $,
        Backbone,
        List,
        TaskView,
        demoData
    ) {

        var ListView = Backbone.View.extend({

            el: $("#main .children"),

            events: {
                'click #add': 'addTask'
            },

            initialize: function () {
                Tasks = this.collection = new List();

                this.listenTo(this.collection, 'add', this.renderTask);

                /** Load demo data and warn users **/
                function loadDemoData() {
                    for (var i = 0; i < demoData.length; i++) {
                        var task = Tasks.add(demoData[i]);
                        task.save();
                    }
                }

                function success(data) {
                    // load demo data if the server returns nothing
                    if (data.length === 0)
                        loadDemoData();
                }

                this.collection.fetch({
                    success: success,
                    error: function () {
                        // switch to localforage database if server isn't present
                        window.hackflowyOffline=true;
                        $('#header').append('<div class="alert-box secondary round">Running in offline mode, data may be lost </div>');
                        Tasks.fetch({
                            success: success
                        });
                    }
                });

            },

            render: function () {
                this.collection.each(function (task) {
                    this.renderTask(task);
                }, this);
            },

            renderTask: function (task) {
                var taskView = new TaskView({
                    model: task
                });
                var a = taskView.render();
                if (a.model.get('parentId') === 0) {
                    this.$el.append(a.el);
                } else {
                    var parent = $('*[data-id="' + a.model.get('parentId') + '"]');
                    if (parent.length === 0) {
                        // TODO deal with loading order
                        console.error("Parent not rendered yet: ", {
                            selector: parent.selector,
                            task: task
                        });
                        this.$el.append(a.el);
                    } else {
                        a.$el.insertBefore(parent.parents('li:first'));
                    }
                }
            }

        });

        return ListView;

    });
