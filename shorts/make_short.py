#!/usr/bin/env python3
"""Render a faceless "story" short (1080x1920) from a folder of images + narration.

Look: illustrated scenes with a slow Ken Burns zoom, a voiceover, and big
two-word captions where the word being spoken is highlighted in red.

Usage:
    python3 make_short.py path/to/project            # -> project/out.mp4
    python3 make_short.py path/to/project --tts      # generate voice with ElevenLabs first

See README.md for the story.json format.
"""
import argparse
import base64
import json
import os
import re
import subprocess
import sys
import urllib.request
from pathlib import Path

W, H, FPS = 1080, 1920, 30
HERE = Path(__file__).resolve().parent
FONT_DIR = HERE / "fonts"
FONT_NAME = "Montserrat ExtraBold"


# ---------- audio / timing ----------

def probe_duration(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
        capture_output=True, text=True, check=True).stdout
    return float(out.strip())


def tokenize(text):
    return text.split()


def elevenlabs_tts(text, out_mp3, voice_id, model_id):
    """Generate narration and word timings via ElevenLabs' with-timestamps endpoint."""
    key = os.environ.get("ELEVENLABS_API_KEY")
    if not key:
        sys.exit("Set ELEVENLABS_API_KEY to use --tts")
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/with-timestamps",
        data=json.dumps({"text": text, "model_id": model_id}).encode(),
        headers={"xi-api-key": key, "Content-Type": "application/json"})
    with urllib.request.urlopen(req) as r:
        data = json.load(r)
    Path(out_mp3).write_bytes(base64.b64decode(data["audio_base64"]))

    # Collapse character alignment into words.
    al = data["alignment"]
    words, cur, start, end = [], "", None, None
    for ch, s, e in zip(al["characters"], al["character_start_times_seconds"],
                        al["character_end_times_seconds"]):
        if ch.isspace():
            if cur:
                words.append({"word": cur, "start": start, "end": end})
            cur, start = "", None
            continue
        if start is None:
            start = s
        cur, end = cur + ch, e
    if cur:
        words.append({"word": cur, "start": start, "end": end})
    return words


def whisper_align(audio):
    """Word timings from faster-whisper, if it is installed locally."""
    try:
        from faster_whisper import WhisperModel
    except ImportError:
        return None
    model = WhisperModel(os.environ.get("WHISPER_MODEL", "base.en"), compute_type="int8")
    segments, _ = model.transcribe(str(audio), word_timestamps=True)
    return [{"word": w.word.strip(), "start": w.start, "end": w.end}
            for seg in segments for w in seg.words]


def estimate_timings(words, total):
    """Spread words over the audio by character length (rough fallback)."""
    weights = [len(w) + 2 + (6 if re.search(r"[.!?]$", w) else 3 if w.endswith(",") else 0)
               for w in words]
    scale = (total - 0.3) / sum(weights)
    t, out = 0.15, []
    for w, k in zip(words, weights):
        d = k * scale
        out.append({"word": w, "start": t, "end": t + d * 0.85})
        t += d
    return out


def map_script_words(script_words, timed):
    """Give every script word a timing, using transcribed timings in order.

    Whisper output can differ slightly from the script (numbers, punctuation),
    so we walk both lists and fall back to interpolation where they disagree.
    """
    norm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower())
    out, j = [], 0
    for w in script_words:
        hit = None
        for k in range(j, min(j + 4, len(timed))):
            if norm(timed[k]["word"]) == norm(w):
                hit = k
                break
        if hit is None and j < len(timed):
            hit = j
        if hit is not None:
            out.append({"word": w, "start": timed[hit]["start"], "end": timed[hit]["end"]})
            j = hit + 1
        else:
            last = out[-1]["end"] if out else 0
            out.append({"word": w, "start": last, "end": last + 0.3})
    return out


# ---------- captions ----------

def ass_time(t):
    t = max(t, 0)
    h, rem = divmod(t, 3600)
    m, s = divmod(rem, 60)
    return f"{int(h)}:{int(m):02d}:{s:05.2f}"


