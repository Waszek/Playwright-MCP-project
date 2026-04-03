# E2E Test Proposal: User Registration and Login

## Application Overview

- **Application**: 🦎 GAD (GUI API Demo)
- **Base URL**: `http://localhost:3000`
- **Module Tested**: BookShop Account Management

## Registration Page Analysis

### URL

- `http://localhost:3000/register.html`

### Form Fields

The registration form contains the following input fields:

| Field      | Type     | Placeholder             | Required           |
| ---------- | -------- | ----------------------- | ------------------ |
| First Name | Text     | "Enter User First Name" | Yes                |
| Last Name  | Text     | "Enter User Last Name"  | Yes                |
| Email      | Text     | "Enter User Email"      | Yes                |
| Birth Date | Text     | "Enter Birth Date"      | Yes                |
| Password   | Text     | "Enter Password"        | Yes                |
| Avatar     | Dropdown | Multiple avatar options | Yes (pre-selected) |

### Form Actions

- **Register Button**: Submits the registration form
- **Sign In Link**: "Already have an account? Sign In" - redirects to login page

---

## Login Page Analysis

### URL

- `http://localhost:3000/login.html` or `/login/`

### Form Fields

The login form contains the following input fields:

| Field             | Type     | Placeholder        |
| ----------------- | -------- | ------------------ |
| Email             | Text     | "Enter User Email" |
| Password          | Text     | "Enter Password"   |
| Keep me signed in | Checkbox | N/A                |

### Form Actions

- **LogIn Button**: Submits the login form (Green button with text "LogIn")
- **Register Link**: "Don't have an account? Register, it's quick and free!" - redirects to registration page

---

## Protected Resources

### BookShop Account Page

- **URL**: `http://localhost:3000/book-shop/account.html`
- **Access Requirements**: Authentication required
- **Not Authenticated Message**: "You are not authenticated. Please login or register to see the content."

---

## Proposed E2E Tests

### Test File Location

`tests/01-registration-and-login.spec.ts`

### Test 1: Register New User with Valid Credentials

**Purpose**: Verify that a new user can successfully register in the application with valid credentials.

**Test Flow**:

1. Navigate to registration page (`/register.html`)
2. Fill in all registration form fields with valid data:
   - First Name: "John"
   - Last Name: "Tester"
   - Email: Unique email generated with timestamp (e.g., `test-user-1712184000000@example.com`)
   - Birth Date: "01/15/1990"
   - Password: "TestPassword123!"
3. Keep default avatar selected
4. Click the "Register" button
5. Verify successful registration by checking:
   - Page redirects to login/success/dashboard page, OR
   - Success message is displayed on current page

**Expected Result**: User is successfully registered and can proceed to login.

**Test Data Storage**: Test uses a dynamically generated email address with timestamp to ensure uniqueness across test runs.

---

### Test 2: Login with Registered User Credentials

**Purpose**: Verify that a registered user can successfully login to the application and access protected resources.

**Test Flow**:

1. Navigate to login page (`/login.html`)
2. Fill in login form with registered user credentials:
   - Email: Same email used during registration
   - Password: Same password used during registration
3. (Optional) Check "keep me sign in" checkbox
4. Click the "LogIn" button
5. Verify successful login by checking:
   - Page redirects to dashboard/account/protected area, OR
   - No "not authenticated" message is displayed
6. Verify user can access protected resources (BookShop account page)

**Expected Result**: User successfully logs in and gains access to protected resources.

---

### Test 3: Access Protected Resources After Login

**Purpose**: Verify that after successful login, the user can access protected content that requires authentication.

**Test Flow**:

1. Navigate to login page
2. Login with registered user credentials
3. Navigate to protected resource (`/book-shop/account.html`)
4. Verify that:
   - No "You are not authenticated" message is displayed
   - Account content is accessible
   - User remains authenticated

**Expected Result**: User can freely access protected resources without being prompted to login again.

---

## Key Testing Considerations

### Dynamic Test Data

- Email addresses are generated with timestamps to ensure uniqueness: `test-user-${Date.now()}@example.com`
- This allows tests to be run multiple times without conflicts
- Consider storing generated test user credentials for cleanup/teardown operations if needed

### Session Management

- Tests verify that authentication state persists across page navigation
- "Keep me signed in" checkbox is available but optional for session persistence

### Error Handling

- Tests include fallback mechanisms in case of slow network or unexpected redirects
- Tests check both URL patterns AND content indicators for validation

### Prerequisites

- Application must be running locally on `http://localhost:3000`
- Database/backend API must be accessible and functioning
- No pre-existing test users needed (new users are created during tests)

---

## Running the Tests

```bash
# Run all tests
npx playwright test

# Run only registration and login tests
npx playwright test tests/01-registration-and-login.spec.ts

# Run with UI mode for debugging
npx playwright test --ui

# Run tests in headed mode (visible browser)
npx playwright test --headed
```

---

## Test Report Location

After running tests, HTML reports are generated at:

- `playwright-report/index.html`

---

## Notes

- Both tests use the same `TEST_USER` object with dynamically generated email
- Tests are designed to be independent but can run sequentially
- Test execution time: ~10-15 seconds per test (including network delays)
- All tests include proper waits and timeouts for reliability
