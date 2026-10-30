---
name: looniemath-video
description: Make a LoonieMath animated explainer video (vertical 1080×1920 MP4 for Reels/Shorts/TikTok) from a voiceover MP3, or write a script for one. Use whenever the user sends a LoonieMath voiceover, asks for a new LoonieMath video, a script, storyboard, caption, or a change to an existing LoonieMath video. Covers transcription, number checks, scenes, the Alex stick-figure mascot, sound, QA, the preview-then-render approval step, and delivery.
---

# LoonieMath video skill

LoonieMath = Canadian personal-finance reels in **English** for a general Canadian audience (many are newcomers).
Each video: a voiceover MP3 → hand-drawn animated scenes with **Alex** (the mascot) acting out every line → MP4.

Everything is built with the template in `dollardesi-template/` (the folder keeps its old name; do not rename it).
Read `DOLLARDESI_VIDEO_STYLE.md` for the full style brief and the lessons-learned table. The **Brand update** note at the top overrides older DollarDesi rules.

## Brand rules (non-negotiable)

- Channel: **LoonieMath**. Never use the DollarDesi name or `logo.png` in new videos.
- Mascot: **Alex**, the **classic stick figure**: white shirt, **blue tie**, curly hair, black dot hands, stick legs. **Not a hoodie.** The user rejected two hoodie redesigns. `outfit: 'hoodie'` exists in the engine but must not be used unless the user asks.
- Second characters: the friend `{ tie: GREEN, acc: 'glasses' }`, the boss `{ tie: RED, acc: 'boss' }`.
- Background: **dotted** (`bg: 'dots'`, the default). The user chose dots, not graph paper.
- **No corner watermark** (the default; never set `watermark: true`).
- Ending: LoonieMath logo reveal + FOLLOW + bell + "Money stories, every day" (`logo: 'looniemath-logo.png'`).
- Keep the user's "Follow LoonieMath… money stories, every day" voice line unless they say otherwise.
- Disclaimer on screen: "Education, not financial advice".

## Setup (fresh session)

```bash
pip install sherpa-onnx soundfile numpy        # speech recognition
# ffmpeg, node and Playwright + Chromium must exist (preinstalled in Claude Code cloud sessions)
```
- `dollardesi-template/transcribe.py` downloads the Whisper model (~1.9 GB) from GitHub on first use. Hugging Face is often blocked; do not use faster-whisper or HF models.
- Free TTS voices (only if the user asks for a generated voice): Kokoro via `pip install kokoro-onnx`, with model files from `github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/`. The user prefers their own ElevenLabs voice.

## Workflow: one round of feedback

1. **Transcribe** with timings:
   `python3 dollardesi-template/transcribe.py <voice.mp3>`
2. **Check every number on a short clip:**
   `python3 dollardesi-template/transcribe.py <voice.mp3> --check 33.0-36.3 …`
   - Never trust a number from one long pass; this once turned "129" into "139".
   - Fact-check rules and limits (CRA limits, deadlines) with a web search, and cite the sources.
   - Anything uncertain goes in the numbers table as ❓.
3. **Create** `dollardesi-template/projects/<name>/scenes.js` (copy `projects/rrsp-en/scenes.js` as the model). One scene per idea or sentence, timed to the transcript.
4. **Preview:** `cd dollardesi-template && ./build.sh projects/<name> <voice.mp3> preview`
   - This runs QA and writes `preview.png` (one frame per scene).
   - Fix every QA issue.
   - Then **look at the storyboard yourself**: QA cannot see text spilling out of its own box, or stamps covering props.
5. **Send the user**, before rendering:
   - the scene plan (time → scene → what Alex does)
   - the numbers table (✅ / ❓)
   - `preview.png`

   **Wait for "OK".** For anything about Alex's look, send a character picture first, never straight into a video.
6. **Render:** `./build.sh projects/<name> <voice.mp3> full`
   - QA, then voice levelling, the SFX/music mix, audio QA, and finally `projects/<name>/video.mp4`.
   - Move the MP4 to `<name>-video/` at the repo root, and copy `scenes.js` next to it.
   - Spot-check 3–4 frames with ffmpeg (a mid-count number like "$2,930" is fine).
7. **Deliver:** send the MP4 as a download, then commit and push.
   - Say plainly that audio was checked by measurement only: you cannot listen.
   - Offer an Instagram caption.

