const { test, expect } = require('../../fixtures');
const { toolshopUser, authFile } = require('../../config/env');

test.use({ storageState: authFile });

test.describe('Account (logged in via storageState)', () => {
  test('account page opens without login form @smoke', async ({ page, accountPage }) => {
    await accountPage.open();

    await expect(page).toHaveURL(/\/account$/);
    await expect(accountPage.title).toHaveText('My account');
    await expect(accountPage.userMenu).toHaveText(toolshopUser.fullName);
  });

  test('header shows user menu instead of sign in link', async ({ page, accountPage }) => {
    await page.goto('/');

    await expect(accountPage.userMenu).toBeVisible();
    await expect(accountPage.signIn).toBeHidden();
  });
});
