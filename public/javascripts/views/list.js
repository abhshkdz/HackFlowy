define(
    ['jquery',
        'backbone',
        'collections/list',
        'views/task',
        'demoData'
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
                var fetchPromise = this.collection.fetch();

                fetchPromise.fail(function (e) {
                    // if the server isn't running load some demo data and a demo warning
                    $('#header').append('<div class="alert-box secondary round">Warning: Running in demo mode, all work will be lost</div>');
                    var data = demoData;
                    for (var i = 0; i < data.length; i++) {
                        Tasks.add(data[i]);
                    }
                }, this);

                this.listenTo(this.collection, 'add', this.renderTask);
            },

            render: function (data) {
                for (var i = 0; i < data.length; i++) {
                    Tasks.add(data[i]);
                }
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
                    var parent = $('*[data-id="' + a.model.get('parentId')+ '"]');
                    if (parent.length===0) {
                        // TODO deal with loading order
                        console.error("Parent not rendered yet: ", {selector: parent.selector, task: task});
                        this.$el.append(a.el);
                    } else {
                        a.$el.insertBefore(parent.parents('li:first'));
                    }
                }
            }

        });

        return ListView;

    });
