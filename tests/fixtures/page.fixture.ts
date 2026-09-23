import { test as base } from '@playwright/test';
import { CatalogPage } from '../pages/catalog.page';
import { SearchPage } from '../pages/search.page';
import { CartPage } from '../pages/cart.page';
import { LoginPage } from '../pages/login.page';

type QAStoryFixtures = {
  catalogPage: CatalogPage;
  searchPage: SearchPage;
  cartPage: CartPage;
  loginPage: LoginPage;
};

export const test = base.extend<QAStoryFixtures>({
  catalogPage: async ({ page }, use) => {
    const catalogPage = new CatalogPage(page);
    await use(catalogPage);
  },
  searchPage: async ({ page }, use) => {
    const searchPage = new SearchPage(page);
    await use(searchPage);
  },
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
});

export { expect } from '@playwright/test';
