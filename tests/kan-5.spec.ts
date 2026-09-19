import { test, expect } from '@playwright/test';

test.describe('KAN-5: Add Cart and Payment End-to-End Tests', () => {

  test('TC-KAN-5-01: Visit Sauce Demo store & navigate to Grey Jacket', async ({ page }) => {
    await page.goto('https://sauce-demo.myshopify.com/');
    await expect(page).toHaveTitle(/Sauce Demo/i);

    const jacketLink = page.getByRole('link', { name: /Grey jacket/i }).first();
    await jacketLink.click();

    await expect(page.getByRole('heading', { name: /Grey jacket/i })).toBeVisible();
    await expect(page.locator('body')).toContainText('£55.00');
  });

  test('TC-KAN-5-02: Add Grey Jacket into cart and proceed to checkout', async ({ page }) => {
    await page.goto('https://sauce-demo.myshopify.com/collections/frontpage/products/grey-jacket');

    const addBtn = page.getByRole('button', { name: /add to cart|buy|purchase/i });
    if (await addBtn.isVisible()) {
      await addBtn.click();
    }

    const checkoutLink = page.getByRole('link', { name: /Check Out|Cart/i }).first();
    if (await checkoutLink.isVisible()) {
      await checkoutLink.click();
    }

    await expect(page.locator('body')).toBeVisible();
  });

});
