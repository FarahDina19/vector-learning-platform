const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto('http://localhost:8000/VECTOR-LANDING-PAGE.html', { waitUntil: 'networkidle' });
    await page.click('button[data-tab="concept1"]');
    await page.waitForTimeout(1000);

    // Try calling the function directly
    const result = await page.evaluate(() => {
      const btn = document.querySelector('#scalar-exercises button.exercise-btn.primary');
      console.log('Button onclick:', btn?.getAttribute('onclick'));
      console.log('Function name: checkAnswer_scalar-exercises');
      console.log('Function exists:', !!window.ExerciseCarousel['checkAnswer_scalar-exercises']);
      
      // Try calling it
      try {
        window.ExerciseCarousel['checkAnswer_scalar-exercises'](0);
        console.log('Function called successfully');
        return 'Success';
      } catch (e) {
        console.log('Error calling function:', e.message);
        return `Error: ${e.message}`;
      }
    });

    console.log('Result:', result);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
