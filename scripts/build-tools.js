#!/usr/bin/env node
// Generates each /tools/*.html page from the TOOLS spec below.
// Run: node scripts/build-tools.js
const fs = require("fs");
const path = require("path");

const OUT_DIR = path.join(__dirname, "..", "public", "tools");

function layout({ title, description, body, script, extraHead = "" }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} — ToolForge</title>
<meta name="description" content="${description}">
<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2222%22 fill=%22%237c5cff%22/></svg>">
<link rel="stylesheet" href="/style.css">
${extraHead}
</head>
<body>
<header class="site">
  <div class="wrap nav">
    <a class="brand" href="/"><span class="dot"></span>ToolForge</a>
    <nav class="navlinks">
      <a href="/tools/">Tools</a>
      <a href="/pricing.html">Pricing</a>
      <a href="/blog/">Blog</a>
    </nav>
    <a class="btn btn-primary" href="/pricing.html">Get Pro</a>
  </div>
</header>

<div class="tool-header wrap">
  <h1>${title}</h1>
  <p class="sub">${description}</p>
</div>

<section style="padding-top:12px">
  <div class="wrap">
    <div class="tool-panel">
${body}
    </div>
    <p style="text-align:center;margin-top:22px"><a href="/tools/">← Back to all tools</a></p>
  </div>
</section>

<section>
  <div class="wrap"><div class="ad-slot">Ad space — reserved for sponsor placements (728×90)</div></div>
</section>

<footer>
  <div class="wrap footer-grid">
    <div><span class="brand"><span class="dot"></span>ToolForge</span></div>
    <div><a href="/tools/">Tools</a></div>
    <div><a href="/pricing.html">Pricing</a></div>
    <div><a href="/blog/">Blog</a></div>
    <div>© 2026 ToolForge</div>
  </div>
