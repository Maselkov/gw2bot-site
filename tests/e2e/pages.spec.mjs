/*
 * Smoke and visual tests for the public pages. They only use what a visitor
 * sees, so the same suite checks the site before and after framework
 * upgrades. Update baselines on purpose with --update-snapshots.
 */
import { expect, test } from '@playwright/test'

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'commands', path: '/commands' },
  { name: 'faq', path: '/faq' },
  { name: 'privacy-policy', path: '/privacy-policy' },
  { name: 'terms-of-service', path: '/terms-of-service' },
  { name: 'not-found', path: '/this-page-does-not-exist', status: 404 }
]

// Collects console errors and failed same-origin requests while a page loads
function watchForErrors (page, { allowStatus } = {}) {
  const errors = []
  const origin = new URL(test.info().project.use.baseURL).origin

  page.on('pageerror', error => errors.push(`pageerror: ${error.message}`))
  page.on('console', (message) => {
    if (message.type() !== 'error') { return }
    // The browser logs the 404 document itself; that is covered by the status check
    if (allowStatus && message.text().includes(`status of ${allowStatus}`)) { return }
    errors.push(`console: ${message.text()}`)
  })
  page.on('requestfailed', (request) => {
    if (request.url().startsWith(origin)) {
      errors.push(`requestfailed: ${request.url()} ${request.failure()?.errorText}`)
    }
  })
  page.on('response', (response) => {
    const request = response.request()
    if (
      response.url().startsWith(origin)
      && response.status() >= 400
      && !(request.isNavigationRequest() && response.status() === allowStatus)
    ) {
      errors.push(`response: ${response.status()} ${response.url()}`)
    }
  })

  return errors
}

// Scrolls through the page so lazysizes loads every image, then returns to the top
async function settle (page) {
  await page.evaluate(async () => {
    const step = window.innerHeight / 2
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForLoadState('networkidle')
  await page.waitForFunction(() =>
    document.querySelectorAll('img.lazyloading').length === 0
    && [...document.images].every(img => img.complete)
  )
  await page.evaluate(() => document.fonts.ready)
  // Chromium's first full-page capture shifts the layout by a few pixels
  // (64px on the desktop home page). Take it here, so the compared
  // screenshots start from the settled layout the baselines were made from.
  await page.screenshot({ fullPage: true })
}

for (const { name, path, status = 200 } of PAGES) {
  test(`${name} renders without errors`, async ({ page }) => {
    const errors = watchForErrors(page, { allowStatus: status === 200 ? undefined : status })

    const response = await page.goto(path)
    expect(response.status()).toBe(status)

    await settle(page)

    const brokenImages = await page.evaluate(() =>
      [...document.images]
        .filter(img => img.checkVisibility() && img.naturalWidth === 0)
        .map(img => img.currentSrc || img.src || img.outerHTML)
    )
    expect(brokenImages).toEqual([])
    expect(errors).toEqual([])

    await expect(page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      // The feature image and title change with the date on the server
      mask: [page.locator('.feature-media')]
    })
  })
}

test('home shows a feature image and title', async ({ page }) => {
  await page.goto('/')
  await settle(page)

  const image = page.locator('.feature-media img').first()
  await expect(image).toBeVisible()
  expect(await image.evaluate(img => img.naturalWidth)).toBeGreaterThan(0)

  await expect(page.locator('.feature-title')).toHaveText(
    /Bring The World\s+of Tyria Into\s+Discord|Celebrate \d+ Years of\s+GW2Bot!/
  )
})

test.describe('header', () => {
  test('color mode button shows a tooltip and switches mode', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.startsWith('mobile'), 'hover tooltips are desktop-only')

    const dark = testInfo.project.use.colorScheme === 'dark'
    const html = page.locator('html')

    await page.goto('/')
    await expect(html).toHaveClass(new RegExp(`\\b${dark ? 'dark' : 'light'}-mode\\b`))

    const button = page.locator('.dark-mode-button')
    await button.hover()
    await expect(page.getByText(`Switch to ${dark ? 'light' : 'dark'} mode`)).toBeVisible()

    await button.click()
    await expect(html).toHaveClass(new RegExp(`\\b${dark ? 'light' : 'dark'}-mode\\b`))
  })

  test('mobile navigation opens and navigates', async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.startsWith('mobile'), 'mobile-only navigation')

    await page.goto('/')
    const container = page.locator('.main-nav__container')
    await expect(container).not.toHaveClass(/\bactive\b/)

    await page.locator('.main-nav-button').click()
    await expect(container).toHaveClass(/\bactive\b/)

    await container.getByRole('link', { name: 'Commands' }).click()
    await expect(page).toHaveURL(/\/commands$/)
    await expect(container).not.toHaveClass(/\bactive\b/)
  })
})

test.describe('commands', () => {
  test('subcommands expand and collapse', async ({ page }) => {
    await page.goto('/commands')

    const button = page.locator('.command__button--subcommands').first()
    const list = page.locator(`#${await button.getAttribute('aria-controls')}`)

    await expect(button).toHaveAttribute('aria-expanded', 'false')
    await expect(list).toBeHidden()

    await button.click()
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    await expect(list).toBeVisible()

    await button.click()
    await expect(list).toBeHidden()
  })

  test('argument tooltip opens and closes', async ({ page }) => {
    await page.goto('/commands')

    const button = page.locator('.command__button--args').first()
    const tooltip = page.locator(`#${await button.getAttribute('aria-controls')}`)

    await expect(tooltip).not.toHaveClass(/\bactive\b/)
    await button.click()
    await expect(tooltip).toHaveClass(/\bactive\b/)

    await tooltip.locator('.tooltip__close').click()
    await expect(tooltip).not.toHaveClass(/\bactive\b/)
  })
})
