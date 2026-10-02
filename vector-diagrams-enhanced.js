/* Enhanced: Component decomposition with improved labels, magnitude display, and color-coded annotations */
function drawComponentDecomposition(x, y, px, py, scale, color, label) {
  const x1=px(0), y1=py(0), x2=px(x), y2=py(y);
  const cornerSize=10;
  const ixEnd=px(x), iyEnd=py(y);
  const jxEnd=px(0), jyEnd=py(y);
  const absx=Math.abs(x), absy=Math.abs(y);
  const arrowSize=6;
  const magnitude = Math.hypot(x, y).toFixed(2);

  // Draw i-component (horizontal, BLUE color for i-direction)
  const iMid=(x1+ixEnd)/2;
  const iArrow=x>0
    ? `<path d="M${ixEnd-arrowSize} ${y2-arrowSize}L${ixEnd} ${y2}L${ixEnd-arrowSize} ${y2+arrowSize}" stroke="#0066ff" stroke-width="2" fill="none"/>`
    : `<path d="M${x1+arrowSize} ${y2-arrowSize}L${x1} ${y2}L${x1+arrowSize} ${y2+arrowSize}" stroke="#0066ff" stroke-width="2" fill="none"/>`;

  const iElements=[
    // i-component line with enhanced styling
    `<path d="M${x1} ${y2}L${ixEnd} ${y2}" stroke="#0066ff" stroke-width="2.5" stroke-dasharray="5 3" opacity="0.8" fill="none"/>`,
    iArrow,
    // i-component magnitude label with background
    `<rect x="${iMid-25}" y="${y2+8}" width="50" height="18" fill="white" stroke="#0066ff" stroke-width="1" opacity="0.9" rx="3"/>`,
    `<text x="${iMid}" y="${y2+20}" text-anchor="middle" font-size="12" font-weight="bold" fill="#0066ff">${x.toFixed(1)}i</text>`,
  ];

  // Draw j-component (vertical, RED color for j-direction)
  const jMid=(y1+y2)/2;
  const jArrow=y>0
    ? `<path d="M${ixEnd-arrowSize} ${y2-arrowSize}L${ixEnd} ${y2}L${ixEnd+arrowSize} ${y2-arrowSize}" stroke="#ff3333" stroke-width="2" fill="none"/>`
    : `<path d="M${ixEnd-arrowSize} ${y1+arrowSize}L${ixEnd} ${y1}L${ixEnd+arrowSize} ${y1+arrowSize}" stroke="#ff3333" stroke-width="2" fill="none"/>`;

  const jElements=[
    // j-component line with enhanced styling
    `<path d="M${ixEnd} ${y1}L${ixEnd} ${y2}" stroke="#ff3333" stroke-width="2.5" stroke-dasharray="5 3" opacity="0.8" fill="none"/>`,
    jArrow,
    // j-component magnitude label with background
    `<rect x="${ixEnd+8}" y="${jMid-9}" width="50" height="18" fill="white" stroke="#ff3333" stroke-width="1" opacity="0.9" rx="3"/>`,
    `<text x="${ixEnd+33}" y="${jMid+3}" text-anchor="middle" font-size="12" font-weight="bold" fill="#ff3333">${y.toFixed(1)}j</text>`,
  ];

  // Enhanced right-angle indicator (larger and more visible)
  const corner=`<g>
    <rect x="${ixEnd-cornerSize}" y="${y2-cornerSize}" width="${cornerSize}" height="${cornerSize}" stroke="#888" stroke-width="1.5" opacity="0.8" fill="none"/>
    <text x="${ixEnd-cornerSize/2-4}" y="${y2-cornerSize/2+4}" font-size="10" fill="#888" opacity="0.8">90°</text>
  </g>`;

  // Magnitude label on hypotenuse (if vector has length)
  let magnitudeLabel = '';
  if (Math.abs(x) > 0.1 || Math.abs(y) > 0.1) {
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    magnitudeLabel = `<g>
      <rect x="${midX-40}" y="${midY-22}" width="80" height="20" fill="#ffeb3b" stroke="#fbc02d" stroke-width="1.5" opacity="0.95" rx="4"/>
      <text x="${midX}" y="${midY-8}" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">|${label}| = ${magnitude}</text>
    </g>`;
  }

  return iElements.concat(jElements).concat([corner, magnitudeLabel]).join('');
}

