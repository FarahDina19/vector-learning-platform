/* Offline, native MathML for the finite notation used by this lesson. */
const VectorMath = (() => {
  const escape = s => String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const names = new Set(['AB','BA','AC','CA','AD','DA','BC','CB','BD','DB','CD','DC','r_x','r_y','a','b','c','d','x','y','k','v','u','i','j','A','B','C','X','Y','R','OP','OB','OC','OD','OF','OG','OH','OQ','OR','kv','kx','ky','xi','yj','kB','F₁','F₂','θ','atan2','m','km','s','N','A_x','A_y','B_x','B_y','zero','r','h','kX','X_x','X_y','Y_x','Y_y']);
  function tokenize(text) {
    return text.match(/atan2|[A-Za-z]+(?:_[xy]|[₁₂])?|\d+(?:\.\d+)?|θ|[²³]|[+−\-×÷=≈≠<>∥√|()[\],/½]/g)||[];
  }
  const row = s => `<mrow>${s}</mrow>`;
  function symbol(s) {
    if(s==='zero')return '<mn mathvariant="bold">0</mn>';
    if(/^[A-Za-z]_[xy]$/.test(s))return `<msub><mi mathvariant="bold-italic">${s[0]}</mi><mi>${s[2]}</mi></msub>`;
    if(s==='F₁'||s==='F₂')return `<msub><mi mathvariant="bold-italic">F</mi><mn>${s==='F₁'?1:2}</mn></msub>`;
    if(s==='i'||s==='j')return `<mover accent="true"><mi>${s}</mi><mo>^</mo></mover>`;
    if(/^(?:O[A-Z]|[A-D][A-D])$/.test(s))return `<mover accent="true"><mi>${s}</mi><mo stretchy="true">→</mo></mover>`;
    if(['m','km','s','h','N','atan2'].includes(s))return `<mi mathvariant="normal">${s}</mi>`;
    if(['kv','kx','ky','xi','yj','kB','kX'].includes(s))return row([...s].map(symbol).join(''));
    return `<mi${/^[abcuvrABCXYR]$/.test(s)?' mathvariant="bold-italic"':''}>${escape(s)}</mi>`;
  }
  function markup(expression) {
    const tokens=tokenize(expression);let pos=0;
    function sequence(end) {let result='';while(pos<tokens.length&&tokens[pos]!==end)result+=factor();if(end&&tokens[pos]===end)pos++;return result;}
    function atom(){const t=tokens[pos++];if(t===undefined)return '<mrow/>';
      if(t==='('||t==='['){const close=t==='('?')':']';return row(`<mo>${t}</mo>${sequence(close)}<mo>${close}</mo>`);}
      if(t==='|')return row(`<mo>|</mo>${sequence('|')}<mo>|</mo>`);
      if(t==='√') {if(tokens[pos]==='('){pos++;return `<msqrt>${sequence(')')}</msqrt>`;}return `<msqrt>${atom()}</msqrt>`;}
      if(t==='½')return '<mfrac><mn>1</mn><mn>2</mn></mfrac>';
      if(/^\d/.test(t))return `<mn>${t}</mn>`;
      if(/^[A-Za-zθ]/.test(t))return symbol(t);
      return `<mo>${escape(t==='-'?'−':t)}</mo>`;
    }
    function factor(){let value=atom();if(tokens[pos]==='²'||tokens[pos]==='³'){value=`<msup>${value}<mn>${tokens[pos++]==='²'?2:3}</mn></msup>`;}if(tokens[pos]==='/'){pos++;value=`<mfrac>${value}${factor()}</mfrac>`;}return value;}
    return sequence();
  }
  function math(expression){return `<math xmlns="http://www.w3.org/1998/Math/MathML" aria-label="${escape(expression)}">${markup(expression)}</math>`;}
  function column(x,y){return `<math xmlns="http://www.w3.org/1998/Math/MathML" aria-label="Vektor lajur ${x}, ${y}"><mrow><mo stretchy="true">(</mo><mtable><mtr><mtd>${markup(String(x))}</mtd></mtr><mtr><mtd>${markup(String(y))}</mtd></mtr></mtable><mo stretchy="true">)</mo></mrow></math>`;}
  // Token runs stop at prose. No HTML, SVG labels, controls or source code are parsed.
  function textHTML(text){
    const parts=text.match(/atan2|[A-Za-z]+(?:_[xy]|[₁₂])?|\d+(?:\.\d+)?|θ|\s+|./gu)||[];
    let output='',run='';
    function flush(){if(!run)return;const trimmed=run.trim();const core=trimmed.replace(/^[,]+|[,]+$/g,'');
      const valid=core&&(/[=+−×÷≈≠√²³/∥]|\b(?:i|j|v|u|kv|xi|yj|OP|A|B|C|X|Y|R|a|b|c)\b/.test(core));
      output+=valid?escape(run.slice(0,run.indexOf(core)))+math(core)+escape(run.slice(run.indexOf(core)+core.length)):escape(run);run='';}
    for(const part of parts){if(/^\s+$/.test(part)||names.has(part)||/^\d+(?:\.\d+)?$/.test(part)||/^[+−\-×÷=≈≠<>∥√|()[\],/½²³]$/.test(part)){run+=part;}else{flush();output+=escape(part);}}flush();return output;
  }
  function render(root){if(!root)return;const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode()){const n=walker.currentNode;if(!n.parentElement.closest('math,svg,script,style,button,select,option,textarea,output,.lab-kicker,.lab-slider,.lab-caption'))nodes.push(n);}for(const n of nodes){const html=textHTML(n.textContent);if(html.includes('<math')){const t=document.createElement('template');t.innerHTML=html;n.replaceWith(t.content);}}}
  return {math,column,render,textHTML};
})();
