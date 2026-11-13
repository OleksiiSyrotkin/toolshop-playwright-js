const { parsePrice } = require('../utils/price');

class CatalogPage {
  constructor(page) {
    this.page = page;
    this.cards = page.locator('a.card');
    this.names = page.getByTestId('product-name');
    this.prices = page.getByTestId('product-price');
    this.searchInput = page.getByTestId('search-query');
    this.searchSubmit = page.getByTestId('search-submit');
    this.sort = page.getByTestId('sort');
  }

  async open() {
    await this.page.goto('/');
    await this.cards.first().waitFor();
  }

  async search(term) {
    await this.searchInput.fill(term);
    await this.searchSubmit.click();
  }

  async sortBy(value) {
    await this.sort.selectOption(value);
  }

  async productNames() {
    return this.names.allInnerTexts();
  }

  async productPrices() {
    return (await this.prices.allInnerTexts()).map(parsePrice);
  }

  async openProduct(name) {
    await this.cards.filter({ has: this.page.getByTestId('product-name').getByText(name, { exact: true }) }).click();
  }
}

module.exports = { CatalogPage };
