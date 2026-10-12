import { test, expect } from '../fixtures/page.fixture';
import { TEST_DATA } from '../utils/test-data';

test.describe('KAN-15: Add In-Stock Item to Cart and Verify Item Details Displayed in Cart End-to-End Tests', () => {

  test('KAN-TC-48: Verify adding in-stock Grey Jacket from catalog displays accurate line item details and subtotal in cart', { tag: '@KAN-TC-48' }, async ({ catalogPage, cartPage }, testInfo) => {
    await test.step('Step 1: Open catalog collections page', async () => {
      await catalogPage.openStorefront(TEST_DATA.catalogUrl);
      await catalogPage.verifyTitle(/Products/i);
    });

    await test.step('Step 2: Select Grey jacket product and verify page details', async () => {
      await catalogPage.selectGreyJacket();
      await catalogPage.verifyProductPage(TEST_DATA.productPrice);
    });

    await test.step('Step 3: Add Grey jacket to cart and verify cart counter increments', async () => {
      await catalogPage.addToCart();
      await catalogPage.verifyCartCounter(1);
    });

    await test.step('Step 4: Navigate to /cart and verify product title, unit price, quantity, and line total', async () => {
      await cartPage.openCart();
      await cartPage.verifyProductInCart(TEST_DATA.productName);
      await cartPage.verifyLineItemDetails(TEST_DATA.productName, TEST_DATA.productPrice, '1', TEST_DATA.productPrice);
    });

    await test.step('Step 5: Capture proof screenshot', async () => {
      await cartPage.captureProof(testInfo, 'KAN-TC-48-proof.png');
    });
  });

  test('KAN-TC-49: Verify Check Out button on cart page is active and initiates checkout with order summary', { tag: '@KAN-TC-49' }, async ({ catalogPage, cartPage }, testInfo) => {
    await test.step('Step 1: Navigate to Grey jacket page and add to cart', async () => {
      await catalogPage.openStorefront(TEST_DATA.productUrl);
      await catalogPage.addToCart();
      await catalogPage.verifyCartCounter(1);
    });

    await test.step('Step 2: Open cart page and verify Check Out button is visible', async () => {
      await cartPage.openCart();
      await expect(cartPage.checkoutButton).toBeVisible();
    });

    await test.step('Step 3: Click Check Out and verify Shopify checkout initiation with order summary', async () => {
      await cartPage.proceedToCheckout();
      await cartPage.verifyCheckoutPageDetails();
    });

    await test.step('Step 4: Capture proof screenshot', async () => {
      await cartPage.captureProof(testInfo, 'KAN-TC-49-proof.png');
    });
  });

  test('KAN-TC-50: Verify updating in-stock item quantity in cart recalculates subtotal accurately', { tag: '@KAN-TC-50' }, async ({ catalogPage, cartPage }, testInfo) => {
    await test.step('Step 1: Navigate to Grey jacket product page and add to cart', async () => {
      await catalogPage.openStorefront(TEST_DATA.productUrl);
      await catalogPage.addToCart();
      await catalogPage.verifyCartCounter(1);
    });

    await test.step('Step 2: Open cart page and verify initial item state', async () => {
      await cartPage.openCart();
      await cartPage.verifyLineItemDetails(TEST_DATA.productName, TEST_DATA.productPrice, '1', TEST_DATA.productPrice);
    });

    await test.step('Step 3: Update quantity to 3 and submit update', async () => {
      await cartPage.updateQuantity('3');
    });

    await test.step('Step 4: Verify subtotal recalculates accurately to £165.00', async () => {
      await cartPage.verifySubtotal('£165.00');
    });

    await test.step('Step 5: Capture proof screenshot', async () => {
      await cartPage.captureProof(testInfo, 'KAN-TC-50-proof.png');
    });
  });

  test('KAN-TC-51: Verify cart counter and added item details persist across catalog navigation and page reload', { tag: '@KAN-TC-51' }, async ({ catalogPage, cartPage }, testInfo) => {
    await test.step('Step 1: Navigate to catalog and add Grey jacket to cart', async () => {
      await catalogPage.openStorefront(TEST_DATA.catalogUrl);
      await catalogPage.selectGreyJacket();
      await catalogPage.addToCart();
      await catalogPage.verifyCartCounter(1);
    });

    await test.step('Step 2: Navigate back to catalog and verify cart badge persists', async () => {
      await catalogPage.openStorefront(TEST_DATA.catalogUrl);
      await catalogPage.verifyCartCounter(1);
    });

    await test.step('Step 3: Reload catalog page and verify cart badge remains 1', async () => {
      await catalogPage.page.reload({ waitUntil: 'domcontentloaded' });
      await catalogPage.verifyCartCounter(1);
    });

    await test.step('Step 4: Navigate to /cart and verify Grey jacket remains retained', async () => {
      await cartPage.openCart();
      await cartPage.verifyProductInCart(TEST_DATA.productName);
      await cartPage.verifyCartCounter(1);
    });

    await test.step('Step 5: Capture proof screenshot', async () => {
      await cartPage.captureProof(testInfo, 'KAN-TC-51-proof.png');
    });
  });

});
