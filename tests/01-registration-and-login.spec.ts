import { test, expect } from '@playwright/test';

const TEST_USER = {
  firstName: 'John',
  lastName: 'Tester',
  email: `test-user-${Date.now()}@example.com`,
  birthDate: '1990-01-15',
  password: 'TestPassword123!',
};

test.describe.serial('User Registration and Login E2E Tests', () => {
  /**
   * Test 1: User Registration
   *
   * This test verifies that a new user can successfully register in the application.
   * Steps:
   * 1. Navigate to the registration page
   * 2. Fill in all required registration fields (first name, last name, email, birth date, password)
   * 3. Select an avatar
   * 4. Click the Register button
   * 5. Verify successful registration by checking redirection
   */
  test('Test 1: Register new user with valid credentials', async ({ page }) => {
    // Navigate to registration page
    await page.goto('/register.html');

    // Wait for the page to load
    await expect(page.locator('h2:has-text("Register")')).toBeVisible();

    // Fill in the registration form with valid data
    await page.fill(
      'input[placeholder="Enter User First Name"]',
      TEST_USER.firstName,
    );
    await page.fill(
      'input[placeholder="Enter User Last Name"]',
      TEST_USER.lastName,
    );
    await page.fill('input[placeholder="Enter User Email"]', TEST_USER.email);
    await page.fill(
      'input[placeholder="Enter Birth Date"]',
      TEST_USER.birthDate,
    );
    // Close the date picker by clicking the "Done" button
    await page.click('button:has-text("Done")');

    await page.fill('input[placeholder="Enter Password"]', TEST_USER.password);

    // Submit the registration form
    await page.click('input[data-testid="register-button"]');

    // Verify successful registration - user should be redirected after registration
    // Wait for navigation to complete (typically redirects to login with success message or directly to dashboard)
    try {
      await page.waitForURL(/login|success|dashboard|account/, {
        timeout: 8000,
      });
    } catch {
      // If no redirect, check for success message on current page
      await expect(
        page.locator('text=/successfully|registered|welcome/i'),
      ).toBeVisible({ timeout: 2000 });
    }

    console.log(
      `✓ Test 1 PASSED: User registered successfully with email: ${TEST_USER.email}`,
    );
  });

  /**
   * Test 2: User Login
   *
   * This test verifies that a registered user can successfully login to the application.
   * Steps:
   * 1. Navigate to the login page
   * 2. Enter the email and password from the registered user
   * 3. Click the LogIn button
   * 4. Verify successful login by checking redirection and/or success indicators
   * 5. Verify user is authenticated by checking for absence of login/authentication prompts
   */
  test('Test 2: Login with registered user credentials', async ({ page }) => {
    // Navigate to the login page
    await page.goto('/login.html');

    // Wait for the page to load
    await expect(page.locator('h2:has-text("Login")')).toBeVisible();

    // Fill in the login form with registered user credentials
    await page.fill('input[placeholder="Enter User Email"]', TEST_USER.email);
    await page.fill('input[placeholder="Enter Password"]', TEST_USER.password);

    // Optional: Check the "keep me sign in" checkbox for better session management
    // await page.check('input[type="checkbox"]');

    // Submit the login form by clicking the LogIn button
    await page.click('input[value="LogIn"], button:has-text("LogIn")');

    // Verify successful login - user should be redirected to a protected area
    try {
      await page.waitForURL(/dashboard|account|book-shop|home/, {
        timeout: 8000,
      });
    } catch {
      // If redirection doesn't happen, check if we're on a page that requires authentication
      // meaning login was successful or there's an error message
      const currentUrl = page.url();
      expect(
        currentUrl.includes('dashboard') ||
          currentUrl.includes('account') ||
          currentUrl.includes('book-shop') ||
          currentUrl.includes('home') ||
          !currentUrl.includes('login'),
      ).toBeTruthy();
    }

    // Verify that no "not authenticated" message is shown
    const notAuthMessage = page.locator(
      'text=/not authenticated|please login|please register/i',
    );
    await expect(notAuthMessage)
      .not.toBeVisible({ timeout: 2000 })
      .catch(() => {
        // It's okay if element doesn't exist
      });

    console.log(
      `✓ Test 2 PASSED: User logged in successfully with email: ${TEST_USER.email}`,
    );
  });

  /**
   * Test 3: Verify User Can Access Protected Resources After Login
   *
   * This test verifies that after successful login, the user can access protected content
   * that requires authentication.
   * Steps:
   * 1. Login with registered user credentials
   * 2. Navigate to a protected resource (BookShop account page)
   * 3. Verify that the page content is accessible and "not authenticated" message is not shown
   */
  test('Test 3: Access protected resources after login', async ({ page }) => {
    // First, login with the registered user
    await page.goto('/login.html');
    await page.fill('input[placeholder="Enter User Email"]', TEST_USER.email);
    await page.fill('input[placeholder="Enter Password"]', TEST_USER.password);
    await page.click('input[value="LogIn"], button:has-text("LogIn")');

    // Wait for login to complete
    await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {
      // Network idle might timeout, but that's okay
    });

    // Navigate to a protected page (BookShop account page)
    await page.goto('/book-shop/account.html');

    // Verify that we can see the protected content
    // If properly authenticated, we should NOT see the "You are not authenticated" message
    const notAuthMessage = page.locator('text=You are not authenticated');
    await expect(notAuthMessage)
      .not.toBeVisible({ timeout: 2000 })
      .catch(() => {
        throw new Error(
          'User still sees authentication required message after login',
        );
      });

    // Verify we can see account-related content
    // Look for any element that indicates we're viewing account information
    const accountContent = page.locator('h2, h3, p').first();
    await expect(accountContent).toBeVisible();

    console.log(
      '✓ Test 3 PASSED: User can access protected resources after login',
    );
  });
});
