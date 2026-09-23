import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class CartPage extends BasePage {
  readonly cartUrl: string = 'https://sauce-demo.myshopify.com/cart';
  readonly removeItemButton: Locator;

  constructor(page: Page) {
    super(page);
    this.removeItemButton = page.locator('a[href*="quantity=0"]').filter({ hasText: /x|remove/i }).locator('visible=true').first();
  }

  async openCart(): Promise<void> {
    await this.navigate(this.cartUrl);
    await this.waitForPageLoad();
  }

  async verifyProductInCart(productName: string): Promise<void> {
    await expect(this.page.locator('body')).toContainText(new RegExp(productName, 'i'));
  }

  async removeProduct(): Promise<void> {
    await expect(this.removeItemButton).toBeVisible();
    await this.removeItemButton.click();
    await this.waitForPageLoad();
  }

  async verifyProductNotPresent(productName: string): Promise<void> {
    const productLink = this.page.locator('form[action="/cart"]').getByRole('link', { name: new RegExp(productName, 'i') });
    await expect(productLink).toHaveCount(0);
  }

  async verifyCartIsEmpty(): Promise<void> {
    await expect(this.page.locator('body')).toContainText(/empty|continue shopping/i);
  }
}
