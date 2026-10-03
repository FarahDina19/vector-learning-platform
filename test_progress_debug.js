const { chromium } = require('playwright');

(async () => {
  console.log('🐛 Debugging Progress Tracking\n');

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Log console messages
  page.on('console', msg => {
    console.log(`[BROWSER] ${msg.type()}: ${msg.text()}`);
  });

  try {
    console.log('📱 Loading app...\n');
    await page.goto('http://localhost:8000/VECTOR-LANDING-PAGE.html', { waitUntil: 'networkidle' });

    // Navigate to Concept 1
    console.log('📍 Navigating to Concept 1...');
    await page.click('button[data-tab="concept1"]');
    await page.waitForTimeout(1000);

    // Check carousel initialization
    const carouselInfo = await page.evaluate(() => {
      return {
        carouselExists: document.getElementById('scalar-exercises') !== null,
        inputId: 'answer-scalar-exercises',
        inputExists: document.getElementById('answer-scalar-exercises') !== null,
        checkButtonExists: !!document.querySelector('#scalar-exercises button.exercise-btn.primary'),
        metadata: window.ExerciseCarousel?.getProgress?.() || 'Not available',
        concept1Total: document.getElementById('concept1-total')?.textContent,
        concept1Completed: document.getElementById('concept1-completed')?.textContent
      };
    });

    console.log('\n✅ Carousel Information:');
    console.log(`  Carousel exists: ${carouselInfo.carouselExists}`);
    console.log(`  Input element exists: ${carouselInfo.inputExists}`);
    console.log(`  Check button exists: ${carouselInfo.checkButtonExists}`);
    console.log(`  Progress metadata: ${JSON.stringify(carouselInfo.metadata)}`);
    console.log(`  Concept 1 progress - Completed: ${carouselInfo.concept1Completed}, Total: ${carouselInfo.concept1Total}`);

    if (carouselInfo.inputExists && carouselInfo.checkButtonExists) {
      // Scroll carousel into view
      await page.evaluate(() => {
        document.getElementById('scalar-exercises').scrollIntoView({ behavior: 'smooth' });
      });
      await page.waitForTimeout(800);

      // Enter answer
      console.log('\n📝 Entering answer...');
      await page.fill('#answer-scalar-exercises', '4i + 6j');

      // Check what the button looks like
      const buttonInfo = await page.evaluate(() => {
        const btn = document.querySelector('#scalar-exercises button.exercise-btn.primary');
        return {
          text: btn?.textContent,
          onclick: btn?.getAttribute('onclick'),
          isDisabled: btn?.disabled
        };
      });

      console.log(`  Button text: ${buttonInfo.text}`);
      console.log(`  Button onclick: ${buttonInfo.onclick}`);
      console.log(`  Button disabled: ${buttonInfo.isDisabled}`);

      // Check if function exists before clicking
      const functionExists = await page.evaluate(() => {
        return {
          checkAnswerExists: typeof window.ExerciseCarousel?.checkAnswer_scalar_exercises === 'function',
          allFunctions: Object.keys(window.ExerciseCarousel || {}).filter(k => k.startsWith('checkAnswer'))
        };
      });

      console.log(`\n🔍 Function Check:`);
      console.log(`  checkAnswer_scalar_exercises exists: ${functionExists.checkAnswerExists}`);
      console.log(`  Available functions: ${JSON.stringify(functionExists.allFunctions)}`);

      // Click button
      console.log('\n🖱️  Clicking check button...');
      await page.click('#scalar-exercises button.exercise-btn.primary');
      await page.waitForTimeout(500);

      // Check for feedback
      const feedbackInfo = await page.evaluate(() => {
        const feedback = document.getElementById('feedback-scalar-exercises');
        return {
          text: feedback?.textContent,
          visible: feedback?.style.display !== 'none',
          className: feedback?.className
        };
      });

      console.log(`\n✅ After Click:`);
      console.log(`  Feedback text: ${feedbackInfo.text}`);
      console.log(`  Feedback visible: ${feedbackInfo.visible}`);
      console.log(`  Feedback class: ${feedbackInfo.className}`);

      // Check progress after answer
      const progressAfter = await page.evaluate(() => {
        return {
          completed: document.getElementById('concept1-completed')?.textContent,
          total: document.getElementById('concept1-total')?.textContent,
          percent: document.getElementById('concept1-percent')?.textContent,
          metadata: window.ExerciseCarousel?.getProgress?.()
        };
      });

      console.log(`\n📊 Progress After Answer:`);
      console.log(`  Completed: ${progressAfter.completed}`);
      console.log(`  Total: ${progressAfter.total}`);
      console.log(`  Percent: ${progressAfter.percent}`);
      console.log(`  Metadata: ${JSON.stringify(progressAfter.metadata)}`);
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();
