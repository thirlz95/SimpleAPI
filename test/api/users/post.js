const chai = require('chai'),
  chaiHttp = require('chai-http'),
  chaiFuzzy = require('chai-fuzzy');
const expect = chai.expect;
const request = require('supertest');
const users = request('http://localhost:5000/api/users');

chai.use(chaiHttp);
chai.use(chaiFuzzy);
const connectDB = require('../../../config/db');
const conn = connectDB();

describe('POST /users', () => {
  before(done => {
    conn.then(() => done()).catch(err => done(err));
  });

  it('OK, Create a new user', async () => {
    let response = await users
      .post('/')
      .set('Accept', 'application/json')
      .send({
        email: 'fakeTestUser@gmail.com',
        password: 'Password'
      })
      .then(response => {
        return response;
      });
    const body = response.body;
    console.log(response);
    expect(response).to.have.status(200);
    expect(body).to.contain.property('token');
  });

  it('OK, try and add a duplicate user', async () => {
    let response = await users
      .post('/')
      .set('Accept', 'application/json')
      .send({
        email: 'fakeTestUser@gmail.com',
        password: 'Password'
      })
      .then(response => {
        return response;
      });
    const body = response.body;
    expect(response).to.have.status(400);
    expect(body).to.eql({ msg: 'User Already Exists' });
  });

  it('bad request, invalid email address and password. should throw two errors', async () => {
    const mockErrors = {
      errors: [
        {
          value: 'fakeperson',
          msg: 'Please include a valid email',
          param: 'email',
          location: 'body'
        },
        {
          value: 'pass',
          msg: 'Please enter a password with 6 or more charcters',
          param: 'password',
          location: 'body'
        }
      ]
    };
    let response = await users
      .post('/')
      .set('Accept', 'application/json')
      .send({
        email: 'fakeperson',
        password: 'pass'
      });
    const body = response.body;
    expect(body).to.eql(mockErrors);
  });
});
