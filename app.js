
/**
 * Module dependencies.
 */

var express = require('express');
// var routes = require('./routes/routes.js'); 
var fs = require('fs');
var http = require('http');
var path = require('path');
var crypto = require('crypto');
var db = require('./lib/db');
var helperLib = require('./lib/helperLib.js');

var app = express()
var server = http.Server(app);
helperLib.createSocket(server); 
server.listen(process.env.PORT || 3000);



// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.session({secret: 'secretpasswordforsessions', store: helperLib.getSessionStore()}));

app.configure(function () {
  app.use(express.bodyParser()); //not sure...
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.static(__dirname + '/public')); //ALREADY USING IT. 
});
app.set('view options', {
  layout: false
});

app.get('/',function(req,res){
  console.log("\n\nrenderingIndex\n")
  res.render('index');
}); 

if(process.argv[2] == "restart"){
  console.log("restarting"); 
helperLib.setUpDB();
}

