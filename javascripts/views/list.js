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


            /** Get root id for the displayed list from the url hash or 0 **/
            // getRootId: function(){
            //     var hash = window.location.hash.slice(1);
            //     return hash ? hash: 0;
            //
            // },

            // /** Called when window location hash changes **/
            // changeRootId: function(){
            //     this.collection.remove(this.collection.models);
            //     this.collection.add(pageView.collection.filter(this.filterDirectChildren,this));
            //     this.updateBreadCrumbs();
            // },

            // updateBreadCrumbs: function(){
            //     var rootId = this.getRootId();
            //     if (rootId){
            //         var current = Tasks.get(rootId);
            //         var breadCrumbs = _.template('<a href="#<%= id %>"><%= content %></a>')(current.attributes);
            //         var depth=0;
            //         while (current.get('parentId') && depth<100){
            //             depth++;
            //             current = Tasks.get(current.get('parentId'));
            //             breadCrumbs=_.template('<a href="#<%= id %>"><%= content %></a> > ')(current.attributes)+breadCrumbs;
            //         }
            //         if (depth>=100) console.error('Max depth exceeded while making breadCrumbs');
            //         breadCrumbs='<a href="#">Home</a> > '+breadCrumbs;
            //         $('#task-breadcrumbs').append(breadCrumbs);
            //
            //     }
            // },

            // Only show direct children
            // filterDirectChildren: function (child, index, collection) {
            //     var rootId = this.getRootId();
            //     if (rootId)
            //         return child.get('id') == rootId;
            //     else
            //         return child.get('parentId') == rootId;
            // },

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
