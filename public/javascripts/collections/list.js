var app = app || {};

(function() {

  app.List = Backbone.Collection.extend({

    model: app.Task
    
  });

}());