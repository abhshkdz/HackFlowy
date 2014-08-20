var config = {}
config.port = process.env.PORT || 3000; 

var username =  "throwaway"
var password = "throwaway1";//
var address = '@ds037637.mongolab.com:37637/throwaway_db';

config.DB_URL = 'mongodb://' + username + ':' + password + address;
config.sessionSecret = "yourPassWordHere"; 

config.StoreDB = {db: "throwaway_db", url: config.DB_URL }

module.exports = config; 