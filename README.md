# SocketIO JWT Auth

[![Travis](https://img.shields.io/travis/adcentury/socketio-jwt-auth.svg)](https://travis-ci.org/adcentury/socketio-jwt-auth) [![Coveralls github](https://img.shields.io/coveralls/github/adcentury/socketio-jwt-auth.svg)](https://coveralls.io/github/adcentury/socketio-jwt-auth) [![npm](https://img.shields.io/npm/dm/socketio-jwt-auth.svg)](https://www.npmjs.com/package/socketio-jwt-auth) [![GitHub license](https://img.shields.io/github/license/adcentury/socketio-jwt-auth.svg)](https://github.com/adcentury/socketio-jwt-auth/blob/master/LICENSE)

> Socket.io authentication middleware using Json Web Token

Work with [socket.io](http://socket.io/) >= 1.0

## Installation

```
npm install socketio-jwt-auth
```

## Usage

### Register the middleware with socket.io

__socketio-jwt-auth__ has only one method `authenticate(options, verify)`.

`options` is an object literal that contains options:

* `secret` a secret key,
* `algorithm`, defaults to HS256, and
* `succeedWithoutToken`, which, if `true` tells the middleware not to fail if no token is suppled. Defaults to`false`.

`verify` is a function with two args `payload`, and `done`:

* `payload` is the decoded JWT payload, and
* `done` is an error-first callback with three args: `done(err, user, message)`

```javascript
var io = require('socket.io')();
var jwtAuth = require('socketio-jwt-auth');

// using middleware
io.use(jwtAuth.authenticate({
  secret: 'Your Secret',    // required, used to verify the token's signature
  algorithm: 'HS256'        // optional, default to be HS256
}, function(payload, done) {
  // done is a callback, you can use it as follows
  User.findOne({id: payload.sub}, function(err, user) {
    if (err) {
      // return error
      return done(err);
    }
    if (!user) {
      // return fail with an error message
      return done(null, false, 'user does not exist');
    }
    // return success with a user info
    return done(null, user);
  });
}));
```

### Connecting without a token

There are times when you might wish to successfully connect the socket but indentify the connection as being un-authenticated. For example when a user connects as a guest, before supplying login credentials.  In this case you must supply the option `succeedWithoutToken`, as follows:

```javascript
var io = require('socket.io')();
var jwtAuth = require('socketio-jwt-auth');

// using middleware
io.use(jwtAuth.authenticate({
  secret: 'Your Secret',    // required, used to verify the token's signature
  algorithm: 'HS256',        // optional, default to be HS256
  succeedWithoutToken: true
}, function(payload, done) {
  // you done callback will not include any payload data now
  // if no token was supplied
  if (payload && payload.sub) {
    User.findOne({id: payload.sub}, function(err, user) {
      if (err) {
        // return error
        return done(err);
      }
      if (!user) {
        // return fail with an error message
        return done(null, false, 'user does not exist');
      }
      // return success with a user info
      return done(null, user);
    });
  } else {
    return done() // in your connection handler user.logged_in will be false
  }
}));
```

### Access user info 
```javascript
io.on('connection', function(socket) {
  console.log('Authentication passed!');
  // now you can access user info through socket.request.user
  // socket.request.user.logged_in will be set to true if the user was authenticated
  socket.emit('success', {
    message: 'success logged in!',
    user: socket.request.user
  });
});

io.listen(9000);
```

### Client Side

```javascript
<script>
  // You should add auth_token to the query when connecting
  // Replace THE_JWT_TOKEN with the valid one
  var socket = io('http://localhost:9000', {query: 'auth_token=THE_JWT_TOKEN'});
  // Connection failed
  socket.on('error', function(err) {
    throw new Error(err);
  });
  // Connection succeeded
  socket.on('success', function(data) {
    console.log(data.message);
    console.log('user info: ' + data.user);
    console.log('logged in: ' + data.user.logged_in)
  })
</script>
```

If your client [support](https://socket.io/docs/client-api/#With-extraHeaders), you can also choose to pass the auth token in headers.

```javascript
<script>
  // Use extraHeaders to set a custom header, the key is 'x-auth-token'.
  // Don't forget to replace THE_JWT_TOKEN with the valid one.
  var socket = io('http://localhost:9000', {
    extraHeaders: {
      'x-auth-token': 'THE_JWT_TOKEN'
    },
    transportOptions: {
      polling: {
        extraHeaders: {
          'x-auth-token': 'THE_JWT_TOKEN'
        }
      }
    },
  });
  // ...
</script>
```

## Tests

```
npm install
npm test
```

## Change Log

### 0.1.0

* Add support for passing auth token with `extraHeaders`

### 0.0.6

* Fix an api bug of `node-simple-jwt`

### 0.0.5

* Add an option (`succeedWithoutToken`) to allow guest connection

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2015 Lei Lei
