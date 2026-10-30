#!/usr/bin/env bash
# DollarDesi video build.  Usage:
#   ./build.sh <projectDir> <voiceover.mp3> preview   -> QA check + storyboard sheet (preview.png) for sign-off
#   ./build.sh <projectDir> <voiceover.mp3> full      -> QA check, audio mix, final MP4 (<projectDir>/video.mp4)
# Set FORCE=1 to render even if QA reports issues.
set -euo pipefail
T="$(cd "$(dirname "$0")" && pwd)"; P="$(cd "$1" && pwd)"; VO="$2"; MODE="${3:-preview}"
for f in engine.html logo.png kalam-latin-400-normal.woff2 kalam-latin-700-normal.woff2; do ln -sf "$T/$f" "$P/$f"; done
# level the voiceover first: no section louder/quieter than the rest (e.g. a hot-recorded hook)
ffmpeg -v error -y -i "$VO" -ar 44100 "$P/vo_raw.wav"
python3 "$T/level_voice.py" "$P/vo_raw.wav" "$P/vo_lev.wav"
ffmpeg -v error -y -i "$P/vo_lev.wav" -af "acompressor=threshold=-18dB:ratio=2.5:attack=8:release=180:makeup=1.5" "$P/vo44.wav"
ffmpeg -v error -y -i "$P/vo44.wav" -ac 1 -ar 16000 "$P/vo16.wav"
node "$T/render.js" "$P" cues                       # writes cfg.json (frame count)
python3 - "$P" <<'PY'
import sys, json, numpy as np, soundfile as sf
P = sys.argv[1]; cfg = json.load(open(f'{P}/cfg.json')); x, sr = sf.read(f'{P}/vo16.wav', dtype='float32')
dur = len(x) / sr
if abs(dur - cfg['voiceEnd']) > .3: sys.exit(f"CFG.voiceEnd={cfg['voiceEnd']} but the voiceover is {dur:.2f}s - fix scenes.js")
hop = sr // 24; n = cfg['frames']
r = np.array([np.sqrt(np.mean(x[i*hop:(i+1)*hop]**2)) if i*hop < len(x) else 0 for i in range(n)])
r = np.clip(r / np.percentile(r[r > 0], 95), 0, 1); r = np.convolve(r, [.25, .5, .25], 'same')
json.dump([round(float(v), 2) for v in r], open(f'{P}/amp.json', 'w'))
PY
if ! node "$T/render.js" "$P" qa; then [ "${FORCE:-0}" = 1 ] || { echo "Fix the QA issues above (or FORCE=1)."; exit 1; }; fi
if [ "$MODE" = preview ]; then
  rm -f "$P"/still_*.png; node "$T/render.js" "$P" stills
  python3 - "$P" <<'PY'
import sys, json, subprocess
P = sys.argv[1]; ts = json.load(open(f'{P}/stills.json')); n = len(ts); cols = 5
args = sum([['-i', f'{P}/still_{t}.png'] for t in ts], [])
fc = ''.join(f'[{i}]scale=360:-1[a{i}];' for i in range(n)) + ''.join(f'[a{i}]' for i in range(n)) + f"xstack=inputs={n}:layout=" + '|'.join(f'{(i%cols)*360}_{(i//cols)*640}' for i in range(n)) + ':fill=gray'
subprocess.run(['ffmpeg', '-v', 'error', '-y', *args, '-filter_complex', fc, f'{P}/preview.png'], check=True)
print(f'Storyboard: {P}/preview.png')
PY
  exit 0
fi
node "$T/render.js" "$P" cues
(cd "$P" && python3 "$T/sfx.py" vo44.wav && ffmpeg -v error -y -i mix_raw.wav -af "loudnorm=I=-14:TP=-1.5:LRA=11" -ar 44100 mix.wav)
python3 "$T/check_audio.py" "$P/mix.wav" || { [ "${FORCE:-0}" = 1 ] || exit 1; }
node "$T/render.js" "$P" full "$P/mix.wav" "$P/video.mp4"
echo "Done: $P/video.mp4"
