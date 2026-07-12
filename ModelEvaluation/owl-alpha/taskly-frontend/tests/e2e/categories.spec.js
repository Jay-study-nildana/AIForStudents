import { test, expect } from '@playwright/test';

test.describe('Categories Management', () => {
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
    // Navigate directly to categories
    await page.goto('http://localhost:5173/categories');
  });

  test('should display categories page', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Categories');
    await expect(page.locator('text=+ New Category')).toBeVisible();
  });

  test('should show existing categories', async ({ page }) => {
    await expect(page.locator('text=Work')).toBeVisible();
    await expect(page.locator('text=Personal')).toBeVisible();
    await expect(page.locator('text=Shopping')).toBeVisible();
  });

  test('should display create category button', async ({ page }) => {
    await expect(page.locator('text=+ New Category')).toBeVisible();
  });

  test('should show edit and delete buttons for categories', async ({ page }) => {
    await expect(page.locator('button:has-text("Edit")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Delete")').first()).toBeVisible();
  });
});
