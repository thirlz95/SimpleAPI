const superTest = require('supertest');
const chai = require('chai');
const expect = chai.expect;

const randomDogUrl = 'https://random.dog';
const randomDog = superTest(randomDogUrl);

describe('Random Dog API', () => {
  it('Verify Response', async () => {
    let response = await randomDog.get('/woof.json').then(response => {
      return response;
    });
    expect(response.status, 'Status Successful').to.equal(200);
    expect(response.body.url, 'Url Contains').to.contains(
      'https://random.dog/'
    );
  });
});
