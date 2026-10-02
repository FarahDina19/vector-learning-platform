/* Enhanced MathML rendering with color-coded components and improved notation */
const VectorMathEnhanced = (() => {
  const escape = s => String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const names = new Set(['AB','BA','AC','CA','AD','DA','BC','CB','BD','DB','CD','DC','r_x','r_y','a','b','c','d','x','y','k','v','u','i','j','A','B','C','X','Y','R','OP','OB','OC','OD','OF','OG','OH','OQ','OR','kv','kx','ky','xi','yj','kB','F₁','F₂','θ','atan2','m','km','s','N','A_x','A_y','B_x','B_y','zero','r','h','kX','X_x','X_y','Y_x','Y_y']);
  const TOKEN_REGEX = /atan2|[A-Za-z]+(?:_[xy]|[₁₂])?|\d+(?:\.\d+)?|θ|[²³]|[+−\-×÷=≈≠<>∥√|()[\],/½]/g;
  const PART_REGEX = /atan2|[A-Za-z]+(?:_[xy]|[₁₂])?|\d+(?:\.\d+)?|θ|\s+|./gu;
  const MATH_CHECK = /[=+−×÷≈≠√²³/∥]/;
  const PART_CHECK = /^[+−\-×÷=≈≠<>∥√|()[\],/½²³]$/;

  function tokenize(text) {
    return text.match(TOKEN_REGEX)||[];
  }

  const row = s => `<mrow>${s}</mrow>`;

  function symbol(s) {
    // Color-coding for vector components
    if(s==='i')return `<mi mathvariant="bold-italic" style="color:#0066ff;">i</mi>`;
    if(s==='j')return `<mi mathvariant="bold-italic" style="color:#ff3333;">j</mi>`;
    if(s==='k')return `<mi mathvariant="bold-italic" style="color:#00aa00;">k</mi>`;

    if(s==='zero')return '<mn mathvariant="bold" style="color:#666;">0</mn>';
    if(/^[A-Za-z]_[xy]$/.test(s))return `<msub><mi mathvariant="bold-italic" style="color:#333;">${s[0]}</mi><mi style="color:#666;">${s[2]}</mi></msub>`;
    if(s==='F₁'||s==='F₂')return `<msub><mi mathvariant="bold-italic" style="color:#333;">F</mi><mn style="color:#666;">${s==='F₁'?1:2}</mn></msub>`;
    if(/^(?:O[A-Z]|[A-D][A-D])$/.test(s))return `<mover accent="true"><mi style="color:#333;">${s}</mi><mo stretchy="true">→</mo></mover>`;
    if(['m','km','s','h','N','atan2'].includes(s))return `<mi mathvariant="normal" style="color:#666;">${s}</mi>`;
    if(['kv','kx','ky','xi','yj','kB','kX'].includes(s))return row([...s].map(symbol).join(''));
    return `<mi${/^[abcuvrABCXYR]$/.test(s)?' mathvariant="bold-italic"':''} style="color:#333;">${escape(s)}</mi>`;
  }

  function markup(expression) {
    const tokens=tokenize(expression);
    let pos=0;
    function sequence(end) {
      let result='';
      while(pos<tokens.length&&tokens[pos]!==end)result+=factor();
      if(end&&tokens[pos]===end)pos++;
      return result;
    }
    function atom(){
      const t=tokens[pos++];
      if(t===undefined)return '<mrow/>';
      if(t==='('||t==='['){
        const close=t==='('?')':']';
        return row(`<mo>${t}</mo>${sequence(close)}<mo>${close}</mo>`);
      }
      if(t==='|')return row(`<mo>|</mo>${sequence('|')}<mo>|</mo>`);
      if(t==='√') {
        if(tokens[pos]==='('){pos++;return `<msqrt>${sequence(')')}</msqrt>`;}
        return `<msqrt>${atom()}</msqrt>`;
      }
      if(t==='½')return '<mfrac><mn>1</mn><mn>2</mn></mfrac>';
      if(/^\d/.test(t))return `<mn style="color:#0066cc;">${t}</mn>`;
      if(/^[A-Za-zθ]/.test(t))return symbol(t);
      return `<mo>${escape(t==='-'?'−':t)}</mo>`;
    }
    function factor(){
      let value=atom();
      if(tokens[pos]==='²'||tokens[pos]==='³'){
        value=`<msup>${value}<mn>${tokens[pos++]==='²'?2:3}</mn></msup>`;
      }
      if(tokens[pos]==='/'){
        pos++;
        value=`<mfrac>${value}${factor()}</mfrac>`;
      }
      return value;
    }
    return sequence();
  }

  function math(expression){
    return `<math xmlns="http://www.w3.org/1998/Math/MathML" aria-label="${escape(expression)}" style="font-size:1.1em;">${markup(expression)}</math>`;
  }

  function column(x,y){
    return `<math xmlns="http://www.w3.org/1998/Math/MathML" aria-label="Vektor lajur ${x}, ${y}"><mrow><mo stretchy="true">(</mo><mtable><mtr><mtd style="color:#0066ff;font-weight:bold;">${markup(String(x))}</mtd></mtr><mtr><mtd style="color:#ff3333;font-weight:bold;">${markup(String(y))}</mtd></mtr></mtable><mo stretchy="true">)</mo></mrow></math>`;
  }

  function enhancedFormula(title, formula, example) {
    return `
      <div style="background:#f9f9f9;border-left:4px solid #0066ff;padding:15px;margin:15px 0;border-radius:4px;">
        <div style="font-weight:bold;color:#0066ff;margin-bottom:8px;font-size:14px;">${title}</div>
        <div style="font-family:monospace;background:#fff;padding:10px;border-radius:3px;margin-bottom:10px;">
          ${math(formula)}
        </div>
        ${example ? `<div style="font-size:12px;color:#666;">Example: ${example}</div>` : ''}
      </div>
    `;
  }

  function textHTML(text){
    const parts=text.match(PART_REGEX)||[];
    let output='',run='';
    function flush(){
      if(!run)return;
      const trimmed=run.trim();
      const core=trimmed.replace(/^[,]+|[,]+$/g,'');
      const valid=core&&(MATH_CHECK.test(core)||/\b(?:i|j|v|u|kv|xi|yj|OP|A|B|C|X|Y|R|a|b|c)\b/.test(core));
      output+=valid?escape(run.slice(0,run.indexOf(core)))+math(core)+escape(run.slice(run.indexOf(core)+core.length)):escape(run);
      run='';
    }
    for(const part of parts){
      if(/^\s+$/.test(part)||names.has(part)||/^\d+(?:\.\d+)?$/.test(part)||PART_CHECK.test(part)){
        run+=part;
      }else{
        flush();
        output+=escape(part);
      }
    }
    flush();
    return output;
  }

  function render(root){
    if(!root)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[];
    while(walker.nextNode()){
      const n=walker.currentNode;
      if(!n.parentElement.closest('math,svg,script,style,button,select,option,textarea,output,.lab-kicker,.lab-slider,.lab-caption'))nodes.push(n);
    }
    for(const n of nodes){
      const html=textHTML(n.textContent);
      if(html.includes('<math')){
        const t=document.createElement('template');
        t.innerHTML=html;
        n.replaceWith(t.content);
      }
    }
  }

  return {math, column, render, textHTML, enhancedFormula};
})();

// Create aliases for backward compatibility
const VectorMath = VectorMathEnhanced;

// Export for use in Node/module environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VectorMathEnhanced;
}
