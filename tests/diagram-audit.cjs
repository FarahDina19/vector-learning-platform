require('fs').mkdirSync('tmp', {recursive:true});
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const {pathToFileURL}=require('url');const path=require('path');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const page=await browser.newPage({viewport:{width:1280,height:950}});const errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.goto(pathToFileURL(path.resolve('VECTOR-LANDING-PAGE.html')).href);
 const results=await page.evaluate(()=>{
  const assert=(v,m)=>{if(!v)throw Error(m);};const near=(a,b)=>Math.abs(a-b)<1e-7;
  let captured=[];const original=buildDiagramSVG;buildDiagramSVG=v=>{captured=v;return original(v);};
  let checked=0;
  for(const type of ['express','add','equality','scalar','realworld'])for(const difficulty of ['easy','medium','hard'])for(let sample=0;sample<150;sample++){
   const q=GENERATORS[type](difficulty),v=captured;
   if(type==='equality'){
    const [a,b]=v;const expected=near(a.dx,b.dx)&&near(a.dy,b.dy)?'equal':near(a.dx*b.dy,a.dy*b.dx)?'parallel':'notequal';
    assert(q.answers.choice===expected,'Equality classification');
   }else if(type==='scalar'&&difficulty==='hard'){
    const target=Number(q.text.match(/\|kv\| = ([\d.]+)/)[1]);assert(near(Math.hypot(v[0].dx,v[0].dy)*q.answers.k,target),'Scalar magnitude');
   }else{
    const result=v[v.length-1];assert(near(q.answers.i,result.dx)&&near(q.answers.j,result.dy),'Components '+type);
    if(q.answers.mag!==undefined)assert(Math.abs(q.answers.mag-Math.hypot(result.dx,result.dy))<=.0051,'Magnitude');
    if(type==='add')assert(near(v[0].dx+v[1].dx,result.dx)&&near(v[0].dy+v[1].dy,result.dy),'Resultant');
   }
   assert(!/NaN|Infinity/.test(q.diagram),'Invalid diagram');
   const svg=new DOMParser().parseFromString(q.diagram,'image/svg+xml');let scales=[];
   v.forEach((item,i)=>{
    const arrow=svg.querySelector('[data-vector="'+i+'"]');
    if(Math.hypot(item.dx,item.dy)<1e-8){assert(!arrow,'Zero vector arrow');return;}
    assert(arrow,'Missing vector');const xy=arrow.getAttribute('d').match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi).map(Number);
    assert(xy.every(n=>n>=48-1e-7&&n<=312+1e-7),'Endpoint outside plot');
    if(item.dx)scales.push((xy[2]-xy[0])/item.dx);if(item.dy)scales.push(-(xy[3]-xy[1])/item.dy);
    const head=arrow.nextElementSibling.getAttribute('d').match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi).map(Number);
    assert(near(head[2],xy[2])&&near(head[3],xy[3]),'Arrowhead at endpoint');
   });assert(scales.every(n=>n>0&&near(n,scales[0])),'Uniform Cartesian scale');checked++;
  }
  buildDiagramSVG=original;
  const zero=new DOMParser().parseFromString(buildDiagramSVG([{ox:0,oy:0,dx:0,dy:0,color:'green',label:'R'}]),'image/svg+xml');
  assert(zero.querySelectorAll('[data-vector]').length===0,'Zero has no arrow');
  assert(document.querySelectorAll('math msqrt').length>0,'Radical');assert(document.querySelectorAll('math mfrac').length>0,'Fractions');assert(document.querySelectorAll('math mtable').length>=1,'Column vector');
  switchTab('practice');startPractice('bookComponents');
  const inputs=document.querySelectorAll('#answerArea input');inputs[0].value='3abc';inputs[1].value='4';checkAnswer();assert(!session.answered,'Malformed answer accepted');
  inputs[0].value='3.05';checkAnswer();assert(!session.answered,'Inexact component accepted');
  inputs[0].value='3';checkAnswer();assert(session.answered,'Correct answer rejected');
  return {generatedProblems:checked,mathElements:document.querySelectorAll('math').length};
 });
 for(const tab of ['concept1','concept2','concept3','resources']){
  await page.evaluate(t=>switchTab(t),tab);
  for(const range of await page.locator('#'+tab+' .timeline').all())await range.fill('100');
  await page.screenshot({path:`tmp/audit-${tab}.png`,fullPage:true,animations:'disabled'});
 }
 await page.evaluate(()=>{switchTab('practice');startPractice('bookOperations');showHint();showSolution();});
 await page.screenshot({path:'tmp/audit-practice.png',fullPage:true,animations:'disabled'});
 await page.setViewportSize({width:390,height:844});
 for(const tab of ['concept1','concept2','concept3','practice','resources']){
  await page.evaluate(t=>switchTab(t),tab);
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Mobile overflow '+tab);
 }
 await page.evaluate(()=>switchTab('concept2'));
 await page.screenshot({path:'tmp/audit-mobile.png',fullPage:true,animations:'disabled'});
 if(errors.length)throw Error(errors.join('\n'));console.log(JSON.stringify({...results,consoleErrors:errors,mobileTabsChecked:5}));await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
