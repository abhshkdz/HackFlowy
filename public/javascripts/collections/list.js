define(
[
'backbone',
'models/task',
'localforage',
'localforagebackbone'
],

function(
Backbone,
Task,
localforage,
localforageBackbone
) {

  var List = Backbone.Collection.extend({


    model: Task,
    offlineSync: Backbone.localforage.sync("tasks"),
    /** switches sync between server and local databases **/
    sync: function(){
            if (window.hackflowyOffline)
                return this.offlineSync.apply(this, arguments);
            else
                return Backbone.sync.apply(this, arguments);
    },

    url: '/tasks'

 });

return List;

});
