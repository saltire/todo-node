var mongoose = require('mongoose');


//connect to mongodb
mongoose.connect('mongodb://localhost:27017/todo', function(err, db) {
	console.log(err ? err : 'Connected to MongoDB database.');
});


User = mongoose.model('User', mongoose.Schema({
	username: {type: String, required: true, index: {unique: true}},
	//salt: {type: String, required: true},
	//hash: {type: String, required: true},
	password: {type: String, required: true}, // plaintext for now
}));


Task = mongoose.model('Task', mongoose.Schema({
	title: {type: String, required: true},
	checked: {type: Boolean, 'default': false},
	notes: String,
}));


exports.verifyUser = function(username, password, done) {
	User.findOne({username: username}, function(err, user) {
		if (err) return done(err); // return error
		if (!user) return done(null, false); // no user found; return false
		if (user.password != password) return done(null, false); // bad password, return false
		console.log('Logged in as ' + username);
		done(null, user); // return user
	});
};


exports.createUser = function(username, password, done) {
	User.create({username: username, password: password}, function(err) {
		if (err) return done(err.code == 11000 ? 'User already exists.' : err.message);
		console.log('Created user ' + username);
		done();
	});
};

