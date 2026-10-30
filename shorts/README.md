# True crime shorts

Makes vertical (1080x1920) faceless story videos: one image or animated clip per
scene, a voiceover, and word-by-word captions. Each story has its own folder in
`stories/`. `stories/db-cooper/` is a full example with placeholder images.

## Workflow per story

1. **Research the case.** Note dates, places, and names, and check the facts against
   two or more reliable sources (court records, major news outlets, the FBI).
2. **Find what the people looked like.** Save mugshots, press photos or
   composite sketches in `refs/`. Write a short visual description of each person
   in `characters` (age, build, hair, face, clothing of the period).
3. **Write the script** (about 150 words per 60 seconds) and split it into scenes in
   `story.json`. Give each scene `text` (the narration), `shot` (what's in the frame),
   `characters` (who's in it) and optionally `motion` (how it should animate).
4. **Make the prompts:**
   ```
   python3 make_short.py stories/db-cooper --prompts
   ```
   This writes `prompts.md`, with an image prompt per scene (style + shot + each
   person's appearance), the reference photos to attach, and an animation prompt.
   People are described by appearance only, because many generators refuse real names.
5. **Generate the visuals.** Make a still image per scene, then optionally animate it
   with an image-to-video tool (Kling, Runway, Hailuo, etc.). Name a scene's file
   `"image": "01.png"` or `"media": "03.mp4"`. You can mix both. Stills get a slow
   zoom. A clip that is shorter than its scene is slowed down slightly, then holds
   its last frame.
6. **Voice.** Put your narration in the folder as `voice.mp3`. The narration must
   match the scene `text`.
   - Captions sync best with `pip install faster-whisper`. Without it, the timing is
     estimated from word length.
   - Or use `--tts` to generate the voice with ElevenLabs (`ELEVENLABS_API_KEY`,
     `voice_id`), which also gives exact word timings.
7. **Music** (optional). Add a `music.mp3`. It is looped and mixed quietly under
   the voice.
8. **Render:**
   ```
   python3 make_short.py stories/db-cooper          # -> stories/db-cooper/out.mp4
   ```
   Requires `ffmpeg` with libass.

## Style options (`story.json` -> `style`)

| key | values |
|---|---|
| `captions` | `glow` (2 big words, spoken word glows), `pop` (3 words, spoken word yellow + larger), `simple` (plain lower-third phrase) |
| `highlight`, `font_size`, `caption_y`, `max_words`, `uppercase` | override any part of the preset |
| `grade` | `dark` (desaturated, contrasty, vignette) or omit |
| `art` | style text appended to every image prompt |
| `music_volume` | e.g. `0.1` |

## Real people

- Disclose AI-generated visuals when you upload. YouTube requires this for realistic
  depictions of real people.
- Keep violence off-screen.
- Be careful with victims and their families, and with anyone who was never
  convicted. Say "suspected" or "alleged" where it applies.
