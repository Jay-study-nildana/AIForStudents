import { test, expect } from '@playwright/test';

test.describe('Admin Panel', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin via API to get token
    const response = await page.request.post('http://localhost:3000/api/auth/login', {
      data: { email: 'admin@taskly.local', password: 'admin123' },
    });
    const { data } = await response.json();
    // Set token in localStorage
    await page.addInitScript(({ token, user }) => {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }, { token: data.token, user: data.user });
    // Navigate directly to admin
    await page.goto('http://localhost:5173/admin');
  });

  test('should display admin panel', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Admin Panel');
  });

  test('should display users tab by default', async ({ page }) => {
    await expect(page.locator('th:has-text("Name")')).toBeVisible();
    await expect(page.locator('th:has-text("Email")')).toBeVisible();
    await expect(page.locator('th:has-text("Role")')).toBeVisible();
  });

  test('should switch to categories tab', async ({ page }) => {
    await page.click('button:has-text("Categories")');
    await expect(page.locator('input[placeholder="New category name"]')).toBeVisible();
    await expect(page.locator('button:has-text("Add")')).toBeVisible();
  });

  test('should show delete button for non-admin users', async ({ page }) => {
    await expect(page.locator('button:has-text("Delete")').first()).toBeVisible();
  });

  test('should switch between tabs', async ({ page }) => {
    // Switch to categories tab
    await page.click('button:has-text("Categories")');
    await expect(page.locator('input[placeholder="New category name"]')).toBeVisible();

    // Switch back to users tab
    await page.click('button:has-text("Users")');
    await expect(page.locator('th:has-text("Name")')).toBeVisible();
  });
});
