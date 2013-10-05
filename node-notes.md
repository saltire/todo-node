# Node Notes

### Modules

Node is modular, so most functionality comes from modules that are imported
into the local namespace using the `require` function.

`var http = require('http');`

A module is just another JS file. The `require` function will return
the `module.exports` object within that file.
When creating a module, add any objects, functions, variables, etc. to `module.exports`,
and they will be available in the variable created when other modules `require` your module.


### Events and listeners

Node is event-driven, so it largely consists of objects which emit events,
and can have associated listener/callback functions that are called when those events occur.
These functions are called asynchronously, so they don't block execution of the application.


### HTTP requests

Node provides an HTTP server object through its *http* module.

`var server = http.createServer();`

The `createServer()` function takes a request listener function as an argument,
which it will call whenever an HTTP request is received, passing it the request object
and the response object as arguments.

It also has a `listen` method that will start it listening;
a common usage is to pass a port number to this method.

`var server = http.createServer(function(request, response) { ... }).listen(8888);`

The response object provides methods you can use to send a response,
such as `writeHead()` to send a header, `write()` to send data, and the mandatory `end()`.


# Connect middleware

The *Connect* framework provides an application object that extends Node's HTTP server,
and a number of functions for processing HTTP requests, called middleware.
A Connect app can have a stack of middleware functions associated with it.
Add middleware to the stack by calling the app's `use` method and passing it a function:

```
var connect = require('connect');
var app = connect.createServer().use(middleware);
```

You can also specify a path: `server.use('/path', middleware);`
The middleware will only be called for requests coming from URLs matching this path.

When a request is received, middleware functions are called in order.
They are passed three arguments:
the request object, the response object, and the next function in the stack.

`function middleware(request, response, next) { ... }`


### Error-handling middleware

Connect also supports middleware that handles errors.
Error-handling functions must take an error argument before the other arguments:

`function errorHandler(error, request, response, next) { ... }`

If you pass an error to the next function (`next(error)`), execution will skip to
the next error-handling function, passing your error as the first argument.


# Routing with Express

The *Express* framework provides a further extension of Connect's application object,
with added features such as routing.
It also extends the request and response objects, and provides some middleware.

```
var express = require('express');
var app = express().use(middleware);
```

Route handlers are defined using an HTTP verb (get, post, etc.),
a URL path, and one or more middleware functions:

`app.VERB(path, callback [, callback...])`

On a request, the application will call, in order of definition,
those handlers whose path matches the request URL.

When a handler is called, each of its callbacks will be called in order.
Calling `next()` within a callback will go to the next callback for this route handler,
and the special `next('route')` will skip to the next matching handler, if any.





