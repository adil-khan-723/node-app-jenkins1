const request = require('supertest');
const app = require('../server');

let server;

beforeAll(() => {
  server = app.listen(0); // use a random available port
});

afterAll((done) => {
  server.close(done);
});

describe('API tests', () => {
  it('should return hello message', async () => {
    const port = server.address().port;
    const res = await request(`http://localhost:${port}`).get('/api/message');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Hello from the backend! 🚀 oggy');
  });
});