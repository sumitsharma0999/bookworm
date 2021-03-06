#!/usr/bin/env node

/**
 * Module dependencies.
 */

var debug = require('debug')('bookworm:server');
var http = require('http');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

var routes = require('./routes/index');
var users = require('./routes/users');
var apis = require('./routes/apis');

var app = express();

require('dotenv').load();

mongoose.connect(process.env.DB_STRING);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CORS Support
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type,x-access-token');
    next();
});

var checkForAuthentication = function(req, res, next) {

    var routeProtectionEnabled = process.env.ENABLE_ROUTE_PROTECTION === "true";
  
    if(routeProtectionEnabled) {
        if(req.url !== '/api/users/addUser' &&
           req.url !== '/api/users/authenticate' &&
           req.url !== '/' &&
           req.url !== '/signup' &&
           req.url !== '/signin') {

            // requester should provide an access token
            var token = req.headers['bookworm-access-token'];
            if(!token) {
                token = req.cookies.bookworm_token;
            }

            if(token) {
                jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
                    if (err) {
                        res.status(401);
                        return res.json({ success: false, message: 'Failed to authenticate token.' });
                    } else {
                        // if everything is good, save to request for use in other routes
                        req.user = decoded;
                        next();
                    }
                });
            } else {
                res.status(401); // Permission denied
                res.json({ success: false, message: 'You should be logged in first' });
            }
        }
        else {
            // Authentication is not required.
           next();
        }
    }
    else {
        next();
    }
};

app.use(checkForAuthentication);

app.use('/', routes);
app.use('/users', users);
app.use('/api', apis);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


// module.exports = app;

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);


// Socket.io
var io = require('socket.io').listen(server);

require('./scripts/socketIoController')(io);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

