require.config({

    //load lib files required
    paths: {
        jquery: '../bower_components/jquery/dist/jquery',
        underscore: "../bower_components/underscore/underscore",
        backbone: '../bower_components/backbone/backbone',
        localforage: '../bower_components/localforage/dist/localforage',
        localforagebackbone: '../bower_components/localforage-backbone/dist/localforage.backbone',
        modernizr: "../bower_components/modernizr/custom.modernizr",
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
