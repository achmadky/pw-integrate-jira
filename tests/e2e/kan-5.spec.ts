import { test, expect } from '../fixtures/page.fixture';
import { TEST_DATA } from '../utils/test-data';

test.describe('KAN-5: Add Cart and Payment End-to-End Tests', () => {

  test('KAN-TC-12: Visit Sauce Demo store & navigate to Grey Jacket', { tag: '@KAN-TC-12' }, async ({ catalogPage }) => {
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
  });

  test('KAN-TC-13: Add Grey Jacket into cart and proceed to checkout', { tag: '@KAN-TC-13' }, async ({ catalogPage }) => {
    await test.step('Step 1: Navigate to product detail page directly', async () => {
      await catalogPage.openStorefront(TEST_DATA.productUrl);
      await catalogPage.verifyProductPage(TEST_DATA.productPrice);
    });

    await test.step('Step 2: Add product to cart and proceed to checkout', async () => {
      await catalogPage.addJacketToCartAndCheckout();
    });
  });

});
