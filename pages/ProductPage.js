const { parsePrice } = require('../utils/price');

class ProductPage {
  constructor(page) {
    this.page = page;
    this.name = page.getByTestId('product-name');
    this.price = page.getByTestId('unit-price');
    this.quantity = page.getByTestId('quantity');
    this.increase = page.getByTestId('increase-quantity');
    this.addToCartButton = page.getByTestId('add-to-cart');
    this.cartBadge = page.getByTestId('cart-quantity');
    this.toast = page.locator('#toast-container');
  }

  async open(id) {
    await this.page.goto(`/product/${id}`);
    await this.name.waitFor();
  }

  async unitPrice() {
    return parsePrice(await this.price.innerText());
  }

  async addToCart(qty = 1) {
    await this.quantity.fill(String(qty));
    await this.addToCartButton.click();
  }
}

module.exports = { ProductPage };
