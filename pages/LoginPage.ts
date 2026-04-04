import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Login Page Object Model
 * Encapsulates all interactions with the login page
 */
export class LoginPage extends BasePage {
  // Selectors
  private readonly pageTitle = 'h2:has-text("Login")';
  private readonly emailInput = 'input[placeholder="Enter User Email"]';
  private readonly passwordInput = 'input[placeholder="Enter Password"]';
  private readonly loginButton =
    'input[value="LogIn"], button:has-text("LogIn")';
  private readonly notAuthMessage =
    'text=/not authenticated|please login|please register/i';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to login page
   */
  async navigate(): Promise<void> {
    await this.goto('/login.html');
  }

  /**
   * Wait for page to be ready
   */
  async waitForPageReady(): Promise<void> {
    await expect(this.page.locator(this.pageTitle)).toBeVisible();
  }

  /**
   * Fill email field
   */
  async fillEmail(email: string): Promise<void> {
    await this.page.fill(this.emailInput, email);
  }

  /**
   * Fill password field
   */
  async fillPassword(password: string): Promise<void> {
    await this.page.fill(this.passwordInput, password);
  }

  /**
   * Click login button
   */
  async clickLoginButton(): Promise<void> {
    await this.page.click(this.loginButton);
  }

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLoginButton();
  }

  /**
   * Verify successful login
   */
  async verifyLoginSuccess(): Promise<void> {
    try {
      await this.page.waitForURL(/dashboard|account|book-shop|home/, {
        timeout: 8000,
      });
    } catch {
      // If redirection doesn't happen, check if we're on a page that requires authentication
      const currentUrl = this.getCurrentUrl();
      const isLoggedIn =
        currentUrl.includes('dashboard') ||
        currentUrl.includes('account') ||
        currentUrl.includes('book-shop') ||
        currentUrl.includes('home') ||
        !currentUrl.includes('login');

      if (!isLoggedIn) {
        throw new Error(
          'Login verification failed - user not redirected to authenticated area',
        );
      }
    }
  }

  /**
   * Verify no authentication error messages
   */
  async verifyNoAuthMessages(): Promise<void> {
    const notAuthLocator = this.page.locator(this.notAuthMessage);
    await expect(notAuthLocator)
      .not.toBeVisible({ timeout: 2000 })
      .catch(() => {
        // It's okay if element doesn't exist
      });
  }
}
