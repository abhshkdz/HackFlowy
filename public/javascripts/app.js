require.config({

  paths: {
    jquery: "vendor/jquery.min",
    underscore: "vendor/underscore",
    backbone: "vendor/backbone",
    modernizr:"vendor/custom.modernizr",
    socket:"vendor/socket.io.min",
    lodash:"vendor/lodash.min"
  },
  
  shim: {
   
    backbone: {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
    }  

  },
  
  waitSeconds: 5

});

//start the app
require([
    'views/page'
],

function( App ) {
   new App();
});
