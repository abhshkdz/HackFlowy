var mongoose = require('mongoose'); 

// Connect to cloud database
//https://mongolab.com/
var username = "throwaway"
var password = "throwaway1";
var address = '@ds037637.mongolab.com:37637/throwaway_db';
var url = 'mongodb://' + username + ':' + password + address;

function safeConnect() {
	try {  mongoose.connect(url); }
	catch(err) { console.log("Error: Sign In to MongoLab") }
	// console.log("error caught"); 
}

