import { Page, Locator, expect, TestInfo } from '@playwright/test';
import path from 'path';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(pathUrl: string): Promise<void> {
    await this.page.goto(pathUrl);
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyTitle(titleRegex: RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(titleRegex);
  }

  async captureProof(testInfo: TestInfo, filename: string): Promise<string> {
    const screenshotPath = path.resolve('test-results', filename);
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    await testInfo.attach(filename, { path: screenshotPath, contentType: 'image/png' });
    return screenshotPath;
  }
}
