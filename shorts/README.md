# Story shorts

Makes vertical (1080x1920) faceless story videos like the reference: illustrated
scenes with a slow zoom, a narrator, and big two-word captions where the word
being spoken glows red.

## Workflow

1. **Script** (about 150 words for 60 seconds). Use a hook line, then a twist every
   few sentences, then a punchy last line. Split it into 10 to 16 scenes of one or two
   sentences each.
2. **Images.** Make one 9:16 image per scene with any image generator. Use the same
   style suffix every time so the character stays consistent:
   > `vintage watercolor and gouache illustration, 1920s, muted earthy palette,
   > soft paper texture, full-body character, detailed period clothing,
   > cinematic composition, vertical 9:16`

   Describe the main character the same way in every prompt (e.g. "a slim man with a
   thin moustache, slicked dark hair, charcoal three-piece suit").
3. **Voice.** Choose one:
   - `--tts` generates the voice with ElevenLabs and gets exact word timings
     (`export ELEVENLABS_API_KEY=...`; set `voice_id` in story.json).
   - Put your own `voice.mp3` in the folder. If `faster-whisper` is installed
     (`pip install faster-whisper`), it is used to sync the captions. Otherwise
     timings are estimated from word length.
   - With no voice at all, you get a silent preview.
4. **Music** (optional). Put a `music.mp3` in the folder. It is looped and
   mixed quietly under the voice.
5. **Render.**
   ```
   python3 make_short.py example            # -> example/out.mp4
   python3 make_short.py example --tts
   ```
   Requires `ffmpeg` with libass.

## story.json

```json
{
  "voice": "voice.mp3",
  "music": "music.mp3",
  "voice_id": "pNInz6obpgDQGcFmaJgB",
  "style": { "highlight": "FF2A2A", "font_size": 110, "caption_y": 0.5, "music_volume": 0.12 },
  "scenes": [
    { "image": "01.png", "text": "In 1932, Australia declared war. Not on a country, but on birds." }
  ]
}
```

Each scene's image stays on screen from that scene's first spoken word until the
next scene starts. You can also supply your own `words.json`
(`[{"word","start","end"}]`).

`example/` holds a 5-scene demo with placeholder images. Swap in real images to see
the actual look.
