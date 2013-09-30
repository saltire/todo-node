var url = require('url'),
	connect = require('connect'),
	db = require('./mongo'),
	actions = require('./actions');


// main request listener
function todo(request, response) {
	var url_parts = url.parse(request.url, true);
	var segments = url_parts.pathname.replace(/^\//, '').split('/');
	
	// get main function from actions module
	var action = segments[0];
	if (!(action in actions)) {
		response.writeHead(404, {"Content-Type": "text/plain"});
		response.write("404 Not found");
		response.end();
	}

	var args;
	
	// post request
	if (request.method.toLowerCase() == 'post') {
		var postData = '';
		request.setEncoding('utf8');
		request.on('data', function(dataChunk) {
			postData += dataChunk;
		});
		request.on('end', function() {
			args = [request, response, postData].concat(segments.slice(1));
			actions[action].apply(this, args);
		});
	
	// get request
	} else if (request.method.toLowerCase() == 'get') {
		args = [request, response, url_parts.query].concat(segments.slice(1));
		actions[action].apply(this, args);
	}
}


// initialize connect module and middleware
var app = connect()
	.use(connect.favicon())
	.use(connect.cookieParser())
	.use(connect.session({
		secret: 'todo-node secret string',
		key: 'todo-node',
	}))
	.use(todo)
	.listen(8888);
