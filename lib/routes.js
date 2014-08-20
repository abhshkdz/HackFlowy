module.exports = function(app, passport) {

	app.get('/', function(req, res) {
		var user = {bleh: "blah"}
		res.render('index', {data: user}); 
	});

	  // route for logging out
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	

	
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    //scope?? //(callBack = None). 


	app.get('/auth/google/callback',
	            passport.authenticate('google', {
	                    successRedirect : '/',
	                    failureRedirect : '/'
	            }));
    
    // // the callback after google has authenticated the user
    // app.get('/auth/google/callback', function(req, res, next){
    // 	passport.authenticate('google', function(err, user, info) {
    // 		if(err){return next(err);}
    // 		if(!user){return res.render('index.ejs', { data: {failed: "true"} } ) }
    // 		req.logIn(user, function(err){
    // 			if(err) {return next(err); }
    // 			return res.redirect("/"); 
    // 			// return res.render('index.ejs', { data: user } ); 
    // 		}); 
    // 	})(req, res, next); //have to actually call the passport method. 
    // });

    app.post("/ajaxlogin", function(req, res){
    	console.log("AJAXLOGIN"); 
    	console.log("req.isAuthenticated() = " + req.isAuthenticated()); 
    	res.send(req.user); 
    })
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}











// // route for login form
// 	// route for processing the login form
// 	// route for signup form
// 	// route for processing the signup form

// 	// route for showing the profile page
// 	app.get('/profile', isLoggedIn, function(req, res) {
// 		res.render('profile.ejs', {
// 			user : req.user // get the user out of session and pass to template
// 		});
// 	});

// 	// facebook routes
// 	// twitter routes

// 	// =====================================
// 	// GOOGLE ROUTES =======================
// 	// =====================================
// 	// send to google to do the authentication
// 	// profile gets us their basic information including their name
// 	// email gets their emails