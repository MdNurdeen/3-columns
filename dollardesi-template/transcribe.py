"""Transcribe a voiceover with timestamps, and re-check numbers on short clips.

Usage:
  python3 transcribe.py voice.mp3                       # timed segments (English)
  python3 transcribe.py voice.mp3 --lang hi             # Hindi/Hinglish: prints English translation + Hindi
  python3 transcribe.py voice.mp3 --check 33.0-36.3 42-46.1   # re-listen to number windows

Uses the multilingual Whisper medium model from the sherpa-onnx GitHub release
(Hugging Face is blocked in some environments). Downloaded once to ~/.cache/looniemath.
Requires: pip install sherpa-onnx soundfile numpy; ffmpeg on PATH.
"""
import argparse, os, subprocess, sys, tarfile, urllib.request
import numpy as np, soundfile as sf

MODEL_URL = "https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-whisper-medium.tar.bz2"
CACHE = os.path.expanduser("~/.cache/looniemath")
MDIR = os.path.join(CACHE, "sherpa-onnx-whisper-medium")


def model():
    if not os.path.exists(os.path.join(MDIR, "medium-encoder.int8.onnx")):
        os.makedirs(CACHE, exist_ok=True)
        tb = os.path.join(CACHE, "m.tar.bz2")
        print("downloading Whisper medium (~1.9 GB, once)…", file=sys.stderr)
        urllib.request.urlretrieve(MODEL_URL, tb)
        with tarfile.open(tb) as t: t.extractall(CACHE)
        os.remove(tb)
        for f in ("medium-encoder.onnx", "medium-decoder.onnx"):  # keep only int8
            try: os.remove(os.path.join(MDIR, f))
            except FileNotFoundError: pass
    return MDIR


def recognizer(lang, task):
    import sherpa_onnx
    d = model() + "/"
    return sherpa_onnx.OfflineRecognizer.from_whisper(encoder=d + "medium-encoder.int8.onnx", decoder=d + "medium-decoder.int8.onnx",
                                                      tokens=d + "medium-tokens.txt", language=lang, task=task, num_threads=8)


def load(path):
    wav = os.path.join(CACHE, "_vo16.wav"); os.makedirs(CACHE, exist_ok=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", path, "-ac", "1", "-ar", "16000", wav], check=True)
    x, sr = sf.read(wav, dtype="float32"); return x, sr


def cuts(x, sr, max_len=4.5):
    """Split at pauses; force a cut at the quietest point so no chunk exceeds max_len (long chunks get truncated)."""
    w = int(.05 * sr); db = 20 * np.log10(np.array([np.sqrt(np.mean(x[i:i + w] ** 2)) for i in range(0, len(x) - w, w)]) + 1e-9)
    quiet = db < -35; c = [0.0]; dur = len(x) / sr
    i = 0
    while i < len(quiet):
        if quiet[i]:
            j = i
            while j < len(quiet) and quiet[j]: j += 1
            if (j - i) * .05 >= .25: c.append((i + j) / 2 * .05)
            i = j
        else: i += 1
    out = [0.0]
    for m in c[1:] + [dur]:
        while m - out[-1] > max_len:
            a, b = out[-1] + max_len * .55, out[-1] + max_len
            seg = db[int(a / .05):int(b / .05)]
            out.append(round(a + int(np.argmin(seg)) * .05 + .025, 2) if len(seg) else b)
        if m - out[-1] >= .8 or m == dur: out.append(round(m, 2))
    return out


def run(rec, x, sr, a, b):
    seg = np.concatenate([np.zeros(sr // 2, np.float32), x[int(a * sr):int(b * sr)], np.zeros(sr * 2, np.float32)])
    s = rec.create_stream(); s.accept_waveform(sr, seg); rec.decode_stream(s); return s.result.text.strip()


if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("audio"); ap.add_argument("--lang", default="en"); ap.add_argument("--check", nargs="*")
    a = ap.parse_args(); x, sr = load(a.audio)
    print(f"duration {len(x) / sr:.2f}s")
    passes = [("en", "transcribe")] if a.lang == "en" else [(a.lang, "translate"), (a.lang, "transcribe"), ("en", "transcribe")]
    wins = [tuple(map(float, w.split("-"))) for w in a.check] if a.check else list(zip(cuts(x, sr)[:-1], cuts(x, sr)[1:]))
    for lang, task in passes:
        rec = recognizer(lang, task)
        if len(passes) > 1: print(f"--- {lang} {task}")
        for s0, s1 in wins: print(f"[{s0:7.2f}-{s1:7.2f}] {run(rec, x, sr, s0, s1)}")
