var socketIoJwtAuth = require('../lib');

describe('authenticate function init', function() {
  it('should throw if called without a secret arg', function() {
    expect(function() {
      socketIoJwtAuth.authenticate()
    }).to.throw(TypeError, 'SocketioJwtAuth requires a secret');
    expect(function() {
      socketIoJwtAuth.authenticate({blabla: 'blabla'})
    }).to.throw(TypeError, 'SocketioJwtAuth requires a secret');
    expect(function() {
      socketIoJwtAuth.authenticate({secret: null})
    }).to.throw(TypeError, 'SocketioJwtAuth requires a secret');
  });

  it('should throw if called without a verify callback', function() {
    expect(function() {
      socketIoJwtAuth.authenticate({secret: 'secret'})
    }).to.throw(TypeError, 'SocketioJwtAuth requires a verify callback');
  });
});


