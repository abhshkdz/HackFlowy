define(
['backbone',
    'localforage',
    'localforagebackbone',
    'util/constants',
],function (
    Backbone,
    localforage,
    localforageBackbone,
    constants
) {

    var TaskModel = Backbone.Model.extend({

        offlineSync: Backbone.localforage.sync('TaskModel'),

        /** switches sync between server and local databases **/
        sync: function () {

            if (window.hackflowyOffline)
                return this.offlineSync.apply(this, arguments);
            else
                return Backbone.sync.apply(this, arguments);
        },

        defaults: {
            parentId: constants.ROOT_PARENT_ID,
            content: '',
            isCompleted: false,
            isFolded: false,
            priority: 0,
            id: undefined,
        },

        toggelCompletedStatus: function (isCompleted) {
            var prev_isCompleted = isCompleted,
                self = this;
            this.save({
                'isCompleted': isCompleted
            }, {
                success: function () {},
                error: function () {
                    //REVERT BACK ON ERROR
                    self.set({
                        'isCompleted': prev_isCompleted
                    });
                }
            });
        },

        focusOnView: function(){
            if (this.view && this.view.$el)
                return this.view.$('input:first').focus();
        }

    });

    // a couple of vars backbone.localforage needs in the sync function
    TaskModel.prototype.sync.localforage = TaskModel.prototype.offlineSync._localeForageKeyFn;
    TaskModel.prototype.sync._localeForageKeyFn = TaskModel.prototype.offlineSync._localeForageKeyFn;
    TaskModel.prototype.sync._localforageNamespace = TaskModel.prototype.offlineSync._localforageNamespace;

    return TaskModel;

});
