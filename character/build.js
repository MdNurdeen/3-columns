// Builds "Rio", the rental-guide mascot, as layered SVGs + transparent PNGs + a short MP4.
// Run: node character/build.js   (needs playwright + ffmpeg)
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const OUT = __dirname;
const C = {
  orange: '#E3882A', orangeDark: '#B9661A',
  teal: '#00646B', tealDark: '#004241',
  skin: '#F4C7A1', skinShade: '#E0A880',
  ink: '#1D2B2B', cheek: '#F29C8F', white: '#FFFFFF', shoe: '#22302F',
};

// ---------- parts (viewBox 0 0 400 600, origin top-left) ----------
const eyes = {
  open: `
    <ellipse cx="165" cy="185" rx="11" ry="15" fill="${C.ink}"/>
    <ellipse cx="235" cy="185" rx="11" ry="15" fill="${C.ink}"/>
    <circle cx="169" cy="179" r="4" fill="${C.white}"/>
    <circle cx="239" cy="179" r="4" fill="${C.white}"/>`,
  blink: `
    <path d="M154 187 q11 6 22 0" stroke="${C.ink}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M224 187 q11 6 22 0" stroke="${C.ink}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
  wink: `
    <ellipse cx="165" cy="185" rx="11" ry="15" fill="${C.ink}"/>
    <circle cx="169" cy="179" r="4" fill="${C.white}"/>
    <path d="M224 188 q11 -9 22 0" stroke="${C.ink}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
  wide: `
    <circle cx="165" cy="183" r="16" fill="${C.white}" stroke="${C.ink}" stroke-width="3"/>
    <circle cx="235" cy="183" r="16" fill="${C.white}" stroke="${C.ink}" stroke-width="3"/>
    <circle cx="165" cy="185" r="8" fill="${C.ink}"/>
    <circle cx="235" cy="185" r="8" fill="${C.ink}"/>`,
  happy: `
    <path d="M153 190 q12 -16 24 0" stroke="${C.ink}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M223 190 q12 -16 24 0" stroke="${C.ink}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
};
const brows = {
  normal: `
    <path d="M150 166 q15 -8 30 0" stroke="${C.tealDark}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M220 166 q15 -8 30 0" stroke="${C.tealDark}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
  up: `
    <path d="M150 160 q15 -10 30 0" stroke="${C.tealDark}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M220 160 q15 -10 30 0" stroke="${C.tealDark}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
  think: `
    <path d="M150 168 q15 -4 30 -6" stroke="${C.tealDark}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M220 158 q15 -8 30 2" stroke="${C.tealDark}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
};
const mouths = {
  smile: `<path d="M180 222 q20 18 40 0" stroke="${C.ink}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
  talkA: `<path d="M178 218 q22 4 44 0 q-4 30 -22 30 q-18 0 -22 -30z" fill="${C.ink}"/>
          <path d="M188 238 q12 -8 24 0 q-6 9 -12 9 q-6 0 -12 -9z" fill="${C.cheek}"/>`,
  talkO: `<ellipse cx="200" cy="230" rx="11" ry="13" fill="${C.ink}"/>
          <ellipse cx="200" cy="237" rx="6" ry="4" fill="${C.cheek}"/>`,
  talkE: `<path d="M178 222 q22 10 44 0 q-6 12 -22 12 q-16 0 -22 -12z" fill="${C.ink}"/>`,
  grin: `<path d="M172 216 h56 q-4 34 -28 34 q-24 0 -28 -34z" fill="${C.ink}"/>
         <path d="M176 217 h48 v7 h-48z" fill="${C.white}"/>
         <path d="M188 240 q12 -7 24 0 q-6 9 -12 9 q-6 0 -12 -9z" fill="${C.cheek}"/>`,
  hmm: `<path d="M186 230 q10 -6 26 2" stroke="${C.ink}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
};

