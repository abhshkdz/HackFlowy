var app = app || {};

(function() {

  app.Task = Backbone.Model.extend({

    defaults: {
      parent_id: '',
      content: ''
    },
    
  });

}());