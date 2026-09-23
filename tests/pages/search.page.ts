import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class SearchPage extends BasePage {
  readonly searchInput: Locator;
  readonly searchSubmitButton: Locator;
  readonly searchHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('#search-field, input[name="q"]').first();
    this.searchSubmitButton = page.locator('#search-submit, input[type="submit"]').first();
    this.searchHeading = page.locator('h1, h2, .title').filter({ hasText: /search/i }).first();
  }

  async performSearch(term: string): Promise<void> {
    await expect(this.searchInput).toBeVisible();
    await this.searchInput.fill(term);
    await this.searchInput.press('Enter');
    await this.waitForPageLoad();
  }

  async verifyProductInResults(productName: string): Promise<void> {
    const productLink = this.page.getByRole('link', { name: new RegExp(productName, 'i') }).first();
    await expect(productLink).toBeVisible();
  }

  async verifyEmptyResults(): Promise<void> {
    await expect(this.page.locator('body')).toContainText(/0 results|no results/i);
  }
}
