const { test, expect } = require('../../fixtures');

const fakeProduct = {
  id: 'FAKE000000000000000000001',
  name: 'Mocked Golden Hammer',
  description: 'not a real product',
  price: 999.99,
  is_location_offer: false,
  is_rental: false,
  co2_rating: 'A',
  in_stock: true,
  is_eco_friendly: false,
  product_image: { file_name: 'hammer01.avif', title: 'Hammer' },
  category: { id: '1', name: 'Hammer', slug: 'hammer' },
  brand: { id: '1', name: 'ForgeFlex Tools' },
};

const PRODUCTS_API = /api\.practicesoftwaretesting\.com\/products(\?|$)/;

const pageOf = (data) => ({
  current_page: 1,
  data,
  from: 1,
  last_page: 1,
  per_page: 9,
  to: data.length,
  total: data.length,
});

test.describe('Catalog with mocked API', () => {
  test('renders products returned by API', async ({ page, catalogPage }) => {
    await page.route(PRODUCTS_API, (route) => route.fulfill({ json: pageOf([fakeProduct]) }));

    await page.goto('/');

    await expect(catalogPage.cards).toHaveCount(1);
    await expect(catalogPage.names).toHaveText(fakeProduct.name);
    await expect(catalogPage.prices).toContainText('999.99');
  });

  test('shows out of stock label', async ({ page }) => {
    await page.route(PRODUCTS_API, (route) =>
      route.fulfill({ json: pageOf([{ ...fakeProduct, in_stock: false }]) }),
    );

    await page.goto('/');

    await expect(page.getByTestId('out-of-stock')).toBeVisible();
  });

  test('page does not crash when API is down', async ({ page, catalogPage }) => {
    await page.route(PRODUCTS_API, (route) => route.fulfill({ status: 500, json: { message: 'Server Error' } }));

    await page.goto('/');

    await expect(page.getByTestId('nav-home')).toBeVisible();
    await expect(catalogPage.cards).toHaveCount(0);
  });
});
