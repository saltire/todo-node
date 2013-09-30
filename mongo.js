var MongoClient = require('mongodb').MongoClient;


MongoClient.connect('mongodb://localhost:27017/todo', function(error, db) {
	console.log(error ? error : 'Connected to MongoDB database.');
});
