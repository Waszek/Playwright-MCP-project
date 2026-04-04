# User Registration and Login E2E Tests

A comprehensive end-to-end test automation project built with **Playwright** and following the **Page Object Model (POM)** pattern. This project tests user registration, login, and access to protected resources.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Page Object Model (POM)](#page-object-model-pom)
- [Running Tests](#running-tests)
- [Test Cases](#test-cases)
- [Configuration](#configuration)

## 🎯 Overview

This project provides automated end-to-end tests for a web application with user authentication. It validates:

- **User Registration**: Complete user signup flow with form validation
- **User Login**: Successful authentication with valid credentials
- **Protected Resources**: Access to authenticated areas after login

The project follows best practices using the **Page Object Model pattern** to maintain clean, maintainable, and scalable test code.

## 📦 Prerequisites

- **Node.js** v16+ (LTS recommended)
- **npm** v7+
- A running web application at `http://localhost:3000` (or configure in `playwright.config.ts`)

## 🚀 Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd pw-mcp-project
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

## 📁 Project Structure

```
pw-mcp-project/
├── pages/                              # Page Object Models
│   ├── BasePage.ts                     # Base class with common functionality
│   ├── RegisterPage.ts                 # Registration page object
│   ├── LoginPage.ts                    # Login page object
│   ├── ProtectedPage.ts                # Protected resources page object
│   └── index.ts                        # Centralized exports
├── tests/
│   └── 01-registration-and-login.spec.ts  # E2E test suite
├── playwright.config.ts                # Playwright configuration
├── package.json                        # Project dependencies
├── playwright-report/                  # HTML test reports
├── test-results/                       # Test execution results
└── README.md                           # This file
```

## 🏗️ Page Object Model (POM)

### What is POM?

The Page Object Model is a design pattern that represents web pages as classes. Each page's UI components and interactions are encapsulated in dedicated objects, making tests:

- **Maintainable**: Selectors are centralized in one place
- **Reusable**: Common methods can be shared across tests
- **Readable**: Tests focus on business logic, not implementation details
- **Scalable**: Easy to add new pages and test cases

### Page Objects

#### **BasePage** (`pages/BasePage.ts`)

Base class providing common functionality:

- `goto(path)` - Navigate to a page path
- `waitForPageLoad()` - Wait for page to fully load
- `getCurrentUrl()` - Get current page URL

#### **RegisterPage** (`pages/RegisterPage.ts`)

Encapsulates registration page interactions:

```typescript
class RegisterPage {
  navigate(); // Go to registration page
  waitForPageReady(); // Wait for page to load
  fillFirstName(name); // Fill first name field
  fillLastName(name); // Fill last name field
  fillEmail(email); // Fill email field
  fillBirthDate(date); // Fill birth date
  closeDatePicker(); // Close date picker
  fillPassword(password); // Fill password
  submitRegistration(); // Submit form
  registerUser(userData); // Complete registration flow
  verifyRegistrationSuccess(); // Verify successful registration
}
```

#### **LoginPage** (`pages/LoginPage.ts`)

Encapsulates login page interactions:

```typescript
class LoginPage {
  navigate(); // Go to login page
  waitForPageReady(); // Wait for page to load
  fillEmail(email); // Fill email field
  fillPassword(password); // Fill password
  clickLoginButton(); // Click login button
  login(email, password); // Complete login flow
  verifyLoginSuccess(); // Verify successful login
  verifyNoAuthMessages(); // Check for auth errors
}
```

#### **ProtectedPage** (`pages/ProtectedPage.ts`)

Encapsulates protected resource interactions:

```typescript
class ProtectedPage {
  navigateToProtectedPage(path); // Navigate to protected page
  verifyAccess(); // Verify access granted
  verifyContentIsVisible(); // Verify page content
  verifyFullAccess(); // Complete access verification
}
```

## ▶️ Running Tests

### Run all tests

```bash
npx playwright test
```

### Run tests in UI mode (interactive)

```bash
npx playwright test --ui
```

### Run specific test file

```bash
npx playwright test tests/01-registration-and-login.spec.ts
```

### Run specific test

```bash
npx playwright test -g "Register new user"
```

### Run tests in debug mode

```bash
npx playwright test --debug
```

### View test report

```bash
npx playwright show-report
```

## 📝 Test Cases

### Test 1: Register New User with Valid Credentials

**File**: `tests/01-registration-and-login.spec.ts`

Tests the complete user registration flow:

1. Navigate to registration page
2. Fill all required registration fields
3. Submit registration form
4. Verify successful registration with redirection

**Test Data**:

```typescript
{
  firstName: 'John',
  lastName: 'Tester',
  email: 'test-user-{timestamp}@example.com',
  birthDate: '1990-01-15',
  password: 'TestPassword123!'
}
```

### Test 2: Login with Registered User Credentials

Tests successful user login:

1. Navigate to login page
2. Enter registered credentials
3. Submit login form
4. Verify successful login and redirection
5. Verify no authentication error messages

### Test 3: Access Protected Resources After Login

Tests access to authenticated areas:

1. Login with registered credentials
2. Wait for login to complete
3. Navigate to protected resource (BookShop account page)
4. Verify access to protected content
5. Verify page content is visible

## ⚙️ Configuration

### Playwright Configuration (`playwright.config.ts`)

Key configuration settings:

```typescript
{
  testDir: './tests',              // Test files location
  fullyParallel: true,            // Run tests in parallel
  forbidOnly: !!process.env.CI,   // Fail on .only in CI
  retries: process.env.CI ? 2 : 0, // Retry failed tests on CI
  reporter: 'html',               // HTML report output
  use: {
    baseURL: 'http://localhost:3000', // Application URL
    trace: 'on'                   // Collect trace on failure
  },
  projects: [
    { name: 'chromium', ... }     // Chromium browser
    // { name: 'firefox', ... }   // Uncomment for Firefox
    // { name: 'webkit', ... }    // Uncomment for Safari
  ]
}
```

### Environment Setup

Ensure your application is running:

```bash
# Terminal 1: Start your application
npm run dev  # or your start command

# Terminal 2: Run tests
npm test
```

## 💡 Best Practices

1. **Use Page Objects**: Always interact with pages through page objects, not directly with the page
2. **Keep Tests DRY**: Reuse page object methods to avoid duplication
3. **Meaningful Test Names**: Use clear, descriptive test names
4. **Wait Strategies**: Use Playwright's built-in waits instead of hardcoded delays
5. **Error Handling**: Include try-catch blocks for non-critical verifications
6. **Test Isolation**: Tests can run independently in any order due to `test.describe.serial()`

## 📊 Test Reporting

After running tests, view the HTML report:

```bash
npx playwright show-report
```

Test reports include:

- Pass/fail status
- Execution time
- Screenshots on failure
- Video recordings
- Network traces

## 🐛 Troubleshooting

### Tests fail with "Connection refused"

- Ensure application is running at `http://localhost:3000`
- Update `baseURL` in `playwright.config.ts` if needed

### Selectors not found

- Check page has fully loaded with visibility assertions
- Update selectors if application markup changed
- Update selectors only in page object files

### Tests timeout

- Increase timeout in test or configuration
- Check network connectivity
- Verify application is responding

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [Page Object Model Guide](https://playwright.dev/docs/pom)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)

## 📄 License

ISC

## 👤 Author

Created for automated E2E testing with Playwright and Page Object Model pattern.
