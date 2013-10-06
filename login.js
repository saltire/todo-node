var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	
	db = require('./db');


// set up a passport local strategy, passing it a verify function
passport.use(new LocalStrategy(db.verifyUser));

passport.serializeUser(function(user, done) {
	done(null, user.username);
});
