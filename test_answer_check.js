const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto('http://localhost:8000/VECTOR-LANDING-PAGE.html', { waitUntil: 'networkidle' });
    await page.click('button[data-tab="concept1"]');
    await page.waitForTimeout(1000);

    // Fill in answer
    await page.fill('#answer-scalar-exercises', '4i + 6j');
    await page.waitForTimeout(300);

    // Call the function and check state after
    const result = await page.evaluate(() => {
      // Before calling
      const inputBefore = document.getElementById('answer-scalar-exercises')?.value;
      const feedbackBefore = document.getElementById('feedback-scalar-exercises')?.textContent;
      
      // Call function
      window.ExerciseCarousel['checkAnswer_scalar-exercises'](0);
      
      // After calling
      const inputAfter = document.getElementById('answer-scalar-exercises')?.value;
      const inputDisabled = document.getElementById('answer-scalar-exercises')?.disabled;
      const feedbackAfter = document.getElementById('feedback-scalar-exercises')?.textContent;
      const feedbackClass = document.getElementById('feedback-scalar-exercises')?.className;
      const progress = {
        percent: document.getElementById('concept1-percent')?.textContent,
        completed: document.getElementById('concept1-completed')?.textContent,
        total: document.getElementById('concept1-total')?.textContent
      };
      
      return {
        inputBefore,
        inputAfter,
        inputDisabled,
        feedbackBefore,
        feedbackAfter,
        feedbackClass,
        progress
      };
    });

    console.log('Results:');
    console.log('  Input before:', result.inputBefore);
    console.log('  Input after:', result.inputAfter);
    console.log('  Input disabled:', result.inputDisabled);
    console.log('  Feedback before:', result.feedbackBefore);
    console.log('  Feedback after:', result.feedbackAfter);
    console.log('  Feedback class:', result.feedbackClass);
    console.log('  Progress:', result.progress);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
