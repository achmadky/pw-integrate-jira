import { test, expect } from '../fixtures/page.fixture';
import { TEST_DATA } from '../utils/test-data';

test.describe('KAN-5: Add Cart and Payment End-to-End Tests', () => {

  test('KAN-TC-44: Verify add Grey Jacket to cart and checkout payment details', { tag: '@KAN-TC-44' }, async ({ catalogPage, cartPage }, testInfo) => {
    await test.step('Step 1: Navigate to store home page and verify title', async () => {
      await catalogPage.openStorefront(TEST_DATA.storeUrl);
      await catalogPage.verifyTitle(/Sauce Demo/i);
    });

    await test.step('Step 2: Select Grey jacket and verify product page', async () => {
      await catalogPage.selectGreyJacket();
      await catalogPage.verifyProductPage(TEST_DATA.productPrice);
    });

    await test.step('Step 3: Add Grey jacket to cart and verify cart counter increments', async () => {
      await catalogPage.addToCart();
      await catalogPage.verifyCartCounter(1);
    });

    await test.step('Step 4: Navigate to My Cart and verify line item details', async () => {
      await cartPage.openCart();
      await cartPage.verifyProductInCart(TEST_DATA.productName);
      await cartPage.verifyLineItemDetails(TEST_DATA.productName, TEST_DATA.productPrice, '1', TEST_DATA.productPrice);
    });

    await test.step('Step 5: Proceed to Checkout and verify payment and order details', async () => {
      await cartPage.proceedToCheckout();
      await cartPage.verifyCheckoutPageDetails();
    });

    await test.step('Step 6: Capture proof screenshot', async () => {
      await cartPage.captureProof(testInfo, 'KAN-TC-44-proof.png');
    });
  });

  test('KAN-TC-45: Verify updating Grey Jacket quantity in cart recalculates line total and subtotal', { tag: '@KAN-TC-45' }, async ({ catalogPage, cartPage }, testInfo) => {
    await test.step('Step 1: Open Grey jacket product page and add to cart', async () => {
      await catalogPage.openStorefront(TEST_DATA.productUrl);
      await catalogPage.addToCart();
      await catalogPage.verifyCartCounter(1);
    });

    await test.step('Step 2: Open cart page and verify initial quantity and price', async () => {
      await cartPage.openCart();
      await cartPage.verifyLineItemDetails(TEST_DATA.productName, TEST_DATA.productPrice, '1', TEST_DATA.productPrice);
    });

    await test.step('Step 3: Update quantity to 2 and submit update', async () => {
      await cartPage.updateQuantity('2');
    });

    await test.step('Step 4: Verify subtotal recalculates to £110.00', async () => {
      await cartPage.verifySubtotal('£110.00');
    });

    await test.step('Step 5: Capture proof screenshot', async () => {
      await cartPage.captureProof(testInfo, 'KAN-TC-45-proof.png');
    });
  });

  test('KAN-TC-46: Verify cart counter and item persistence across page navigation and refresh', { tag: '@KAN-TC-46' }, async ({ catalogPage, cartPage }, testInfo) => {
    await test.step('Step 1: Open product page and add Grey jacket to cart', async () => {
      await catalogPage.openStorefront(TEST_DATA.productUrl);
      await catalogPage.addToCart();
      await catalogPage.verifyCartCounter(1);
    });

    await test.step('Step 2: Reload page and verify cart counter persists', async () => {
      await catalogPage.page.reload({ waitUntil: 'domcontentloaded' });
      await catalogPage.verifyCartCounter(1);
    });

    await test.step('Step 3: Navigate to storefront home and verify cart badge persists', async () => {
      await catalogPage.openStorefront(TEST_DATA.storeUrl);
      await catalogPage.verifyCartCounter(1);
    });

    await test.step('Step 4: Navigate to /cart and verify Grey jacket is still retained', async () => {
      await cartPage.openCart();
      await cartPage.verifyProductInCart(TEST_DATA.productName);
      await cartPage.verifyCartCounter(1);
    });

    await test.step('Step 5: Capture proof screenshot', async () => {
      await cartPage.captureProof(testInfo, 'KAN-TC-46-proof.png');
    });
  });

  test('KAN-TC-47: Verify removing item from cart clears cart and updates counter to zero', { tag: '@KAN-TC-47' }, async ({ catalogPage, cartPage }, testInfo) => {
    await test.step('Step 1: Open product page and add Grey jacket to cart', async () => {
      await catalogPage.openStorefront(TEST_DATA.productUrl);
      await catalogPage.addToCart();
      await catalogPage.verifyCartCounter(1);
    });

    await test.step('Step 2: Open cart page and remove item', async () => {
      await cartPage.openCart();
      await cartPage.verifyProductInCart(TEST_DATA.productName);
      await cartPage.removeProduct();
    });

    await test.step('Step 3: Verify empty cart message and counter reset to zero', async () => {
      await cartPage.verifyCartIsEmpty();
      await cartPage.verifyCartCounter(0);
      await cartPage.verifyProductNotPresent(TEST_DATA.productName);
    });

    await test.step('Step 4: Capture proof screenshot', async () => {
      await cartPage.captureProof(testInfo, 'KAN-TC-47-proof.png');
    });
  });

});
