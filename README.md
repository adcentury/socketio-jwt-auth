# SocketIO JWT Auth

> Socket.io authentication middleware using Json Web Token

Work with [socket.io](http://socket.io/) >= 1.0

## Install

npm install socketio-jwt-auth

## Usage

### Register middleware to socket io

__socketio-jwt-auth__ has only one method `authenticate(options, verify)`

```javascript
var io = require('socket.io')();
var jwtAuth = require('socketio-jwt-auth');

// using middleware
io.use(jwtAuth.authenticate({
  secret: 'Your Secret',    // required, used to decode token
  algorithm: 'HS256'        // optional, default to be HS256
}, function(payload, done) {
  // done is a callback, you can use it as follow
  User.findOne({id: payload.sub}, function(err, user) {
    if (err) {
      // return error
      return done(err);
    }
    if (!user) {
      // return fail with an error message
      return done(null, false, 'user not exist');
    }
    // return success with a user info
    return done(null, userinfo);
  });
}));
```

### Access user info 
```javascript
io.on('connection', function(socket) {
  console.log('authentication passed!');
  // now you can access user info through socket.request.user
  // socket.request.user.logged_in will be set to true
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
  // you should add auth_token to query while connecting
  // replace THE_JWT_TOKEN with the verified one
  var socket = io('http://localhost:9000', {query: 'auth_token=THE_JWT_TOKEN'});
  // Authentication failed
  socket.on('error', function(err) {
    throw new Error(err);
  });
  // Authentication passed
  socket.on('success', function(data) {
    console.log(message);
    console.log('user info: ' + user);
  })
</script>
```

## Tests

```
npm install
npm test
```

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2015 Lei Lei