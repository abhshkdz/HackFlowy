define(
    ['jquery',
        'backbone',
        'collections/list',
        'views/task',
        'data/demo',
        'text!../../templates/task.html',
        'marionette'
    ],

    function (
        $,
        Backbone,
        List,
        TaskView,
        demoData,
        listTemplate,
        Marionette
    ) {

        // renders recursive tree structure for each item in collection
        var ListView = Backbone.Marionette.CollectionView.extend({

            el: $("#main .children"),
            childView: TaskView,
            template: '#list-view-template',

            events: {
                'click #add': 'addTask'
            },

            initialize: function () {
                var self = this;

                this.collection = Tasks = new List();

                /** Load demo data **/
                function loadDemoData() {
                    for (var i = 0; i < demoData.length; i++) {
                        var task = Tasks.add(demoData[i]);
                        task.save();
                    }
                }

                function success(children, data, promise) {
                    // load demo data if the server returns nothing
                    if (children.length === 0)
                        loadDemoData();
                    else {
                        this.render();
                    }
                }

                Tasks.fetch({
                    success: success,
                    error: function () {

                        // switch to localforage database if server isn't present and fetch again
                        // from there
                        window.hackflowyOffline = true;
                        $('#header').append('<div class="alert-box secondary round">Running in offline mode, data may be lost </div>');
                        Tasks.fetch({
                            success: success,
                            context: this
                        });
                    },
                    context: this
                });

            },

            // Only show direct children
            filter: function (child, index, collection) {
                return child.get('parentId') === 0;
            },

        });

        return ListView;

    });
