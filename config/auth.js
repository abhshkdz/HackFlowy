var port = require('./config.js').port; 
module.exports = {
	'googleAuth' : {
		'clientID' 		: '740908531699-7v0vlgb8h0hvvfj21365dadkuqdms9nk.apps.googleusercontent.com',
		'clientSecret' 	: 'zhdBknzScyShw5GiMZowp89Y',
		'callbackURL' 	: 'http://localhost:' + port +  '/auth/google/callback'
	}
};

