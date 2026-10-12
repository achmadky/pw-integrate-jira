import { test, expect } from '../fixtures/page.fixture';
import { TEST_DATA } from '../utils/test-data';

test.describe('KAN-14: Search Sold Out Item and Prevent Addition to Checkout', () => {

  test('KAN-TC-53: Verify search query for sold out item displays Sold Out badge in results and disables purchase button on product page', { tag: '@KAN-TC-53' }, async ({ searchPage, catalogPage }, testInfo) => {
    await test.step('Step 1: Navigate to search results for Brown Shades', async () => {
      await searchPage.openStorefront(`${TEST_DATA.storeUrl}search?q=Brown+Shades`);
      await searchPage.verifySearchUrl('Brown Shades');
    });

    await test.step('Step 2: Verify search result displays Brown Shades with SOLD OUT badge and price', async () => {
      await searchPage.verifySearchResultWithSoldOutBadge(TEST_DATA.brownShadesName, TEST_DATA.brownShadesPrice);
    });

    await test.step('Step 3: Click Brown Shades result and verify product detail page loads', async () => {
      await searchPage.clickProductResult(TEST_DATA.brownShadesName);
      await catalogPage.verifyProductPage(TEST_DATA.brownShadesPrice);
    });

    await test.step('Step 4: Verify purchase button is disabled with Sold Out value', async () => {
      await catalogPage.verifyProductDetailPageSoldOut(TEST_DATA.brownShadesName, TEST_DATA.brownShadesPrice);
    });

    await test.step('Step 5: Capture proof screenshot', async () => {
      await catalogPage.captureProof(testInfo, 'KAN-TC-53-proof.png');
    });
  });

  test('KAN-TC-54: Verify cart guard prevents adding sold out item and direct checkout navigation preserves empty cart state', { tag: '@KAN-TC-54' }, async ({ catalogPage, cartPage }, testInfo) => {
    await test.step('Step 1: Navigate directly to Brown Shades product detail page', async () => {
      await catalogPage.openStorefront(TEST_DATA.brownShadesUrl);
      await catalogPage.verifyProductDetailPageSoldOut(TEST_DATA.brownShadesName, TEST_DATA.brownShadesPrice);
    });

    await test.step('Step 2: Verify header cart counter remains at zero', async () => {
      await catalogPage.verifyCartCounterRemainsZero();
    });

    await test.step('Step 3: Navigate directly to /cart and verify empty state', async () => {
      await cartPage.openCart();
      await cartPage.verifyCartIsEmpty();
      await cartPage.verifyCartCounter(0);
      await cartPage.verifyProductNotPresent(TEST_DATA.brownShadesName);
    });

    await test.step('Step 4: Capture proof screenshot', async () => {
      await cartPage.captureProof(testInfo, 'KAN-TC-54-proof.png');
    });
  });

  test('KAN-TC-55: Verify search query for secondary out-of-stock item White sandals correctly displays Sold Out badge alongside in-stock items', { tag: '@KAN-TC-55' }, async ({ searchPage, catalogPage }, testInfo) => {
    await test.step('Step 1: Navigate to search results for White sandals', async () => {
      await searchPage.openStorefront(`${TEST_DATA.storeUrl}search?q=White+sandals`);
      await searchPage.verifySearchUrl('White sandals');
    });

    await test.step('Step 2: Verify in-stock Bronze sandals does not display Sold Out badge', async () => {
      await searchPage.verifySearchResultWithoutSoldOutBadge(TEST_DATA.bronzeSandalsName);
    });

    await test.step('Step 3: Verify out-of-stock White sandals displays explicit SOLD OUT badge', async () => {
      await searchPage.verifySearchResultWithSoldOutBadge(TEST_DATA.whiteSandalsName, TEST_DATA.whiteSandalsPrice);
    });

    await test.step('Step 4: Click White sandals and verify PDP purchase button is disabled with Sold Out', async () => {
      await searchPage.clickProductResult(TEST_DATA.whiteSandalsName);
      await catalogPage.verifyProductDetailPageSoldOut(TEST_DATA.whiteSandalsName, TEST_DATA.whiteSandalsPrice);
    });

    await test.step('Step 5: Capture proof screenshot', async () => {
      await catalogPage.captureProof(testInfo, 'KAN-TC-55-proof.png');
    });
  });

  test('KAN-TC-56: Verify sold out item status consistency across search refresh and header search submission', { tag: '@KAN-TC-56' }, async ({ searchPage, catalogPage }, testInfo) => {
    await test.step('Step 1: Open storefront home page', async () => {
      await searchPage.openStorefront(TEST_DATA.storeUrl);
      await searchPage.verifyTitle(/Sauce Demo/i);
    });

    await test.step('Step 2: Perform search for Brown Shades using search input', async () => {
      await searchPage.performSearch(TEST_DATA.brownShadesName);
      await searchPage.verifySearchUrl('Brown Shades');
    });

    await test.step('Step 3: Verify Brown Shades displays SOLD OUT overlay badge', async () => {
      await searchPage.verifySearchResultWithSoldOutBadge(TEST_DATA.brownShadesName, TEST_DATA.brownShadesPrice);
    });

    await test.step('Step 4: Refresh page and verify SOLD OUT status and cart count persist', async () => {
      await searchPage.page.reload({ waitUntil: 'domcontentloaded' });
      await searchPage.verifySearchResultWithSoldOutBadge(TEST_DATA.brownShadesName, TEST_DATA.brownShadesPrice);
      await catalogPage.verifyCartCounterRemainsZero();
    });

    await test.step('Step 5: Capture proof screenshot', async () => {
      await searchPage.captureProof(testInfo, 'KAN-TC-56-proof.png');
    });
  });

});
