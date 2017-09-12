var server = require('./server');
var io = require('socket.io-client');

var data = require('./testdata');

describe('authenticate', function() {

  var socket;

  // start and stop the server
  before(server.start);
  after(server.stop);

  afterEach(function() {
    socket.disconnect();
  });

  describe('when user connect to server', function() {
    it('should emit error when auth_token is missing', function(done) {
      socket = io('http://localhost:9000', {'force new connection': true});
      socket.on('error', function(err) {
        expect(err).to.equal('No auth token');
        done();
      })
    });

    it('should emit error when auth_token is syntactically invalid', function(done) {
      socket = io('http://localhost:9000', {query: 'auth_token=blabla', 'force new connection': true});
      socket.on('error', function(err) {
        expect(err).to.be.a('string');
        done();
      });
    });

    it('should emit error when auth_token has the wrong signature', function(done) {
      socket = io('http://localhost:9000', {query: 'auth_token=' + data.valid_jwt_with_another_secret.token, 'force new connection': true});
      socket.on('error', function(err) {
        expect(err).to.be.a('string');
        done();
      });
    });

    it('should add user info to socket.request when authenticated', function(done) {
      socket = io('http://localhost:9000', {query: 'auth_token=' + data.valid_jwt.token, 'force new connection': true});
      socket.on('success', function(user) {
        expect(user).to.be.an('object');
        expect(user.name).to.equal(data.user.name);
        expect(user.email).to.equal(data.user.email);
        expect(user.logged_in).to.be.true;
        done();
      });
    })
  });

});
