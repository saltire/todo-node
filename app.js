var express = require('express'),
	mongoose = require('mongoose'),
	passport = require('passport'),
		LocalStrategy = require('passport-local').Strategy,
	swig = require('swig');


// set up express
var app = express()
	.use(express.json())
	.use(express.urlencoded())
	.use(express.cookieParser())
	.use(express.cookieSession({secret: 'secret string...'}));


// connect mongoose to todo db
mongoose.connect('mongodb://localhost:27017/todo', function(err, db) {
	console.log(err ? err : 'Connected to MongoDB database.');
});


// set up a User model with schema
var User = mongoose.model('User', {
	username: {type: String, required: true, unique: true},
	//salt: {type: String, required: true},
	//hash: {type: String, required: true},
	password: {type: String, required: true}, // plaintext for now
});


// set up a local strategy for passport, passing it a verify function
passport.use(new LocalStrategy(function(username, password, done) {
	User.findOne({username: username}, function(err, user) {
		if (err) return done(err);
		if (!user) return done(null, false);
		if (!user.verifyPassword(password)) return done(null, false);
		return done(null, user);
	});
}));






// route handlers

app.get('*', function(req, res, next) {
	console.log('got ' + req.path);
	next();
});


app.get('/login', function(req, res) {
	console.log('rendering login');
	res.send(swig.renderFile('./templates/login.html', {}));
});


// authenticate using 
app.post('/login', passport.authenticate('local', function(err, user, info) {
	if (err) return next(err);
	if (!user) {
		return res.redirect('/login');
	}
	//req.logIn
}));


app.get('/list', function(req, res) {
	console.log('listing users');
	User.find({}, function(err, docs) {
		console.log(docs);
	});
});


app.listen(8888);
