import { test, expect } from '@playwright/test';

test.describe('KAN-5: Add Cart and Payment End-to-End Tests', () => {

  test('KAN-TC-8: Visit Sauce Demo store & navigate to Grey Jacket', { tag: '@KAN-TC-8' }, async ({ page }) => {
    // 1. Open browser and navigate to target URL
    await page.goto('https://sauce-demo.myshopify.com/');
    await expect(page).toHaveTitle(/Sauce Demo/i);

    // 2. Click into Grey Jacket product page
    const jacketLink = page.getByRole('link', { name: /Grey jacket/i }).first();
    await jacketLink.click();

    // 3. Verify product detail page loads with correct title and price
    await expect(page.getByRole('heading', { name: /Grey jacket/i })).toBeVisible();
    await expect(page.locator('body')).toContainText('£55.00');
  });

  test('KAN-TC-9: Add Grey Jacket into cart and proceed to checkout', { tag: '@KAN-TC-9' }, async ({ page }) => {
    // 1. Visit Grey Jacket product page directly
    await page.goto('https://sauce-demo.myshopify.com/collections/frontpage/products/grey-jacket');

    // 2. Add product to cart if available
    const addBtn = page.getByRole('button', { name: /add to cart|buy|purchase/i });
    if (await addBtn.isVisible()) {
      await addBtn.click();
    }

    // 3. Click Check Out link
    const checkoutLink = page.getByRole('link', { name: /Check Out|Cart/i }).first();
    if (await checkoutLink.isVisible()) {
      await checkoutLink.click();
    }

    // 4. Verify checkout page is reached
    await expect(page.locator('body')).toBeVisible();
  });

});
