var express = require('express');
var app = express(); 
var port = process.env.PORT || 3000; 

var passport = require('passport');
var flash    = require('connect-flash');
require('./config/passport')(passport); // pass passport for configuration


require('./config/database.js').safeConnect(); 

var db = require('./lib/db');
var helperLib = require('./lib/helperLib.js');

// var routes = require('./routes/routes.js'); 
var http = require('http');
var path = require('path');



// all environments
app.set('port', port);

// app.set('views', path.join(__dirname, 'views')); 
app.set('views', __dirname + '/views');
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/public')); //ALREADY USING IT. 
app.set('view engine', 'ejs');

app.use(express.logger('dev'));
app.use(express.favicon());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);

app.use(express.cookieParser()); //(I've also installed cookie module)
app.use(express.bodyParser()); //not sure...
app.use(express.session({secret: 'secretpasswordforsessions', store: helperLib.getSessionStore()}));
//the session stuff differs from the scotch tutorial. 

app.use(passport.initialize()); 
app.use(passport.session()); 
app.use(flash()); 

app.set('view options', {
  layout: false
});





var server = http.Server(app);
helperLib.createSocket(server); 
server.listen(port);



if(process.argv[2] == "restart"){
  console.log("restarting"); 
helperLib.setUpDB();
}