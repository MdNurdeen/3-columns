# DollarDesi Video Style Brief

Paste this into a new chat along with your voiceover MP3 (or a topic).

---

Make a **DollarDesi-style animated explainer video** with these specs:

**Format**
- Vertical 1080×1920, 24 fps, for Reels/Shorts/TikTok
- Length follows the voiceover
- Language: Hinglish voiceover; on-screen text in Roman Hinglish, e.g. "TFSA = ek DABBA", "Sabse badi galti"

**Look**
- Hand-drawn whiteboard style: off-white paper background with light grain, black ink outlines with a slight wobble ("boiling lines")
- Handwriting font (Kalam)
- Colours: blue `#3d8bd4`, red `#e0443b`, green `#3fae49`, yellow highlighter, brand dark green `#04452f`
- Simple drawn props: boxes, cash bills, coins, calendars, laptops, flags, charts, stamps, checklists
- Thin blue progress bar at the top
- Small DollarDesi logo watermark top-right; big logo reveal at the end with a FOLLOW button and bell

**Character (the mascot)**
- Stick figure with a round head, white shirt, blue tie, curly hair tuft on top, rosy cheeks, shiny eyes
- In every scene it acts out the line, with a new reaction every few seconds:
  - **Expressions:** happy, excited, shocked, jaw-drop, scared (sweat drop), sad, crying (tears), $ money eyes, star eyes, dizzy (spiral eyes + orbiting stars), thinking (?), smug, wink, angry (vein mark)
  - **Actions:** walk in, hop, jump, dance, spin, tremble, nod, head shake, finger wag, wave, facepalm, head scratch, hands-on-cheeks scream, clap, stomp, grab at flying money
- Mouth moves in sync with the voice; blinks; eyes look at the thing being explained; squash and stretch on jumps

**Motion**
- One scene per idea/sentence, timed exactly to the voiceover
- Elements pop, slide up, drop and bounce, or draw on; numbers count up
- Stamps ("GALAT!", "LIMIT") land with screen shake and punch zoom
- Yellow highlighter swipes behind key phrases
- Slide transitions with motion blur

**Sound**
- Voiceover is the loudest element by far
- Soft lo-fi music bed, very low, ducked under the voice
- Light sound effects, kept subtle: pops, stamp thuds, ding on checks, error buzz on wrong/X, number-counting ticks, cha-ching on money totals, hop springs, footsteps, "!" ping, sparkles, bell at the end
- Whoosh only on 4–5 major section changes (not every transition); no swish on text

**Structure**
1. Hook / myth (0–10 s)
2. "Sach yeh hai…" — the truth
3. Key rules and numbers, with visuals
4. Trap / biggest mistake, with a $ comparison chart
5. "Toh karna kya hai?" checklist
6. Disclaimer ("education hai, financial advice nahi") + next-video teaser
7. Logo + FOLLOW ending

**Voiceover**
- If I send an MP3, use it as is.
- Otherwise, write the Hinglish script for me to record in ElevenLabs with my usual voice.

---

## Lessons learned: do this right the first time

These caused retakes before. They're now defaults in `dollardesi-template/` and checked automatically.

| # | Past mistake | Rule now |
|---|---|---|
| 1 | Whoosh on every scene change | Whoosh **only on 4–6 major section changes**, quiet. No swish on text, drops or spins. |
| 2 | Effects and music too loud | **Voice is loudest.** Effects about −6 dB and ducked 30% under the voice; music very low and ducked 60%. |
| 3 | Character looked boring | Mascot must **react every 2–3 s**: a new expression or action per line. Never just stand. QA flags long scenes with only one expression. |
| 4 | Character too small | Minimum scale **0.36**; prefer 0.45+. |
| 5 | Text overlapping the character or other text, or going off-screen | **QA checks every scene** at its end state and blocks the render. |
| 6 | Counters ended on rounded values ($2,300 instead of $2,308) | Counters always land on the **exact** number. QA checks it. |
| 7 | Unclear numbers in the audio | Every derived number goes in `CFG.checks`; QA recomputes them (e.g. net pay, CPP). Unclear numbers are listed for you to confirm **before** the final render. |
| 8 | Logo ending cut short | Video holds **~1.9 s after the voice ends** so the logo and FOLLOW are readable. |
| 10 | Speech recognition misheard a number (CPP "129" heard as "139") | Numbers heard from Hindi audio are **never trusted**: each one is re-checked on a short clip in both Hindi and English, and any doubt is marked ❓ in the numbers table for you to confirm before rendering. |
| 11 | Volume dropped after the hook (hook recorded ~6 dB louder) | The voiceover is **auto-leveled** before mixing, and audio QA fails the build if speech volume varies by more than 3 dB. |
| 9 | Fixes made in one copy but not the other | Single source of truth: `projects/<name>/scenes.js`. Engine, sounds and character live in the template only. |

## Workflow (one round of feedback, not five)

1. **You send:** the voiceover MP3 (and the topic or script, if you have it).
2. **I send back, before rendering:**
   - the transcript meaning, scene by scene
   - a **numbers table** with anything I'm unsure of marked ❓
   - `preview.png`, a storyboard with one frame per scene
3. **You reply** "OK" or with corrections (takes about a minute).
4. **I render the final MP4** with the template. QA must pass first.

## Script tips (to avoid audio-related fixes)
- Say numbers clearly and double-check them before recording (e.g. CPP: 5.95% × (gross − $134.62) per bi-weekly paycheque).
- End with the "Follow" line; leave half a second of silence at the end.
