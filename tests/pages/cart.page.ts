import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class CartPage extends BasePage {
  readonly cartUrl: string = 'https://sauce-demo.myshopify.com/cart';
  readonly removeItemButton: Locator;
  readonly checkoutButton: Locator;
  readonly quantityInput: Locator;
  readonly updateButton: Locator;
  readonly cartHeaderLink: Locator;

  constructor(page: Page) {
    super(page);
    this.removeItemButton = page.locator('a:visible').filter({ hasText: /^x$/i }).or(page.locator('a[href*="/cart/change"]:visible')).first();
    this.checkoutButton = page.locator('input#checkout, input[name="checkout"], input[value*="Check Out" i]:visible').first();
    this.quantityInput = page.locator('input[name*="updates"]:visible').first();
    this.updateButton = page.locator('input#update, input[value="Update"]:visible').first();
    this.cartHeaderLink = page.getByRole('link', { name: /my cart/i }).first();
  }

  async openCart(): Promise<void> {
    await this.navigate(this.cartUrl);
    await this.waitForPageLoad();
  }

  async verifyProductInCart(productName: string): Promise<void> {
    await expect(this.page.locator('body')).toContainText(new RegExp(productName, 'i'));
  }

  async verifyLineItemDetails(title: string, price: string, qty: string, lineTotal: string): Promise<void> {
    await expect(this.page.locator('body')).toContainText(new RegExp(title, 'i'));
    await expect(this.page.locator('body')).toContainText(price);
    await expect(this.quantityInput).toHaveValue(qty);
    await expect(this.page.locator('body')).toContainText(lineTotal);
  }

  async updateQuantity(newQty: string): Promise<void> {
    await expect(this.quantityInput).toBeVisible();
    await this.quantityInput.fill(newQty);
    await expect(this.updateButton).toBeVisible();
    await this.updateButton.click();
    await this.waitForPageLoad();
  }

  async verifySubtotal(expectedTotal: string): Promise<void> {
    await expect(this.page.locator('body')).toContainText(expectedTotal);
  }

  async verifyCartCounter(count: number | string): Promise<void> {
    await expect(this.cartHeaderLink).toBeVisible();
    await expect(this.cartHeaderLink).toContainText(new RegExp(`my cart \\(${count}\\)`, 'i'));
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

  async proceedToCheckout(): Promise<void> {
    await expect(this.checkoutButton).toBeVisible();
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => {}),
      this.checkoutButton.click()
    ]);
  }

  async verifyCheckoutPageDetails(): Promise<void> {
    await expect(this.page.locator('body')).toContainText(/checkout|contact|delivery|order summary|payment/i);
  }
}
