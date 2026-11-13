const { parsePrice } = require('../utils/price');

class CartPage {
  constructor(page) {
    this.page = page;
    this.titles = page.getByTestId('product-title');
    this.quantities = page.getByTestId('product-quantity');
    this.prices = page.getByTestId('product-price');
    this.linePrices = page.getByTestId('line-price');
    this.total = page.getByTestId('cart-total');
    this.proceed = page.getByTestId('proceed-1');
  }

  async open() {
    await this.page.goto('/checkout');
  }

  async rows() {
    await this.titles.first().waitFor();
    const titles = await this.titles.allInnerTexts();
    const rows = [];
    for (let i = 0; i < titles.length; i++) {
      rows.push({
        name: titles[i].trim(),
        qty: Number(await this.quantities.nth(i).inputValue()),
        price: parsePrice(await this.prices.nth(i).innerText()),
        line: parsePrice(await this.linePrices.nth(i).innerText()),
      });
    }
    return rows;
  }

  async totalValue() {
    return parsePrice(await this.total.innerText());
  }
}

module.exports = { CartPage };
