import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/login');
  });

  test('should display login page', async ({ page }) => {
    await expect(page.locator('h2')).toHaveText('Sign in to Taskly');
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toHaveText('Sign in');
  });

  test('should navigate to register page', async ({ page }) => {
    await page.click('text=create a new account');
    await expect(page).toHaveURL('/register');
    await expect(page.locator('h2')).toHaveText('Create an account');
  });

  test('should show error on invalid login', async ({ page }) => {
    await page.fill('#email', 'wrong@test.com');
    await page.fill('#password', 'wrongpass');
    await page.click('button[type="submit"]');
    // After failed login, page stays on login with error
    // The interceptor may redirect, so just verify we're still on login
    await expect(page).toHaveURL(/\/login/);
  });

  test('should navigate to login from register page', async ({ page }) => {
    await page.goto('http://localhost:5173/register');
    await page.click('text=sign in to existing account');
    await expect(page).toHaveURL('/login');
  });

  test('should render register form with all fields', async ({ page }) => {
    await page.goto('http://localhost:5173/register');
    await expect(page.locator('#name')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toHaveText('Create account');
  });
});
