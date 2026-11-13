class AccountPage {
  constructor(page) {
    this.page = page;
    this.title = page.getByTestId('page-title');
    this.userMenu = page.getByTestId('nav-menu');
    this.signOut = page.getByTestId('nav-sign-out');
    this.signIn = page.getByTestId('nav-sign-in');
  }

  async open() {
    await this.page.goto('/account');
  }

  async logout() {
    await this.userMenu.click();
    await this.signOut.click();
  }
}

module.exports = { AccountPage };