To cut a spoken line (e.g. a channel name the user doesn't want), find the silent gap with `silencedetect`, then trim with `ffmpeg -af "atrim=0:T,afade=t=out:st=T-0.2:d=0.2"`. Set `voiceEnd` to T and build from the trimmed WAV.

## scenes.js reference

```js
const CFG = {
  brand: true, logo: 'looniemath-logo.png', bg: 'dots',
  voiceEnd: 127.48,          // must match the audio length (build checks ±0.3 s)
  endScene: 124.23,          // start of the Follow/logo scene
  tail: 1.9,                 // hold after the voice so the logo is readable
  whoosh: [20.35, 38.34, 63.74, 75.84, 90.04],   // ONLY 4–6 major section changes
  checks: [{ label: 'refund', expr: '5000 * 0.30', expect: 1500, tol: 1 }],   // every derived number
};
scene(start, end, A(...) + A(...) + character({...}));   // the last scene uses end 999
```

**Elements:** `A(tin, anim, svgBody, { x, y, s, sfx, dur, attr })`
- **anim:**
  - `pop`, `up`, `fade`, `stamp` (lands with shake + punch zoom)
  - `drop` (bounces in), `grow` (bars), `draw` (strokes with `pathLength`)
  - `mark` (highlighter; use `HL(tin, x, y, w, h)`), `fly`, `slide`, `rain`
  - `count` (number counts up to an exact value): `txt(0,0,'$35,390',110,{extra:'data-n="35390" data-pre="$"'})`
- **sfx overrides:** `wrong`, `ding`, `cash`, `alert`, `sparkle`, `bell`, `boing`, `lose`, `stamp+wrong`, `stamp+ding`, `stamp+cash`, `stamp+lose`, `none`. Defaults come from the anim type.

**Props:**
- **Text and labels:** `txt`, `pill`, `stamp`, `HL`, `nameTag`
- **Speech and thought:** `say(w, h, body, tail ±1)` speech bubble, `bubble`
- **Marks and arrows:** `bigX`, `check`, `arrowR`, `arrowUp`, `warn`, `sparks`
- **Money:** `bill`, `coins`, `piggy`, `bank`
- **Containers and cards:** `box(label, w, h, stuffed)`, `card`, `tag`
- **Documents and screens:** `calendar(top, big, sub, w)`, `laptop`, `doc`, `stub`, `offer`, `phone`
- **Objects:** `suitcase`, `flag`, `leaf`, `heart`, `shield`, `umbrella`, `magnifier`, `house`, `bell`, `shareIcon`
- **Charts and lists:** `months` (bar chart), `row` (receipt line)
- **Colours:** `INK`, `BLUE`, `RED`, `GREEN`, `DG`

**Characters:** `character({ x, y, s, pose, expr, act, look, tie, acc, from, flip })`
- **pose** `[[t,name],…]`: idle point pointUp pointL shrug think present thumbs hold holdR hips cheer facepalm scratch cheeks reach wave wag guns clap shh
- **expr** `[[t,name],…]`: smile happy excited shock jawdrop worry scared sad cry money star dizzy think smug wink angry
- **act** `[[t,name,dur,arg],…]`:
  - movement: hop jump hops stomp spin dance walk (arg = start offset; negative = enter from the right)
  - wobbles: shake tremble wobble
  - head: nod shakehead tilt
  - hands: wave wag scratch reach clap
- **look** `[[t,'c'|'r'|'l'|'u'|'ur'|'ul'|'d']]`, so Alex looks at what's being explained.
- **from:** the character stays hidden until this time (for late entrances).

## Rules that prevent retakes

- **Alex reacts every 2–3 s:** a new expression, pose or action per line. Never a static figure.
- **Scale and position:** character scale ≥ 0.45 where possible (QA minimum 0.36). Keep text above the character, or to the side with clear space.
- **Exact numbers:** counters land exactly on the final value. Screen numbers must match the audio, and when the speaker rounds ("near $196,000") ask which to show.
- **Voice is loudest:** effects are about −6 dB and ducked; the music is very low.
- **Volume:** the build auto-levels the voice and fails above a 3 dB spread.
- **Whoosh:** only on the `CFG.whoosh` times. No swish on text.
- **One source of truth:** fix things in `scenes.js` or the engine, never in a copied file.
- **Script tips for the user:**
  - write numbers as words
  - keep the same mic energy throughout
  - leave a pause between sections and half a second of silence at the end

## Scripts and captions

- **Scripts:** use the format of `scripts/*.md`.
  - hook in the first 2 seconds
  - numbers written as words
  - a delivery table (tone, pace, stress words, pauses)
  - ElevenLabs settings: Stability 40–50%, Similarity 75–80%, Style 15–25%, Speaker boost on, Speed 1.0–1.05×
  - a verified numbers table with sources
- **Length:** about 148 words per minute in the user's voice. 60–75 s performs best; offer a two-part split for long topics.
- **Captions:**
  - a shock or hook first line, then the key numbers as emoji bullets, then a save/share CTA
  - `Follow @looniemath`
  - "This is education, not financial advice."
  - 10–15 Canada-specific hashtags
  - suggest a pinned comment question and posting at 7–9 pm Eastern for Canadian reach