</footer>
<script>
${script}
</script>
</body>
</html>
`;
}

const TOOLS = [
  {
    slug: "qr-generator",
    title: "QR Code Generator",
    description: "Turn any link or text into a downloadable QR code, instantly.",
    body: `
      <label for="qr-text">Text or URL</label>
      <input id="qr-text" type="text" placeholder="https://example.com" value="https://toolforge.app">
      <label for="qr-size">Size (px)</label>
      <select id="qr-size"><option>200</option><option selected>300</option><option>400</option><option>600</option></select>
      <div class="tool-out" style="text-align:center">
        <canvas id="qr-canvas" width="300" height="300" style="background:#fff;border-radius:8px;margin-top:10px"></canvas>
        <div style="margin-top:14px"><a id="qr-download" class="btn btn-primary" download="qrcode.png">Download PNG</a></div>
      </div>`,
    extraHead: `<script src="/vendor/qrcode.min.js"></script>`,
    script: `
      const textEl = document.getElementById('qr-text');
      const sizeEl = document.getElementById('qr-size');
      const canvas = document.getElementById('qr-canvas');
      const dl = document.getElementById('qr-download');
      function render(){
        const text = textEl.value || ' ';
        const size = parseInt(sizeEl.value,10);
        const qr = qrcode(0, 'M'); // type 0 = auto-detect smallest version
        qr.addData(text);
        qr.make();
        const count = qr.getModuleCount();
        const cell = Math.floor(size / count);
        const pixelSize = cell * count;
        canvas.width = pixelSize; canvas.height = pixelSize;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, pixelSize, pixelSize);
        ctx.fillStyle = '#111';
        for (let row = 0; row < count; row++) {
          for (let col = 0; col < count; col++) {
            if (qr.isDark(row, col)) ctx.fillRect(col * cell, row * cell, cell, cell);
          }
        }
        dl.href = canvas.toDataURL('image/png');
      }
      textEl.addEventListener('input', render);
      sizeEl.addEventListener('change', render);
      render();
    `,
  },
  {
    slug: "password-generator",
    title: "Password Generator",
    description: "Generate strong, random passwords with the rules you choose.",
    body: `
      <label for="pw-length">Length: <span id="pw-length-val">16</span></label>
      <input id="pw-length" type="range" min="6" max="64" value="16" style="width:100%">
      <label><input type="checkbox" id="pw-upper" checked> Uppercase (A-Z)</label>
      <label><input type="checkbox" id="pw-lower" checked> Lowercase (a-z)</label>
      <label><input type="checkbox" id="pw-num" checked> Numbers (0-9)</label>
      <label><input type="checkbox" id="pw-sym" checked> Symbols (!@#...)</label>
      <div class="tool-out">
        <input id="pw-out" type="text" readonly style="font-family:monospace;font-size:1.1rem">
        <div style="margin-top:12px;display:flex;gap:10px">
          <button class="btn btn-primary" id="pw-regen">Generate new</button>
          <button class="btn btn-ghost" id="pw-copy">Copy</button>
        </div>
      </div>`,
    script: `
      const len = document.getElementById('pw-length');
      const lenVal = document.getElementById('pw-length-val');
      const sets = { upper:'ABCDEFGHIJKLMNOPQRSTUVWXYZ', lower:'abcdefghijklmnopqrstuvwxyz', num:'0123456789', sym:'!@#$%^&*()-_=+[]{}' };
      function gen(){
        let chars = '';
        if (document.getElementById('pw-upper').checked) chars += sets.upper;
        if (document.getElementById('pw-lower').checked) chars += sets.lower;
        if (document.getElementById('pw-num').checked) chars += sets.num;
        if (document.getElementById('pw-sym').checked) chars += sets.sym;
        if (!chars) chars = sets.lower;
        const n = parseInt(len.value,10);
        const arr = new Uint32Array(n);
        crypto.getRandomValues(arr);
        let out = '';
        for (let i=0;i<n;i++) out += chars[arr[i] % chars.length];
        document.getElementById('pw-out').value = out;
      }
      len.addEventListener('input', ()=>{ lenVal.textContent = len.value; gen(); });
      document.querySelectorAll('#pw-upper,#pw-lower,#pw-num,#pw-sym').forEach(el=>el.addEventListener('change', gen));
      document.getElementById('pw-regen').addEventListener('click', gen);
      document.getElementById('pw-copy').addEventListener('click', ()=>{
        const out = document.getElementById('pw-out');
        out.select(); document.execCommand('copy');
      });
      gen();
    `,
  },
  {
    slug: "word-counter",
    title: "Word & Character Counter",
    description: "Live word, character, and sentence counts as you type or paste.",
    body: `
      <label for="wc-text">Your text</label>
      <textarea id="wc-text" placeholder="Paste or type here..."></textarea>
      <div class="tool-out grid grid-4">
        <div class="card"><h3 id="wc-words">0</h3><p>Words</p></div>
        <div class="card"><h3 id="wc-chars">0</h3><p>Characters</p></div>
        <div class="card"><h3 id="wc-sentences">0</h3><p>Sentences</p></div>
        <div class="card"><h3 id="wc-read">0 min</h3><p>Read time</p></div>
      </div>`,
    script: `
      const t = document.getElementById('wc-text');
      function update(){
        const v = t.value;
        const words = (v.trim().match(/\\S+/g) || []).length;
        const chars = v.length;
        const sentences = (v.match(/[.!?]+/g) || []).length;
        document.getElementById('wc-words').textContent = words;
        document.getElementById('wc-chars').textContent = chars;
        document.getElementById('wc-sentences').textContent = sentences;
        document.getElementById('wc-read').textContent = Math.max(1, Math.round(words/200)) + ' min';
      }
      t.addEventListener('input', update);
      update();
    `,
  },
  {
    slug: "json-formatter",
    title: "JSON Formatter",
    description: "Beautify, validate, and minify JSON instantly in your browser.",
    body: `
      <label for="json-in">Paste JSON</label>
      <textarea id="json-in" placeholder='{"hello":"world"}'></textarea>
      <div style="display:flex;gap:10px;margin-top:12px">
        <button class="btn btn-primary" id="json-beautify">Beautify</button>
        <button class="btn btn-ghost" id="json-minify">Minify</button>
      </div>
      <div class="tool-out">
        <label>Result</label>
        <textarea id="json-out" readonly></textarea>
        <p id="json-status" style="color:var(--text-dim);font-size:.85rem"></p>
      </div>`,
    script: `
      const input = document.getElementById('json-in');
      const out = document.getElementById('json-out');
      const status = document.getElementById('json-status');
      function parseOrError(){
        try { return { ok:true, val: JSON.parse(input.value) }; }
        catch(e){ return { ok:false, err: e.message }; }
      }
      document.getElementById('json-beautify').addEventListener('click', ()=>{
        const r = parseOrError();
        if (!r.ok) { status.textContent = 'Invalid JSON: ' + r.err; out.value=''; return; }
        out.value = JSON.stringify(r.val, null, 2);
        status.textContent = 'Valid JSON ✓';
      });
      document.getElementById('json-minify').addEventListener('click', ()=>{
        const r = parseOrError();
        if (!r.ok) { status.textContent = 'Invalid JSON: ' + r.err; out.value=''; return; }
        out.value = JSON.stringify(r.val);
        status.textContent = 'Valid JSON ✓';
      });
    `,
  },
  {
    slug: "utm-builder",
    title: "UTM Link Builder",
    description: "Build trackable campaign URLs for ads, email, and social.",
    body: `
      <label for="utm-url">Base URL</label>
      <input id="utm-url" type="text" placeholder="https://example.com/landing">
      <label for="utm-source">Source</label>
      <input id="utm-source" type="text" placeholder="newsletter">
      <label for="utm-medium">Medium</label>
      <input id="utm-medium" type="text" placeholder="email">
      <label for="utm-campaign">Campaign</label>
      <input id="utm-campaign" type="text" placeholder="fall-launch">
      <div class="tool-out">
        <label>Generated URL</label>
        <input id="utm-out" type="text" readonly>
        <div style="margin-top:12px"><button class="btn btn-primary" id="utm-copy">Copy link</button></div>
      </div>`,
    script: `
      const ids = ['utm-url','utm-source','utm-medium','utm-campaign'];
      function build(){
        const url = document.getElementById('utm-url').value.trim();
        if (!url) { document.getElementById('utm-out').value=''; return; }
        try {
          const u = new URL(url);
          const s = document.getElementById('utm-source').value.trim();
          const m = document.getElementById('utm-medium').value.trim();
          const c = document.getElementById('utm-campaign').value.trim();
          if (s) u.searchParams.set('utm_source', s);
          if (m) u.searchParams.set('utm_medium', m);
          if (c) u.searchParams.set('utm_campaign', c);
          document.getElementById('utm-out').value = u.toString();
        } catch(e) { document.getElementById('utm-out').value = 'Enter a valid URL (include https://)'; }
      }
      ids.forEach(id => document.getElementById(id).addEventListener('input', build));
      document.getElementById('utm-copy').addEventListener('click', ()=>{
        const out = document.getElementById('utm-out'); out.select(); document.execCommand('copy');
      });
    `,
  },
  {
    slug: "unit-converter",
    title: "Unit Converter",
    description: "Convert length, weight, temperature, and data sizes instantly.",
    body: `
      <label for="uc-category">Category</label>
      <select id="uc-category">
        <option value="length">Length</option>
        <option value="weight">Weight</option>
        <option value="temp">Temperature</option>
        <option value="data">Data size</option>
      </select>
      <label for="uc-value">Value</label>
      <input id="uc-value" type="number" value="1">
      <div style="display:flex;gap:12px;margin-top:10px">
        <div style="flex:1"><label for="uc-from">From</label><select id="uc-from"></select></div>
        <div style="flex:1"><label for="uc-to">To</label><select id="uc-to"></select></div>
      </div>
      <div class="tool-out"><h3 id="uc-result" style="font-size:1.6rem">—</h3></div>`,
    script: `
      const UNITS = {
        length: { m:1, km:1000, cm:0.01, mm:0.001, mi:1609.34, yd:0.9144, ft:0.3048, in:0.0254 },
        weight: { kg:1, g:0.001, mg:0.000001, lb:0.453592, oz:0.0283495 },
        data: { B:1, KB:1024, MB:1024**2, GB:1024**3, TB:1024**4 },
      };
      const cat = document.getElementById('uc-category');
      const from = document.getElementById('uc-from');
      const to = document.getElementById('uc-to');
      const val = document.getElementById('uc-value');
      const result = document.getElementById('uc-result');
      function populate(){
        const c = cat.value;
        from.innerHTML = ''; to.innerHTML = '';
        if (c === 'temp') {
          ['C','F','K'].forEach(u => { from.add(new Option(u,u)); to.add(new Option(u,u)); });
          to.value = 'F';
        } else {
          Object.keys(UNITS[c]).forEach(u => { from.add(new Option(u,u)); to.add(new Option(u,u)); });
          to.selectedIndex = 1;
        }
        convert();
      }
      function convert(){
        const c = cat.value; const v = parseFloat(val.value) || 0;
        let out;
        if (c === 'temp') {
          let celsius;
          if (from.value==='C') celsius = v;
          else if (from.value==='F') celsius = (v-32) * 5/9;
          else celsius = v - 273.15;
          if (to.value==='C') out = celsius;
          else if (to.value==='F') out = celsius*9/5+32;
          else out = celsius + 273.15;
        } else {
          const base = v * UNITS[c][from.value];
          out = base / UNITS[c][to.value];
        }
        result.textContent = (Math.round(out*10000)/10000) + ' ' + to.value;
      }
      [cat].forEach(el=>el.addEventListener('change', populate));
      [from,to,val].forEach(el=>el.addEventListener('input', convert));
      populate();
    `,
  },
  {
    slug: "case-converter",
    title: "Text Case Converter",
    description: "Convert text to UPPERCASE, lowercase, Title Case, camelCase, and more.",
    body: `
      <label for="cc-in">Input</label>
      <textarea id="cc-in" placeholder="Type or paste text..."></textarea>
      <div class="tool-out grid grid-3">
        <button class="btn btn-ghost" data-mode="upper">UPPERCASE</button>
        <button class="btn btn-ghost" data-mode="lower">lowercase</button>
        <button class="btn btn-ghost" data-mode="title">Title Case</button>
        <button class="btn btn-ghost" data-mode="sentence">Sentence case</button>
        <button class="btn btn-ghost" data-mode="camel">camelCase</button>
        <button class="btn btn-ghost" data-mode="snake">snake_case</button>
      </div>
      <label style="margin-top:18px">Output</label>
      <textarea id="cc-out" readonly></textarea>`,
    script: `
      const inp = document.getElementById('cc-in');
      const out = document.getElementById('cc-out');
      function words(s){ return s.trim().split(/\\s+/).filter(Boolean); }
      const modes = {
        upper: s => s.toUpperCase(),
        lower: s => s.toLowerCase(),
        title: s => words(s).map(w => w[0].toUpperCase()+w.slice(1).toLowerCase()).join(' '),
        sentence: s => s.toLowerCase().replace(/(^\\s*\\w|[.!?]\\s*\\w)/g, c => c.toUpperCase()),
        camel: s => words(s).map((w,i)=> i===0 ? w.toLowerCase() : w[0].toUpperCase()+w.slice(1).toLowerCase()).join(''),
        snake: s => words(s).map(w=>w.toLowerCase()).join('_'),
      };
      document.querySelectorAll('[data-mode]').forEach(btn=>{
        btn.addEventListener('click', ()=> out.value = modes[btn.dataset.mode](inp.value || ''));
      });
    `,
  },
  {
    slug: "color-picker",
    title: "Color Converter",
    description: "Convert colors between HEX, RGB, and HSL with a live preview.",
    body: `
      <label for="col-hex">HEX</label>
      <input id="col-hex" type="text" value="#7c5cff">
      <input id="col-picker" type="color" value="#7c5cff" style="width:100%;height:44px;margin-top:8px;border:none;background:none">
      <div class="tool-out grid grid-3">
        <div class="card"><h3 id="col-hex-out">#7c5cff</h3><p>HEX</p></div>
        <div class="card"><h3 id="col-rgb-out">—</h3><p>RGB</p></div>
        <div class="card"><h3 id="col-hsl-out">—</h3><p>HSL</p></div>
      </div>
      <div id="col-swatch" style="height:80px;border-radius:12px;margin-top:16px;border:1px solid var(--border)"></div>`,
    script: `
      function hexToRgb(hex){
        hex = hex.replace('#','');
        if (hex.length===3) hex = hex.split('').map(c=>c+c).join('');
        const num = parseInt(hex,16);
        return [num>>16 & 255, num>>8 & 255, num & 255];
      }
      function rgbToHsl(r,g,b){
        r/=255; g/=255; b/=255;
        const max=Math.max(r,g,b), min=Math.min(r,g,b);
        let h,s,l=(max+min)/2;
        if(max===min){ h=s=0; } else {
          const d=max-min; s = l>0.5 ? d/(2-max-min) : d/(max+min);
          switch(max){
            case r: h=(g-b)/d+(g<b?6:0); break;
            case g: h=(b-r)/d+2; break;
            case b: h=(r-g)/d+4; break;
          }
          h/=6;
        }
        return [Math.round(h*360), Math.round(s*100), Math.round(l*100)];
      }
      const hexIn = document.getElementById('col-hex');
      const picker = document.getElementById('col-picker');
      function update(hex){
        if (!/^#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(hex)) return;
        if (!hex.startsWith('#')) hex = '#'+hex;
        const [r,g,b] = hexToRgb(hex);
        const [h,s,l] = rgbToHsl(r,g,b);
        document.getElementById('col-hex-out').textContent = hex;
        document.getElementById('col-rgb-out').textContent = 'rgb(' + r + ', ' + g + ', ' + b + ')';
        document.getElementById('col-hsl-out').textContent = 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
        document.getElementById('col-swatch').style.background = hex;
        picker.value = hex;
      }
      hexIn.addEventListener('input', ()=> update(hexIn.value));
      picker.addEventListener('input', ()=> { hexIn.value = picker.value; update(picker.value); });
      update(hexIn.value);
    `,
  },
  {
    slug: "lorem-ipsum",
    title: "Lorem Ipsum Generator",
    description: "Generate placeholder text by paragraph, sentence, or word count.",
    body: `
      <label for="li-count">Paragraphs</label>
      <input id="li-count" type="number" value="3" min="1" max="20">
      <div style="margin-top:12px"><button class="btn btn-primary" id="li-gen">Generate</button></div>
      <div class="tool-out"><textarea id="li-out" style="min-height:220px"></textarea></div>`,
    script: `
      const WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat".split(' ');
      function sentence(){
        const n = 8 + Math.floor(Math.random()*8);
        let words = [];
        for (let i=0;i<n;i++) words.push(WORDS[Math.floor(Math.random()*WORDS.length)]);
        let s = words.join(' ');
        return s[0].toUpperCase() + s.slice(1) + '.';
      }
      function paragraph(){
        const n = 3 + Math.floor(Math.random()*3);
        let sentences = [];
        for (let i=0;i<n;i++) sentences.push(sentence());
        return sentences.join(' ');
      }
      document.getElementById('li-gen').addEventListener('click', ()=>{
        const n = parseInt(document.getElementById('li-count').value,10) || 1;
        const paras = [];
        for (let i=0;i<n;i++) paras.push(paragraph());
        document.getElementById('li-out').value = paras.join('\\n\\n');
      });
      document.getElementById('li-gen').click();
    `,
  },
  {
    slug: "image-compressor",
    title: "Image Compressor",
    description: "Shrink JPG and PNG images in your browser, no upload required.",
    body: `
      <label for="ic-file">Choose an image</label>
      <input id="ic-file" type="file" accept="image/*">
      <label for="ic-quality">Quality: <span id="ic-quality-val">0.7</span></label>
      <input id="ic-quality" type="range" min="0.1" max="1" step="0.05" value="0.7" style="width:100%">
      <div class="tool-out" style="text-align:center">
        <img id="ic-preview" style="max-width:100%;border-radius:8px;margin-top:10px;display:none">
        <p id="ic-sizes" style="color:var(--text-dim);font-size:.85rem"></p>
        <a id="ic-download" class="btn btn-primary" style="display:none" download="compressed.jpg">Download compressed image</a>
      </div>
      <p style="color:var(--text-dim);font-size:.8rem;margin-top:10px">Free tier: 1 image at a time. <a href="/pricing.html">Upgrade to Pro</a> for batch compression.</p>`,
    script: `
      const fileInput = document.getElementById('ic-file');
      const quality = document.getElementById('ic-quality');
      const qualityVal = document.getElementById('ic-quality-val');
      quality.addEventListener('input', ()=> qualityVal.textContent = quality.value);
      fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (!file) return;
        const img = new Image();
        const reader = new FileReader();
        reader.onload = e => { img.src = e.target.result; };
        reader.readAsDataURL(file);
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width; canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const preview = document.getElementById('ic-preview');
            preview.src = url; preview.style.display = 'block';
            const dl = document.getElementById('ic-download');
            dl.href = url; dl.style.display = 'inline-flex';
            document.getElementById('ic-sizes').textContent =
              'Original: ' + Math.round(file.size/1024) + ' KB  →  Compressed: ' + Math.round(blob.size/1024) + ' KB';
          }, 'image/jpeg', parseFloat(quality.value));
        };
      });
    `,
  },
];

fs.mkdirSync(OUT_DIR, { recursive: true });
for (const tool of TOOLS) {
  const html = layout(tool);
  fs.writeFileSync(path.join(OUT_DIR, `${tool.slug}.html`), html);
  console.log("wrote", tool.slug + ".html");
}
