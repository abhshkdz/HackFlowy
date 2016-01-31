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
            viewComparator: List.prototype.comporator,
            template: _.template(listTemplate),

            events: {
                'click #add': 'addTask'
            },

            initialize: function () {
                var self = this;

                // this wholeCollection holds all items
                this.wholeCollection = Tasks = new List();
                //this.collection = new List();

                // custom events
                this.listenTo(this, 'childview:rerender', this.render);
                // this.listenTo(this.collection, 'add remove', this.render);

                /** Load demo data **/
                function loadDemoData() {
                    for (var i = 0; i < demoData.length; i++) {
                        var task = Tasks.add(demoData[i]);
                        task.save();
                    }
                }

                function success(children, data, promise) {
                    // load demo data if the server returns nothing
                    var directChildren = children.filter(this.filterDirectChildren);
                    if (directChildren.length === 0)
                        loadDemoData();
                    this.collection = new List(Tasks.filter(this.filterDirectChildren));
                    this.render();
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
            filterDirectChildren: function (child, index, collection) {
                return child.get('parentId') === 0;
            },

            /** This is the root view in the tree **/
            getParentView: function () {
                return this;
            },

            /** Update parentId when added to collection **/
            onAddChild: function(childView){
                if (childView.model.get('parentId')!==0)
                    childView.model.save({parentId: 0});
            },

        });

        return ListView;

    });
