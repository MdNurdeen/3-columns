"""Audio QA: voice level must stay even (speech-only loudness in 5 s blocks within 3 dB)."""
import sys, numpy as np, soundfile as sf
x, sr = sf.read(sys.argv[1], dtype='float32', always_2d=True); x = x.mean(1)
w = int(.05 * sr); db = 20 * np.log10(np.array([np.sqrt(np.mean(x[i:i + w] ** 2)) for i in range(0, len(x) - w, w)]) + 1e-9)
gate = db > np.percentile(db, 95) - 25; B = 100; v = []
for i in range(0, len(db) - B, B):          # skip the final partial block (logo tail)
    seg = db[i:i + B][gate[i:i + B]]
    if gate[i:i + B].mean() > .4: v.append(10 * np.log10(np.mean(10 ** (seg / 10))))
spread = max(v) - min(v)
print(f"AUDIO QA: speech level spread {spread:.1f} dB across {len(v)} blocks " + ("PASSED" if spread <= 3 else "FAILED (voice volume not even)"))
sys.exit(0 if spread <= 3 else 1)
