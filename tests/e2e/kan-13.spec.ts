import { test, expect } from '../fixtures/page.fixture';

test.describe('KAN-13: User Account Registration Validation & Duplicate Email Handling End-to-End Tests', () => {

  test('KAN-TC-40: Verify customer registration form fields and UI layout', { tag: '@KAN-TC-40' }, async ({ registerPage }, testInfo) => {
    await test.step('Step 1: Open registration page and verify title', async () => {
      await registerPage.openRegister();
      await registerPage.verifyTitle(/Create Account/i);
    });

    await test.step('Step 2: Verify all form input fields and Create button are rendered', async () => {
      await registerPage.verifyFormFieldsVisible();
    });

    await test.step('Step 3: Save proof screenshot', async () => {
      await registerPage.captureProof(testInfo, 'KAN-TC-40-proof.png');
    });
  });

  test('KAN-TC-41: Verify client-side HTML5 validation halts submission on malformed email', { tag: '@KAN-TC-41' }, async ({ registerPage }, testInfo) => {
    await test.step('Step 1: Open registration page', async () => {
      await registerPage.openRegister();
    });

    await test.step('Step 2: Fill malformed email string without @ and submit form', async () => {
      await registerPage.fillRegistrationForm({
        firstName: 'Alex',
        lastName: 'Validation',
        email: 'invalid-email-format',
        password: 'password123'
      });
      await registerPage.submitForm();
    });

    await test.step('Step 3: Assert browser HTML5 typeMismatch prevents submission and remains on register page', async () => {
      await registerPage.verifyEmailHtml5TypeMismatch();
    });

    await test.step('Step 4: Save proof screenshot', async () => {
      await registerPage.captureProof(testInfo, 'KAN-TC-41-proof.png');
    });
  });

  test('KAN-TC-42: Verify submitting empty registration form preserves form state on register page', { tag: '@KAN-TC-42' }, async ({ registerPage }, testInfo) => {
    await test.step('Step 1: Open registration page with empty inputs', async () => {
      await registerPage.openRegister();
    });

    await test.step('Step 2: Click Create submit button with blank fields', async () => {
      await registerPage.submitForm();
    });

    await test.step('Step 3: Assert application state remains strictly on /account/register', async () => {
      await registerPage.verifyFormRemainsOnRegisterPage();
    });

    await test.step('Step 4: Save proof screenshot', async () => {
      await registerPage.captureProof(testInfo, 'KAN-TC-42-proof.png');
    });
  });

  test('KAN-TC-43: Verify bot protection challenge triggers upon customer account registration submission', { tag: '@KAN-TC-43' }, async ({ registerPage }, testInfo) => {
    await test.step('Step 1: Open registration page', async () => {
      await registerPage.openRegister();
    });

    await test.step('Step 2: Fill valid unique customer credentials and submit', async () => {
      const uniqueEmail = `test_qa_${Date.now()}@example.com`;
      await registerPage.fillRegistrationForm({
        firstName: 'QA',
        lastName: 'Automation',
        email: uniqueEmail,
        password: 'SecurePassword123!'
      });
      await registerPage.submitForm();
    });

    await test.step('Step 3: Assert hCaptcha security challenge frame is activated to protect registration', async () => {
      await registerPage.verifyCaptchaChallengeTriggered();
    });

    await test.step('Step 4: Save proof screenshot', async () => {
      await registerPage.captureProof(testInfo, 'KAN-TC-43-proof.png');
    });
  });

});
