# Node Notes


# Connect middleware

A node server created by connect can have a stack of middleware functions associated with it.
Add middleware to the stack by calling the server's `use` method and passing it a function:

```
var connect = require('connect');
var app = connect.createServer();
app.use(middleware);
```

You can also specify a path: `app.use('/path', middleware);`
The middleware will only be called for requests using this path.

Middleware functions are called in order, and are passed three arguments:
the request object, the response object, and the next function in the stack.
`function middleware(request, response, next) { ... }`





# Routing with Express

`app.verb(path, callback [,callback ...])`

- verb: an HTTP method (get, post, etc.)
- path: a URL path that will call this handler
- callback: one or more middleware functions, called in order


