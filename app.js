var express = require('express');
var app = express(); 
var port = require('./config/config.js').port; 

var passport = require('passport');
var flash    = require('connect-flash');
require('./config/passport')(passport); // pass passport for configuration

require('./config/database.js').safeConnect(); 
var helperLib = require('./lib/helperLib.js');


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

app.use(express.cookieParser()); //(I've also installed cookie module)
app.use(express.bodyParser()); //not sure...
app.use(express.session({secret: 'secretpasswordforsessions', store: helperLib.getSessionStore()}));
//the session stuff differs from the scotch tutorial. 

app.use(passport.initialize()); 
app.use(passport.session()); 
app.use(flash()); 
app.use(app.router);


app.set('view options', {
  layout: false
});



var http = require('http');
var path = require('path');
var server = http.Server(app);
helperLib.createSocket(server); 
server.listen(port);
require('./lib/routes.js')(app, passport); 



// console.log("ABOUT TO RECURSE"); 
// require('./lib/revAlgorithm').recurse(); 

// var MySnap = require('./models/Snap.js').MySnap; 
// console.log("TESTING Mongo"); 
// MySnap.find({},'timestamp')
// 		.sort({timestamp: -1}).limit(1).exec(function(err,timeStamp){
// 			timeStamp = timeStamp[0].timestamp; 
// 			console.log("timeStamp="); 
// 			console.log(timeStamp); 
// 		}); 





if(process.argv[2] == "restart"){
  console.log("restarting"); 
helperLib.setUpDB();
}