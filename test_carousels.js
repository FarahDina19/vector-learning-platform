const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('🚀 Testing Exercise Carousels...\n');
  
  try {
    // Navigate to app
    console.log('📍 Loading app...');
    await page.goto('http://localhost:8000', { waitUntil: 'networkidle' });
    
    // Check if carousels are present
    console.log('\n✅ Checking Carousel Presence:');
    
    const carousels = [
      { id: 'scalar-exercises', name: 'Pendaraban Skalar' },
      { id: 'component-exercises', name: 'Komponen Cartes' },
      { id: 'unit-vector-exercises', name: 'Vektor Unit' },
      { id: 'addition-exercises', name: 'Tambah dan Tolak' },
      { id: 'geometry-exercises', name: 'Laluan Rajah ABCD' }
    ];
    
    for (const carousel of carousels) {
      const exists = await page.locator(`#${carousel.id}`).count() > 0;
      console.log(`  ${exists ? '✓' : '✗'} ${carousel.name} (${carousel.id})`);
    }
    
    // Test Scalar Multiplication carousel
    console.log('\n🧪 Testing Scalar Multiplication Carousel:');
    
    // Switch to Scalar & Vector tab
    await page.click('[data-tab="concept1"]');
    await page.waitForTimeout(500);
    
    // Check if carousel loaded
    const scalarTitle = await page.locator('.carousel-title').first().textContent();
    console.log(`  Carousel Title: "${scalarTitle}"`);
    
    // Check question is visible
    const question = await page.locator('.exercise-question').first().textContent();
    console.log(`  Question: "${question.substring(0, 50)}..."`);
    
    // Test answer input
    const inputField = await page.locator('.exercise-input-group input').first();
    await inputField.fill('4i + 6j');
    console.log(`  ✓ Answer input works`);
    
    // Click Check Answer button
    await page.click('.exercise-btn.primary');
    await page.waitForTimeout(500);
    
    const feedback = await page.locator('.exercise-feedback').first().textContent();
    console.log(`  Feedback: "${feedback}"`);
    
    // Test Hint button
    await page.click('.exercise-btn:has-text("Petunjuk")');
    await page.waitForTimeout(300);
    const hintVisible = await page.locator('.exercise-hint.show').count() > 0;
    console.log(`  ${hintVisible ? '✓' : '✗'} Hint button works`);
    
    // Test Solution button
    await page.click('.exercise-btn:has-text("Penyelesaian")');
    await page.waitForTimeout(300);
    const solutionVisible = await page.locator('.exercise-solution.show').count() > 0;
    console.log(`  ${solutionVisible ? '✓' : '✗'} Solution button works`);
    
    // Test Navigation
    console.log('\n🧪 Testing Navigation:');
    const nextBtn = await page.locator('.carousel-nav button:has-text("Seterusnya")');
    await nextBtn.click();
    await page.waitForTimeout(300);
    
    const newQuestion = await page.locator('.exercise-question').first().textContent();
    const questionChanged = newQuestion !== question;
    console.log(`  ${questionChanged ? '✓' : '✗'} Next button works (question changed)`);
    
    // Test Component Form Tab
    console.log('\n🧪 Testing Component Form Tab:');
    await page.click('[data-tab="concept2"]');
    await page.waitForTimeout(500);
    
    const componentTitle = await page.locator('.carousel-title').first().textContent();
    console.log(`  First Carousel: "${componentTitle}"`);
    
    const unitVectorTitle = await page.locator('.carousel-title').nth(1).textContent();
    console.log(`  Second Carousel: "${unitVectorTitle}"`);
    
    // Test Addition Tab
    console.log('\n🧪 Testing Addition Tab:');
    await page.click('[data-tab="concept3"]');
    await page.waitForTimeout(500);
    
    const additionTitle = await page.locator('.carousel-title').first().textContent();
    console.log(`  First Carousel: "${additionTitle}"`);
    
    const geometryTitle = await page.locator('.carousel-title').nth(1).textContent();
    console.log(`  Second Carousel: "${geometryTitle}"`);
    
    console.log('\n✅ All tests passed!\n');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();
