
import request from 'supertest';

describe('Registrierung API Integration', () => {
  const baseUrl = 'http://localhost:3000';

  it('sollte einen neuen Nutzer erfolgreich registrieren', async () => {
    const body = {
      name: 'Testuser',
      email: 'test@example.com',
      desc: 'Testbeschreibung',
      password: 'testpass',
      avatar: null,
    };
    const res = await request(baseUrl)
      .post('/api/users')
      .send(body)
      .set('Accept', 'application/json');
    console.log(res.body); // Debug-Ausgabe
    expect(res.body.success).toBe(true);
    expect(res.body.user.name).toBe('Testuser');
    expect(res.body.user.email).toBe('test@example.com');
    expect(res.body.user.password).toBeUndefined();
  });

  it('sollte Fehler zurückgeben, wenn MONGODB_URI fehlt', async () => {
    const originalEnv = process.env.MONGODB_URI;
    process.env.MONGODB_URI = '';
    const body = {
      name: 'Testuser',
      email: 'test@example.com',
      desc: 'Testbeschreibung',
      password: 'testpass',
      avatar: null,
    };
    const res = await request(baseUrl)
      .post('/api/users')
      .send(body)
      .set('Accept', 'application/json');
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/MONGODB_URI/);
    process.env.MONGODB_URI = originalEnv;
  });
});
