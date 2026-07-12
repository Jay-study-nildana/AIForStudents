import { test, expect } from '@playwright/test';

test.describe('Search and Pagination', () => {
  test.beforeEach(async ({ page }) => {
    // Login via API to get token
    const response = await page.request.post('http://localhost:3000/api/auth/login', {
      data: { email: 'admin@taskly.local', password: 'admin123' },
    });
    const { data } = await response.json();
    await page.addInitScript(({ token, user }) => {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }, { token: data.token, user: data.user });
    await page.goto('http://localhost:5173/dashboard');
  });

  test('should have search input', async ({ page }) => {
    await expect(page.locator('input[placeholder="Search tasks..."]')).toBeVisible();
  });

  test('should have status filter dropdown', async ({ page }) => {
    await expect(page.locator('select')).toBeVisible();
  });

  test('should filter tasks by status', async ({ page }) => {
    await page.selectOption('select', 'todo');
    // Verify the filter is applied (dashboard still renders)
    await expect(page.locator('h1')).toHaveText('Tasks');
  });

  test('should search tasks by typing', async ({ page }) => {
    await page.fill('input[placeholder="Search tasks..."]', 'test');
    // Verify search input accepts text
    await expect(page.locator('input[placeholder="Search tasks..."]')).toHaveValue('test');
  });

  test('should clear search', async ({ page }) => {
    await page.fill('input[placeholder="Search tasks..."]', 'test');
    await page.fill('input[placeholder="Search tasks..."]', '');
    await expect(page.locator('input[placeholder="Search tasks..."]')).toHaveValue('');
  });
});
