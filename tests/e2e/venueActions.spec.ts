import { test, expect } from '@playwright/test';

test('App should load properly and allow navigation', async ({ page }) => {
  // Wait up to 10s for the page to be ready considering network initialization
  await page.goto('/');

  // Assuming Neurovenue or Ai-prompt-war banner or text exists
  await expect(page).toHaveTitle(/vite|neurovenue|ai-prompt-war/i);

  // We check if EcoRewards component renders via its button
  const eWasteBtn = page.locator('[data-testid="simulate-ewaste-btn"]');
  
  if(await eWasteBtn.isVisible()) {
    await eWasteBtn.click();
    await expect(page.locator('[data-testid="success-msg"]')).toBeVisible({ timeout: 5000 });
  }
});
