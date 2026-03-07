
const presets = [
  { name: 'Spin',    icon: '🌀', cls: 'anim-spin'    },
  { name: 'Bounce',  icon: '⬆️', cls: 'anim-bounce'  },
  { name: 'Pulse',   icon: '💓', cls: 'anim-pulse'   },
  { name: 'Shake',   icon: '🤝', cls: 'anim-shake'   },
  { name: 'Flip',    icon: '🔄', cls: 'anim-flip'    },
  { name: 'Wobble',  icon: '〰️', cls: 'anim-wobble'  },
  { name: 'FadeIn',  icon: '✨', cls: 'anim-fadeIn'  },
  { name: 'Swing',   icon: '🎪', cls: 'anim-swing'   },
  { name: 'Morph',   icon: '🧬', cls: 'anim-morph'   },
  { name: 'Float',   icon: '🎈', cls: 'anim-float'   },
  { name: 'Glitch',  icon: '⚡', cls: 'anim-glitch'  },
  { name: 'Rainbow', icon: '🌈', cls: 'anim-rainbow' },
  { name: 'Zigzag',  icon: '↯',  cls: 'anim-zigzag'  },
];

const colors = [
  '#1a1a1a','#b45309','#92400e','#44403c',
  '#78716c','#d97706','#a16207','#57534e',
  '#dc2626','#0f766e','#1d4ed8','#6d28d9',
];

let state = {
  anim: null,
  shape: 'square',
  color: '#1a1a1a',
  dur: 1,
  size: 100,
  easing: 'ease',
  direction: 'normal',
  paused: false,
};


const shape           = document.getElementById('shape');
const animLabel       = document.getElementById('animLabel');
const presetGrid      = document.getElementById('presetGrid');
const shapeRow        = document.getElementById('shapeRow');
const swatchRow       = document.getElementById('swatchRow');
const durSlider       = document.getElementById('durSlider');
const sizeSlider      = document.getElementById('sizeSlider');
const durVal          = document.getElementById('durVal');
const sizeVal         = document.getElementById('sizeVal');
const easingSelect    = document.getElementById('easingSelect');
const directionSelect = document.getElementById('directionSelect');
const pauseBtn        = document.getElementById('pauseBtn');
const resetBtn        = document.getElementById('resetBtn');
const cssOutput       = document.getElementById('cssOutput');
const copyBtn         = document.getElementById('copyBtn');
const toast           = document.getElementById('toast');

//  BUILD PRESETS
presets.forEach(p => {
  const btn = document.createElement('button');
  btn.className = 'preset-btn';
  btn.innerHTML = `<span class="icon">${p.icon}</span>${p.name}`;
  btn.dataset.cls = p.cls;
  btn.dataset.name = p.name;
  btn.addEventListener('click', () => selectAnimation(p, btn));
  presetGrid.appendChild(btn);
});

//  BUILD SWATCHES 
colors.forEach((c, i) => {
  const sw = document.createElement('div');
  sw.className = 'swatch' + (i === 0 ? ' active' : '');
  sw.style.background = c;
  sw.title = c;
  sw.addEventListener('click', () => {
    document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
    sw.classList.add('active');
    state.color = c;
    applyColor();
  });
  swatchRow.appendChild(sw);
});

//  SHAPE BUTTONS 
shapeRow.querySelectorAll('.shape-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    shapeRow.querySelectorAll('.shape-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.shape = btn.dataset.shape;
    applyShape();
  });
});

//  SLIDERS 
durSlider.addEventListener('input', () => {
  state.dur = parseFloat(durSlider.value);
  durVal.textContent = state.dur.toFixed(1) + 's';
  applyAnimation();
});

sizeSlider.addEventListener('input', () => {
  state.size = parseInt(sizeSlider.value);
  sizeVal.textContent = state.size + 'px';
  applySize();
});

easingSelect.addEventListener('change', () => {
  state.easing = easingSelect.value;
  applyAnimation();
});

