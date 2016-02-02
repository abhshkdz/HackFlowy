define(
    ['jquery',
        'backbone',
        'collections/list',
        'views/task',
        'text!../../templates/task.html',
        'marionette'
    ],

    function (
        $,
        Backbone,
        List,
        TaskView,
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
                'click #add': 'addTask',
            },

            initialize: function () {
            },

            /** This is the root view in the tree **/
            getParentView: function () {
                return this;
            },

            /** Update parentId when added to collection **/
            onAddChild: function(childView){
                var rootId = pageView.getRootId();
                if (childView.model.get('parentId')!=rootId && childView.model==rootId)
                    childView.model.save({parentId: rootId});
            },

        });

        return ListView;

    });
