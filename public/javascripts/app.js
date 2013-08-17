require.config({

  //load lib files required
  paths: {
    jquery: "vendor/jquery.min",
    lodash:"vendor/lodash.min",
    backbone: "vendor/backbone",
    modernizr:"vendor/custom.modernizr",
    socket:"vendor/socket.io.min"   
  },
  
  shim: {   
    backbone: {
      deps: ["lodash", "jquery"],
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
