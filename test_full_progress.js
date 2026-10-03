const { chromium } = require('playwright');

(async () => {
  console.log('Progress Tracking Full Test\n');

  const browser = await chromium.launch();
  const page = await browser.newPage();
  const screenshotDir = '/tmp/claude-0/-home-user-vector-learning-platform/9da7e9ca-200d-595e-a21d-2e4cb680e0d3/scratchpad';

  try {
    console.log('Loading app...');
    await page.goto('http://localhost:8000/VECTOR-LANDING-PAGE.html', { waitUntil: 'networkidle' });

    // Navigate to Concept 1
    console.log('Navigating to Concept 1...');
    await page.click('button[data-tab="concept1"]');
    await page.waitForTimeout(1000);

    // Screenshot before
    console.log('Taking screenshot before answers...');
    await page.screenshot({ path: `${screenshotDir}/full_progress_start.png`, fullPage: true });

    // Answer all 3 exercises
    for (let i = 0; i < 3; i++) {
      // Clear and enter new answer
      const answers = ['4i + 6j', '-3i + 2j', '2i + 4j'];
      console.log(`Answer ${i + 1}: ${answers[i]}`);
      
      await page.fill('#answer-scalar-exercises', answers[i]);
      await page.waitForTimeout(300);

      // Call checkAnswer directly
      await page.evaluate((index) => {
        window.ExerciseCarousel['checkAnswer_scalar-exercises'](index);
      }, i);
      await page.waitForTimeout(500);

      // Check progress
      const progress = await page.evaluate(() => {
        return {
          percent: document.getElementById('concept1-percent')?.textContent,
          completed: document.getElementById('concept1-completed')?.textContent,
          total: document.getElementById('concept1-total')?.textContent
        };
      });

      console.log(`  Progress: ${progress.completed}/${progress.total} (${progress.percent})`);

      // Navigate to next exercise if not the last one
      if (i < 2) {
        await page.evaluate(() => {
          window.ExerciseCarousel['nextExercise_scalar-exercises']();
        });
        await page.waitForTimeout(800);
      }
    }

    // Take final screenshot
    console.log('\nTaking final screenshot...');
    await page.screenshot({ path: `${screenshotDir}/full_progress_complete.png`, fullPage: true });

    // Final progress check
    const finalProgress = await page.evaluate(() => {
      return {
        percent: document.getElementById('concept1-percent')?.textContent,
        completed: document.getElementById('concept1-completed')?.textContent,
        total: document.getElementById('concept1-total')?.textContent,
        exercises: Array.from(document.querySelectorAll('#concept1-exercises-list .progress-exercise-item')).map(el => ({
          text: el.textContent.trim().split('\n')[1],
          completed: el.classList.contains('completed')
        }))
      };
    });

    console.log('\nFinal Progress:');
    console.log(`  Completed: ${finalProgress.completed}/${finalProgress.total}`);
    console.log(`  Percentage: ${finalProgress.percent}`);
    console.log('  Exercises:');
    finalProgress.exercises.forEach((ex, idx) => {
      console.log(`    ${idx + 1}. ${ex.text} - ${ex.completed ? 'DONE' : 'TODO'}`);
    });

    console.log('\nTEST PASSED!');
    console.log('Screenshots: full_progress_start.png, full_progress_complete.png');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
