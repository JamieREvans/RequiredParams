require('rootpath')();

var request = require('supertest')(require('test/test-app.js'));
var expect = require('chai').expect;

describe('Required Params', function() {
  describe('GET /endpoint', function() {
    describe('without the required parameters', function() {
      it('should return 422 with the missing parameters, skipping default parameters', function(done) {
        request
          .get('/endpoint')
          .expect(function(response) {
            expect(response.body.missing_params).to.contain('q');
          })
          .expect(422, done);
      });
    });
    describe('with the required parameters', function() {
      it('should return 200', function(done) {
        request
          .get('/endpoint')
          .query({ q: '', limit: 5, offset: 0 })
          .expect(function(response) {
            expect(response.body).to.equal('hello world - 0 - 5');
          })
          .expect(200, done);
      });
    });
    describe('with the only a query', function() {
      it('should return 200 and a 30 limit and 0 offset', function(done) {
        request
          .get('/endpoint')
          .query({ q: '' })
          .expect(function(response) {
            expect(response.body).to.equal('hello world - 0 - 30');
          })
          .expect(200, done);
      });
    });
  });
  describe('POST /endpoint', function() {
    describe('without the required parameters', function() {
      it('should return 422 with the missing parameters', function(done) {
        request
          .post('/endpoint')
          .send({})
          .expect(function(response) {
            expect(response.body.missing_params).to.contain('username', 'email');
          })
          .expect(422, done);
      });
    });
    describe('with the required parameters', function() {
      it('should return 201', function(done) {
        request
          .post('/endpoint')
          .send({ email: '', username: '' })
          .expect(function(response) {
            expect(response.body).to.equal('created');
          })
          .expect(201, done);
      });
    });
  });
  describe('POST /endpoint/nested', function() {
    describe('without the required parameters', function() {
      it('should return 422 with the missing parameters', function(done) {
        request
          .post('/endpoint/nested')
          .send({})
          .expect(function(response) {
            expect(response.body.missing_params).to.contain('user.first_name', 'user.email');
          })
          .expect(422, done);
      });
    });
    describe('with the required parameters', function() {
      it('should return 201', function(done) {
        request
          .post('/endpoint/nested')
          .send( { user: { email: 'hello', first_name: 'hi' } })
          .expect('"hola"')
          .expect(201, done);
      });
    });
  });
});