def chunk_words(words, max_words=2, max_chars=14):
    """Group words into 1-2 word caption chunks, breaking after punctuation."""
    chunks, cur = [], []
    for w in words:
        cur.append(w)
        text = " ".join(x["word"] for x in cur)
        if len(cur) >= max_words or len(text) >= max_chars or re.search(r"[.,!?;:]$", w["word"]):
            chunks.append(cur)
            cur = []
    if cur:
        chunks.append(cur)
    return chunks


def build_ass(words, path, style):
    hl = style.get("highlight", "FF2A2A")
    # ASS colours are &HBBGGRR&
    hl_ass = f"&H{hl[4:6]}{hl[2:4]}{hl[0:2]}&"
    y = int(H * style.get("caption_y", 0.5))
    size = style.get("font_size", 110)
    lines = [
        "[Script Info]", "ScriptType: v4.00+", f"PlayResX: {W}", f"PlayResY: {H}",
        "WrapStyle: 0", "",
        "[V4+ Styles]",
        "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, "
        "BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, "
        "BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
        f"Style: Cap,{FONT_NAME},{size},&H00FFFFFF,&H00FFFFFF,&H00000000,&H96000000,"
        "0,0,0,0,100,100,1,0,1,5,4,5,60,60,0,1",
        "",
        "[Events]",
        "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text",
    ]
    clean = lambda s: re.sub(r"[{}\\]", "", s).upper().rstrip(",;:")
    chunks = chunk_words(words)
    for ci, chunk in enumerate(chunks):
        chunk_end = chunks[ci + 1][0]["start"] if ci + 1 < len(chunks) else chunk[-1]["end"] + 0.4
        for wi, w in enumerate(chunk):
            start = w["start"]
            end = chunk[wi + 1]["start"] if wi + 1 < len(chunk) else chunk_end
            # Layer 0 draws only a blurred red glow behind the active word;
            # layer 1 draws the crisp text on top (white words, red active word).
            glow, crisp = [], []
            for k, x in enumerate(chunk):
                word = clean(x["word"])
                if k == wi:
                    glow.append(f"{{\\alpha&H00&\\c{hl_ass}\\3c{hl_ass}\\3a&H40&\\bord12\\blur14\\shad0}}"
                                f"{word}{{\\alpha&HFF&\\bord0}}")
                    crisp.append(f"{{\\c{hl_ass}\\3c&H101060&}}{word}{{\\r}}")
                else:
                    glow.append(word)
                    crisp.append(word)
            # A short scale "pop" when a new chunk appears.
            pop = "\\fscx88\\fscy88\\t(0,90,\\fscx100\\fscy100)" if wi == 0 else ""
            head = f"{{\\an5\\pos({W // 2},{y}){pop}}}"
            span = f"{ass_time(start)},{ass_time(end)}"
            lines.append(f"Dialogue: 0,{span},Cap,,0,0,0,,{head}{{\\alpha&HFF&\\bord0\\shad0}}"
                         + " ".join(glow))
            lines.append(f"Dialogue: 1,{span},Cap,,0,0,0,,{head}" + " ".join(crisp))
    Path(path).write_text("\n".join(lines) + "\n", encoding="utf-8")


# ---------- video ----------

