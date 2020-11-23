const chai = require('chai'),
  chaiHttp = require('chai-http'),
  chaiFuzzy = require('chai-fuzzy');
const expect = chai.expect;
const request = require('supertest');
const auth = request('http://localhost:5000/api/auth');

chai.use(chaiHttp);
chai.use(chaiFuzzy);

describe('testing functionality of auth ', () => {
  /*
  TODO: Need to write a script to either clear a testing database or
  remove the mock auth in the main database implementation
  
  Database and application also need to be running before being successful,
  probably need a better solution...
  */
  it('success, login a successful user', async () => {
    let response = await auth
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
    expect(response).to.have.status(200);
    expect(body).to.contain.property('token');
  });

  it('failure, non registered account tries to login', async () => {
    let response = await auth
      .post('/')
      .set('Accept', 'application/json')
      .send({
        email: 'fakeTestAccount@fakeEmail.com',
        password: 'Password'
      })
      .then(response => {
        return response;
      });
    const body = response.body;
    expect(response).to.have.status(400);
    expect(body).to.eql({ msg: 'Invalid Credintals' });
  });

  it('bad request, user attempted to login without a password', async () => {
    const mockErrors = {
      errors: [
        {
          msg: 'Password is required',
          param: 'password',
          location: 'body'
        }
      ]
    };
    let response = await auth
      .post('/')
      .set('Accept', 'application/json')
      .send({
        email: 'fakeperson@email.com'
      });
    const body = response.body;
    expect(body).to.eql(mockErrors);
  });

  describe('Testing GET functionality of auth', async () => {
    let token = null;
    before(async () => {
      let res = await auth
        .post('/')
        .set('Accept', 'application/json')
        .send({
          email: 'fakeTestUser@gmail.com',
          password: 'Password'
        });
      token = res.body.token;
    });

    it('bad request to auth/, user does not have an auth Token in the headers', async () => {
      let response = await auth
        .get('/')
        .set('Accept', 'application/json')
        .send({
          email: 'fakeperson@email.com',
          password: 'password'
        });
      const body = response.body;
      expect(body).to.eql({ msg: 'No Token, auth denied' });
    });

    it('successful  auth/, user can view their user object', async () => {
      let response = await auth
        .get('/')
        .set({
          'x-auth-token': token
        })
        .send({
          email: 'fakeTestUser@gmail.com',
          password: 'Password'
        });
      const body = response.body;
      expect(body).to.have.own.property('date');
      expect(body).to.have.own.property('_id');
      expect(body).to.have.own.property('email');
      expect(response).to.have.status(200);
    });
  });
});
