# DollarDesi video template

The engine (character, props, sound effects, music, logo, QA) is shared. Each video is one `projects/<name>/scenes.js`.

```
./build.sh projects/<name> voiceover.mp3 preview   # QA + storyboard (preview.png) for sign-off
./build.sh projects/<name> voiceover.mp3 full      # QA + audio mix + projects/<name>/video.mp4
```

`scenes.js` starts with `CFG` (voice length, end-scene time, whoosh times, number checks), followed by `scene(start, end, ...)` calls.
See `projects/paycheque/scenes.js` for a complete example and `../DOLLARDESI_VIDEO_STYLE.md` for the rules.

The build stops if QA finds text overlaps, off-screen text, a character that is too small or never changes expression, wrong counter end values, failed number checks, or too many whooshes. `FORCE=1` overrides.
