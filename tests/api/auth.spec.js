const { test, expect } = require('../../fixtures');
const { toolshopUser } = require('../../config/env');

test.describe('Auth API', () => {
  test('login returns bearer token @smoke', async ({ api }) => {
    const res = await api.login(toolshopUser.email, toolshopUser.password);

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.access_token.length).toBeGreaterThan(20);
    expect(body.token_type.toLowerCase()).toBe('bearer');
    expect(body.expires_in).toBeGreaterThan(0);
  });

  test('login with unknown email returns 401', async ({ api }) => {
    const res = await api.login(`nobody_${Date.now()}@example.com`, 'welcome01');

    expect(res.status()).toBe(401);
    expect(await res.json()).toEqual({ error: 'Unauthorized' });
  });

  test('GET /users/me returns current user', async ({ api }) => {
    const token = await api.customerToken();

    const res = await api.me(token);

    expect(res.status()).toBe(200);
    const user = await res.json();
    expect(user.email).toBe(toolshopUser.email);
    expect(`${user.first_name} ${user.last_name}`).toBe(toolshopUser.fullName);
    expect(user).not.toHaveProperty('password');
  });

  for (const token of ['', 'abc', 'fake.jwt.token']) {
    test(`GET /users/me with invalid token "${token}" returns 401`, async ({ api }) => {
      expect((await api.me(token)).status()).toBe(401);
    });
  }
});
