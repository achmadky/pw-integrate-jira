import { test as base } from '@playwright/test';
import { CatalogPage } from '../pages/catalog.page';
import { SearchPage } from '../pages/search.page';
import { CartPage } from '../pages/cart.page';

type QAStoryFixtures = {
  catalogPage: CatalogPage;
  searchPage: SearchPage;
  cartPage: CartPage;
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
});

export { expect } from '@playwright/test';
