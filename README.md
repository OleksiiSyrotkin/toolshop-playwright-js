# toolshop-playwright-js

[![playwright](https://github.com/OleksiiSyrotkin/toolshop-playwright-js/actions/workflows/playwright.yml/badge.svg)](https://github.com/OleksiiSyrotkin/toolshop-playwright-js/actions/workflows/playwright.yml)

UI and API tests for [Practice Software Testing (Toolshop)](https://practicesoftwaretesting.com) with Playwright Test (JavaScript).

HTML report from the latest run on `main`: https://oleksiisyrotkin.github.io/toolshop-playwright-js/

## What is tested

| Area | Checks |
|---|---|
| Auth | login once in setup project, other tests reuse the session with `storageState` |
| Login form | unknown user, required fields, login + sign out, checking the request body sent to API |
| Catalog | search results compared with API, no results message, sorting by price, product page data vs API |
| Cart | add with quantity, toast, badge, line prices and total |
| Network mocking | catalog with a fake product from `page.route`, out of stock label, API returns 500 |
| API | products, pagination, product by id, 404, search, sorting, categories, login, `/users/me`, invalid tokens |

## Stack

- Node.js 20+
- Playwright Test (UI + `APIRequestContext` for API)
- ESLint with `eslint-plugin-playwright`
- GitHub Actions + GitHub Pages for the report

## Project structure

```
api/ToolshopApi.js        API client on top of Playwright request
config/env.js             urls and test user (overridable with .env)
fixtures/index.js         page objects and api client as fixtures
pages/                    LoginPage, AccountPage, CatalogPage, ProductPage, CartPage
tests/
  ui/                     UI tests (auth.setup.js runs first)
  api/                    API tests
utils/price.js            price parsing and rounding
playwright.config.js      projects: setup, ui, api
```

## Approach

- **Page Object Model + fixtures.** Page objects and the API client are created in custom fixtures (`test.extend`), tests just ask for `catalogPage`, `api` etc.
- **Locators.** Toolshop uses `data-test` attributes, so `testIdAttribute` is set to `data-test` and tests use `getByTestId()`.
- **No hard waits.** Only web-first assertions. Where a list re-renders after search or sorting, the check is wrapped in `expect(...).toPass()`.
- **Login once.** The `setup` project logs in through UI and saves the session to `.auth/`. The `ui` project depends on it, and tests that need a logged in user use `test.use({ storageState })`. The sign out test does its own login, because sign out invalidates the token and would break other tests that share the saved session.
- **UI + API.** Expected values in UI tests (product id, price, search results) come from the API, not hardcoded. Demo data can change and tests still work.
- **Network mocking.** `page.route()` replaces the products response to check how the UI renders data that is hard to get on a real backend (out of stock product, server error).
- **Request checks.** One login test catches the request with `waitForRequest` and checks its JSON body.
- **Test data.** Negative login tests use a random email, so the shared demo account doesn't get locked.
- **On failure** Playwright saves screenshot, video and trace into the HTML report.

## How to run

```bash
git clone https://github.com/OleksiiSyrotkin/toolshop-playwright-js.git
cd toolshop-playwright-js
npm ci
npx playwright install chromium
```

```bash
npm test                # setup + ui + api
npm run test:ui         # UI only (setup runs automatically)
npm run test:api        # API only, no browser
npm run test:smoke      # tests tagged @smoke
npm run test:headed
npm run test:ui-mode
npm run report
npm run lint

npx playwright test tests/ui/cart.spec.js
```

## Configuration

Defaults are in `config/env.js`. To override, copy `.env.example` to `.env`:

```
TOOLSHOP_URL=https://practicesoftwaretesting.com
TOOLSHOP_API_URL=https://api.practicesoftwaretesting.com
TOOLSHOP_EMAIL=customer@practicesoftwaretesting.com
TOOLSHOP_PASSWORD=welcome01
```

These are public demo credentials from the Toolshop site.

## CI

`.github/workflows/playwright.yml`:

1. installs dependencies, runs ESLint
2. installs Chromium, runs all projects (4 workers, 1 retry)
3. uploads HTML report as an artifact and publishes it to GitHub Pages (only from `main`)

Runs on push to `main`, on pull requests, manually and every Monday.
