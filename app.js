var express = require('express'),
	passport = require('passport'),
	swig = require('swig'),
	
	db = require('./db'),
	login = require('./login');


var app = express()
	.use(express.bodyParser())
	.use(express.cookieParser())
	.use(express.session({secret: 'secret string...'}))
	.use(passport.initialize());


// get methods

app.get('*', function(req, res, next) {
	if (!req.session.userid && req.url != '/login') {
		return res.redirect('/login');
	}
	next();
});

app.get('/', function(req, res, next) {
	db.getUserTasks(req.session.userid, function(err, tasks) {
		if (err) return next(err);
		res.send(swig.renderFile('./views/tasks.html', {tasks: tasks}));
	});
});

app.get('/register', function(req, res) {
	res.send(swig.renderFile('./views/register.html', {}));
});

app.get('/login', function(req, res) {
	res.send(swig.renderFile('./views/login.html', {}));
});


// post methods

app.post('/register', function(req, res) {
	if (!req.body.username || !req.body.password1) {
		return res.send('Username and password required.');
	}
	if (req.body.password1 != req.body.password2) {
		return res.send('Password fields do not match.');
	}
	db.createUser(req.body.username, req.body.password1, function(errmsg) {
		if (errmsg) return res.send(errmsg);
		console.log('Created user ' + req.body.username);
		res.redirect('/login');
	});
});

app.post('/login', function(req, res, next) {
	// call the passport local strategy's auth method, then call its result as middleware
	passport.authenticate('local', function(err, user) {
		if (err) return next(err);
		if (!user) return res.redirect('/login');
		req.session.regenerate(function(err) {
			console.log('Logged in as ' + user.username);
			req.session.userid = user._id;
			res.redirect('/');
		});
	})(req, res, next);
});

app.post('/new', function(req, res) {
	console.log('attempting to add new');
	db.addTask(req.session.userid, req.body.title, function(err) {
		if (err) return next(err);
		console.log('Added task ' + req.body.title);
		res.redirect('/');
	});
});


app.listen(8888);
