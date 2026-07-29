import { test, expect } from '@playwright/test';

test.describe('Accessibility Module', () => {

  test('Keyboard navigation reaches search box', async ({ page }) => {

    await page.goto('/');

    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');

      const isFocused = await page.locator('#hero-search-input').evaluate(el =>
        el === document.activeElement
      );

      if (isFocused) break;
    }

    await expect(page.locator('#hero-search-input')).toBeFocused();

  });

  test('All buttons have accessible names', async ({ page }) => {

    await page.goto('/');

    const buttons = page.locator('button');

    const count = await buttons.count();

    console.log(`Found ${count} buttons`);

    for (let i = 0; i < count; i++) {

      const button = buttons.nth(i);

      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      const title = await button.getAttribute('title');

      console.log(`Button ${i + 1}`);
      console.log('Text:', text);
      console.log('aria-label:', ariaLabel);
      console.log('title:', title);

      expect(
        !!(text?.trim() || ariaLabel?.trim() || title?.trim())
      ).toBe(true);

    }

  });

  test('All images have alt text', async ({ page }) => {

    await page.goto('/');

    const images = page.locator('img');

    const count = await images.count();

    for (let i = 0; i < count; i++) {

      const alt = await images.nth(i).getAttribute('alt');

      expect(alt).not.toBeNull();
      expect(alt.trim().length).toBeGreaterThan(0);

    }

  });

  test('Page has exactly one H1 heading', async ({ page }) => {

    await page.goto('/');

    const h1s = page.locator('h1');

    expect(await h1s.count()).toBe(1);

    await expect(h1s.first()).toBeVisible();

  });

  test('Search input has accessible placeholder', async ({ page }) => {

    await page.goto('/');

    const input = page.locator('#hero-search-input');

    await expect(input).toBeVisible();

    const placeholder = await input.getAttribute('placeholder');

    expect(placeholder).toBeTruthy();

    expect(placeholder.length).toBeGreaterThan(0);

  });

});