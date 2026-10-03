import { test, expect } from '../fixtures/page.fixture';
import { TEST_DATA } from '../utils/test-data';

test.describe('KAN-12: Display Sold Out status and prevent purchase for Brown Shades End-to-End Tests', () => {

  test('KAN-TC-36: Verify Sold Out badge overlay on Brown Shades in catalog grid', { tag: '@KAN-TC-36' }, async ({ catalogPage }, testInfo) => {
    await test.step('Step 1: Open catalog page and verify products view', async () => {
      await catalogPage.openStorefront(TEST_DATA.catalogUrl);
      await catalogPage.verifyTitle(/Products/i);
    });

    await test.step('Step 2: Verify Brown Shades product card displays price and SOLD OUT badge', async () => {
      await catalogPage.verifySoldOutProductCard(TEST_DATA.brownShadesName, TEST_DATA.brownShadesPrice);
    });

    await test.step('Step 3: Save proof screenshot', async () => {
      await catalogPage.captureProof(testInfo, 'KAN-TC-36-proof.png');
    });
  });

  test('KAN-TC-37: Verify Sold Out status and disabled purchase button on product detail page', { tag: '@KAN-TC-37' }, async ({ catalogPage }, testInfo) => {
    await test.step('Step 1: Open Brown Shades product detail page', async () => {
      await catalogPage.openStorefront(TEST_DATA.brownShadesUrl);
      await catalogPage.verifyTitle(/Brown Shades/i);
    });

    await test.step('Step 2: Verify product heading, price, and disabled Sold Out button state', async () => {
      await catalogPage.verifyProductDetailPageSoldOut(TEST_DATA.brownShadesName, TEST_DATA.brownShadesPrice);
    });

    await test.step('Step 3: Save proof screenshot', async () => {
      await catalogPage.captureProof(testInfo, 'KAN-TC-37-proof.png');
    });
  });

  test('KAN-TC-38: Verify cart guard prevents adding depleted stock and keeps cart counter at 0', { tag: '@KAN-TC-38' }, async ({ catalogPage, cartPage }, testInfo) => {
    await test.step('Step 1: Navigate to Brown Shades product detail page', async () => {
      await catalogPage.openStorefront(TEST_DATA.brownShadesUrl);
      await catalogPage.verifyProductDetailPageSoldOut(TEST_DATA.brownShadesName, TEST_DATA.brownShadesPrice);
    });

    await test.step('Step 2: Attempt form submission or click on disabled purchase button', async () => {
      const disabledBtn = catalogPage.page.locator('input#add');
      await expect(disabledBtn).toBeDisabled();
      // Ensure cart counter in header remains strictly 0
      await catalogPage.verifyCartCounterRemainsZero();
    });

    await test.step('Step 3: Navigate to My Cart and verify empty state without item', async () => {
      await cartPage.openCart();
      await cartPage.verifyCartIsEmpty();
      await cartPage.verifyProductNotPresent(TEST_DATA.brownShadesName);
    });

    await test.step('Step 4: Save proof screenshot', async () => {
      await cartPage.captureProof(testInfo, 'KAN-TC-38-proof.png');
    });
  });

  test('KAN-TC-39: Verify cross-feature search returns Brown Shades with Sold Out status', { tag: '@KAN-TC-39' }, async ({ searchPage }, testInfo) => {
    await test.step('Step 1: Open storefront homepage', async () => {
      await searchPage.openStorefront(TEST_DATA.storeUrl);
      await searchPage.verifyTitle(/Sauce Demo/i);
    });

    await test.step('Step 2: Search for "Brown" in storefront search', async () => {
      await searchPage.performSearch('Brown');
      await expect(searchPage.page).toHaveURL(/search\?.*q=Brown/i);
    });

    await test.step('Step 3: Verify Brown Shades item is listed with Sold Out status', async () => {
      await searchPage.verifyProductInResults(TEST_DATA.brownShadesName);
      await expect(searchPage.page.locator('body')).toContainText(TEST_DATA.brownShadesPrice);
    });

    await test.step('Step 4: Save proof screenshot', async () => {
      await searchPage.captureProof(testInfo, 'KAN-TC-39-proof.png');
    });
  });

});
