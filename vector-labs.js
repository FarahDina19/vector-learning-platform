/* Concrete journeys and their mathematical representations share one timeline. */
(() => {
  const blue='#2f6fed', red='#c73c32', green='#227849';
  const labs=[];
  const config=[
    ['concept1','journey','Jarak atau sesaran?','Sebuah troli bergerak 4 m ke Timur, kemudian 3 m ke Barat. Perhatikan meter jarak dan anak panah sesaran.'],
    ['concept2','components','Dari lantai bengkel ke i dan j','Gerakkan troli pada petak lantai. Setiap petak mewakili 1 m. Ubah komponen untuk melihat arah dan panjang vektor berubah.'],
    ['concept3','operations','Sambungkan perjalanan, bina paduan','A = (3i + 2j) m dan B = (2i + j) m. Alihkan B ke hujung A tanpa mengubah panjang atau arahnya. Untuk menolak B, gunakan −B.'],
    ['concept1','scale','Skalar mengubah vektor','Satu gerakan asas ialah v = (2i + j) m. Pengganda k mengubah jarak; nilai negatif membalikkan arah.']
  ];
  function mount([tab,type,title,intro]) {
    const el=document.createElement('section'); el.className='vector-lab';
    el.innerHTML=`<div class="lab-kicker">Lihat • Gerakkan • Hubungkan</div><h3>${title}</h3><p class="lab-intro">${intro}</p><div class="lab-layout"><svg class="lab-diagram" viewBox="0 0 480 380" role="img" aria-label="${title}"></svg><div><div class="lab-settings"></div><div class="lab-equation"></div><p class="lab-caption" aria-live="polite"></p><div class="lab-controls"><button type="button" data-action="play">Main animasi</button><button type="button" data-action="step">Langkah +</button><button type="button" data-action="reset">Mula semula</button></div><label class="lab-slider">Kemajuan<input class="timeline" aria-label="Kemajuan animasi" type="range" min="0" max="100" value="0"><output>0%</output></label><small>Animasi bermula hanya apabila anda menekan Main. Gunakan peluncur untuk melihat setiap peringkat.</small></div></div>`;
    const host=document.getElementById(tab); host.insertBefore(el,host.querySelector('.cta-button'));
    const s={el,type,t:0,x:3,y:4,k:2,op:1,running:false,last:0}; labs.push(s);
    const settings=el.querySelector('.lab-settings');
    if(type==='components'||type==='scale') {
      const fields=type==='scale'?[['k','Pengganda',-3,3,0.5]]:[['x','Komponen i',-6,6,1],['y','Komponen j',-6,6,1]];
      fields.forEach(([key,label,min,max,step])=>{const row=document.createElement('label');row.className='lab-slider';row.innerHTML=`${label}<input aria-label="${label}" type="range" min="${min}" max="${max}" step="${step}" value="${s[key]}"><output>${s[key]}</output>`;settings.append(row);row.querySelector('input').oninput=e=>{stop(s);s[key]=Number(e.target.value);row.querySelector('output').textContent=s[key];draw(s);};});
    }
    if(type==='operations') {settings.innerHTML='<label>Operasi <select aria-label="Operasi vektor"><option value="1">A + B</option><option value="-1">A − B</option></select></label>';settings.querySelector('select').onchange=e=>{stop(s);s.op=Number(e.target.value);s.t=0;draw(s);};}
    el.querySelector('[data-action="play"]').onclick=()=>{if(s.running){stop(s);return;}if(s.t>=1)s.t=0;s.running=true;s.last=0;el.querySelector('[data-action="play"]').textContent='Jeda';s.frame=requestAnimationFrame(time=>tick(s,time));};
    el.querySelector('[data-action="step"]').onclick=()=>{stop(s);s.t=Math.min(1,s.t+0.25);draw(s);};
    el.querySelector('[data-action="reset"]').onclick=()=>{stop(s);s.t=0;draw(s);};
    el.querySelector('.timeline').oninput=e=>{stop(s);s.t=Number(e.target.value)/100;draw(s);}; draw(s);
  }
  function stop(s){cancelAnimationFrame(s.frame);s.running=false;s.el.querySelector('[data-action="play"]').textContent='Main animasi';}
  function tick(s,time){if(!s.running)return;if(document.hidden||!s.el.closest('.tab-content').classList.contains('active')){stop(s);return;}if(s.last)s.t=Math.min(1,s.t+(time-s.last)/6500);s.last=time;draw(s);if(s.t<1)s.frame=requestAnimationFrame(t=>tick(s,t));else stop(s);}
  function draw(s){
    const X=x=>240+x*22,Y=y=>190-y*22;
    let svg='<title>Diagram vektor berskala sama pada paksi x dan y</title>';
    for(let i=-7;i<=7;i++)svg+=`<path d="M${X(i)} 36V344 M86 ${Y(i)}H394" stroke="#e3ddd5" fill="none"/>`;
    svg+=`<path d="M80 190H407l-6 -3m6 3l-6 3 M240 344V24l-3 6m3 -6l3 6" stroke="#938477"/><text x="410" y="182" font-size="12">x</text><text x="249" y="22" font-size="12">y</text><text x="225" y="207" font-size="12">O</text>`;
    for(let i=-6;i<=6;i+=2)if(i)svg+=`<text x="${X(i)}" y="207" text-anchor="middle" font-size="11">${i}</text><text x="228" y="${Y(i)+4}" text-anchor="end" font-size="11">${i}</text>`;
    function arrow(a,b,c,d,color,label,dash=false){const x=X(a),y=Y(b),xx=X(c),yy=Y(d),ang=Math.atan2(yy-y,xx-x);svg+=`<path d="M${x} ${y}L${xx} ${yy}" stroke="${color}" stroke-width="3" data-from="${a},${b}" data-to="${c},${d}" ${dash?'stroke-dasharray="6 5"':''} fill="none"/>`;if(Math.hypot(xx-x,yy-y)>2)svg+=`<path d="M${xx-10*Math.cos(ang-.45)} ${yy-10*Math.sin(ang-.45)}L${xx} ${yy}L${xx-10*Math.cos(ang+.45)} ${yy-10*Math.sin(ang+.45)}" stroke="${color}" stroke-width="3" fill="none"/>`;if(Math.hypot(xx-x,yy-y)<=2)svg+=`<circle cx="${x}" cy="${y}" r="3" fill="${color}"/>`;if(label)svg+=`<text x="${(x+xx)/2+8}" y="${(y+yy)/2-12}" fill="${color}" font-size="14" font-weight="600">${label.replace(/i/g,'î').replace(/j/g,'ĵ')}</text>`;}
    let cx=0,cy=0,eq='',caption='';const t=s.t;
    if(s.type==='journey'){
      cx=t<=.5?8*t:4-6*(t-.5);arrow(0,0,4,0,blue,'4 m Timur',true);arrow(4,-1,1,-1,red,'3 m Barat',true);arrow(0,1.5,cx,1.5,green,'Sesaran');
      const distance=t<=.5?8*t:4+6*(t-.5);eq=`Jarak = ${distance.toFixed(1)} m<br>Sesaran = ${cx.toFixed(1)}i m`;
      caption=t<.5?'1. Troli bergerak ke Timur. Jarak dan magnitud sesaran bertambah bersama.':'2. Troli kembali ke Barat. Jarak terus bertambah tetapi sesaran berkurang. Akhir: jarak 7 m; sesaran 1 m ke Timur.';
    } else if(s.type==='components'){
      cx=s.x*Math.min(1,t*2);cy=s.y*Math.max(0,t*2-1);arrow(0,0,s.x,0,blue,`${s.x}i`,true);arrow(s.x,0,s.x,s.y,red,`${s.y}j`,true);arrow(0,0,cx,cy,green,t===1?'v':'r');
      eq=`Sasaran: v = (${fmtVector(s.x,s.y)}) m<br>Semasa: r ≈ (${fmtVector(cx,cy)}) m<br>|r| = √((${cx.toFixed(2)})² + (${cy.toFixed(2)})²) ≈ ${Math.hypot(cx,cy).toFixed(2)} m`;
      caption=t<.5?'1. Komponen i ialah gerakan mendatar: positif ke Timur, negatif ke Barat.':'2. Komponen j ialah gerakan menegak. Vektor r (hijau) menghubungkan tempat mula dan kedudukan semasa. Pada akhir, ia ialah vektor v.';
    } else if(s.type==='operations'){
      const bx=2*s.op,by=s.op;
      const rotation=s.op===-1?Math.min(1,t/.25)*Math.PI:0;
      const movingX=2*Math.cos(rotation)-Math.sin(rotation),movingY=2*Math.sin(rotation)+Math.cos(rotation);
      const shift=s.op===-1?Math.max(0,Math.min(1,(t-.25)/.35)):Math.min(1,t/.6);
      arrow(0,0,3,2,blue,'A');arrow(0,0,2,1,red,'B',true);
      arrow(3*shift,2*shift,3*shift+movingX,2*shift+movingY,red,s.op===1?'B':t<.25?'B diputar':'−B');
      const reveal=Math.max(0,(t-.6)/.4);if(reveal>0)arrow(0,0,(3+bx)*reveal,(2+by)*reveal,green,reveal>=1?'R':'R dibina');cx=(3+bx)*reveal;cy=(2+by)*reveal;
      eq=`Paduan akhir: R = A ${s.op===1?'+':'−'} B<br>= ((3 ${s.op===1?'+':'−'} 2)i + (2 ${s.op===1?'+':'−'} 1)j) m<br>= (${fmtVector(3+bx,2+by)}) m`;
      caption=s.op===-1&&t<.25?'1. Putar B sebanyak 180° untuk mendapatkan −B: magnitud kekal, arah bertentangan.':t<.6?'Alihkan vektor kedua ke hujung A. Panjang dan arahnya kekal semasa translasi.':'Bina anak panah paduan dari O ke hujung vektor kedua. R ialah sesaran akhir bagi dua perjalanan berturutan.';
    } else {
      const k=1+(s.k-1)*t;arrow(0,0,2,1,blue,'v',true);arrow(0,0,2*k,k,green,'kv');cx=2*k;cy=k;
      eq=`Pengganda sasaran: ${s.k}<br>Semasa: k = ${k.toFixed(2)}<br>kv ≈ (${fmtVector(2*k,k)}) m<br>|kv| = |k|√5 ≈ ${(Math.abs(k)*Math.sqrt(5)).toFixed(2)} m`;
      caption=`Pengganda semasa: ${k.toFixed(2)}. ${s.k<0?'Anak panah mengecil ke sifar, kemudian memanjang dalam arah bertentangan.':s.k===0?'Vektor menjadi vektor sifar; arah tidak ditentukan.':'Panjang berubah mengikut k; arah kekal bagi k positif.'}`;
    }
    if(s.type!=='operations')svg+=`<g transform="translate(${X(cx)},${Y(cy)})"><rect x="-10" y="-8" width="20" height="13" rx="3" fill="#5a4a42" stroke="white" stroke-width="2"/><circle cx="-6" cy="7" r="3" fill="#3d2817"/><circle cx="6" cy="7" r="3" fill="#3d2817"/></g>`;
    svg+=`<text x="240" y="370" text-anchor="middle" font-size="12" fill="#6b6159">1 petak = 1 m · Timur: +x · Utara: +y</text>`;
    s.el.querySelector('svg').innerHTML=svg;s.el.querySelector('.lab-equation').innerHTML=eq;VectorMath.render(s.el.querySelector('.lab-equation'));
    const cap=s.el.querySelector('.lab-caption');if(cap.textContent!==caption)cap.textContent=caption;
    s.el.querySelector('.timeline').value=Math.round(t*100);s.el.querySelector('.timeline + output').textContent=Math.round(t*100)+'%';
  }
  config.forEach(mount);

  // Verified selections from printed pages 78 and 82; original data retained.
  const points=[[3,4,'B',1],[6,3,'C',2],[-6,4,'F',4],[-5,3,'G',5],[5,-4,'Q',7],[7,-3,'R',8]];
  const operations=[['2b',[1,-4],2,[0,0],0,1],['3a',[2,5],3,[0,0],0,2],['½a',[2,5],.5,[0,0],0,4],['a + 3b',[2,5],1,[1,-4],3,5],['2a + b',[2,5],2,[1,-4],1,6],['b + c',[1,-4],1,[-3,7],1,7],['a − 3b',[2,5],1,[1,-4],-3,9],['4b − c',[1,-4],4,[-3,7],-1,10]];
  function question(x,y,text,tag,vectors,working){return {text,tag,diagram:buildDiagramSVG(vectors),inputsHTML:'<label>Komponen i <input class="ans-input" data-key="i" aria-label="Komponen i"></label> i + <label>Komponen j <input class="ans-input" data-key="j" aria-label="Komponen j"></label> j',answers:{i:x,j:y},hints:['Asingkan komponen mendatar dan menegak.',working],solution:`${working}\nJawapan: ${fmtVector(x,y)}`};}
  const componentQuestions=points.map(([x,y,name,n])=>question(x,y,`Setiap petak ialah 1 unit. Daripada diagram, ungkapkan O${name} dalam bentuk xi + yj.`, `UNIT 5 (latihan) • m.s. 78 / PDF 11 • 5.2 • Soalan ${n} • Diagram dilukis semula`,[{ox:0,oy:0,dx:x,dy:y,color:'green',label:'O'+name}],`Dari O: ${x} unit pada paksi x, ${y} unit pada paksi y.`));
  const operationQuestions=operations.map(([label,a,k,b,l,n])=>{const ax=a[0]*k,ay=a[1]*k,bx=b[0]*l,by=b[1]*l;return question(ax+bx,ay+by,`Diberi a = 2i + 5j, b = i − 4j dan c = −3i + 7j. Cari <strong>${label}</strong>.`, `UNIT 5 (latihan) • m.s. 82 / PDF 15 • 5.3.1 Task 1 (${n}) • Diagram bantuan ditambah`,[{ox:0,oy:0,dx:ax,dy:ay,color:'blue',label:'Pertama'},{ox:ax,oy:ay,dx:bx,dy:by,color:'red',label:l?'Kedua':''}],`Komponen i: (${k} × ${a[0]}) + (${l} × ${b[0]}) = ${ax+bx}. Komponen j: (${k} × ${a[1]}) + (${l} × ${b[1]}) = ${ay+by}.${n===7?" Nota pembetulan: jawapan bercetak bagi soalan 7 mempunyai kesilapan tanda; −4 + 7 = +3.":""}`);});
  const groups=[['bookComponents','Komponen Cartes',componentQuestions],['bookScalar','Pendaraban skalar',operationQuestions.slice(0,3)],['bookOperations','Tambah dan tolak',operationQuestions.slice(3)]];
  groups.forEach(([id,title,questions])=>{CATEGORY_CONFIG[id]={title:'Buku kerja · '+title,total:questions.length,isWorkbook:true,gen:()=>questions[session.index]};});
  const section=document.createElement('section');section.className='vector-lab';section.innerHTML='<div class="lab-kicker">NUM10192 · Latihan terpilih</div><h3>Dari animasi ke buku kerja</h3><p class="lab-intro">14 soalan daripada UNIT 5 (latihan), dengan semakan jawapan, petua dan penyelesaian. Komponen: m.s. 78 (PDF 11), soalan 1, 2, 4, 5, 7, 8. Pendaraban skalar: m.s. 82 (PDF 15), Task 1 soalan 1, 2, 4. Operasi: halaman sama, soalan 5, 6, 7, 9, 10. Masukkan jawapan pecahan sebagai perpuluhan (contoh: 5/2 = 2.5). Rujukan mengikut topik kerana penomboran bahagian buku dan aplikasi tidak semuanya sama.</p><div class="workbook-links"></div>';
  groups.forEach(([id,title,questions])=>{const button=document.createElement('button');button.textContent=`${title} · ${questions.length} soalan`;button.onclick=()=>{switchTab('practice');startPractice(id);};section.querySelector('.workbook-links').append(button);});document.getElementById('practiceMenu').prepend(section);
})();
