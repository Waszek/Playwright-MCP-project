/**
 * Test Data Fixtures
 * 
 * Centralized location for test data used across test suites.
 * Following Playwright best practices for maintainable test data management.
 */

export const TEST_USER = {
  firstName: 'John',
  lastName: 'Tester',
  email: `test-user-${Date.now()}@example.com`,
  birthDate: '1990-01-15',
  password: 'TestPassword123!',
};
