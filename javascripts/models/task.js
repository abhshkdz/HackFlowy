define(
['backbone',
    'localforage',
    'localforagebackbone'
],

function (
    Backbone,
    localforage,
    localforageBackbone
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
            parentId: 0,
            content: '',
            isCompleted: 0,
            priority: 0,
            id: '',
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
            return this.view.$('input:first').focus();
        }

    });

    // a couple of vars backbone.localforage needs in the sync function
    TaskModel.prototype.sync.localforage = TaskModel.prototype.offlineSync._localeForageKeyFn;
    TaskModel.prototype.sync._localeForageKeyFn = TaskModel.prototype.offlineSync._localeForageKeyFn;
    TaskModel.prototype.sync._localforageNamespace = TaskModel.prototype.offlineSync._localforageNamespace;

    return TaskModel;

});
