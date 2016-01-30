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

        // The tree's root: a simple collection view that renders
        // a recursive tree structure for each item in the collection
        var ListView = Backbone.Marionette.CollectionView.extend({

            el: $("#main .children"),
            childView: TaskView,
            template: '#list-view-template',

            events: {
                'click #add': 'addTask'
            },

            initialize: function () {
                var self = this;

                Tasks =  new List();

                // this.listenTo(this.collection, 'add', this.renderTask);

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
                        this.collection = {models:Tasks.filter({'parentId':0})};
                        this.render();
                    }
                }

                Tasks.fetch({
                    success: success,
                    error: function () {

                        // switch to localforage database if server isn't present and fetch again
                        window.hackflowyOffline=true;
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

            // render: function () {
            //     var models = Tasks.filter({'parentId':0});
            //
            //     _.each(models, function(model, index) {
            //         var taskView = new this.childView({
            //             model: model,
            //             collection: model.collection
            //         });
            //         var a = taskView.render();
            //         this.$el.append(a.el);
            //     }, this);
            //
            //     this.triggerMethod('render', this);
            //     return this;
            // },

            renderTask: function (task) {
                var taskView = new TaskView({
                    model: task
                });
                var a = taskView.render();
                this.$el.append(a.el);
                //
                // if (a.model.get('parentId') === 0) {
                //     // insert it at the end of the top-level items
                //     this.$el.append(a.el);
                // } else {
                //
                //     // TODO use dom nesting instead of data attributes
                //     var parent = $('*[data-id="' + a.model.get('parentId') + '"]').parents('li:first');
                //     var siblings = parent.find('.children:first li');
                //     var editingSibling = siblings.filter('.editing:first');
                //
                //     if (editingSibling.length > 0){
                //         // insert it after open sibling
                //         a.$el.insertAfter(editingSibling);
                //     }
                //     else if (parent.length > 0) {
                //         // insert under parent
                //         a.$el.appendTo(parent.find('.children:first'));
                //     } else {
                //         // we have an orphan :(
                //         // insert at root for lack of a better option
                //         this.$el.append(a.el);
                //
                //         // TODO deal with loading order
                //         console.error("Parent not rendered yet: ", {
                //             selector: parent.selector,
                //             task: task
                //         });
                //
                //     }
                // }
            }

        });

        return ListView;

    });
