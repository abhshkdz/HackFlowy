define(
    ['jquery',
        'backbone',
        'collections/list',
        'views/task'
    ],

    function (
        $,
        Backbone,
        List,
        TaskView
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
                    $('#header').append('<div class="alert-box warning round">Warning: Running in demo mode, all work will be lost</div>');
                    var data = JSON.parse(demoData);
                    for (var i = 0; i < data.length; i++) {
                        Tasks.add(data[i]);
                    }
                }, this);

                this.listenTo(this.collection, 'add', this.renderTask);
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
                if (a.model.get('parentId') === 0)
                    this.$el.append(a.el);
                else
                    a.$el.insertAfter($('*[data-id="' + (a.model.get('parentId')||0) + '"]').parents('li:first'));
            }

        });

        return ListView;

    });
