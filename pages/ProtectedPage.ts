import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Protected Page Object Model
 * Encapsulates interactions with protected/authenticated pages
 */
export class ProtectedPage extends BasePage {
  // Selectors
  private readonly notAuthMessage = 'text=You are not authenticated';
  private readonly contentElements = 'h2, h3, p';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to protected page (e.g., BookShop account)
   */
  async navigateToProtectedPage(
    path: string = '/book-shop/account.html',
  ): Promise<void> {
    await this.goto(path);
  }

  /**
   * Verify access to protected content
   */
  async verifyAccess(): Promise<void> {
    await expect(this.page.locator(this.notAuthMessage))
      .not.toBeVisible({ timeout: 2000 })
      .catch(() => {
        throw new Error(
          'User still sees authentication required message after login',
        );
      });
  }

  /**
   * Verify protected content is visible
   */
  async verifyContentIsVisible(): Promise<void> {
    const accountContent = this.page.locator(this.contentElements).first();
    await expect(accountContent).toBeVisible();
  }

  /**
   * Verify full access to protected resource
   */
  async verifyFullAccess(): Promise<void> {
    await this.verifyAccess();
    await this.verifyContentIsVisible();
  }
}