// Arm: drawn hanging down from shoulder, rotated around shoulder pivot.
function arm(side, angle, extra = '') {
  const sx = side === 'L' ? 128 : 272;   // shoulder x
  const sy = 330;
  return `
  <g id="arm${side}" transform="rotate(${angle} ${sx} ${sy})">
    <path d="M${sx} ${sy} L${sx} ${sy + 95}" stroke="${C.orange}" stroke-width="34" stroke-linecap="round"/>
    <path d="M${sx} ${sy + 92} L${sx} ${sy + 100}" stroke="${C.teal}" stroke-width="36" stroke-linecap="butt"/>
    <circle cx="${sx}" cy="${sy + 120}" r="20" fill="${C.skin}"/>
    ${extra}
  </g>`;
}

function rio({ eye = 'open', brow = 'normal', mouth = 'smile', armL = 12, armR = -12,
               headTilt = 0, bob = 0, keyInHand = false } = {}) {
  const key = keyInHand ? `
    <g transform="translate(288 446)">
      <rect x="-14" y="2" width="28" height="36" rx="10" fill="${C.tealDark}"/>
      <circle cx="0" cy="16" r="5" fill="${C.orange}"/>
      <rect x="-3" y="38" width="6" height="22" fill="#B8C4C4"/>
      <rect x="3" y="48" width="6" height="4" fill="#B8C4C4"/>
    </g>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="400" height="600">
  <g id="rio" transform="translate(0 ${bob})">
    <ellipse id="shadow" cx="200" cy="585" rx="95" ry="10" fill="#000" opacity="0.12" transform="translate(0 ${-bob})"/>
    <g id="legs">
      <rect x="160" y="450" width="34" height="110" rx="14" fill="${C.tealDark}"/>
      <rect x="206" y="450" width="34" height="110" rx="14" fill="${C.tealDark}"/>
      <path d="M148 560 q0 -18 22 -18 h26 v24 h-48z" fill="${C.shoe}"/>
      <path d="M252 560 q0 -18 -22 -18 h-26 v24 h48z" fill="${C.shoe}"/>
      <rect x="146" y="562" width="52" height="8" rx="4" fill="${C.white}"/>
      <rect x="202" y="562" width="52" height="8" rx="4" fill="${C.white}"/>
    </g>
    ${arm('L', armL)}
    <g id="body">
      <path d="M130 320 q70 -30 140 0 l12 140 q-82 18 -164 0z" fill="${C.orange}"/>
      <path d="M200 300 v162" stroke="${C.orangeDark}" stroke-width="4"/>
      <rect x="150" y="390" width="34" height="26" rx="6" fill="${C.orangeDark}"/>
      <rect x="216" y="390" width="34" height="26" rx="6" fill="${C.orangeDark}"/>
      <circle cx="252" cy="345" r="12" fill="${C.white}"/>
      <path d="M246 345 l4 5 l8 -10" stroke="${C.teal}" stroke-width="3" fill="none" stroke-linecap="round"/>
    </g>
    ${arm('R', armR, '')}
    ${key}
    <g id="head" transform="rotate(${headTilt} 200 300)">
      <path d="M150 285 q50 32 100 0 l8 26 q-58 26 -116 0z" fill="${C.teal}"/>
      <path d="M238 300 l18 40 l-22 4z" fill="${C.teal}"/>
      <circle cx="104" cy="200" r="18" fill="${C.skinShade}"/>
      <circle cx="296" cy="200" r="18" fill="${C.skinShade}"/>
      <ellipse cx="200" cy="195" rx="98" ry="100" fill="${C.skin}"/>
      <g id="cap" transform="translate(0 -14)">
        <path d="M100 160 q0 -90 100 -92 q100 2 100 92z" fill="${C.teal}"/>
        <rect x="98" y="140" width="204" height="22" rx="6" fill="${C.orange}"/>
        <path d="M110 162 q90 -14 180 0 q-6 14 -24 16 q-66 -10 -132 0 q-18 -2 -24 -16z" fill="${C.tealDark}"/>
        <circle cx="200" cy="151" r="9" fill="${C.white}"/>
        <path d="M195 151 h10 M200 146 v10" stroke="${C.orange}" stroke-width="3"/>
      </g>
      <g id="brows">${brows[brow]}</g>
      <g id="eyes">${eyes[eye]}</g>
      <ellipse cx="140" cy="215" rx="15" ry="9" fill="${C.cheek}" opacity="0.7"/>
      <ellipse cx="260" cy="215" rx="15" ry="9" fill="${C.cheek}" opacity="0.7"/>
      <path d="M196 196 q6 10 -2 14" stroke="${C.skinShade}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <g id="mouth">${mouths[mouth]}</g>
    </g>
  </g>
</svg>`;
}

