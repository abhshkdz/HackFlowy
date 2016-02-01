define(
['jquery',
'backbone',
'marionette',
'views/list',
'data/demo',
'models/task',
'collections/list'
],

function(
$,
Backbone,
Marionette,
ListView,
demoData,
Task,
List
) {

  var PageView = Marionette.View.extend({

    el: $("#hackflowy"),

    events: {
    },

    initialize: function() {

        // this wholeCollection holds all items
        this.collection = new List();


        function success(children, data, promise) {
            // load demo data if the server returns nothing
            var directChildren = children.filter(this.filterDirectChildren,this);
            if (directChildren.length === 0){
                for (var i = 0; i < demoData.length; i++) {
                    var task = this.collection.add(demoData[i]);
                    task.save();
                }
            }
            this.listView.collection.add(children.filter(this.filterDirectChildren,this));
            this.listView.render();
            this.updateBreadCrumbs();
        }

        this.collection.fetch({
            success: success,
            error: function () {
                // switch to localforage database if server isn't present and fetch again
                // from there
                window.hackflowyOffline = true;
                this.$('#header-alerts').append('<div class="alert-box secondary round">Running in offline mode, data may be lost </div>');
                this.collection.fetch({
                    success: success,
                    context: this
                });
            },
            context: this
        });

       var rootItems = new List(this.collection.filter(this.filterDirectChildren,this));
      this.listView = new ListView({collection: rootItems});


      // change root item when the url hash changes
      // HACK should ideally use http://stackoverflow.com/a/19114496/221742
      $(window).on("hashchange", this.changeRootId.bind(this));

      // stop browser going back a page when jamming backspace
      $(window).on('keydown',function(e){if(e.keyIdentifier=='U+0008'||e.keyIdentifier=='Backspace'){if(e.target==document.body){e.preventDefault();}}});


    },

    /** remove non backbone listener on delete **/
    onDestroy: function() {
      $(window).off("haschange",this.changeRootId);
      $(window).off('keydown',function(e){if(e.keyIdentifier=='U+0008'||e.keyIdentifier=='Backspace'){if(e.target==document.body){e.preventDefault();}}});
    },

    /** Get root id for the displayed list from the url hash or 0 **/
    getRootId: function(){
        var hash = window.location.hash.slice(1);
        if (hash && pageView.collection.get(hash))
            return hash;
        else if (hash)
            window.location.hash='';
        return 0;
    },

    /** Called when window location hash changes **/
    changeRootId: function(){
        // change the listview children
        this.listView.collection.remove(this.collection.models);
        this.listView.collection.add(this.collection.filter(this.filterDirectChildren,this));
        this.updateBreadCrumbs();
    },

    // Only show direct children
    filterDirectChildren: function (child, index, collection) {
        var rootId = this.getRootId();
        if (rootId)
            return child.get('id') == rootId;
        else
            return child.get('parentId') == rootId;
    },

    updateBreadCrumbs: function(){
        var rootId = this.getRootId();
        if (rootId){
            this.$('#task-breadcrumbs').empty();
            var current = this.collection.get(rootId);
            var breadCrumbs = '';//_.template('<a href="#<%= id %>"><%= content %></a>')(current.attributes);
            var depth=0;
            while (current.get('parentId') && depth<100){
                depth++;
                current = this.collection.get(current.get('parentId'));
                breadCrumbs=_.template('<a href="#<%= id %>"><%= content %></a> > ')(current.attributes)+breadCrumbs;
            }
            if (depth>=100) console.error('Max depth exceeded while making breadCrumbs');
            breadCrumbs='<a href="#">Home</a> > '+breadCrumbs;
            this.$('#task-breadcrumbs').append(breadCrumbs);

        }
    },

 });

return PageView;

});
