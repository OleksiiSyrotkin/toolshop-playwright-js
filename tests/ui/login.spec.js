const { test, expect } = require('../../fixtures');
const { toolshopUser } = require('../../config/env');

test.describe('Login form', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('unknown user gets an error', async ({ page, loginPage }) => {
    await loginPage.login(`nobody_${Date.now()}@example.com`, 'Wrong_pass1');

    await expect(loginPage.error).toContainText('Invalid email or password');
    await expect(page).toHaveURL(/auth\/login/);
  });

  test('empty form shows required errors', async ({ loginPage }) => {
    await loginPage.submit.click();

    await expect(loginPage.emailError).toContainText(/required/i);
    await expect(loginPage.passwordError).toContainText(/required/i);
  });

  test('user can log in and sign out', async ({ page, loginPage, accountPage }) => {
    await loginPage.login(toolshopUser.email, toolshopUser.password);
    await expect(accountPage.title).toHaveText('My account');

    await accountPage.logout();

    await expect(accountPage.signIn).toBeVisible();
    await page.goto('/account');
    await expect(page).toHaveURL(/auth\/login/);
  });

  test('login request is sent with entered credentials', async ({ page, loginPage }) => {
    const email = `nobody_${Date.now()}@example.com`;
    const requestPromise = page.waitForRequest((req) => req.url().endsWith('/users/login') && req.method() === 'POST');

    await loginPage.login(email, 'Some_pass1');

    const request = await requestPromise;
    expect(request.postDataJSON()).toMatchObject({ email, password: 'Some_pass1' });
  });
});
