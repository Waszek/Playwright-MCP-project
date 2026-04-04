import { Page } from '@playwright/test';

/**
 * Base Page class that provides common functionality for all page objects
 */
export class BasePage {
  constructor(protected page: Page) {}

  /**
   * Navigate to a specific path
   */
  async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Wait for page to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle').catch(() => {
      // Network idle might timeout, but that's okay
    });
  }

  /**
   * Get current URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }
}
