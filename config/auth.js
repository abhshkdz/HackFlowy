var port = require('./config.js').port; 
module.exports = {
	'googleAuth' : {
		'clientID' 		: 'yours-here',
		'clientSecret' 	: 'yours-here',
		'callbackURL' 	: 'http://localhost:' + port +  '/auth/google/callback'
	}
};

