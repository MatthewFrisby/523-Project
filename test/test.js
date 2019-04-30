
var assert = require('assert'),
 express = require('express'),
 app = express(),
 chai = require('chai'),
 request = require('supertest');

var expect = chai.expect;

var tLogin = {
  email: "immaspaceship@gmail.com",
  password: "1234567890"
};



/**
*Tests SuperUser registration
*/
describe('Router', function() {

  describe('Login', function () {
    it('login with testinfo, should return json with 200', function(done) {
      request(app)
      .post('api/login').send(tLogin).expect(200).end(function(err, res) {
        expect('Content-Type', /json/);
        if (err) return done(err);

        done();
      });
    });

  });

  it('Get all S3 keys', function (done) {
    request(app)
    .get('/api/admin/S3/keys')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });

  it('Get SAQ assignments for user currently logged in', function(done) {
    superuser: UserService;
    request(app)
    .get('/api/saqassignments' + superuser.getFromLocal());
  });


  describe('registration', function() {
    // COME BACK AND FIX
    describe('Super Registration (POST /api/register)', function(done) {
      // Should pass
      it('should return a json with status 200 and conf message', function(done) {
        this.timeout(10000);
        request(app)
          .post('/api/register')
          .send({email: 'snc@email',
                fname: 'secure',
                lname: 'dude',
                password: 'secure33',
                address: 'place',
                company: 'legit company',
                telephone: '1234567890',
                issuper: true,
                businessinfo: 'info'
              })
          .end(function(err, res) {
            console.log('hello');
            expect('Content-Type', /json/);
            expect(res.statusCode).to.equal(200);
            // if (err) return done(err);

            done();
          });
      });
      // Remove and check again expecting failure
    });

  });





});
