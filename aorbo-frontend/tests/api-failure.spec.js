import { test, expect } from '@playwright/test';

test.describe('API Failure Module', () => {

  test('Home page loads even if API returns 500', async ({ page }) => {

    await page.route('**/api/treks/**', async route => {

      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Internal Server Error'
        })
      });

    });

    await page.goto('/');

    await expect(page.locator('body')).toBeVisible();

  });

  test('Search input works when API fails', async ({ page }) => {

    await page.route('**/api/treks/**', async route => {

      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Internal Server Error'
        })
      });

    });

    await page.goto('/');

    const input = page.locator('#hero-search-input');

    await input.fill('Coorg');

    await expect(input).toHaveValue('Coorg');

  });

  test('Application remains responsive during slow API', async ({ page }) => {

    await page.route('**/api/treks/**', async route => {

      await new Promise(resolve => setTimeout(resolve, 5000));

      await route.continue();

    });

    await page.goto('/');

    const input = page.locator('#hero-search-input');

    await input.fill('Coorg');

    await expect(input).toHaveValue('Coorg');

  });

  test('Application handles empty API response', async ({ page }) => {

    await page.route('**/api/treks/**', async route => {

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });

    });

    await page.goto('/');

    await expect(page.locator('body')).toBeVisible();

    const input = page.locator('#hero-search-input');

    await input.fill('Coorg');

    await expect(input).toHaveValue('Coorg');

  });

  test('Application handles network failure gracefully', async ({ page }) => {

    await page.route('**/*', async route => {

      await route.abort();

    });

    await expect(page.goto('/')).rejects.toThrow();

  });

});