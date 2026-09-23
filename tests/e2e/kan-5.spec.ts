import { test, expect } from '../fixtures/page.fixture';
import { TEST_DATA } from '../utils/test-data';
import path from 'path';

test.describe('KAN-5: Add Cart and Payment End-to-End Tests', () => {

  test('KAN-TC-18: Visit Sauce Demo store & navigate to Grey Jacket', { tag: '@KAN-TC-18' }, async ({ catalogPage }, testInfo) => {
    await test.step('Step 1: Open store & verify page title', async () => {
      await catalogPage.openStorefront(TEST_DATA.storeUrl);
      await catalogPage.verifyTitle(/Sauce Demo/i);
    });

    await test.step('Step 2: Select Grey Jacket product link', async () => {
      await catalogPage.selectGreyJacket();
    });

    await test.step('Step 3: Verify product detail page loads with correct title and price', async () => {
      await catalogPage.verifyProductPage(TEST_DATA.productPrice);
    });

    await test.step('Step 4: Save proof screenshot', async () => {
      const screenshotPath = path.resolve('test-results', 'KAN-TC-18-proof.png');
      await catalogPage.page.screenshot({ path: screenshotPath, fullPage: true });
      await testInfo.attach('KAN-TC-18-proof.png', { path: screenshotPath, contentType: 'image/png' });
    });
  });

  test('KAN-TC-19: Add Grey Jacket into cart and proceed to checkout', { tag: '@KAN-TC-19' }, async ({ catalogPage }, testInfo) => {
    await test.step('Step 1: Navigate to product detail page directly', async () => {
      await catalogPage.openStorefront(TEST_DATA.productUrl);
      await catalogPage.verifyProductPage(TEST_DATA.productPrice);
    });

    await test.step('Step 2: Add product to cart and proceed to checkout', async () => {
      await catalogPage.addJacketToCartAndCheckout();
    });

    await test.step('Step 3: Save proof screenshot', async () => {
      const screenshotPath = path.resolve('test-results', 'KAN-TC-19-proof.png');
      await catalogPage.page.screenshot({ path: screenshotPath, fullPage: true });
      await testInfo.attach('KAN-TC-19-proof.png', { path: screenshotPath, contentType: 'image/png' });
    });
  });

});
