const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { spawn } = require('child_process');
const dir = __dirname, mode = process.argv[2];
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.addInitScript(`window.AMP=${fs.readFileSync(path.join(dir, 'amp.json'))}`);
  p.on('pageerror', e => console.error('ERR', e.message));
  await p.goto('file://' + path.join(dir, 'video.html'));
  await p.evaluate(() => document.fonts.ready);
  if (mode === 'cues') { fs.writeFileSync(path.join(dir, 'cues.json'), JSON.stringify(await p.evaluate(() => cues()))); } else if (mode === 'stills') {
    const ts = process.argv.slice(3).map(Number);
    for (const t of ts) { await p.evaluate(t => render(t), t); await p.screenshot({ path: path.join(dir, `still_${t}.png`) }); }
  } else {
    const fps = 24, N = +(process.env.N || 2726);
    const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-', '-i', process.argv[3],
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-preset', 'medium', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', process.argv[4]], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let i = 0; i < N; i++) {
      await p.evaluate(t => render(t), i / fps);
      const buf = await p.screenshot({ type: 'jpeg', quality: 92 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (i % 240 === 0) console.log('frame', i);
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await b.close();
})();
