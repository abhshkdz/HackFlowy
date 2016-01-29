var demoData = [{"id":80,"content":"Welcome to HackFlowy!","parentId":0,"isCompleted":false,"priority":0,"createdAt":"2016-01-29T05:44:30.858Z","updatedAt":"2016-01-29T05:44:30.858Z"},{"id":81,"content":"An open-source WorkFlowy clone","parentId":0,"isCompleted":false,"priority":0,"createdAt":"2016-01-29T05:44:30.858Z","updatedAt":"2016-01-29T05:44:30.858Z"},{"id":82,"content":"Built using Backbone + Socket.IO","parentId":0,"isCompleted":false,"priority":0,"createdAt":"2016-01-29T05:44:30.858Z","updatedAt":"2016-01-29T05:44:30.858Z"},{"id":83,"content":"Desyncr pulled this together in a few hours to learn Backbone","parentId":0,"isCompleted":false,"priority":0,"createdAt":"2016-01-29T05:44:30.858Z","updatedAt":"2016-01-29T05:44:30.858Z"},{"id":84,"content":"Feel free to try it out and hack on it","parentId":0,"isCompleted":false,"priority":0,"createdAt":"2016-01-29T05:44:30.858Z","updatedAt":"2016-01-29T05:44:30.858Z"},{"id":85,"content":"Good Luck!","parentId":0,"isCompleted":false,"priority":0,"createdAt":"2016-01-29T05:44:30.858Z","updatedAt":"2016-01-29T05:44:30.858Z"},{"id":86,"content":"P.S","parentId":0,"isCompleted":false,"priority":0,"createdAt":"2016-01-29T05:44:40.978Z","updatedAt":"2016-01-29T05:44:40.978Z"},{"id":88,"content":"It makes sense if you don't think about it; I haven't","parentId":0,"isCompleted":false,"priority":0,"createdAt":"2016-01-29T05:44:58.737Z","updatedAt":"2016-01-29T05:45:50.939Z"},{"id":89,"content":"Make love not war","parentId":88,"isCompleted":false,"priority":0,"createdAt":"2016-01-29T05:45:03.048Z","updatedAt":"2016-01-29T05:45:57.481Z"},{"id":91,"content":"Love can be brought not sold","parentId":88,"isCompleted":false,"priority":0,"createdAt":"2016-01-29T05:45:32.331Z","updatedAt":"2016-01-29T05:46:10.478Z"},{"id":93,"content":"How do I love thee? Let me count the ways - Shakespear","parentId":88,"isCompleted":false,"priority":0,"createdAt":"2016-01-29T05:46:25.119Z","updatedAt":"2016-01-29T05:48:00.604Z"},{"id":95,"content":"Therefore: love can be listed and lists can be loved","parentId":88,"isCompleted":false,"priority":0,"createdAt":"2016-01-29T05:46:38.998Z","updatedAt":"2016-01-29T05:48:22.937Z"},{"id":96,"content":"Conclusion: lists and love should be free","parentId":88,"isCompleted":false,"priority":0,"createdAt":"2016-01-29T05:47:26.684Z","updatedAt":"2016-01-29T05:48:29.796Z"},{"id":97,"content":"But how can our lists be real if our love isnt? - Jaden Smith","parentId":88,"isCompleted":false,"priority":0,"createdAt":"2016-01-29T05:47:46.930Z","updatedAt":"2016-01-29T05:47:46.930Z"}];

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