directionSelect.addEventListener('change', () => {
  state.direction = directionSelect.value;
  applyAnimation();
});

//  PAUSE / RESET 
pauseBtn.addEventListener('click', () => {
  state.paused = !state.paused;
  shape.style.animationPlayState = state.paused ? 'paused' : 'running';
  pauseBtn.textContent = state.paused ? '▶ Resume' : '⏸ Pause';
});

resetBtn.addEventListener('click', () => {
  if (!state.anim) return;
  const cls = state.anim.cls;
  shape.classList.remove(cls);
  void shape.offsetWidth; // force reflow to restart animation
  shape.classList.add(cls);
  if (state.paused) {
    state.paused = false;
    shape.style.animationPlayState = 'running';
    pauseBtn.textContent = '⏸ Pause';
  }
});

//  COPY CSS 
copyBtn.addEventListener('click', () => {
  const text = cssOutput.innerText;
  navigator.clipboard.writeText(text).then(() => {
    copyBtn.classList.add('copied');
    copyBtn.textContent = '✓ COPIED!';
    toast.classList.add('show');
    setTimeout(() => {
      copyBtn.classList.remove('copied');
      copyBtn.textContent = '⎘ COPY CSS';
      toast.classList.remove('show');
    }, 2000);
  });
});

//  APPLY FUNCTIONS 
function selectAnimation(preset, btn) {
  presetGrid.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
  if (state.anim) shape.classList.remove(state.anim.cls);

  btn.classList.add('active');
  state.anim = preset;
  shape.classList.add(preset.cls);
  animLabel.textContent = preset.name.toUpperCase();
  applyAnimation();
}

function applyAnimation() {
  shape.style.setProperty('--dur', state.dur + 's');
  shape.style.animationTimingFunction = state.easing;
  shape.style.animationDirection = state.direction;
  shape.style.animationPlayState = state.paused ? 'paused' : 'running';
  updateCSS();
}

function applyColor() {
  if (state.shape === 'triangle') {
    shape.style.borderBottomColor = state.color;
    shape.style.background = 'transparent';
  } else {
    shape.style.background = state.color;
  }
  updateCSS();
}

function applyShape() {
  shape.className = '';
  shape.style.cssText = `--dur:${state.dur}s; width:${state.size}px; height:${state.size}px;`;

  if (state.shape === 'circle')   shape.classList.add('circle');
  if (state.shape === 'triangle') shape.classList.add('triangle');
  if (state.shape === 'star')     shape.classList.add('star');

  applyColor();

  if (state.anim) {
    shape.classList.add(state.anim.cls);
    applyAnimation();
  }
}

function applySize() {
  if (state.shape === 'triangle') {
    shape.style.borderLeftWidth   = (state.size * 0.55) + 'px';
    shape.style.borderRightWidth  = (state.size * 0.55) + 'px';
    shape.style.borderBottomWidth = state.size + 'px';
  } else {
    shape.style.width  = state.size + 'px';
    shape.style.height = state.size + 'px';
  }
  updateCSS();
}

function updateCSS() {
  if (!state.anim) return;
  const animName = state.anim.cls.replace('anim-', '');
  const lines = [
    `.element {`,
    `  background: ${state.color};`,
    `  width: ${state.size}px;`,
    `  height: ${state.size}px;`,
    `  animation-name: ${animName};`,
    `  animation-duration: ${state.dur}s;`,
    `  animation-timing-function: ${state.easing};`,
    `  animation-direction: ${state.direction};`,
    `  animation-iteration-count: infinite;`,
    `}`,
  ].join('\n');

  // syntax highlight
  cssOutput.innerHTML = lines
    .replace(/\b(animation-name|animation-duration|animation-timing-function|animation-direction|animation-iteration-count|background|width|height)\b/g,
      '<span class="prop">$1</span>')
    .replace(/:\s([^;]+);/g, ': <span class="val">$1</span>;')
    .replace(/\{|\}/g, m => `<span class="kw">${m}</span>`);
}

//  INIT 
applyColor();
applySize();
