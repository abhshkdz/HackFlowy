require.config({

    //load lib files required
    paths: {
        jquery: '../bower_components/jquery/dist/jquery.min',
        lodash: "../bower_components/lodash/dist/lodash.min",
        backbone: '../bower_components/backbone/backbone-min',
        modernizr: "vendor/custom.modernizr",
        socket: "../bower_components/socket.io-client/socket.io",
        text: '../bower_components/text/text',
    },
    map: {
        "*": {
            // alias underscore to lodash for backbone
            "underscore": "lodash"
        }
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
    function (App) {
        new App();
    });
