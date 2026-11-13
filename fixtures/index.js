const base = require('@playwright/test');
const { ToolshopApi } = require('../api/ToolshopApi');
const { LoginPage } = require('../pages/LoginPage');
const { AccountPage } = require('../pages/AccountPage');
const { CatalogPage } = require('../pages/CatalogPage');
const { ProductPage } = require('../pages/ProductPage');
const { CartPage } = require('../pages/CartPage');

const test = base.test.extend({
  api: async ({ request }, use) => {
    await use(new ToolshopApi(request));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  accountPage: async ({ page }, use) => {
    await use(new AccountPage(page));
  },
  catalogPage: async ({ page }, use) => {
    await use(new CatalogPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
});

module.exports = { test, expect: base.expect };
