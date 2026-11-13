const { urls, toolshopUser } = require('../config/env');

class ToolshopApi {
  constructor(request, baseUrl = urls.toolshopApi) {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  url(path) {
    return `${this.baseUrl}${path}`;
  }

  getProducts(params = {}) {
    return this.request.get(this.url('/products'), { params: { page: 1, ...params } });
  }

  getProduct(id) {
    return this.request.get(this.url(`/products/${id}`));
  }

  search(q) {
    return this.request.get(this.url('/products/search'), { params: { q } });
  }

  getCategories() {
    return this.request.get(this.url('/categories/tree'));
  }

  login(email, password) {
    return this.request.post(this.url('/users/login'), { data: { email, password } });
  }

  me(token) {
    return this.request.get(this.url('/users/me'), {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async customerToken() {
    const res = await this.login(toolshopUser.email, toolshopUser.password);
    if (!res.ok()) throw new Error(`login failed: ${res.status()}`);
    return (await res.json()).access_token;
  }

  async productByName(name) {
    const { data } = await (await this.search(name)).json();
    const product = data.find((p) => p.name === name);
    if (!product) throw new Error(`product "${name}" not found`);
    return product;
  }
}

module.exports = { ToolshopApi };
