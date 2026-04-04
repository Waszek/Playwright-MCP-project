import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export interface UserRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  password: string;
}

/**
 * Register Page Object Model
 * Encapsulates all interactions with the registration page
 */
export class RegisterPage extends BasePage {
  // Selectors
  private readonly pageTitle = 'h2:has-text("Register")';
  private readonly firstNameInput =
    'input[placeholder="Enter User First Name"]';
  private readonly lastNameInput = 'input[placeholder="Enter User Last Name"]';
  private readonly emailInput = 'input[placeholder="Enter User Email"]';
  private readonly birthDateInput = 'input[placeholder="Enter Birth Date"]';
  private readonly doneButton = 'button:has-text("Done")';
  private readonly passwordInput = 'input[placeholder="Enter Password"]';
  private readonly registerButton = 'input[data-testid="register-button"]';
  private readonly successMessage = 'text=/successfully|registered|welcome/i';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to registration page
   */
  async navigate(): Promise<void> {
    await this.goto('/register.html');
  }

  /**
   * Wait for page to be ready
   */
  async waitForPageReady(): Promise<void> {
    await expect(this.page.locator(this.pageTitle)).toBeVisible();
  }

  /**
   * Fill first name field
   */
  async fillFirstName(firstName: string): Promise<void> {
    await this.page.fill(this.firstNameInput, firstName);
  }

  /**
   * Fill last name field
   */
  async fillLastName(lastName: string): Promise<void> {
    await this.page.fill(this.lastNameInput, lastName);
  }

  /**
   * Fill email field
   */
  async fillEmail(email: string): Promise<void> {
    await this.page.fill(this.emailInput, email);
  }

  /**
   * Fill birth date field
   */
  async fillBirthDate(birthDate: string): Promise<void> {
    await this.page.fill(this.birthDateInput, birthDate);
  }

  /**
   * Close date picker by clicking Done button
   */
  async closeDatePicker(): Promise<void> {
    await this.page.click(this.doneButton);
  }

  /**
   * Fill password field
   */
  async fillPassword(password: string): Promise<void> {
    await this.page.fill(this.passwordInput, password);
  }

  /**
   * Submit registration form
   */
  async submitRegistration(): Promise<void> {
    await this.page.click(this.registerButton);
  }

  /**
   * Register user with complete data
   */
  async registerUser(userData: UserRegistrationData): Promise<void> {
    await this.fillFirstName(userData.firstName);
    await this.fillLastName(userData.lastName);
    await this.fillEmail(userData.email);
    await this.fillBirthDate(userData.birthDate);
    await this.closeDatePicker();
    await this.fillPassword(userData.password);
    await this.submitRegistration();
  }

  /**
   * Verify successful registration
   */
  async verifyRegistrationSuccess(): Promise<void> {
    try {
      await this.page.waitForURL(/login|success|dashboard|account/, {
        timeout: 8000,
      });
    } catch {
      // If no redirect, check for success message on current page
      await expect(this.page.locator(this.successMessage)).toBeVisible({
        timeout: 2000,
      });
    }
  }
}
