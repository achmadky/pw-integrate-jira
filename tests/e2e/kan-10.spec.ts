import { test, expect } from '../fixtures/page.fixture';
import { TEST_DATA } from '../utils/test-data';
import path from 'path';

test.describe('KAN-10: Remove from my cart End-to-End Tests', () => {

  test('KAN-TC-22: Add Grey Jacket to cart and remove it successfully', { tag: '@KAN-TC-22' }, async ({ catalogPage, cartPage }, testInfo) => {
    await test.step('Step 1: Open Grey Jacket product page', async () => {
      await catalogPage.openStorefront(TEST_DATA.productUrl);
      await catalogPage.verifyProductPage(TEST_DATA.productPrice);
    });

    await test.step('Step 2: Add Grey Jacket to cart', async () => {
      await catalogPage.page.locator('input#add').click();
      await catalogPage.page.waitForLoadState('networkidle');
    });

    await test.step('Step 3: Navigate to My Cart page and verify item presence', async () => {
      await cartPage.openCart();
      await cartPage.verifyProductInCart('Grey jacket');
    });

    await test.step('Step 4: Remove Grey Jacket from cart', async () => {
      await cartPage.removeProduct();
    });

    await test.step('Step 5: Verify Grey Jacket is removed and cart is empty', async () => {
      await cartPage.verifyProductNotPresent('Grey jacket');
      await cartPage.verifyCartIsEmpty();
    });

    await test.step('Step 6: Save proof screenshot', async () => {
      const screenshotPath = path.resolve('test-results', 'KAN-TC-22-proof.png');
      await cartPage.page.screenshot({ path: screenshotPath, fullPage: true });
      await testInfo.attach('KAN-TC-22-proof.png', { path: screenshotPath, contentType: 'image/png' });
    });
  });

  test('KAN-TC-23: Verify empty cart state displays appropriate message', { tag: '@KAN-TC-23' }, async ({ cartPage }, testInfo) => {
    await test.step('Step 1: Open empty My Cart page', async () => {
      await cartPage.openCart();
    });

    await test.step('Step 2: Verify empty cart notice is displayed', async () => {
      await cartPage.verifyCartIsEmpty();
    });

    await test.step('Step 3: Save proof screenshot', async () => {
      const screenshotPath = path.resolve('test-results', 'KAN-TC-23-proof.png');
      await cartPage.page.screenshot({ path: screenshotPath, fullPage: true });
      await testInfo.attach('KAN-TC-23-proof.png', { path: screenshotPath, contentType: 'image/png' });
    });
  });

});
