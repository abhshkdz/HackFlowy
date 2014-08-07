var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }
});
// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);