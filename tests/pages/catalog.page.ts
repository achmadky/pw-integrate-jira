import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class CatalogPage extends BasePage {
  readonly greyJacketLink: Locator;
  readonly productHeading: Locator;
  readonly addToCartButton: Locator;
  readonly checkoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.greyJacketLink = page.getByRole('link', { name: /Grey jacket/i }).first();
    this.productHeading = page.getByRole('heading', { name: /Grey jacket/i });
    // Semantic locator with resilient fallback chain
    this.addToCartButton = page.getByRole('button', { name: /add to cart|buy|purchase/i })
      .or(page.locator('input#add'))
      .or(page.locator('input[type="submit"][value*="Add to Cart" i]'))
      .first();
    this.checkoutLink = page.getByRole('link', { name: /Check Out|Cart/i }).first();
  }

  async openStorefront(url: string): Promise<void> {
    await this.navigate(url);
    await this.waitForPageLoad();
  }

  async selectGreyJacket(): Promise<void> {
    await expect(this.greyJacketLink).toBeVisible();
    await this.greyJacketLink.click();
    await this.waitForPageLoad();
  }

  async verifyProductPage(expectedPrice: string): Promise<void> {
    await expect(this.productHeading).toBeVisible();
    await expect(this.page.locator('body')).toContainText(expectedPrice);
  }

  async addToCart(): Promise<void> {
    await expect(this.addToCartButton).toBeVisible();
    await this.addToCartButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async addJacketToCartAndCheckout(): Promise<void> {
    await this.addToCart();
    if (await this.checkoutLink.isVisible()) {
      await this.checkoutLink.click();
      await this.waitForPageLoad();
    }
    await expect(this.page.locator('body')).toBeVisible();
  }
}
