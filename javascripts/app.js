require.config({

    //load lib files required
    paths: {
        jquery: '../bower_components/jquery/dist/jquery.min',
        underscore: "../bower_components/underscore/underscore-min",
        backbone: '../bower_components/backbone/backbone-min',
        localforage: '../bower_components/localforage/dist/localforage',
        localforagebackbone: '../bower_components/localforage-backbone/dist/localforage.backbone',
        modernizr: "vendor/custom.modernizr",
        socket: "../bower_components/socket.io-client/socket.io",
        text: '../bower_components/text/text',
        marionette: '../bower_components/backbone.marionette/lib/backbone.marionette'
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
    function (App) {
        new App();
    });
