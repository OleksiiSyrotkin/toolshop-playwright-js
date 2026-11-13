const { test, expect } = require('../../fixtures');
const { round2 } = require('../../utils/price');

test.describe('Cart', () => {
  test('add product with quantity @smoke', async ({ api, productPage }) => {
    const product = await api.productByName('Combination Pliers');

    await productPage.open(product.id);
    await productPage.addToCart(3);

    await expect(productPage.toast).toHaveText('Product added to shopping cart.');
    await expect(productPage.cartBadge).toHaveText('3');
  });

  test('cart shows correct line prices and total', async ({ api, productPage, cartPage }) => {
    const pliers = await api.productByName('Combination Pliers');
    const hammer = await api.productByName('Claw Hammer');

    await productPage.open(pliers.id);
    await productPage.addToCart(2);
    await expect(productPage.cartBadge).toHaveText('2');

    await productPage.open(hammer.id);
    await productPage.addToCart(1);
    await expect(productPage.cartBadge).toHaveText('3');

    await cartPage.open();
    const rows = await cartPage.rows();

    expect(rows.map((r) => r.name).sort()).toEqual([hammer.name, pliers.name].sort());
    for (const row of rows) {
      expect(row.line).toBe(round2(row.price * row.qty));
    }
    expect(await cartPage.totalValue()).toBe(round2(pliers.price * 2 + hammer.price));
  });
});
