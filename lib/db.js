var mongoose = require('mongoose');
var Schema = mongoose.Schema;
module.exports.mongoose = mongoose;
module.exports.Schema = Schema;

// Connect to cloud database
//https://mongolab.com/
var username = "throwaway"
var password = "throwaway1";//
var address = '@ds037637.mongolab.com:37637/throwaway_db';
connect(); 


// Connect to mongo
function connect() {

  var url = 'mongodb://' + username + ':' + password + address;
  try {  mongoose.connect(url); }
  catch(err) { console.log("Error: Sign In to MongoLab") }
  console.log("error caught"); 
 
}
function disconnect() {
	mongoose.disconnect()
}
