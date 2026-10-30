const { chromium } = require('playwright');const {spawn}=require('child_process');
const FPS=30,DUR=15,OUT=__dirname+'/phone-time-reel.mp4';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+__dirname+'/phone-time-reel.html',{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
const ff=spawn('ffmpeg',['-y','-f','image2pipe','-framerate',FPS,'-c:v','mjpeg','-i','-','-c:v','libx264','-pix_fmt','yuv420p','-crf','20','-preset','medium','-movflags','+faststart',OUT],{stdio:['pipe','ignore','inherit']});
for(let f=0;f<FPS*DUR;f++){await p.evaluate(t=>render(t),f/FPS);const buf=await p.screenshot({type:'jpeg',quality:92});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));}
ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();})();
