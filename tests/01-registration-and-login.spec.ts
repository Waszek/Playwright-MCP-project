import { test } from '@playwright/test';
import { RegisterPage, LoginPage, ProtectedPage } from '../pages';
import { TEST_USER } from '../fixtures/test-data';

test.describe.serial('User Registration and Login E2E Tests', () => {
  /**
   * Test 1: User Registration
   *
   * This test verifies that a new user can successfully register in the application.
   * Uses RegisterPage object to abstract all registration page interactions.
   */
  test('Test 1: Register new user with valid credentials', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    // Navigate and wait for page to load
    await registerPage.navigate();
    await registerPage.waitForPageReady();

    // Register user with valid data
    await registerPage.registerUser(TEST_USER);

    // Verify successful registration
    await registerPage.verifyRegistrationSuccess();

    console.log(
      `✓ Test 1 PASSED: User registered successfully with email: ${TEST_USER.email}`,
    );
  });

  /**
   * Test 2: User Login
   *
   * This test verifies that a registered user can successfully login to the application.
   * Uses LoginPage object to abstract all login page interactions.
   */
  test('Test 2: Login with registered user credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Navigate and wait for page to load
    await loginPage.navigate();
    await loginPage.waitForPageReady();

    // Login with registered user credentials
    await loginPage.login(TEST_USER.email, TEST_USER.password);

    // Verify successful login
    await loginPage.verifyLoginSuccess();
    await loginPage.verifyNoAuthMessages();

    console.log(
      `✓ Test 2 PASSED: User logged in successfully with email: ${TEST_USER.email}`,
    );
  });

  /**
   * Test 3: Verify User Can Access Protected Resources After Login
   *
   * This test verifies that after successful login, the user can access protected content
   * that requires authentication.
   */
  test('Test 3: Access protected resources after login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const protectedPage = new ProtectedPage(page);

    // Login with the registered user
    await loginPage.navigate();
    await loginPage.login(TEST_USER.email, TEST_USER.password);
    await loginPage.verifyLoginSuccess();

    // Wait for login to complete
    await protectedPage.waitForPageLoad();

    // Navigate to protected page
    await protectedPage.navigateToProtectedPage();

    // Verify full access to protected resource
    await protectedPage.verifyFullAccess();

    console.log(
      '✓ Test 3 PASSED: User can access protected resources after login',
    );
  });
});
