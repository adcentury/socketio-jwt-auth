var server = require('./server/allowNoToken');
var io = require('socket.io-client');

var data = require('./testdata');

describe('authenticate without token if succeedWithoutToken is true', function() {

  var socket;

  // start and stop the server
  before(server.start);
  after(server.stop);

  afterEach(function() {
    socket.disconnect();
  });

  describe('when guest connects to server', function() {

      it('should succeed but the user should not be logged in', function(done) {
        socket = io('http://localhost:9000', {'force new connection': true});
        socket.on('success', function(user) {
          console.log('got user', user)
          expect(user).to.be.an('object');
          expect(user.logged_in).to.be.false;
          done();
        });
      });

  });

});
