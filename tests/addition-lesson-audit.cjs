require('fs').mkdirSync('tmp', { recursive: true });
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { pathToFileURL } = require('url');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 950 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  await page.goto(pathToFileURL(path.resolve('VECTOR-LANDING-PAGE.html')).href);

  const result = await page.evaluate(() => {
    const assert = (condition, message) => {
      if (!condition) throw new Error(message);
    };
    const module = document.querySelector('#concept3 .addition-module');
    assert(module, 'Addition module is in the addition lesson');
    for (const heading of [
      'Bentuk algebra',
      'Bentuk geometri',
      'Kaedah segi empat selari',
      'Bentuk komponen i-j',
      'Ringkasan Penambahan Vektor'
    ]) assert(module.textContent.includes(heading), `Module includes ${heading}`);
    assert(module.textContent.includes('A = (2, 3)') && module.textContent.includes('A + B = (6, 2)'), 'Ordered-pair worked example');
    assert(module.querySelectorAll('.addition-worked-card ol').length >= 3, 'Worked examples include calculation steps');
    assert(module.querySelectorAll('.addition-diagram svg').length === 2, 'Both vector diagrams are rendered');
    assert(module.querySelector('#addition-head-tail-title') && module.querySelector('#addition-parallelogram-svg-title'), 'Both diagrams have accessible titles');
    assert(module.querySelectorAll('.addition-quiz-list .addition-question').length === 6, 'Six focused practice questions');

    const answers = [[6, 2], [-1, 1], [5, 3], [-1, 3], [5, 3], [1, 7]];
    module.querySelectorAll('.addition-question').forEach((card, index) => {
      const inputs = [...card.querySelectorAll('input')];
      const check = card.querySelector('button');
      const feedback = card.querySelector('.addition-question-feedback');
      assert(inputs.length === 2 && inputs.every(input => input.labels.length === 1), `Question ${index + 1} has labeled inputs`);

      check.click();
      assert(feedback.dataset.state === 'incomplete', `Question ${index + 1} rejects an incomplete answer`);
      inputs[0].value = String(answers[index][0] + 1);
      inputs[1].value = String(answers[index][1]);
      check.click();
      assert(feedback.dataset.state === 'wrong', `Question ${index + 1} rejects an incorrect answer`);
      assert(feedback.textContent.includes(`(${answers[index][0]}, ${answers[index][1]})`), `Question ${index + 1} reveals its answer`);
      assert(feedback.querySelector('ol li'), `Question ${index + 1} explains the calculation`);

      inputs.forEach((input, componentIndex) => { input.value = String(answers[index][componentIndex]); });
      check.click();
      assert(feedback.dataset.state === 'correct', `Question ${index + 1} accepts the correct answer`);
      assert(feedback.textContent.includes('Betul!'), `Question ${index + 1} shows positive feedback`);
    });

    const first = module.querySelector('.addition-question');
    first.querySelectorAll('input').forEach(input => { input.value = '4'; });
    first.querySelectorAll('button')[1].click();
    assert(first.querySelector('.addition-question-feedback').hidden, 'Reset hides prior feedback');
    assert([...first.querySelectorAll('input')].every(input => input.value === ''), 'Reset clears answer inputs');
    const ids = [...document.querySelectorAll('[id]')].map(element => element.id);
    assert(ids.length === new Set(ids).size, 'No duplicate IDs');
    return { diagrams: 2, practiceQuestions: answers.length, answerChecks: answers.length * 3 };
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => switchTab('concept3'));
  const mobileWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  if (mobileWidth > 390) throw new Error(`Mobile overflow: ${mobileWidth}px`);
  if (errors.length) throw new Error(errors.join('\n'));
  console.log(JSON.stringify({ ...result, mobileWidth, pageErrors: errors }));
  await browser.close();
})().catch(error => {
  console.error(error);
  process.exit(1);
});
