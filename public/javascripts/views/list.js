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

                this.collection.fetch()
                    .fail(function (e) {
                        // if the server isn't running so load some demo data and a demo warning
                        $('#header').append('<div class="alert-box secondary round">Warning: Running in demo mode, all work will be lost</div>');
                        for (var i = 0; i < demoData.length; i++) {
                            Tasks.add(demoData[i]);
                        }
                    })
                    .always(function(data){
                        console.log({data:data});
                        if (data.length===0){
                            // if the server isn't running so load some demo data and a demo warning
                            $('#header').append('<div class="alert-box secondary round">Warning: Running in demo mode, work will be lost</div>');
                            for (var i = 0; i < demoData.length; i++) {
                                var task = Tasks.add(demoData[i]);
                                task.save();
                            }
                        }
                    });

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
