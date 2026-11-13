const { test, expect } = require('../../fixtures');
const { toolshopUser, authFile } = require('../../config/env');

test('log in as customer', async ({ page, loginPage, accountPage }) => {
  await loginPage.open();
  await loginPage.login(toolshopUser.email, toolshopUser.password);

  await expect(page).toHaveURL(/\/account/);
  await expect(accountPage.title).toHaveText('My account');

  await page.context().storageState({ path: authFile });
});
