import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class RegisterPage extends BasePage {
  readonly registerUrl: string = 'https://sauce-demo.myshopify.com/account/register';
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly createButton: Locator;
  readonly registerForm: Locator;

  constructor(page: Page) {
    super(page);
    this.registerForm = page.locator('form[action*="account"], form#create_customer').first();
    this.firstNameInput = page.getByRole('textbox', { name: /first name/i })
      .or(page.getByLabel(/first name/i))
      .or(page.locator('input[name="customer[first_name]"]'))
      .first();
    this.lastNameInput = page.getByRole('textbox', { name: /last name/i })
      .or(page.getByLabel(/last name/i))
      .or(page.locator('input[name="customer[last_name]"]'))
      .first();
    this.emailInput = page.getByRole('textbox', { name: /email/i })
      .or(page.getByLabel(/email/i))
      .or(page.locator('input[name="customer[email]"]'))
      .first();
    this.passwordInput = page.getByLabel(/password/i)
      .or(page.locator('input[name="customer[password]"]'))
      .first();
    this.createButton = page.getByRole('button', { name: /create|sign up|register/i })
      .or(page.locator('input[type="submit"][value*="Create" i]'))
      .first();
  }

  async openRegister(): Promise<void> {
    await this.navigate(this.registerUrl);
    await this.waitForPageLoad();
  }

  async verifyFormFieldsVisible(): Promise<void> {
    await expect(this.registerForm).toBeVisible();
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.createButton).toBeVisible();
  }

  async fillRegistrationForm(data: { firstName?: string; lastName?: string; email?: string; password?: string }): Promise<void> {
    if (data.firstName) await this.firstNameInput.fill(data.firstName);
    if (data.lastName) await this.lastNameInput.fill(data.lastName);
    if (data.email) await this.emailInput.fill(data.email);
    if (data.password) await this.passwordInput.fill(data.password);
  }

  async submitForm(): Promise<void> {
    await expect(this.createButton).toBeVisible();
    await this.createButton.click();
    await this.page.waitForTimeout(2000);
  }

  async verifyEmailHtml5TypeMismatch(): Promise<void> {
    const isMismatch = await this.emailInput.evaluate((el: HTMLInputElement) => el.validity.typeMismatch);
    expect(isMismatch).toBe(true);
    // Ensure form was blocked from navigating away
    await expect(this.page).toHaveURL(/.*\/account\/register.*/);
  }

  async verifyFormRemainsOnRegisterPage(): Promise<void> {
    await expect(this.page).toHaveURL(/.*\/account\/register.*/);
    await expect(this.registerForm).toBeVisible();
  }

  async verifyCaptchaChallengeTriggered(): Promise<void> {
    // Assert that hCaptcha iframe challenge frame was injected into the DOM
    const captchaFrame = this.page.locator('iframe[src*="hcaptcha.html"], iframe[src*="captcha"]').first();
    await expect(captchaFrame).toBeAttached({ timeout: 5000 });
  }
}
