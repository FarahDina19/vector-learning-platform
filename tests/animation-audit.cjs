const assert = require('node:assert/strict');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const {pathToFileURL} = require('node:url');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch({headless: true, channel: 'msedge'});
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(pathToFileURL(path.resolve('index.html')).href);
    await page.waitForURL('**/VECTOR-LANDING-PAGE.html');
    assert(page.url().endsWith('/VECTOR-LANDING-PAGE.html'), 'Entry point opens the learning app');

    const labs = [
      ['concept1', 'Jarak atau sesaran?', 'Jarak =7.0m'],
      ['concept1', 'Skalar mengubah vektor', 'Semasa: k=2.00'],
      ['concept2', 'Dari lantai bengkel', 'Semasa: r≈'],
      ['concept3', 'Sambungkan perjalanan', 'Paduan akhir: R=']
    ];
    assert.equal(await page.locator('.vector-lab .lab-diagram').count(), labs.length);
    for (const [tab, title, expected] of labs) {
      await page.locator(`.tab-button[data-tab="${tab}"]`).click();
      assert(await page.locator(`#${tab}`).evaluate(el => el.classList.contains('active')), `${tab} navigation`);
      const lab = page.locator(`#${tab} .vector-lab`).filter({has: page.locator('h3', {hasText: title})});
      assert.equal(await lab.locator('.lab-diagram').count(), 1, `${title} diagram`);
      assert(await lab.locator('.lab-diagram path[data-from]').count() > 0, `${title} arrows`);
      assert.equal(await lab.locator('[data-action]').count(), 3, `${title} controls`);
      assert.equal(await lab.locator('.lab-diagram').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(250, 248, 245)', `${title} stylesheet`);

      await lab.locator('[data-action="step"]').click();
      assert.equal(await lab.locator('.timeline').inputValue(), '25', `${title} step`);
      await lab.locator('[data-action="reset"]').click();
      assert.equal(await lab.locator('.timeline').inputValue(), '0', `${title} reset`);
      await lab.locator('[data-action="play"]').click();
      await page.waitForFunction(el => Number(el.querySelector('.timeline').value) > 0, await lab.elementHandle());
      await lab.locator('[data-action="play"]').click();
      const paused = await lab.locator('.timeline').inputValue();
      await page.waitForTimeout(120);
      assert.equal(await lab.locator('.timeline').inputValue(), paused, `${title} pause`);
      await lab.locator('.timeline').fill('100');
      assert.equal(await lab.locator('.timeline + output').textContent(), '100%', `${title} scrub`);
      assert((await lab.locator('.lab-equation').textContent()).includes(expected), `${title} final readout`);
    }

    await page.locator('.tab-button[data-tab="concept1"]').click();
    const scale = page.locator('#concept1 .vector-lab').filter({hasText: 'Skalar mengubah vektor'});
    await scale.getByLabel('Pengganda').fill('-2');
    await scale.locator('.timeline').fill('100');
    assert((await scale.locator('.lab-equation').textContent()).includes('Semasa: k=−2.00'), 'Negative scalar updates diagram');
    await page.locator('.tab-button[data-tab="concept2"]').click();
    const components = page.locator('#concept2 .vector-lab .lab-diagram').first();
    await page.locator('#concept2 .vector-lab').getByLabel('Komponen i').fill('-6');
    assert((await components.locator('path[data-to="-6,0"]').count()) > 0, 'Component slider redraws arrow');
    await page.locator('.tab-button[data-tab="concept3"]').click();
    await page.locator('#concept3 .vector-lab').getByLabel('Operasi vektor').selectOption('-1');
    await page.locator('#concept3 .timeline').fill('100');
    assert((await page.locator('#concept3 .vector-lab').filter({has: page.locator('.timeline')}).locator('.lab-equation').textContent()).includes('1i^+1j^'), 'Subtraction redraws result');
    assert.deepEqual(errors, [], 'No script errors while using diagrams');
    console.log(JSON.stringify({passed: true, animatedDiagrams: labs.length, pageErrors: errors}));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
