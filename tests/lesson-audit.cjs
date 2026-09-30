require('fs').mkdirSync('tmp', {recursive:true});
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const {pathToFileURL}=require('url');const path=require('path');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});const page=await browser.newPage({viewport:{width:1280,height:950}});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(pathToFileURL(path.resolve('VECTOR-LANDING-PAGE.html')).href);
 const result=await page.evaluate(()=>{
  const assert=(v,m)=>{if(!v)throw Error(m)};const near=(x,y)=>Math.abs(x-y)<1e-8;
  for(const args of [[4,5,2],[3,6,2]]){const g=VectorExtensions.geometry(...args);const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);assert(near(cross(g.A,g.C,g.E),0)&&near(cross(g.B,g.D,g.E),0),'E intersection');for(const t of ['DB','AC','CD']){const [x,y]=VectorExtensions.routeResult(...args,t);assert(near(g[t[1]][0]-g[t[0]][0],x+.3*y)&&near(g[t[1]][1]-g[t[0]][1],.6*y),'Oblique basis displacement '+t);}}
  const expected=[[-5,4],[2,4],[3,-4]];['DB','AC','CD'].forEach((t,i)=>assert(JSON.stringify(VectorExtensions.routeResult(4,5,2,t))===JSON.stringify(expected[i]),'Original answer'));
  startPractice('examRoutes');const firstRoute=session.problem;assert(CATEGORY_CONFIG.examRoutes.total===6,'Route category has six questions');assert(firstRoute.answers.x===-5&&firstRoute.answers.y===4,'Figure 3 DB coefficients');assert(firstRoute.text.includes('Rajah 3')&&firstRoute.text.includes('AC dan BD ialah garis lurus yang bersilang di E')&&firstRoute.text.includes(VectorMath.math('4y'))&&firstRoute.text.includes(VectorMath.math('5x'))&&firstRoute.text.includes(VectorMath.math('2x')),'Exact Figure 3 DB wording and givens');assert(firstRoute.solution.includes('DB = DA + AB = −5x + 4y'),'Figure 3 DB solution');assert(firstRoute.hints.some(h=>h.includes('D → A → B')),'Figure 3 route hint');
  assert(document.getElementById('route-lesson').closest('#concept3'),'Route lesson is in Addition tab');assert(document.getElementById('route-progress').textContent.includes('D → A → B'),'Lesson identifies the DB route');
  document.getElementById('route-next').click();assert(document.getElementById('route-progress').textContent.includes('DA = −AD = −5x'),'Lesson explains reversing AD');assert(document.querySelector('#route-diagram path[data-edge="DA"]'),'Diagram reveals reversed DA');
  document.getElementById('route-next').click();assert(document.getElementById('route-progress').textContent.includes('DB = DA + AB'),'Lesson adds DA and AB');assert(document.querySelector('#route-diagram path[data-edge="AB"]'),'Diagram reveals AB');
  document.getElementById('route-next').click();assert(document.getElementById('route-progress').textContent.includes('DB = −5x + 4y'),'Lesson concludes with the Figure 3 answer');assert(document.querySelector('#route-diagram path[data-edge="DB"]'),'Diagram reveals direct DB vector');
  document.getElementById('route-reset').click();document.querySelector('#route-lesson > button').click();assert(session.category==='examRoutes'&&session.problem.answers.x===-5&&session.problem.answers.y===4,'Lesson practice button opens the exact first route question');
  for(let k=-2;k<=5;k++){const x=3*k-2,y=k-5,h=Math.hypot(x,y);assert(near(Math.hypot(x/h,y/h),1),'Unit magnitude');assert(x*x/h+y*y/h>0,'Same direction');document.getElementById('unit-k').value=k;document.getElementById('unit-k').dispatchEvent(new Event('input'));assert(!/NaN|Infinity/.test(document.getElementById('unit-lesson').innerHTML),'Finite unit chart');}
  document.getElementById('unit-original').click();
  let count=0;switchTab('practice');
  for(const cat of ['examRoutes','examUnit']){startPractice(cat);for(let i=0;i<6;i++){const p=session.problem;const fields=[...document.querySelectorAll('#answerArea input')];fields.forEach(el=>el.value='999');checkAnswer();assert(!session.answered,'Wrong answer rejected');fields[0].value='3abc';checkAnswer();assert(!session.answered,'Malformed answer rejected');showHint();assert(document.getElementById('hintBox').textContent.length>0,'Hints');fields.forEach(el=>el.value=Number(p.answers[el.dataset.key]).toFixed(el.dataset.key==='mag'?2:4));checkAnswer();assert(session.answered&&session.correct===i+1,'Correct answer '+cat+i);count++;nextQuestion();}assert(document.getElementById('practiceSummary').style.display==='block','Completed summary');}
  startPractice('examUnit');session.index=2;loadQuestion();showSolution();assert(document.getElementById('solutionBox').textContent.includes('101'),'Exact solution');
  return {newExercises:count,geometryCases:2,unitSliderStates:8};
 });
 await page.evaluate(()=>switchTab('concept3'));
 for(const target of ['DB','AC','CD']){await page.selectOption('#route-target',target);while(await page.locator('#route-next').isEnabled())await page.click('#route-next');await page.locator('#route-lesson').screenshot({path:`tmp/route-${target}.png`});}
 await page.evaluate(()=>switchTab('concept2'));await page.locator('#unit-lesson').screenshot({path:'tmp/unit-lesson.png'});
 await page.setViewportSize({width:390,height:844});
 for(const tab of ['concept1','concept2','concept3','practice']){await page.evaluate(t=>switchTab(t),tab);if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow '+tab);}
 await page.evaluate(()=>switchTab('concept3'));await page.locator('#route-lesson').screenshot({path:'tmp/route-mobile.png'});
 await page.evaluate(()=>switchTab('concept2'));await page.locator('#unit-lesson').screenshot({path:'tmp/unit-mobile.png'});
 if(errors.length)throw Error(errors.join('\n'));console.log(JSON.stringify({...result,pageErrors:errors}));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
