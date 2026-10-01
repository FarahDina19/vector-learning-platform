require('fs').mkdirSync('tmp', {recursive:true});
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const {pathToFileURL}=require('url');const path=require('path');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const page=await browser.newPage({viewport:{width:1280,height:950}});const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',message=>{if(message.type()==='error')errors.push('console: '+message.text());});
 await page.goto(pathToFileURL(path.resolve('VECTOR-LANDING-PAGE.html')).href);
 const results=await page.evaluate(()=>{
  const assert=(value,message)=>{if(!value)throw Error(message);};
  const near=(a,b)=>Math.abs(a-b)<1e-7;
  const EXPECTED_TABS=['intro','concept1','concept2','concept3','practice','resources'];
  const LEVELS=VectorExamples.LEVELS;
  assert(LEVELS.length===6,'Six difficulty levels');
  assert(LEVELS.map(l=>l.tier).join(',')==='easy,easy,medium,medium,hard,hard','Levels run easy to hard');

  // every existing example area keeps its original worked examples and gains one ladder
  for(const tab of EXPECTED_TABS){
   assert(document.querySelectorAll(`#${tab} .worked-examples li`).length>=2,'Original worked examples kept in '+tab);
   const ladders=document.querySelectorAll(`#${tab} .example-ladder`);
   assert(ladders.length===1,'Exactly one example ladder in '+tab);
   assert(ladders[0].previousElementSibling.classList.contains('worked-examples'),'Ladder follows the example area in '+tab);
  }
  assert(document.querySelectorAll('.example-ladder').length===6,'Six ladders overall');
  assert(document.querySelectorAll('.ex-card').length===36,'Thirty-six new interactive examples');
  assert(document.querySelectorAll('.vector-lab').length===9,'Existing labs untouched');
  const ids=[...document.querySelectorAll('[id]')].map(element=>element.id);
  assert(ids.length===new Set(ids).size,'No duplicate element ids');

  const fill=(card,answers)=>{
   card.querySelectorAll('.ex-answer [data-key]').forEach(element=>{
    const expected=answers[element.dataset.key];
    if(element.tagName==='SELECT')element.value=String(expected);
    else element.value=Number(expected).toFixed(Number(element.dataset.dp)||0);
   });
  };
  const spoil=(card,answers)=>{
   card.querySelectorAll('.ex-answer [data-key]').forEach(element=>{
    const expected=String(answers[element.dataset.key]);
    if(element.tagName==='SELECT'){element.value=[...element.options].map(o=>o.value).filter(v=>v!==''&&v!==expected)[0];}
    else element.value=String(Number(answers[element.dataset.key])+999);
   });
  };
  let checked=0,blockedStates=0,interactiveControls=0;
  for(const area of VectorExamples.AREAS){
   const section=document.getElementById('ladder-'+area.key);
   assert(section,'Ladder mounted for '+area.key);
   const cards=[...section.querySelectorAll('.ex-card')];
   assert(cards.length===6,'Six examples for '+area.key);
   cards.forEach((card,index)=>{
    const spec=area.examples[index];
    assert(card.querySelector('.ex-badge').textContent===LEVELS[index].label,'Visible level label '+card.id);
    assert(card.dataset.level===String(index+1)&&card.dataset.tier===LEVELS[index].tier,'Ordered difficulty metadata '+card.id);
    assert(card.querySelectorAll('.ex-answer [data-key]').length>0,'Answer inputs exist in '+card.id);
    assert((spec.controls||[]).length>0,'Interactive controls exist in '+card.id);
    card.querySelectorAll('.ex-answer [data-key]').forEach(element=>{
     const label=card.querySelector(`label[for="${element.id}"]`);
     assert(label&&label.textContent.trim().length>0,'Labelled answer field in '+card.id);
    });
    (spec.controls||[]).forEach(control=>{
     const input=card.querySelector(`[data-control="${control.key}"]`);
     assert(input,'Control '+control.key+' rendered in '+card.id);
     assert(card.querySelector(`label[for="${input.id}"]`),'Labelled control in '+card.id);
     interactiveControls++;
    });

    // sweep several control states, including the defaults
    for(let variant=0;variant<4;variant++){
     if(variant){
      (spec.controls||[]).forEach(control=>{
       const input=card.querySelector(`[data-control="${control.key}"]`);
       if(control.kind==='select'){const options=[...input.options];input.value=options[(variant+index)%options.length].value;}
       else{const count=Math.round((control.max-control.min)/control.step);input.value=String(control.min+((variant*3+index)%(count+1))*control.step);}
       input.dispatchEvent(new Event('input',{bubbles:true}));
       input.dispatchEvent(new Event('change',{bubbles:true}));
      });
     }
     const state=VectorExamples.readState(card);
     const visual=card.querySelector('.ex-visual').innerHTML;
     const readout=card.querySelector('.ex-readout').innerHTML;
     assert(!/NaN|Infinity|undefined/.test(visual+readout+card.querySelector('.ex-prompt').innerHTML),'Finite live output in '+card.id);
     card.querySelector('[data-act="hint"]').click();
     card.querySelector('[data-act="solution"]').click();
     if(card.querySelector('[data-act="check"]').disabled){blockedStates++;continue;}
     assert(card.querySelector('.ex-hint').textContent.length>10,'Hint shown in '+card.id);
     const solution=card.querySelector('.ex-solution');
     assert(!solution.hidden&&solution.textContent.length>10,'Solution shown in '+card.id);
     assert(!/NaN|Infinity|undefined/.test(solution.innerHTML),'Finite solution in '+card.id);
     const answers=spec.answers(state);
     spoil(card,answers);
     assert(VectorExamples.check(card,spec)===false,'Wrong answer rejected in '+card.id);
     const first=card.querySelector('.ex-answer [data-key]');
     if(first.tagName!=='SELECT'){first.value='3abc';assert(VectorExamples.check(card,spec)===false,'Malformed answer rejected in '+card.id);}
     fill(card,answers);
     assert(VectorExamples.check(card,spec)===true,'Correct answer accepted in '+card.id+' variant '+variant);
     assert(card.querySelector('.ex-feedback').dataset.state==='correct','Immediate feedback in '+card.id);
     checked++;
    }

    // reset restores the published defaults and clears the answer state
    card.querySelector('[data-act="reset"]').click();
    (spec.controls||[]).forEach(control=>{
     assert(card.querySelector(`[data-control="${control.key}"]`).value===String(control.value),'Reset restores '+control.key+' in '+card.id);
    });
    assert([...card.querySelectorAll('.ex-answer [data-key]')].every(element=>element.value===''),'Reset clears answers in '+card.id);
    assert(card.querySelector('.ex-hint').hidden&&card.querySelector('.ex-solution').hidden,'Reset hides help in '+card.id);
   });
  }

  // the zero-vector state of the unit-vector examples refuses a meaningless answer
  const zeroCard=document.getElementById('ex-component-5');
  ['x','y'].forEach(key=>{const input=zeroCard.querySelector(`[data-control="${key}"]`);input.value='0';input.dispatchEvent(new Event('input',{bubbles:true}));});
  assert(zeroCard.querySelector('[data-act="check"]').disabled,'Zero vector blocks checking');
  assert(zeroCard.querySelector('.ex-feedback').textContent.includes('tidak tertakrif'),'Zero vector is explained');
  assert(VectorExamples.check(zeroCard,VectorExamples.AREAS[2].examples[4])===false,'Zero vector answer never scores');
  zeroCard.querySelector('[data-act="reset"]').click();
  assert(!zeroCard.querySelector('[data-act="check"]').disabled,'Reset re-enables checking');
  blockedStates++;

  // independent mathematical spot checks against the shared helpers
  const introMag=VectorExamples.AREAS[0].examples[1];
  assert(near(introMag.answers({e:3,u:4}).mag,5),'Pythagorean displacement');
  const unit=VectorExamples.AREAS[2].examples[4].answers({x:10,y:-1});
  assert(near(Math.hypot(unit.ui,unit.uj),1),'Unit vector has magnitude one');
  const route=VectorExamples.AREAS[3].examples[5];
  for(const target of ['DB','AC','CD']){
   const [x,y]=VectorExtensions.routeResult(4,5,2,target);
   const got=route.answers({p:4,q:5,r:2,target});
   assert(got.x===x&&got.y===y,'Route ladder matches the existing route engine for '+target);
  }
  assert(route.answers({p:4,q:5,r:2,target:'DB'}).x===-5,'Figure 3 DB coefficient');
  const drill=VectorExamples.AREAS[4].examples[2].answers({k:4,bx:2,by:5});
  assert(drill.i===10&&drill.j===-1,'4a − b matches the printed worked example');
  const zeroK=VectorExamples.AREAS[4].examples[5].answers({ax:3,bx:2,by:5});
  assert(near(zeroK.k,2/3)&&near(zeroK.j,2/3-5),'Eliminating the i component');

  // the practice engine and its workbook categories still behave
  switchTab('practice');startPractice('examRoutes');
  assert(session.problem.answers.x===-5&&session.problem.answers.y===4,'Existing practice engine intact');
  return {ladders:6,newExamples:36,verifiedStates:checked,blockedZeroVectorStates:blockedStates,controls:interactiveControls};
 });

 for(const tab of ['intro','concept1','concept2','concept3','practice','resources']){
  await page.evaluate(name=>switchTab(name),tab);
  await page.locator(`#${tab} .example-ladder`).screenshot({path:`tmp/ladder-${tab}.png`});
 }
 await page.setViewportSize({width:390,height:844});
 for(const tab of ['intro','concept1','concept2','concept3','practice','resources']){
  await page.evaluate(name=>switchTab(name),tab);
  if(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth))throw Error('Mobile overflow '+tab);
 }
 await page.evaluate(()=>switchTab('concept2'));
 await page.locator('#ladder-component').screenshot({path:'tmp/ladder-mobile.png'});

 // keyboard reachability of the controls and actions of one card
 await page.evaluate(()=>switchTab('concept3'));
 await page.focus('#ex-addition-1 [data-control="ax"]');
 const reachable=await page.evaluate(async()=>{
  const card=document.getElementById('ex-addition-1');
  const focusable=[...card.querySelectorAll('input,select,button')];
  return focusable.every(element=>element.tabIndex>=0&&!element.hasAttribute('aria-hidden'));
 });
 if(!reachable)throw Error('Example controls are not keyboard reachable');
 await page.keyboard.press('ArrowRight');
 const moved=await page.evaluate(()=>document.querySelector('#ex-addition-1 [data-control="ax"]').value);
 if(moved!=='4')throw Error('Slider does not respond to the keyboard, got '+moved);

 if(errors.length)throw Error(errors.join('\n'));
 console.log(JSON.stringify({...results,pageErrors:errors}));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