def scene_clip(image, duration, idx, out):
    """Render one image as a slow zoom/pan clip, cropped to fill 9:16."""
    frames = max(int(round(duration * FPS)), 1)
    z0, z1 = (1.0, 1.12) if idx % 2 == 0 else (1.12, 1.0)  # alternate zoom in / out
    zexpr = f"{z0}+({z1}-{z0})*on/{frames}"
    drift = ["0", "-1", "1"][idx % 3]  # slight horizontal drift for variety
    xexpr = f"(iw-iw/zoom)/2+({drift})*(iw-iw/zoom)/2*on/{frames}"
    vf = (
        f"scale={W * 2}:{H * 2}:force_original_aspect_ratio=increase,"
        f"crop={W * 2}:{H * 2},"
        f"zoompan=z='{zexpr}':x='{xexpr}':y='(ih-ih/zoom)/2':d={frames}:s={W}x{H}:fps={FPS},"
        "format=yuv420p"
    )
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-loop", "1", "-i", str(image), "-vf", vf,
                    "-frames:v", str(frames), "-c:v", "libx264", "-preset", "veryfast",
                    "-crf", "18", str(out)], check=True)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("project", type=Path)
    ap.add_argument("--tts", action="store_true", help="generate the voice with ElevenLabs")
    ap.add_argument("-o", "--out", type=Path)
    args = ap.parse_args()

    proj = args.project.resolve()
    story = json.loads((proj / "story.json").read_text())
    style = story.get("style", {})
    scenes = story["scenes"]
    build = proj / "build"
    build.mkdir(exist_ok=True)

    script_words, scene_first = [], []
    for sc in scenes:
        scene_first.append(len(script_words))
        script_words += tokenize(sc["text"])
    full_text = " ".join(sc["text"] for sc in scenes)

    voice = proj / story.get("voice", "voice.mp3")
    words_file = proj / "words.json"
    timed = None
    if args.tts:
        timed = elevenlabs_tts(full_text, voice,
                               story.get("voice_id", "pNInz6obpgDQGcFmaJgB"),
                               story.get("model_id", "eleven_multilingual_v2"))
        words_file.write_text(json.dumps(timed, indent=1))
    elif words_file.exists():
        timed = json.loads(words_file.read_text())

    if voice.exists():
        total = probe_duration(voice)
        if timed is None:
            timed = whisper_align(voice)
            if timed:
                words_file.write_text(json.dumps(timed, indent=1))
        words = map_script_words(script_words, timed) if timed else estimate_timings(script_words, total)
    else:
        # No narration yet: preview with estimated pacing (~2.7 words/sec) and silence.
        total = len(script_words) / 2.7 + 0.6
        words = estimate_timings(script_words, total)
        voice = None
        print("No voice file found - rendering a silent preview with estimated timings.")
    total = max(total, words[-1]["end"] + 0.4)

    # Each scene runs from its first word to the next scene's first word.
    bounds = [0.0] + [words[i]["start"] for i in scene_first[1:]] + [total]
    clips = []
    for i, sc in enumerate(scenes):
        clip = build / f"scene_{i:02d}.mp4"
        dur = bounds[i + 1] - bounds[i]
        print(f"scene {i + 1}/{len(scenes)}  {dur:5.2f}s  {sc['image']}")
        scene_clip(proj / sc["image"], dur, i, clip)
        clips.append(clip)

    concat = build / "concat.txt"
    concat.write_text("".join(f"file '{c.name}'\n" for c in clips))
    ass = build / "captions.ass"
    build_ass(words, ass, style)

    out = (args.out or proj / "out.mp4").resolve()
    cmd = ["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", str(concat)]
    music = proj / story["music"] if story.get("music") else None
    audio_inputs = []
    if voice:
        cmd += ["-i", str(voice)]
        audio_inputs.append("voice")
    if music and music.exists():
        cmd += ["-stream_loop", "-1", "-i", str(music)]
        audio_inputs.append("music")

    sub_filter = f"ass={ass.name}:fontsdir={FONT_DIR}"
    fc = f"[0:v]{sub_filter}[v]"
    if audio_inputs == ["voice"]:
        fc += ";[1:a]anull[a]"
    elif audio_inputs == ["music"]:
        fc += f";[1:a]volume={style.get('music_volume', 0.12)},afade=t=out:st={total - 1.5}:d=1.5[a]"
    elif audio_inputs:
        fc += (f";[2:a]volume={style.get('music_volume', 0.12)},afade=t=out:st={total - 1.5}:d=1.5[m]"
               ";[1:a][m]amix=inputs=2:duration=first:normalize=0[a]")
    cmd += ["-filter_complex", fc, "-map", "[v]"]
    if audio_inputs:
        cmd += ["-map", "[a]", "-c:a", "aac", "-b:a", "192k"]
    cmd += ["-t", f"{total:.3f}", "-c:v", "libx264", "-preset", "medium", "-crf", "20",
            "-pix_fmt", "yuv420p", "-r", str(FPS), "-movflags", "+faststart", str(out)]
    # Run from the build dir so the ass filter path needs no escaping.
    subprocess.run(cmd, check=True, cwd=build)
    print(f"Done: {out}  ({total:.1f}s)")


if __name__ == "__main__":
    main()
