var io = require('socket.io')();
var socketIoJwtAuth = require('../../lib');

var data = require('../testdata');

exports.start = function() {
  io.use(socketIoJwtAuth.authenticate({
    secret: data.valid_jwt.secret,
    algorithm: 'HS256'
  }, function(payload, done) {
    var id = payload.sub;
    if (!id) {
      return done('error happened');
    }
    if (id !== '1') {
      return done(null, false, 'user not exist');
    }
    return done(null, {
      name: data.user.name,
      email: data.user.email
    });
  }));

  io.on('connection', function(socket) {
    socket.emit('success', socket.request.user);
  });

  io.listen(9000);
}

exports.stop = function() {
  io.close();
}
