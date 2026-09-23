import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly loginUrl: string = 'https://sauce-demo.myshopify.com/account/login';
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('#customer_email, input[name="customer[email]"]').first();
    this.passwordInput = page.locator('#customer_password, input[name="customer[password]"]').first();
    this.signInButton = page.locator('form[action*="login"] input[type="submit"][value*="Sign In" i], form[action*="login"] button[type="submit"]').first();
  }

  async openLogin(): Promise<void> {
    await this.navigate(this.loginUrl);
    await this.waitForPageLoad();
  }

  async login(email: string, pass: string): Promise<void> {
    await expect(this.emailInput).toBeVisible();
    await this.emailInput.fill(email);
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(pass);
    await this.signInButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}
