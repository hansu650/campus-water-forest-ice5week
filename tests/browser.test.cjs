'use strict';

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { execFileSync } = require('node:child_process');

// Use an installed Playwright runtime; this suite never installs packages.
const runtime = process.env.CAMPUS_PLAYWRIGHT_MODULE || 'playwright';
let chromium;
let expect;
try {
  ({ chromium } = require(runtime));
  ({ expect } = require(runtime + '/test'));
} catch (error) {
  throw new Error('Playwright is required for real-browser tests. Set '
    + 'CAMPUS_PLAYWRIGHT_MODULE to an existing installation; see docs/testing.md.', { cause: error });
}

const root = path.resolve(__dirname, '..');
const saveKey = 'campus-water-forest:pond-v5';
let browser;
let server;
let baseURL;

before(async () => {
  const build = JSON.parse(execFileSync(process.execPath, ['scripts/build.cjs'], {
    cwd: root, encoding: 'utf8',
  }).trim());
  const html = fs.readFileSync(path.join(root, 'dist/index.html'));
  assert.equal(build.externalRuntimeResources, 0);
  server = http.createServer((request, response) => {
    if (request.url === '/favicon.ico') { response.writeHead(204).end(); return; }
    if (request.url !== '/') { response.writeHead(404).end('Not found'); return; }
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    response.end(html);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  baseURL = `http://127.0.0.1:${server.address().port}/`;
  const launch = { headless: true };
  if (process.env.CAMPUS_BROWSER_EXECUTABLE) {
    launch.executablePath = process.env.CAMPUS_BROWSER_EXECUTABLE;
  } else if (process.platform === 'win32') {
    launch.channel = 'msedge';
  }
  browser = await chromium.launch(launch);
  console.log(`Built local game: ${build.bytes} bytes, ${build.images} embedded images.`);
  console.log(`Browser: ${browser.version()}; target: ${baseURL}`);
}, { timeout: 30000 });

after(async () => {
  await browser?.close();
  if (server) await new Promise(resolve => server.close(resolve));
});

async function openGame(t, { viewport = { width: 1280, height: 900 }, initialize } = {}) {
  const context = await browser.newContext({ viewport, locale: 'en-GB', reducedMotion: 'reduce' });
  const errors = [];
  const externalRequests = [];
  const page = await context.newPage();
  page.setDefaultTimeout(6000);
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => {
    if (/^https?:/.test(request.url()) && !request.url().startsWith(baseURL)) {
      externalRequests.push(request.url());
    }
  });
  t.after(async () => {
    await context.close();
    assert.deepEqual(errors, [], 'The game raised a browser JavaScript error.');
    assert.deepEqual(externalRequests, [], 'The built game requested an external runtime resource.');
  });
  if (initialize) await context.addInitScript(initialize, saveKey);
  await page.goto(baseURL, { waitUntil: 'load' });
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.getByRole('button', { name: 'Play', exact: true }).click();
  await expect(page.locator('#welcome')).toBeHidden();
  return page;
}

async function closePanel(page) {
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(page.locator('#overlay')).toBeHidden();
}

async function feedOnce(page) {
  await expect(page.locator('#feed')).toBeEnabled();
  await page.locator('#feed').click();
  await expect(page.locator('#feed')).toBeEnabled();
}

async function photoPuzzle(page) {
  await page.locator('[data-tab="games"]').click();
  await page.locator('[data-act="open-photo"]').click();
  await expect(page.locator('#sheet-title')).toHaveText('Campus photo puzzle');
}

async function solvePhoto(page) {
  for (const [first, second] of [[0, 1], [4, 5], [6, 8]]) {
    await page.locator(`[data-act="tile"][data-index="${first}"]`).click();
    await page.locator(`[data-act="tile"][data-index="${second}"]`).click();
  }
}

async function chooseFish(page, type, size, outfit) {
  await page.locator('[data-open="wardrobe"]').click();
  await page.getByRole('button', { name: 'Fish', exact: true }).click();
  await page.locator(`[data-act="choose-fish"][data-value="${type}"]`).click();
  await page.getByRole('button', { name: 'Size & outfit', exact: true }).click();
  await page.locator(`[data-act="size"][data-value="${size}"]`).click();
  await page.locator(`[data-act="wear"][data-value="${outfit}"]`).click();
}

test('UI-01: feed buttons spend food, stop at zero and grant trial supply only once', async t => {
  const page = await openGame(t);
  for (const remaining of [2, 1, 0]) {
    await feedOnce(page);
    await expect(page.locator('#food')).toHaveText(String(remaining));
    await expect(page.locator('#points')).toHaveText('80');
  }
  await expect(page.locator('#level')).toHaveText('Lv. 2');
  await page.locator('#feed').click();
  await expect(page.locator('#sheet-title')).toHaveText('Fish food');
  await expect(page.locator('#food')).toHaveText('0');
  await page.locator('[data-act="gift"]').click();
  await expect(page.locator('.reward-value')).toHaveText('+2 fish food');
  await page.locator('[data-act="reward-next"]').click();
  await page.locator('.hud [data-open="food"]').click();
  await expect(page.locator('[data-act="gift"]')).toBeDisabled();
  await expect(page.locator('#food')).toHaveText('2');
  t.diagnostic('Real clicks: food 3 -> 0 -> 2; empty feeding blocked; repeated supply disabled.');
});

test('UI-02: all three species and nine outfit combinations load and appear in the pond', async t => {
  const page = await openGame(t);
  const species = [['clown', 'Clownfish', 'small', 125],
    ['gold', 'Goldfish', 'normal', 170], ['blue', 'Blue betta', 'large', 230]];
  for (const [type, label, size, pixels] of species) {
    for (const outfit of ['none', 'sailor', 'scarf']) {
      await chooseFish(page, type, size, outfit);
      const selected = page.locator(`[data-act="wear"][data-value="${outfit}"]`);
      await expect(selected).toHaveAttribute('aria-pressed', 'true');
      const expectedImage = await selected.locator('img').getAttribute('src');
      await expect(page.locator('.preview-fish img')).toHaveAttribute('src', expectedImage);
      await closePanel(page);
      await expect(page.locator('#pet-image')).toHaveAttribute('alt', label);
      await expect(page.locator('#pet-image')).toHaveAttribute('src', expectedImage);
      await expect(page.locator('#pet')).toHaveCSS('width', `${pixels}px`);
      assert.equal(await page.locator('#pet-image').evaluate(image => image.complete && image.naturalWidth > 0), true);
    }
  }
  t.diagnostic('Nine species/outfit combinations and all three size settings checked in the real page.');
});

test('UI-03: real photo swaps unlock a badge, while replay never duplicates food', async t => {
  const page = await openGame(t);
  await photoPuzzle(page);
  await expect(page.locator('.game-meta')).toContainText('0 swaps');
  await solvePhoto(page);
  await expect(page.locator('.reward-content h3')).toHaveText('Campus puzzle complete');
  await expect(page.locator('.reward-value')).toHaveText('+2 fish food');
  await page.locator('[data-act="reward-next"]').click();
  await expect(page.locator('#food')).toHaveText('5');
  await expect(page.locator('#game-count')).toHaveText('1/2');
  await photoPuzzle(page);
  await page.locator('[data-act="shuffle"]').click();
  await solvePhoto(page);
  await expect(page.locator('.game-result')).toContainText('Complete!');
  await expect(page.locator('#food')).toHaveText('5');
  await expect(page.locator('#points')).toHaveText('80');
  await closePanel(page);
  await page.locator('[data-tab="bag"]').click();
  await expect(page.locator('.item-card').filter({ hasText: 'Campus Explorer' })).toContainText('Unlocked on your first clear');
  t.diagnostic('First clear: food 3 -> 5 and 1/2 badges. Second clear: food remains 5.');
});

test('UI-04: rotating actual pipes changes a blocked flow into a one-time rewarded win', async t => {
  const page = await openGame(t);
  await page.locator('[data-tab="games"]').click();
  await page.locator('[data-act="open-water"]').click();
  await page.locator('[data-act="flow"]').click();
  await expect(page.locator('.game-result')).toContainText('The flow stopped.');
  await expect(page.locator('#food')).toHaveText('3');
  // Turn the visible pipes; do not inject a solved board or invoke game functions.
  for (const [index, turns] of [[2, 2], [3, 1], [4, 1], [5, 3], [8, 3]]) {
    for (let turn = 0; turn < turns; turn++) {
      await page.locator(`[data-act="pipe"][data-index="${index}"]`).click();
    }
  }
  await page.locator('[data-act="flow"]').click();
  await expect(page.locator('.reward-content h3')).toHaveText('The water found its way');
  await page.locator('[data-act="reward-next"]').click();
  await expect(page.locator('#food')).toHaveText('5');
  await page.locator('[data-tab="games"]').click();
  await page.locator('[data-act="open-water"]').click();
  await page.locator('[data-act="flow"]').click();
  await expect(page.locator('.game-result')).toContainText('Water reached the outlet!');
  await expect(page.locator('.pipe.wet')).toHaveCount(6);
  await expect(page.locator('#food')).toHaveText('5');
  await expect(page.locator('#points')).toHaveText('80');
});

test('UI-05: sample water points can be collected once and enable the guardian preview', async t => {
  const page = await openGame(t);
  await page.locator('.hud [data-open="records"]').click();
  await expect(page.locator('#sheet-body')).toContainText('Sample data');
  await page.locator('[data-act="collect"]').click();
  await expect(page.locator('.reward-value')).toHaveText('+20 green points');
  await page.locator('[data-act="reward-next"]').click();
  await page.getByRole('button', { name: 'Open the guardian plaque', exact: true }).click();
  await expect(page.locator('.plaque-overlay')).toContainText('100-point demo threshold reached');
  await expect(page.locator('.plaque-overlay h3')).toHaveText('Qin Tian');
  await closePanel(page);
  await page.locator('.hud [data-open="records"]').click();
  await expect(page.locator('[data-act="collect"]')).toBeDisabled();
  await expect(page.locator('#points')).toHaveText('100');
  await expect(page.locator('#food')).toHaveText('3');
  await expect(page.locator('#game-count')).toHaveText('0/2');
});

test('UI-06: reload preserves customization, names and language; another browser stays independent', async t => {
  const page = await openGame(t);
  await chooseFish(page, 'blue', 'large', 'scarf');
  const image = await page.locator('.preview-fish img').getAttribute('src');
  await closePanel(page);
  await feedOnce(page);
  await page.locator('[data-open="friends"]').click();
  await page.locator('#keeper-input').fill('Alex <b>');
  await page.locator('#partners-input').fill('Alex <b>, Jo, Jo, Maya');
  await page.locator('[data-act="save-friends"]').click();
  await page.locator('#language').click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await page.locator('#language').click();
  await expect(page.locator('#food')).toHaveText('2');
  await expect(page.locator('#pet-image')).toHaveAttribute('src', image);
  await expect(page.locator('#pet')).toHaveCSS('width', '230px');
  await expect(page.locator('#friend-sub')).toHaveText('3 guardians');
  await page.locator('[data-tab="campus"]').click();
  await page.getByRole('button', { name: 'Open the guardian plaque', exact: true }).click();
  await expect(page.locator('.plaque-overlay h3')).toHaveText('Alex <b> · Jo · Maya');
  await expect(page.locator('.plaque-overlay h3 b')).toHaveCount(0);
  const independent = await openGame(t);
  await expect(independent.locator('#food')).toHaveText('3');
  await expect(independent.locator('#pet-image')).toHaveAttribute('alt', 'Clownfish');
  await expect(independent.locator('#friend-sub')).toHaveText('1 guardian');
  t.diagnostic('Reload retains the local save. A separate browser context starts with default progress.');
});

test('UI-07: corrupt or unavailable storage does not prevent playing', async t => {
  // Fault fixtures affect only these new browser contexts, never the user's save.
  const corrupt = await openGame(t, { initialize: key => localStorage.setItem(key, '{broken') });
  await feedOnce(corrupt);
  await expect(corrupt.locator('#food')).toHaveText('2');
  const blocked = await openGame(t, { initialize: () => {
    Object.defineProperty(window, 'localStorage', {
      get() { throw new DOMException('Storage blocked for this test', 'SecurityError'); },
    });
  } });
  await feedOnce(blocked);
  await expect(blocked.locator('#food')).toHaveText('2');
  await blocked.locator('[data-tab="profile"]').click();
  await expect(blocked.locator('#sheet-body')).toContainText('This browser cannot save progress');
});

test('UI-08: restart retains the chosen fish; full reset restores the defaults', async t => {
  const page = await openGame(t);
  await chooseFish(page, 'gold', 'large', 'scarf');
  const image = await page.locator('.preview-fish img').getAttribute('src');
  await closePanel(page);
  await feedOnce(page);
  await page.locator('.hud [data-open="records"]').click();
  await page.locator('[data-act="collect"]').click();
  await closePanel(page);
  await page.locator('[data-tab="profile"]').click();
  await page.locator('[data-act="open-reset"]').click();
  await page.locator('[data-act="reset-keep"]').click();
  await expect(page.locator('#food')).toHaveText('3');
  await expect(page.locator('#points')).toHaveText('80');
  await expect(page.locator('#pet-image')).toHaveAttribute('src', image);
  await expect(page.locator('#pet')).toHaveCSS('width', '230px');
  await page.locator('[data-tab="profile"]').click();
  await page.locator('[data-act="open-reset"]').click();
  await page.locator('[data-act="reset-all"]').click();
  await expect(page.locator('#pet-image')).toHaveAttribute('alt', 'Clownfish');
  await expect(page.locator('#pet')).toHaveCSS('width', '170px');
  await expect(page.locator('#goal-title')).toHaveText('Next up: Choose your fish');
  await page.reload();
  await expect(page.locator('#food')).toHaveText('3');
  await expect(page.locator('#game-count')).toHaveText('0/2');
});

test('UI-09: 320px, 390px and desktop layouts keep navigation and puzzle controls reachable', async t => {
  for (const width of [320, 390, 1280]) {
    const page = await openGame(t, { viewport: { width, height: 900 } });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    for (const button of await page.locator('.nav-item').all()) {
      const box = await button.boundingBox();
      assert.ok(box && box.x >= 0 && box.x + box.width <= width + 1);
    }
    await photoPuzzle(page);
    for (const tile of await page.locator('.photo-tile').all()) {
      const box = await tile.boundingBox();
      assert.ok(box && box.width > 0 && box.x >= 0 && box.x + box.width <= width + 1);
    }
    await page.locator('[data-act="tile"][data-index="0"]').click();
    await page.locator('[data-act="tile"][data-index="1"]').click();
    await expect(page.locator('.game-meta')).toContainText('1 swaps');
    await closePanel(page);
    await page.locator('[data-tab="campus"]').click();
    await page.getByRole('button', { name: 'Open the guardian plaque', exact: true }).click();
    await expect(page.locator('.plaque-overlay')).toContainText('Qin Tian');
  }
  t.diagnostic('Viewport checks: 320, 390 and 1280 pixels; navigation, swaps and plaque controls exercised.');
});

test('UI-10: modal keyboard focus stays inside the dialog and returns on Escape', async t => {
  const page = await openGame(t);
  const opener = page.locator('[data-tab="games"]');
  await opener.click();
  await expect(page.locator('#close-sheet')).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('[data-act="open-water"]')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('#close-sheet')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#overlay')).toBeHidden();
  await expect(opener).toBeFocused();
});