/* Enhanced Cartesian diagram builder with improved styling, legend, and annotations */
function buildDiagramSVG(vectors) {
  const size=380, pad=50, plot=size-2*pad;
  const xs=[0], ys=[0];
  vectors.forEach(v=>{xs.push(v.ox,v.ox+v.dx);ys.push(v.oy,v.oy+v.dy);});
  const loX=Math.min(...xs), hiX=Math.max(...xs), loY=Math.min(...ys), hiY=Math.max(...ys);
  const raw=Math.max(hiX-loX,hiY-loY,4)/7;
  const power=10**Math.floor(Math.log10(raw));
  const step=[1,2,5,10].find(n=>n*power>=raw)*power;
  const span=Math.ceil((Math.max(hiX-loX,hiY-loY,4)+2*step)/step)*step;
  const minX=Math.floor((loX+hiX-span)/2/step)*step, minY=Math.floor((loY+hiY-span)/2/step)*step;
  const scale=plot/span, px=x=>pad+(x-minX)*scale, py=y=>size-pad-(y-minY)*scale;
  const num=n=>String(Number(n.toFixed(3)));
  const esc=s=>String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  const gridPaths=[], axesLabels=[];
  for(let i=0;i<=Math.round(span/step);i++){
    const x=minX+i*step, y=minY+i*step;
    // Enhanced grid styling
    const gridOpacity = Math.abs(x) < 0.1 || Math.abs(y) < 0.1 ? 0.3 : 0.15;
    gridPaths.push(`<path d="M${px(x)} ${pad}V${size-pad} M${pad} ${py(y)}H${size-pad}" stroke="#ddd" fill="none" stroke-width="0.8" opacity="${gridOpacity}"/>`);
    if(Math.abs(x)>1e-8)axesLabels.push(`<text x="${px(x)}" y="${py(0)+22}" text-anchor="middle" font-size="12" font-weight="600" fill="#0066ff">▼${num(x)}</text>`);
    if(Math.abs(y)>1e-8)axesLabels.push(`<text x="${px(0)-15}" y="${py(y)+5}" text-anchor="end" font-size="12" font-weight="600" fill="#ff3333">▶${num(y)}</text>`);
  }

  const grid=gridPaths.join('');

  // Enhanced axes with color-coding
  const axes=axesLabels.join('')+`
    <defs>
      <marker id="arrowhead-x" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
        <polygon points="0 0, 10 3, 0 6" fill="#0066ff"/>
      </marker>
      <marker id="arrowhead-y" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
        <polygon points="0 0, 10 3, 0 6" fill="#ff3333"/>
      </marker>
    </defs>
    <path d="M${pad} ${py(0)}H${size-pad+15}" stroke="#0066ff" stroke-width="3" fill="none" marker-end="url(#arrowhead-x)"/>
    <path d="M${px(0)} ${size-pad}V${pad-15}" stroke="#ff3333" stroke-width="3" fill="none" marker-end="url(#arrowhead-y)"/>
    <text x="${size-pad+25}" y="${py(0)+7}" font-size="15" font-weight="bold" fill="#0066ff">x (i)</text>
    <text x="${px(0)+8}" y="${pad-18}" font-size="15" font-weight="bold" fill="#ff3333">y (j)</text>
    <circle cx="${px(0)}" cy="${py(0)}" r="3" fill="#000"/>
    <text x="${px(0)-12}" y="${py(0)+20}" font-size="14" font-weight="bold" fill="#000">O</text>
  `;

  let lines='';
  const lineElements=[];
  const componentElements=[];

  // Draw component decomposition for vectors
  vectors.forEach((v)=>{
    if(v.showComponents && Math.hypot(v.dx,v.dy)>0.1){
      const color=v.color==='blue'?'#0066ff':v.color==='red'?'#ff3333':v.color==='green'?'#00aa00':'#dd00dd';
      componentElements.push(drawComponentDecomposition(v.dx,v.dy,px,py,scale,color,v.label));
    }
  });
  const components=componentElements.join('');

  // Draw vectors with enhanced styling
  vectors.forEach((v,index)=>{
    const colorMap={'blue':'#0066ff','red':'#ff3333','green':'#00aa00','purple':'#dd00dd'};
    const color=colorMap[v.color]||'#00aa00';
    const x1=px(v.ox), y1=py(v.oy), x2=px(v.ox+v.dx), y2=py(v.oy+v.dy);
    const length=Math.hypot(x2-x1,y2-y1), angle=Math.atan2(y2-y1,x2-x1), head=Math.min(10,length*.35);
    const realMag=Math.hypot(v.dx,v.dy);

    if(length<1e-7){
      lineElements.push(`<circle cx="${x1}" cy="${y1}" r="5" fill="${color}" opacity="0.7"/><text x="${x1+10}" y="${y1-12}" fill="${color}" font-weight="bold" font-size="12">${esc(v.label ? v.label+' = 0' : '0')}</text>`);
      return;
    }

    // Enhanced vector arrow with thicker stroke
    const strokeWidth = v.dashed ? '2.5' : '3.2';
    lineElements.push(`<path data-vector="${index}" d="M${x1} ${y1}L${x2} ${y2}" stroke="${color}" stroke-width="${strokeWidth}" ${v.dashed?'stroke-dasharray="6 4"':''} fill="none" opacity="0.85"/><path d="M${x2-head*Math.cos(angle-.48)} ${y2-head*Math.sin(angle-.48)}L${x2} ${y2}L${x2-head*Math.cos(angle+.48)} ${y2-head*Math.sin(angle+.48)}" stroke="${color}" stroke-width="${strokeWidth}" fill="${color}" opacity="0.85"/>`);

    if(v.label){
      const lx=Math.max(pad+15,Math.min(size-pad-15,(x1+x2)/2+20)), ly=Math.max(35,Math.min(size-30,(y1+y2)/2-15-index*5));
      // Vector label box with background
      lineElements.push(`<rect x="${lx-35}" y="${ly-18}" width="70" height="22" fill="white" stroke="${color}" stroke-width="1.5" opacity="0.95" rx="3"/><text x="${lx}" y="${ly}" text-anchor="middle" fill="${color}" font-weight="bold" font-size="14">${esc(v.label)}</text>`);

      if(realMag>0.1){
        const magLabel=realMag.toFixed(2);
        lineElements.push(`<rect x="${lx-45}" y="${ly+12}" width="90" height="20" fill="white" stroke="${color}" stroke-width="1.5" opacity="0.95" rx="3"/><text x="${lx}" y="${ly+27}" text-anchor="middle" fill="${color}" font-size="11" font-weight="600">|${esc(v.label)}| = ${magLabel}</text>`);
      }
    }
  });

  lines=lineElements.join('');

  // Enhanced legend
  const legend = `
    <g>
      <rect x="10" y="${size-115}" width="140" height="110" fill="white" stroke="#ccc" stroke-width="1" opacity="0.98" rx="4"/>
      <text x="80" y="${size-102}" text-anchor="middle" font-size="12" font-weight="bold" fill="#333">LEGEND</text>
      <circle cx="20" cy="${size-83}" r="4" fill="#0066ff"/>
      <text x="30" y="${size-80}" font-size="11" fill="#333">i-direction</text>
      <circle cx="20" cy="${size-62}" r="4" fill="#ff3333"/>
      <text x="30" y="${size-59}" font-size="11" fill="#333">j-direction</text>
      <circle cx="20" cy="${size-41}" r="4" fill="#00aa00"/>
      <text x="30" y="${size-38}" font-size="11" fill="#333">Resultant</text>
      <circle cx="20" cy="${size-20}" r="4" fill="#dd00dd"/>
      <text x="30" y="${size-17}" font-size="11" fill="#333">Balance</text>
    </g>
  `;

  // Grid scale indicator
  const scaleInfo = `<text x="${size/2}" y="${size-8}" text-anchor="middle" fill="#888" font-size="12" font-weight="500">1 square = ${num(step)} unit | Equal scale (x=y)</text>`;

  const description=vectors.map(v=>`${v.label||'Vector'}: (${num(v.ox)}, ${num(v.oy)}) to (${num(v.ox+v.dx)}, ${num(v.oy+v.dy)})`).join('; ');

  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" style="max-width:100%;height:auto;background:#fafafa" role="img" aria-label="${esc(description)}"><title>${esc(description)}</title><g font-family="'Segoe UI','Helvetica',sans-serif" font-size="12">${grid}${axes}${components}${lines}${legend}${scaleInfo}</g></svg>`;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { buildDiagramSVG, drawComponentDecomposition };
}
