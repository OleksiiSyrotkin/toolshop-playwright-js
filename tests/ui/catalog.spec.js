const { test, expect } = require('../../fixtures');

test.describe('Catalog', () => {
  test.beforeEach(async ({ catalogPage }) => {
    await catalogPage.open();
  });

  test('search shows the same products as API @smoke', async ({ api, catalogPage }) => {
    const { data } = await (await api.search('pliers')).json();
    const expected = data.map((p) => p.name).sort();

    await catalogPage.search('pliers');

    await expect(async () => {
      expect((await catalogPage.productNames()).sort()).toEqual(expected);
    }).toPass();
  });

  test('search with no results', async ({ page, catalogPage }) => {
    await catalogPage.search('qwertyzxcv');

    await expect(page.getByTestId('no-results')).toHaveText('There are no products found.');
    await expect(page.getByTestId('search-result-count')).toContainText("0 products found for 'qwertyzxcv'");
    await expect(catalogPage.cards).toHaveCount(0);
  });

  for (const [option, direction] of [['price,asc', 1], ['price,desc', -1]]) {
    test(`sort by ${option}`, async ({ catalogPage }) => {
      await catalogPage.sortBy(option);

      await expect(async () => {
        const prices = await catalogPage.productPrices();
        expect(prices).toEqual([...prices].sort((a, b) => (a - b) * direction));
      }).toPass();
    });
  }

  test('product page matches API data', async ({ page, api, catalogPage, productPage }) => {
    const product = await api.productByName('Combination Pliers');

    await catalogPage.openProduct(product.name);

    await expect(page).toHaveURL(new RegExp(`/product/${product.id}`));
    await expect(productPage.name).toHaveText(product.name);
    expect(await productPage.unitPrice()).toBe(product.price);
  });
});
