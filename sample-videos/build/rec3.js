const { chromium } = require('playwright');const {spawn}=require('child_process');const segs=require('./segs.json');
const FPS=30,DUR=segs[segs.length-1].B,OUT='video_silent.mp4';
const map=t=>{const s=segs.find(s=>t<s.B)||segs[segs.length-1];return s.a+(t-s.A)*(s.b-s.a)/(s.B-s.A)};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+__dirname+'/explainer.html',{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
const ff=spawn('ffmpeg',['-y','-f','image2pipe','-framerate',FPS,'-c:v','mjpeg','-i','-','-c:v','libx264','-pix_fmt','yuv420p','-crf','20','-preset','medium',OUT],{stdio:['pipe','ignore','ignore']});
for(let f=0;f<Math.round(FPS*DUR);f++){await p.evaluate(t=>render(t),map(f/FPS));const buf=await p.screenshot({type:'jpeg',quality:92});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));}
ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();})();
