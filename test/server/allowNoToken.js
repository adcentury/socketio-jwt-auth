var io = require('socket.io')();
var socketIoJwtAuth = require('../../lib');

var data = require('../testdata');

exports.start = function() {
  io.use(socketIoJwtAuth.authenticate({
    secret: data.valid_jwt.secret,
    succeedWithoutToken: true
  }, function(_payload, done) {
    // ignore payload
    return done(null, null);
  }));

  io.on('connection', function(socket) {
    socket.emit('success', socket.request.user);
  });

  io.listen(9000);
}

exports.stop = function() {
  io.close();
}
