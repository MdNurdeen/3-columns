"""Even out voiceover loudness so no section is louder/quieter than the rest.
Usage: python3 level_voice.py in.wav out.wav"""
import sys, numpy as np, soundfile as sf
x, sr = sf.read(sys.argv[1], dtype='float32', always_2d=True); mono = x.mean(1)
hop = int(.05 * sr)
fr = np.array([np.sqrt(np.mean(mono[i:i + hop] ** 2)) for i in range(0, len(mono), hop)]) + 1e-9
db = 20 * np.log10(fr)
speech = db > np.percentile(db, 95) - 25                      # gate out pauses/breaths
# speech-only level, smoothed over ~2 s, held through pauses
lvl = np.where(speech, db, np.nan)
k = 40; L = np.full(len(db), np.nan)
for i in range(len(db)):
    seg = lvl[max(0, i - k // 2): i + k // 2 + 1]; seg = seg[~np.isnan(seg)]
    if len(seg) > 4: L[i] = 10 * np.log10(np.mean(10 ** (seg / 10)))
idx = np.arange(len(L)); good = ~np.isnan(L)
L = np.interp(idx, idx[good], L[good])
target = np.median(L[speech])
g = np.clip(target - L, -10, 8)
g = np.convolve(g, np.ones(9) / 9, 'same')                     # glide, no pumping
gs = np.repeat(10 ** (g / 20), hop)[:len(mono)]
y = x * gs[:, None]
y /= max(1e-9, np.abs(y).max()) / .9
sf.write(sys.argv[2], y, sr)
