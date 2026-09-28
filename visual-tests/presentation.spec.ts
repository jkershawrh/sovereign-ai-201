import { expect, test } from '@playwright/test'

test('opening and architecture remain visually stable', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Build the Governed Inference Boundary' })).toHaveCSS('opacity', '1')
  await expect(page).toHaveScreenshot('opening.png', { fullPage: true })
  await page.goto('/?act=1&scene=0')
  await expect(page).toHaveScreenshot('architecture.png', { fullPage: true })
})

test('live journey opens as a workload workspace with topology on demand', async ({ page }) => {
  await page.goto('/?act=2&scene=0')
  await expect(page).toHaveScreenshot('live-journey.png', { fullPage: true })
})

test('earlier fail-closed evidence remains visible as conditions change', async ({ page }) => {
  await page.goto('/?act=2&scene=0')
  await page.getByRole('button', { name: /run the qualification journey/i }).click()
  await page.getByRole('button', { name: /next condition/i }).click()
  await expect(page.getByLabel('Earlier qualification evidence').getByText('ALLOWED', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: /next condition/i }).click()
  await expect(page.getByLabel('Earlier qualification evidence').getByText('POLICY_DENIED', { exact: true })).toBeVisible()
})

test('every scene fits the stage without accidental scrolling', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'rehearsal-mobile', 'Desktop stage-fit gate')
  const locations = ['/?act=0&scene=0', '/?act=0&scene=1', '/?act=1&scene=0', '/?act=2&scene=0', '/?act=2&scene=1', '/?act=3&scene=0', '/?act=4&scene=0']
  for (const location of locations) {
    await page.goto(location)
    await expect.poll(() => page.evaluate(() => ({
      horizontal: document.documentElement.scrollWidth - window.innerWidth,
      vertical: document.documentElement.scrollHeight - window.innerHeight,
    }))).toEqual({ horizontal: 0, vertical: 0 })
  }
})

test('core controls are keyboard reachable', async ({ page }) => {
  await page.goto('/?act=0&scene=0')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Restart presentation' })).toBeFocused()
})