// ---------- named variants ----------
const variants = {
  'rio-neutral':  {},
  'rio-happy':    { eye: 'happy', mouth: 'grin', brow: 'up' },
  'rio-talking':  { mouth: 'talkA', brow: 'up' },
  'rio-surprised':{ eye: 'wide', mouth: 'talkO', brow: 'up', armL: 40, armR: -40 },
  'rio-wink':     { eye: 'wink', mouth: 'grin', headTilt: -6 },
  'rio-thinking': { eye: 'open', brow: 'think', mouth: 'hmm', headTilt: 5, armR: -150 },
  'rio-wave':     { eye: 'happy', mouth: 'grin', brow: 'up', armR: -160, headTilt: -4 },
  'rio-point':    { mouth: 'talkE', brow: 'up', armR: -95 },
  'rio-keys':     { eye: 'wink', mouth: 'grin', keyInHand: true, armR: -8 },
};

fs.mkdirSync(path.join(OUT, 'svg'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'png'), { recursive: true });
for (const [name, opts] of Object.entries(variants))
  fs.writeFileSync(path.join(OUT, 'svg', `${name}.svg`), rio(opts));

// Separate mouth shapes for lip-sync (same coordinate system, transparent)
fs.mkdirSync(path.join(OUT, 'svg', 'mouths'), { recursive: true });
for (const [m, d] of Object.entries(mouths))
  fs.writeFileSync(path.join(OUT, 'svg', 'mouths', `mouth-${m}.svg`),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="400" height="600">${d}</svg>`);

// ---------- render PNGs + wave/talk animation ----------
(async () => {
  const { chromium } = require('playwright');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 800, height: 1200 } });
  const shot = async (svg, file, bg = 'transparent') => {
    await page.setContent(`<html><body style="margin:0;background:${bg}">${svg.replace('width="400" height="600"', 'width="800" height="1200"')}</body></html>`);
    await page.screenshot({ path: file, omitBackground: bg === 'transparent', clip: { x: 0, y: 0, width: 800, height: 1200 } });
  };
  for (const [name, opts] of Object.entries(variants))
    await shot(rio(opts), path.join(OUT, 'png', `${name}.png`));

  // 3-second, 30fps intro clip: wave + talk + blink, on a soft background
  const frames = path.join(OUT, '.frames');
  fs.rmSync(frames, { recursive: true, force: true });
  fs.mkdirSync(frames);
  const talk = ['talkA', 'talkE', 'talkO', 'talkA', 'smile', 'talkE'];
  for (let f = 0; f < 90; f++) {
    const t = f / 30;
    const opts = {
      bob: Math.sin(t * Math.PI * 2) * 4,
      headTilt: Math.sin(t * Math.PI * 2) * 3,
      armL: 12,
      armR: -150 + Math.sin(t * Math.PI * 6) * 20,
      brow: 'up',
      eye: (f % 45 > 40) ? 'blink' : 'open',
      mouth: talk[Math.floor(f / 4) % talk.length],
    };
    await shot(rio(opts), path.join(frames, `f${String(f).padStart(3, '0')}.png`), '#F2F2F2');
  }
  await browser.close();
  execSync(`ffmpeg -y -loglevel error -framerate 30 -i ${frames}/f%03d.png -vf "scale=720:1080,format=yuv420p" -c:v libx264 ${OUT}/rio-hello.mp4`);
  execSync(`ffmpeg -y -loglevel error -framerate 30 -i ${frames}/f%03d.png -vf "scale=320:-1:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse" ${OUT}/rio-hello.gif`);
  fs.rmSync(frames, { recursive: true, force: true });
  console.log('done');
})();
