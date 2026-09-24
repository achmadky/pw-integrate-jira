import { test, expect } from '../fixtures/page.fixture';
import { TEST_DATA } from '../utils/test-data';
import path from 'path';

test.describe('KAN-9: Search Feature End-to-End Tests', () => {

  test('KAN-TC-26: Search for Grey and verify Grey jacket appears in results', { tag: '@KAN-TC-26' }, async ({ searchPage, catalogPage }, testInfo) => {
    await test.step('Step 1: Open storefront and verify title', async () => {
      await catalogPage.openStorefront(TEST_DATA.storeUrl);
      await catalogPage.verifyTitle(/Sauce Demo/i);
    });

    await test.step('Step 2: Enter "Grey" in search field and submit', async () => {
      await searchPage.performSearch('Grey');
      await expect(searchPage.page).toHaveURL(/search\?.*q=Grey/i);
    });

    await test.step('Step 3: Verify Grey jacket product is visible in results', async () => {
      await searchPage.verifyProductInResults('Grey jacket');
    });

    await test.step('Step 4: Save proof screenshot', async () => {
      const screenshotPath = path.resolve('test-results', 'KAN-TC-26-proof.png');
      await searchPage.page.screenshot({ path: screenshotPath, fullPage: true });
      await testInfo.attach('KAN-TC-26-proof.png', { path: screenshotPath, contentType: 'image/png' });
    });
  });

  test('KAN-TC-27: Search with non-existent query and verify zero results handled gracefully', { tag: '@KAN-TC-27' }, async ({ searchPage, catalogPage }, testInfo) => {
    await test.step('Step 1: Open storefront', async () => {
      await catalogPage.openStorefront(TEST_DATA.storeUrl);
    });

    await test.step('Step 2: Enter non-existent query and submit', async () => {
      await searchPage.performSearch('nonexistentproductxyz123');
      await expect(searchPage.page).toHaveURL(/search\?.*q=nonexistentproductxyz123/i);
    });

    await test.step('Step 3: Verify 0 results message is displayed gracefully', async () => {
      await searchPage.verifyEmptyResults();
    });

    await test.step('Step 4: Save proof screenshot', async () => {
      const screenshotPath = path.resolve('test-results', 'KAN-TC-27-proof.png');
      await searchPage.page.screenshot({ path: screenshotPath, fullPage: true });
      await testInfo.attach('KAN-TC-27-proof.png', { path: screenshotPath, contentType: 'image/png' });
    });
  });

});
