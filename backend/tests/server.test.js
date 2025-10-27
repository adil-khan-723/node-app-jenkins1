const request = require('supertest');
const app = require('../server');

let server;

beforeAll(() => {
  server = app.listen(5001);
});

afterAll((done) => {
  server.close(done);
});

describe('API tests', () => {
  it('should return hello message', async () => {
    const res = await request(server).get('/api/message');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Hello from the backend! 🚀 oggy');
  });
});