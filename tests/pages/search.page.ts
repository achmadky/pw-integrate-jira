import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class SearchPage extends BasePage {
  readonly searchInput: Locator;
  readonly searchSubmitButton: Locator;
  readonly searchHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.getByRole('textbox', { name: /search/i })
      .or(page.getByPlaceholder(/search/i))
      .or(page.locator('#search-field'))
      .or(page.locator('input[name="q"]'))
      .first();
    this.searchSubmitButton = page.getByRole('button', { name: /search/i })
      .or(page.locator('#search-submit'))
      .or(page.locator('input[type="submit"]'))
      .first();
    this.searchHeading = page.getByRole('heading', { name: /search/i })
      .or(page.locator('h1, h2, .title').filter({ hasText: /search/i }))
      .first();
  }

  async openStorefront(url: string): Promise<void> {
    await this.navigate(url);
    await this.waitForPageLoad();
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
