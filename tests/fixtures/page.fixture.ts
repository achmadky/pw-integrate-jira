import { test as base } from '@playwright/test';
import { CatalogPage } from '../pages/catalog.page';
import { SearchPage } from '../pages/search.page';

type QAStoryFixtures = {
  catalogPage: CatalogPage;
  searchPage: SearchPage;
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
});

export { expect } from '@playwright/test';
