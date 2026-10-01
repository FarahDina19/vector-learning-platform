/* All Cartesian diagrams use one scale for both axes. Tick spacing adapts to range. */
function buildDiagramSVG(vectors) {
  const size=360,pad=48,plot=size-2*pad;
  const xs=[0],ys=[0];vectors.forEach(v=>{xs.push(v.ox,v.ox+v.dx);ys.push(v.oy,v.oy+v.dy);});
  const loX=Math.min(...xs),hiX=Math.max(...xs),loY=Math.min(...ys),hiY=Math.max(...ys);
  const raw=Math.max(hiX-loX,hiY-loY,4)/7;
  const power=10**Math.floor(Math.log10(raw));
  const step=[1,2,5,10].find(n=>n*power>=raw)*power;
  const span=Math.ceil((Math.max(hiX-loX,hiY-loY,4)+2*step)/step)*step;
  const minX=Math.floor((loX+hiX-span)/2/step)*step,minY=Math.floor((loY+hiY-span)/2/step)*step;
  const scale=plot/span,px=x=>pad+(x-minX)*scale,py=y=>size-pad-(y-minY)*scale;
  const num=n=>String(Number(n.toFixed(3)));
  const esc=s=>String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const gridPaths=[],axesLabels=[];
  for(let i=0;i<=Math.round(span/step);i++){
    const x=minX+i*step,y=minY+i*step;
    gridPaths.push(`<path d="M${px(x)} ${pad}V${size-pad} M${pad} ${py(y)}H${size-pad}" stroke="#e8e8e8" fill="none" stroke-width="0.5" opacity="0.6"/>`);
    if(Math.abs(x)>1e-8)axesLabels.push(`<text x="${px(x)}" y="${py(0)+19}" text-anchor="middle" font-size="12" font-weight="500">${num(x)}</text>`);
    if(Math.abs(y)>1e-8)axesLabels.push(`<text x="${px(0)-10}" y="${py(y)+5}" text-anchor="end" font-size="12" font-weight="500">${num(y)}</text>`);
  }
  const grid=gridPaths.join(''),axes=axesLabels.join('')+`<path d="M${pad} ${py(0)}H${size-pad+10}l-6 -3m6 3l-6 3 M${px(0)} ${size-pad}V${pad-10}l-3 6m3 -6l3 6" stroke="#333333" stroke-width="2.5" fill="none"/><text x="${size-pad+22}" y="${py(0)+5}" font-size="14" font-weight="bold" fill="#333">x</text><text x="${px(0)+10}" y="${pad-15}" font-size="14" font-weight="bold" fill="#333">y</text><text x="${px(0)-16}" y="${py(0)+19}" font-size="13" font-weight="bold" fill="#333">O</text>`;
  let lines='';
  const lineElements=[];
  vectors.forEach((v,index)=>{
    const color=VECTOR_COLORS[v.color]||VECTOR_COLORS.green;
    const x1=px(v.ox),y1=py(v.oy),x2=px(v.ox+v.dx),y2=py(v.oy+v.dy);
    const length=Math.hypot(x2-x1,y2-y1),angle=Math.atan2(y2-y1,x2-x1),head=Math.min(9,length*.4);
    const realMag=Math.hypot(v.dx,v.dy);
    if(length<1e-7){lineElements.push(`<circle cx="${x1}" cy="${y1}" r="4" fill="${color}"/><text x="${x1+8}" y="${y1-10}" fill="${color}" font-weight="bold">${esc(v.label ? v.label+' = 0' : '0')}</text>`);return;}
    lineElements.push(`<path data-vector="${index}" d="M${x1} ${y1}L${x2} ${y2}" stroke="${color}" stroke-width="2.8" ${v.dashed?'stroke-dasharray="5 4"':''} fill="none"/><path d="M${x2-head*Math.cos(angle-.45)} ${y2-head*Math.sin(angle-.45)}L${x2} ${y2}L${x2-head*Math.cos(angle+.45)} ${y2-head*Math.sin(angle+.45)}" stroke="${color}" stroke-width="2.8" fill="none"/>`);
    if(v.label){const lx=Math.max(pad+15,Math.min(size-pad-15,(x1+x2)/2+15)),ly=Math.max(25,Math.min(size-20,(y1+y2)/2-12-index*3));lineElements.push(`<text x="${lx}" y="${ly}" text-anchor="middle" fill="${color}" font-weight="bold" font-size="13" paint-order="stroke" stroke="white" stroke-width="4">${esc(v.label)}</text>`);if(realMag>0.1){const magLabel=realMag.toFixed(1);lineElements.push(`<text x="${lx}" y="${ly+16}" text-anchor="middle" fill="${color}" font-size="11" opacity="0.8" paint-order="stroke" stroke="white" stroke-width="3">|${esc(v.label)}|=${magLabel}</text>`);}}
  });
  lines=lineElements.join('');
  const description=vectors.map(v=>`${v.label||'Vector'}: (${num(v.ox)}, ${num(v.oy)}) to (${num(v.ox+v.dx)}, ${num(v.oy+v.dy)})`).join('; ');
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" style="max-width:100%;height:auto" role="img" aria-label="${esc(description)}"><title>${esc(description)}</title><g font-family="Cambria,serif" font-size="12">${grid}${axes}${lines}<text x="180" y="350" text-anchor="middle" fill="#3a3a3a" font-size="13" font-weight="bold">1 square = ${num(step)} unit · same scale for x and y</text></g></svg>`;
}
