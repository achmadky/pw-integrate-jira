import { test as base } from '@playwright/test';
import { CatalogPage } from '../pages/catalog.page';

type QAStoryFixtures = {
  catalogPage: CatalogPage;
};

export const test = base.extend<QAStoryFixtures>({
  catalogPage: async ({ page }, use) => {
    const catalogPage = new CatalogPage(page);
    await use(catalogPage);
  },
});

export { expect } from '@playwright/test';
