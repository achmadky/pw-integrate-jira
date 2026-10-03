import { test, expect } from '../fixtures/page.fixture';
import { TEST_DATA } from '../utils/test-data';

test.describe('KAN-11: Login and add cart checkout End-to-End Tests', () => {

  test('KAN-TC-30: Sign in and search for Grey jacket then verify in search results', { tag: '@KAN-TC-30' }, async ({ loginPage, searchPage }, testInfo) => {
    await test.step('Step 1: Open Login page and authenticate', async () => {
      await loginPage.openLogin();
      await loginPage.login('qates@gmail.com', 'qates');
    });

    await test.step('Step 2: Search for "Grey"', async () => {
      await searchPage.performSearch('Grey');
      await expect(searchPage.page).toHaveURL(/search\?.*q=Grey/i);
    });

    await test.step('Step 3: Verify Grey jacket appears in search results', async () => {
      await searchPage.verifyProductInResults('Grey jacket');
    });

    await test.step('Step 4: Save proof screenshot', async () => {
      await searchPage.captureProof(testInfo, 'KAN-TC-30-proof.png');
    });
  });

  test('KAN-TC-31: Add Grey Jacket to cart and proceed to Checkout page with payment details', { tag: '@KAN-TC-31' }, async ({ catalogPage, cartPage }, testInfo) => {
    await test.step('Step 1: Navigate to Grey Jacket product page', async () => {
      await catalogPage.openStorefront(TEST_DATA.productUrl);
      await catalogPage.verifyProductPage(TEST_DATA.productPrice);
    });

    await test.step('Step 2: Add Grey Jacket to cart', async () => {
      await catalogPage.addToCart();
    });

    await test.step('Step 3: Navigate to My Cart page and verify item presence', async () => {
      await cartPage.openCart();
      await cartPage.verifyProductInCart('Grey jacket');
    });

    await test.step('Step 4: Click Check Out button and verify Checkout / Payment details', async () => {
      await cartPage.proceedToCheckout();
      await cartPage.verifyCheckoutPageDetails();
    });

    await test.step('Step 5: Save proof screenshot', async () => {
      await cartPage.captureProof(testInfo, 'KAN-TC-31-proof.png');
    });
  });

});
