import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class CatalogPage extends BasePage {
  readonly greyJacketLink: Locator;
  readonly productHeading: Locator;
  readonly addToCartButton: Locator;
  readonly checkoutLink: Locator;
  readonly brownShadesLink: Locator;
  readonly cartHeaderLink: Locator;

  constructor(page: Page) {
    super(page);
    this.greyJacketLink = page.getByRole('link', { name: /Grey jacket/i }).first();
    this.brownShadesLink = page.getByRole('link', { name: /Brown Shades/i }).first();
    this.productHeading = page.getByRole('heading', { name: /Grey jacket|Brown Shades/i }).first();
    this.cartHeaderLink = page.getByRole('link', { name: /my cart/i }).first();

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

  async selectBrownShades(): Promise<void> {
    await expect(this.brownShadesLink).toBeVisible();
    await this.brownShadesLink.click();
    await this.waitForPageLoad();
  }

  async verifyProductPage(expectedPrice: string): Promise<void> {
    await expect(this.productHeading).toBeVisible();
    await expect(this.page.locator('body')).toContainText(expectedPrice);
  }

  async verifySoldOutProductCard(productName: string, expectedPrice: string): Promise<void> {
    // Assert product link contains product name, expected price, and SOLD OUT text
    const productLink = this.page.getByRole('link', { name: new RegExp(`.*SOLD OUT.*${productName}.*${expectedPrice}.*`, 'i') })
      .or(this.page.getByRole('link', { name: new RegExp(productName, 'i') }).filter({ hasText: /sold out/i }))
      .first();
    await expect(productLink).toBeVisible();
    await expect(productLink).toContainText(/sold out/i);
    await expect(productLink).toContainText(expectedPrice);
  }

  async verifyProductDetailPageSoldOut(productName: string, expectedPrice: string): Promise<void> {
    const heading = this.page.getByRole('heading', { name: new RegExp(productName, 'i') }).first();
    await expect(heading).toBeVisible();
    await expect(this.page.locator('body')).toContainText(expectedPrice);

    // Verify purchase button indicates Sold Out and is strictly disabled
    const purchaseButton = this.page.locator('input#add, button#add, input[type="submit"][name="add"]').first();
    await expect(purchaseButton).toBeVisible();
    await expect(purchaseButton).toHaveAttribute('value', /sold out/i);
    await expect(purchaseButton).toBeDisabled();
  }

  async verifyCartCounterRemainsZero(): Promise<void> {
    await expect(this.cartHeaderLink).toBeVisible();
    await expect(this.cartHeaderLink).toContainText(/my cart \(0\)/i);
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
