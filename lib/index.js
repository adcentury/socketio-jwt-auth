var xtend = require('xtend');
var jwt = require('jwt-simple');

var defaultOptions = {
  algorithm: 'HS256',
  succeedWithoutToken: false
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
    var error;
    // Legacy support for users who handle the errors as strings
    // Should be removed on next release.
    if (typeof(err) === 'string') {
      error = new Error(err);
    } else {
      // Socket IO parser only parses object if there is a data field
      // This allows for better error handling by checking name/type
      error = err;
      error.data = { name: err.name, message: err.message };
    }
    next(error);
  }

  return function(socket, next) {
    var token = socket.handshake.headers['x-auth-token'] || socket.handshake.query.auth_token;
    var verified = function(err, user, message) {
      if (err) {
        return _this.fail(err, next);
      } else if (!user) {
        if (!_this.options.succeedWithoutToken) return _this.fail(message, next);
        socket.request.user = {logged_in: false};
        return _this.success(next)
      } else {
        user.logged_in = true;
        socket.request.user = user;
        return _this.success(next);
      }
    };
    try {
      var payload = {};
      if (!token) {
        if (!_this.options.succeedWithoutToken) {
          return _this.fail('No auth token', next);
        }
      } else {
        payload = jwt.decode(token, _this.options.secret, false, _this.options.algorithm);
      }
      _this.verify(payload, verified);
    } catch (ex) {
      _this.fail(ex, next);
    }
  }
}

exports.authenticate = authenticate;
