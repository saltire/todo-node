var express = require('express'),
	passport = require('passport'),
	swig = require('swig'),
	
	db = require('./db'),
	login = require('./login');


// set up express
var app = express()
	.use(express.bodyParser())
	.use(express.cookieParser())
	.use(express.session({secret: 'secret string...'}))
	.use(passport.initialize());


app.get('/list', function(req, res) {
	db.User.find({}, function(err, users) {
		console.log(users);
	});
	res.end();
});


app.get('/register', function(req, res) {
	res.send(swig.renderFile('./views/register.html', {}));
});
app.get('/login', function(req, res) {
	res.send(swig.renderFile('./views/login.html', {}));
});


app.post('/register', function(req, res) {
	if (!req.body.username || !req.body.password1) {
		return res.send('Username and password required.');
	}
	if (req.body.password1 != req.body.password2) {
		return res.send('Password fields do not match.');
	}
	db.createUser(req.body.username, req.body.password1, function(errmsg) {
		if (errmsg) return res.send(errmsg);
		res.redirect('/login');
	});
});


// authenticate using passport local strategy, passing authenticate a done function
app.post('/login', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login',
}));


app.listen(8888);
