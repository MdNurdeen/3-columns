// Usage: node render.js <projectDir> qa|cues|stills <t...>|full <mix.wav> <out.mp4>
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { spawn } = require('child_process');
const dir = path.resolve(process.argv[2]), mode = process.argv[3];
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const ampF = path.join(dir, 'amp.json');
  await p.addInitScript(`window.AMP=${fs.existsSync(ampF) ? fs.readFileSync(ampF) : '[]'}`);
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.join(dir, 'engine.html'));
  await p.evaluate(() => document.fonts.ready);
  if (errs.length) { console.error('PAGE ERROR:', errs.join('\n')); process.exit(2); }
  const cfg = await p.evaluate(() => CFG_OUT());
  fs.writeFileSync(path.join(dir, 'cfg.json'), JSON.stringify(cfg));
  if (mode === 'qa') {
    const issues = await p.evaluate(() => qa());
    console.log(issues.length ? 'QA ISSUES:\n - ' + issues.join('\n - ') : 'QA PASSED');
    await b.close(); process.exit(issues.filter(x => !x.startsWith('(warning)')).length ? 1 : 0);
  } else if (mode === 'cues') {
    fs.writeFileSync(path.join(dir, 'cues.json'), JSON.stringify(await p.evaluate(() => cues())));
  } else if (mode === 'stills') {
    let ts = process.argv.slice(4).map(Number);
    if (!ts.length) ts = await p.evaluate(() => scenes.map(s => +(Math.min(s.e, CFG.voiceEnd + CFG.tail) - .05).toFixed(2)));
    fs.writeFileSync(path.join(dir, 'stills.json'), JSON.stringify(ts));
    for (const t of ts) { await p.evaluate(t => render(t), t); await p.screenshot({ path: path.join(dir, `still_${t}.png`) }); }
  } else if (mode === 'full') {
    const fps = 24, N = cfg.frames;
    const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-', '-i', process.argv[4],
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-preset', 'medium', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', process.argv[5]], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let i = 0; i < N; i++) {
      await p.evaluate(t => render(t), i / fps);
      const buf = await p.screenshot({ type: 'jpeg', quality: 92 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (i % 480 === 0) console.log(`frame ${i}/${N}`);
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await b.close();
})();
