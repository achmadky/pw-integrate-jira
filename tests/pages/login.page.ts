import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly loginUrl: string = 'https://sauce-demo.myshopify.com/account/login';
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;

  constructor(page: Page) {
    super(page);
    // Semantic locator with resilient fallback chain
    this.emailInput = page.getByRole('textbox', { name: /email/i })
      .or(page.getByLabel(/email/i))
      .or(page.locator('#customer_email'))
      .or(page.locator('input[name="customer[email]"]'))
      .first();
    this.passwordInput = page.getByLabel(/password/i)
      .or(page.locator('#customer_password'))
      .or(page.locator('input[name="customer[password]"]'))
      .first();
    this.signInButton = page.getByRole('button', { name: /sign in/i })
      .or(page.locator('form[action*="login"] input[type="submit"][value*="Sign In" i]'))
      .or(page.locator('form[action*="login"] button[type="submit"]'))
      .first();
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
    await this.waitForPageLoad();
  }
}
