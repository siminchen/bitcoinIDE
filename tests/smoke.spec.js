// @ts-check
const { test, expect } = require('@playwright/test');

const PAGE = '/build/editor.html';

// Collect console errors + page errors for the "zero console errors" assertion.
function trackErrors(page) {
  const errors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', (err) => errors.push(String(err)));
  return errors;
}

// Set the ACE editor contents via the global `editor` (typing into ACE is flaky).
async function setScript(page, text) {
  await page.evaluate((t) => {
    // @ts-ignore - editor is a global created in editor.html
    window.editor.setValue(t, -1);
  }, text);
}

test('1. page loads with zero console errors', async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto(PAGE);
  await page.waitForFunction(() => typeof window.editor !== 'undefined' && typeof window.scriptDebugger !== 'undefined');
  await page.waitForTimeout(500);
  expect(errors, `console errors:\n${errors.join('\n')}`).toEqual([]);
});

test('2. Run 1 2 OP_ADD produces stack value 3, marked valid', async ({ page }) => {
  await page.goto(PAGE);
  await page.waitForFunction(() => typeof window.editor !== 'undefined');
  await setScript(page, '1 2 OP_ADD');
  await page.click('#run-button');
  await expect(page.locator('#next-opcode-container')).toHaveText(/Execution successful/i);
  // The stack visualizer renders numeric values in hex by default (StackVisualizer.numberSystem),
  // so 1 + 2 = 3 is displayed as "0x3", not "3".
  await expect(page.locator('#stack-visualizer .stackElement').filter({ hasText: /^0x3$/i })).toHaveCount(1);
});

test('3. Step and Continue advance execution', async ({ page }) => {
  await page.goto(PAGE);
  await page.waitForFunction(() => typeof window.editor !== 'undefined');
  await setScript(page, '1 2 OP_ADD');
  // change event sets next-opcode to the first token "1"
  await expect(page.locator('#next-opcode-container')).toHaveText('1');
  await page.click('#next-button'); // executes "1", advances to "2"
  await expect(page.locator('#next-opcode-container')).toHaveText('2');
  await page.click('#continue-button'); // runs to completion
  await expect(page.locator('#next-opcode-container')).toHaveText(/Execution successful/i);
});

test('4. Tab switching Script <-> Assembly <-> Options', async ({ page }) => {
  await page.goto(PAGE);
  await page.waitForFunction(() => typeof window.editor !== 'undefined');
  await page.click('#editor-tab-assembly');
  await expect(page.locator('#editor-assembly-holder')).toHaveClass(/active/);
  await expect(page.locator('#editor-tab-assembly')).toHaveClass(/active/);
  await expect(page.locator('#editor-tab-script')).not.toHaveClass(/active/);
  await page.click('#editor-tab-options');
  await expect(page.locator('#editor-options')).toHaveClass(/active/);
  await page.click('#editor-tab-script');
  await expect(page.locator('#editor-holder')).toHaveClass(/active/);
  await expect(page.locator('#editor-tab-script')).toHaveClass(/active/);
  await expect(page.locator('#editor-tab-assembly')).not.toHaveClass(/active/);
});

test('5. Dropdown opens and font-size option applies', async ({ page }) => {
  await page.goto(PAGE);
  await page.waitForFunction(() => typeof window.editor !== 'undefined');
  await page.click('#editor-tab-options');
  // Open the "Editor Theme" dropdown (Bootstrap JS toggles .show / display).
  const themeToggle = page.locator('#editor-options .dropdown .dropdown-toggle').first();
  const themeMenu = page.locator('#editor-options .dropdown .dropdown-menu').first();
  await themeToggle.click();
  await expect(themeMenu).toBeVisible();
  // Toggle a concrete option: set font size to 18 and assert it applied to ACE.
  const fontInput = page.locator('#editor-options input[option="fontSize"]');
  await fontInput.fill('18');
  await fontInput.dispatchEvent('change');
  await expect
    .poll(async () => page.evaluate(() => window.editor.getOption('fontSize')))
    .toBe(18);
});

test('6. Download produces a script.txt blob', async ({ page }) => {
  await page.goto(PAGE);
  await page.waitForFunction(() => typeof window.editor !== 'undefined');
  const downloadPromise = page.waitForEvent('download');
  await page.click('#download-script');
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('script.txt');
});

test('7. Upload replaces editor content', async ({ page }) => {
  await page.goto(PAGE);
  await page.waitForFunction(() => typeof window.editor !== 'undefined');
  await page.setInputFiles('#upload-input', {
    name: 'uploaded.txt', mimeType: 'text/plain', buffer: Buffer.from('OP_1 OP_2 OP_ADD'),
  });
  await expect.poll(async () => page.evaluate(() => window.editor.getSession().getValue())).toContain('OP_1 OP_2 OP_ADD');
});

test('8. Theme dropdown item applies', async ({ page }) => {
  await page.goto(PAGE);
  await page.waitForFunction(() => typeof window.editor !== 'undefined');
  await page.click('#editor-tab-options');
  await page.locator('#editor-options .dropdown .dropdown-toggle').first().click(); // open Editor Theme dropdown
  await page.click('#editor-options a.dropdown-item[value="ace/theme/chrome"]');
  await expect.poll(async () => page.evaluate(() => window.editor.getOption('theme'))).toBe('ace/theme/chrome');
});
