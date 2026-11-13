const { test, expect } = require('../../fixtures');

test.describe('Products API', () => {
  test('GET /products returns first page @smoke', async ({ api }) => {
    const res = await api.getProducts();

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({
      current_page: 1,
      per_page: expect.any(Number),
      last_page: expect.any(Number),
      total: expect.any(Number),
    });
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data.length).toBeLessThanOrEqual(body.per_page);

    for (const product of body.data) {
      expect(product).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          price: expect.any(Number),
          in_stock: expect.any(Boolean),
          category: expect.objectContaining({ name: expect.any(String) }),
          brand: expect.objectContaining({ name: expect.any(String) }),
        }),
      );
      expect(product.price).toBeGreaterThan(0);
    }
  });

  test('pages do not overlap', async ({ api }) => {
    const first = (await (await api.getProducts({ page: 1 })).json()).data.map((p) => p.id);
    const second = (await (await api.getProducts({ page: 2 })).json()).data.map((p) => p.id);

    expect(second.length).toBeGreaterThan(0);
    expect(first.filter((id) => second.includes(id))).toEqual([]);
  });

  test('page after the last one is empty', async ({ api }) => {
    const { last_page } = await (await api.getProducts()).json();
    const res = await api.getProducts({ page: last_page + 1 });

    expect(res.status()).toBe(200);
    expect((await res.json()).data).toEqual([]);
  });

  test('GET /products/{id}', async ({ api }) => {
    const [expected] = (await (await api.getProducts()).json()).data;

    const res = await api.getProduct(expected.id);

    expect(res.status()).toBe(200);
    expect(await res.json()).toMatchObject({ id: expected.id, name: expected.name, price: expected.price });
  });

  test('unknown product returns 404', async ({ api }) => {
    expect((await api.getProduct('does-not-exist')).status()).toBe(404);
  });

  for (const term of ['pliers', 'hammer', 'PLIERS']) {
    test(`search "${term}"`, async ({ api }) => {
      const { data } = await (await api.search(term)).json();

      expect(data.length).toBeGreaterThan(0);
      for (const { name } of data) {
        expect(name.toLowerCase()).toContain(term.toLowerCase());
      }
    });
  }

  test('sort by price asc', async ({ api }) => {
    const { data } = await (await api.getProducts({ sort: 'price,asc' })).json();
    const prices = data.map((p) => p.price);

    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('categories tree has main categories', async ({ api }) => {
    const res = await api.getCategories();

    expect(res.status()).toBe(200);
    const names = (await res.json()).map((c) => c.name);
    expect(names).toEqual(expect.arrayContaining(['Hand Tools', 'Power Tools']));
  });
});
