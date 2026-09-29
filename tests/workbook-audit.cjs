require('fs').mkdirSync('tmp', {recursive:true});
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const path = require('path');
const {pathToFileURL}=require('url');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:"msedge"});
 const page=await browser.newPage({viewport:{width:1280,height:900}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(path.resolve('VECTOR-LANDING-PAGE.html')).href);
 const assert=(v,m)=>{if(!v)throw Error(m);};
 assert(await page.locator('.vector-lab').count()===9,'labs mounted');
 await page.evaluate(()=>switchTab('concept1'));
 await page.locator('#concept1 .timeline').first().fill('100');
 assert((await page.locator('#concept1 .lab-equation').first().innerHTML()).includes('7.0 m'),'distance final');
 assert((await page.locator('#concept1 .lab-equation').first().innerHTML()).includes('1.0i'),'displacement final');
 await page.evaluate(()=>switchTab('concept2'));
 await page.locator('[aria-label="Komponen i"]').first().fill('-6');
 await page.locator('#concept2 .timeline').fill('100');
 await page.screenshot({path:'tmp/components-desktop.png',fullPage:true,animations:'disabled'});
 await page.evaluate(()=>switchTab('concept3'));
 await page.locator('[aria-label="Operasi vektor"]').selectOption('-1');
 await page.locator('#concept3 .timeline').fill('100');
 assert((await page.locator('#concept3 .lab-equation').first().innerHTML()).includes('1i + 1j'),'subtraction result');
 await page.locator('#concept3 [data-action="play"]').click();
 await page.waitForTimeout(250);
 await page.locator('#concept3 [data-action="play"]').click();
 const paused=await page.locator('#concept3 .timeline').inputValue();
 await page.waitForTimeout(150);
 assert(await page.locator('#concept3 .timeline').inputValue()===paused,'pause');
 const results=await page.evaluate(()=>{
  const out=[];switchTab('practice');
  for(const cat of ['bookComponents','bookScalar','bookOperations']){
   startPractice(cat);
   for(let index=0;index<CATEGORY_CONFIG[cat].total;index++){
    const p=session.problem;
    document.querySelectorAll('#answerArea .ans-input').forEach(i=>i.value=p.answers[i.dataset.key]);
    checkAnswer();if(!session.answered)throw Error('Answer failed '+cat+index);
    if(session.correct!==index+1)throw Error('Scoring failed '+cat+index);
    out.push({cat,index,answers:p.answers});nextQuestion();
   }
   if(document.getElementById('practiceSummary').style.display==='none')throw Error('Summary missing');
  }
  return out;
 });
 assert(results.length===14,'14 workbook exercises');
 await page.evaluate(()=>{switchTab('practice');backToMenu();startPractice('add');});
 assert(await page.locator('#answerArea .ans-input').count()===2,'original practice works');
 await page.setViewportSize({width:390,height:844});
 await page.evaluate(()=>switchTab('concept2'));
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),'mobile overflow');
 await page.screenshot({path:'tmp/components-mobile.png',fullPage:true,animations:'disabled'});
 assert(errors.length===0,errors.join('\n'));
 console.log(JSON.stringify({passed:true,workbookQuestions:results.length,consoleErrors:errors}));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});


