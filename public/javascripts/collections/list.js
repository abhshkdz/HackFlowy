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

        initialize: function(){
            // update order on add, remove.
            // Ref: http://stackoverflow.com/a/11665085/221742
            this.on('add remove', this.updateModelPriority);
        },

        /**
         * Move a model in the list up. Only a sort event is emitted
         * @param  {Backbone.Model} model - Model to be moved
         */
        moveUp: function(model) { // I see move up as the -1
          var index = this.indexOf(model);
          if (index > 0) {
            this.remove(model, {silent: true});
            this.add(model, {at: index-1, silent: true});
          }
          this.trigger('sort', this, {});
        },

        /**
         * Move a model in the list up. Only a sort event is emitted
         * @param  {Backbone.Model} model - Model to be moved
         */
        moveDown: function(model) { // I see move up as the -1
          var index = this.indexOf(model);
          if (index < this.models.length) {
            this.remove(model, {silent: true});
            this.add(model, {at: index+1, silent: true});
          }
          this.trigger('sort', this, {});
        },

        /** Updated priority of each member of list **/
        updateModelPriority: function() {
          this.each(function(model, index) {
            if (model)
                model.set('priority', index);
          }, this);
        },

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

        /** sort by priority then created date **/
        comporator: function(child){
            return [child.get('priority'), child.get('createdAt')];
        },

        url: '/tasks'

    });

    // a couple of vars backbone.localforage needs in the sync function
    List.prototype.sync.localforage = List.prototype.offlineSync._localeForageKeyFn;
    List.prototype.sync._localeForageKeyFn = List.prototype.offlineSync._localeForageKeyFn;
    List.prototype.sync._localforageNamespace = List.prototype.offlineSync._localforageNamespace;

return List;

});
