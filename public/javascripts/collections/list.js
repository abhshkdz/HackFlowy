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
            //var self = this;
            _localforageNamespace = this.offlineSync._localforageNamespace;
            _localeForageKeyFn=this.offlineSync._localeForageKeyFn;
            localforageKey = this.offlineSync._localeForageKeyFn;
            if (window.hackflowyOffline)
                return this.offlineSync.apply(this, arguments);
            else
                return Backbone.sync.apply(this, arguments);
        },

        url: '/tasks'

    });

    // a couple of vars backbone.localforage needs in the sync function
    List.prototype.sync.localforage = List.prototype.offlineSync._localeForageKeyFn;
    List.prototype.sync._localeForageKeyFn = List.prototype.offlineSync._localeForageKeyFn;
    List.prototype.sync._localforageNamespace = List.prototype.offlineSync._localforageNamespace;

return List;

});
