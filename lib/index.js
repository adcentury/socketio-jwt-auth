var xtend = require('xtend');
var jwt = require('jwt-simple');

var defaultOptions = {
  algorithm: 'HS256'
};

function authenticate(options, verify) {
  var _this = this;
  this.options = xtend(defaultOptions, options);
  if (!this.options.secret) {
    throw new TypeError('SocketioJwtAuth requires a secret');
  }

  this.verify = verify;
  if (!this.verify) {
    throw new TypeError('SocketioJwtAuth requires a verify callback');
  }

  this.success = function(next) {
    next();
  }

  this.fail = function(err, next) {
    next(new Error(err));
  }

  return function(socket, next) {
    var token = socket.handshake.query.auth_token;
    if (!token) {
      return _this.fail('No auth token', next);
    }
    try {
      var payload = jwt.decode(token, _this.options.secret, _this.options.algorithm);
      var verified = function(err, user, message) {
        if (err) {
          return _this.fail(err, next);
        } else if (!user) {
          return _this.fail(message, next);
        } else {
          user.logged_in = true;
          socket.request.user = user;
          return _this.success(next);
        }
      };
      _this.verify(payload, verified);
    } catch (ex) {
      _this.fail(ex, next);
    }
  }
}

exports.authenticate = authenticate;
