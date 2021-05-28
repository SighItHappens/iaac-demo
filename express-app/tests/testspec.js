var request = require('supertest');

describe('loading express', function () {
  var server;
  beforeEach(function () {
    server = require('../app');
  });

  it('GET /', function testSlash(done) {
    request(server)
        .get('/')
        .expect(200, done);
  });
  it('GET 404', function test404(done) {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });
});