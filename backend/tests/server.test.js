const request = require('supertest');
const app = require('../server');
const server = app.listen(); // temporary instance for cleanup

describe('API tests', () => {
  afterAll(() => {
    server.close(); // stop Express after tests
  });

  it('should return hello message', async () => {
    const res = await request(app).get('/api/message');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Hello from the backend! 🚀 oggy');
  });
});