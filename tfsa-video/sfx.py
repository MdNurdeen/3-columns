import numpy as np, json, soundfile as sf, subprocess, sys
SR = 44100
rng = np.random.default_rng(7)
def T(d): return np.arange(int(d * SR)) / SR
def env(n, a=0.003, d=None):
    t = np.arange(n) / SR; e = np.minimum(1, t / a) if a > 0 else np.ones(n)
    return e * (np.exp(-t / d) if d else 1)
def noise(d): return rng.standard_normal(int(d * SR))
def bp(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X[(f < lo) | (f > hi)] = 0; return np.fft.irfft(X, len(x))
def sweep(f0, f1, d, shape=np.sin):
    t = T(d); f = f0 * (f1 / f0) ** (t / d); return shape(2 * np.pi * np.cumsum(f) / SR)
def tone(f, d, dec, harm=(1,), a=.003):
    t = T(d); return sum(np.sin(2 * np.pi * f * h * t) / (i + 1) ** 1.3 for i, h in enumerate(harm)) * env(len(t), a, dec)
def mix(*parts):  # (signal, offset_sec, gain)
    n = max(int(o * SR) + len(x) for x, o, g in parts); out = np.zeros(n)
    for x, o, g in parts: s0 = int(o * SR); out[s0:s0 + len(x)] += x * g
    return out
def norm(x, g=1): return x / (np.abs(x).max() + 1e-9) * g

S = {}
S['pop'] = norm(sweep(380, 1100, .09) * env(int(.09 * SR), .001, .025) + .3 * bp(noise(.09), 1500, 6000) * env(int(.09 * SR), .0005, .006))
def whoosh(d=.38, lo=300, hi=3500):
    n = noise(d); t = T(d)
    # moving band: crossfade low->high bands
    a = bp(n, lo, lo * 3); b = bp(n, hi / 3, hi)
    k = t / d; x = a * (1 - k) + b * k
    e = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 2
    return norm(x * e)
S['whoosh'] = whoosh()
S['swish'] = norm(whoosh(.2, 1200, 7000))
thud = np.sin(2 * np.pi * np.cumsum(90 * np.exp(-T(.3) * 9) + 45) / SR) * env(int(.3 * SR), .001, .09)
S['stamp'] = norm(thud + .5 * bp(noise(.3), 100, 2500) * env(int(.3 * SR), .0005, .03))
S['wood'] = norm(.7 * thud[:int(.2 * SR)] + bp(noise(.2), 250, 900) * env(int(.2 * SR), .0005, .02))
def sq(f, d): t = T(d); return np.sign(np.sin(2 * np.pi * f * t))
bz = (sq(146, .42) + sq(151, .42)) * env(int(.42 * SR), .005, .25)
S['wrong'] = norm(bp(bz, 60, 1800))
S['ding'] = norm(mix((tone(1567.98, 1.2, .35, (1, 2.0, 3.01)), 0, 1), (tone(2093, 1.0, .3, (1, 2)), .08, .6)))
def chime(fs, gap, d=1.0, dec=.3):
    out = np.zeros(int((gap * len(fs) + d) * SR))
    for i, f in enumerate(fs):
        x = tone(f, d, dec, (1, 2.76, 5.4)); s0 = int(i * gap * SR); out[s0:s0 + len(x)] += x
    return norm(out)
S['cash'] = norm(mix((bp(noise(.06), 2000, 8000) * env(int(.06 * SR), .001, .015), 0, 1), (bp(noise(.1), 1500, 7000) * env(int(.1 * SR), .001, .02), .0, .6), (chime([2637, 3520], .09, .9, .22), .1, 1)))
S['tick'] = norm(bp(noise(.02), 2500, 9000) * env(int(.02 * SR), .0002, .003))
S['sparkle'] = chime([2093, 2637, 3136, 4186, 3520], .06, .6, .15)
S['bell'] = chime([1318.5, 1046.5], .28, 1.4, .45)
S['alert'] = norm(np.concatenate([tone(880, .12, .06, (1, 3)), np.zeros(int(.06 * SR)), tone(880, .14, .07, (1, 3))]))
S['boing'] = norm(np.sin(2 * np.pi * np.cumsum(300 + 120 * np.sin(2 * np.pi * 14 * T(.45)) * np.exp(-T(.45) * 4)) / SR) * env(int(.45 * SR), .002, .15))
def saw(f, d): t = T(d); return 2 * ((f * t) % 1) - 1
lose = np.concatenate([bp(saw(f, d), 80, 2200) * env(int(d * SR), .01, d * .7) for f, d in [(392, .22), (370, .22), (349, .22), (330, .7)]])
S['lose'] = norm(lose * (1 + .3 * np.sin(2 * np.pi * 6 * np.arange(len(lose)) / SR)))
def scribble(d):
    n = noise(d); t = T(d); am = .5 + .5 * np.sign(np.sin(2 * np.pi * 9 * t + 3 * np.sin(2 * np.pi * 2.3 * t)))
    return norm(bp(n, 2500, 7500) * (.3 + .7 * am) * np.sin(np.pi * t / d) ** .5)
def rise(d): return norm(sweep(220, 880, d, lambda p: np.sin(p) + .3 * np.sin(2 * p)) * np.sin(np.pi * T(d) / d / 2) * env(int(d * SR), .05))

S['hop'] = norm(sweep(260, 820, .16) * env(int(.16 * SR), .002, .07) * (1 + .4 * np.sin(2 * np.pi * 40 * T(.16))))
S['step'] = norm(bp(noise(.05), 120, 900) * env(int(.05 * SR), .001, .012))
S['ping'] = norm(tone(2349, .5, .14, (1, 2.01)) + .5 * np.pad(tone(3136, .42, .12), (int(.08 * SR), 0)))
S['tweet'] = norm(np.concatenate([np.concatenate([sweep(2600, 4200, .07) * env(int(.07 * SR), .005, .04), np.zeros(int(.05 * SR))]) for _ in range(3)]))
S['drip'] = norm(sweep(500, 1500, .09) * env(int(.09 * SR), .002, .04))
S['ting'] = norm(tone(3520, .6, .16, (1, 2.4)))
S['boop'] = norm(sweep(700, 420, .14) * env(int(.14 * SR), .004, .07))
S['sob'] = norm(np.concatenate([bp(saw(f, .16), 200, 2500) * env(int(.16 * SR), .01, .1) * (1 + .5 * np.sin(2 * np.pi * 9 * T(.16))) for f in (520, 490, 460)]))
S['scratch'] = norm(bp(noise(.5), 1500, 5000) * (.5 + .5 * np.sign(np.sin(2 * np.pi * 13 * T(.5)))) * env(int(.5 * SR), .01))
S['clap'] = norm(bp(noise(.06), 800, 6000) * env(int(.06 * SR), .0005, .012))
S['grr'] = norm(bp(sq(70, .5) * (1 + .6 * np.sin(2 * np.pi * 23 * T(.5))), 60, 900) * env(int(.5 * SR), .02, .3))
GAIN = dict(hop=.3, step=.18, ping=.3, tweet=.22, drip=.25, ting=.22, boop=.22, sob=.22, scratch=.12, clap=.3, grr=.25, pop=.42, whoosh=.42, swish=.14, stamp=.75, wood=.45, wrong=.32, ding=.3, cash=.38, tick=.12, sparkle=.25, bell=.42, alert=.3, boing=.35, lose=.3, scribble=.13, marker=.16, rise=.12)
cues = json.load(open('cues.json'))
dur = 113.6
fx = np.zeros(int((dur + 2) * SR))
last = {}
def put(name, t, g=None, x=None, minGap=0.12):
    if t < 0 or (name in last and t - last[name] < minGap): return
    last[name] = t
    x = S[name] if x is None else x
    s0 = int(t * SR); fx[s0:s0 + len(x)] += x[:len(fx) - s0] * (GAIN.get(name, .3) if g is None else g)
for c in sorted(cues, key=lambda c: c['t']):
    t, a, sx, d = c['t'], c['a'], c['sfx'], c['dur']
    if sx == 'none': continue
    extra = [k for k in sx.split('+') if k] if sx else []
    if a == 'act':
        if sx in ('hop', 'jump', 'spin'): put('hop', t + .06, g=.38 if sx == 'jump' else None, minGap=.2)
        if sx == 'spin': put('swish', t, g=.25, minGap=0)
        if sx == 'hops':
            for k in np.arange(0, d, .5): put('hop', t + k + .06, g=.2, minGap=0)
        if sx == 'stomp':
            for k in np.arange(0, d, .28): put('step', t + k + .25, g=.35, minGap=0)
        if sx == 'walk':
            for k in np.arange(.1, d, 1 / 3.5): put('step', t + k, minGap=0)
        if sx == 'scratch': put('scratch', t, minGap=0)
        if sx == 'clap':
            for k in np.arange(.13, d, np.pi / 11): put('clap', t + k, minGap=0)
        continue
    if a == 'expr':
        m = dict(shock='ping', jawdrop='ping', dizzy='tweet', money='cash', star='sparkle', excited='sparkle', scared='drip', worry='drip', wink='ting', think='boop', cry='sob', angry='grr')
        if sx in m: put(m[sx], t, minGap=.6)
        continue
    if a == 'scene': put('whoosh', t - .05)
    elif a == 'up': put('swish', t, minGap=.35)
    elif a == 'pop' and not extra: put('pop', t)
    elif a == 'stamp': put('stamp', t + .1, minGap=0); extra = [e for e in extra if e != 'stamp']
    elif a == 'drop': put('swish', t, minGap=.2); put('wood', t + .27 * d, minGap=0)
    elif a == 'fly': put('whoosh', t + .3, g=.25, minGap=.5); put('cash', t + .2, minGap=5)
    elif a == 'mark': put('marker', t, x=scribble(.4), minGap=0)
    elif a == 'grow': put('rise', t, x=rise(d), minGap=0)
    elif a == 'draw' and 'ding' not in extra: put('scribble', t, x=scribble(d), minGap=0)
    elif a == 'count':
        put('pop', t)
        k = 0.0
        while k < d * .9: put('tick', t + k, minGap=0); k += .045 + .09 * (k / d) ** 2
        if c['money']: put('cash', t + d * .85, minGap=0)
        else: put('ding', t + d * .85, minGap=0)
    for e in extra:
        if e == 'ding' and a == 'draw': put('ding', t + .3, g=.22, minGap=0)
        elif e in ('wrong', 'ding', 'alert', 'sparkle', 'bell', 'boing', 'cash', 'lose'): put(e, t + (.1 if a == 'stamp' else 0), minGap=0)
    if a == 'pop' and extra == ['bell']: put('pop', t, minGap=0)

# ---- music bed: lofi I-vi-IV-V, 92 bpm ----
bpm = 92; beat = 60 / bpm
chords = [[60, 64, 67, 71], [57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 65]]
mf = lambda m: 440 * 2 ** ((m - 69) / 12)
mus = np.zeros_like(fx)
def epiano(f, d):
    t = T(d); x = (np.sin(2 * np.pi * f * t) + .25 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 6) + .08 * np.sin(2 * np.pi * 3 * f * t) * np.exp(-t * 9))
    return x * env(len(t), .01, .6) * (1 + .12 * np.sin(2 * np.pi * 4.5 * t))
kick = np.sin(2 * np.pi * np.cumsum(50 + 90 * np.exp(-T(.25) * 30)) / SR) * env(int(.25 * SR), .001, .08)
shk = bp(noise(.06), 5000, 11000) * env(int(.06 * SR), .002, .015)
bar = 0; tt = 0.0
while tt < dur:
    ch = chords[bar % 4]
    for i in range(8):  # 8th-note arpeggio
        tn = tt + i * beat / 2 + rng.uniform(0, .012)
        m = ch[[0, 1, 2, 3, 2, 1, 2, 3][i]] + (12 if i in (3, 7) else 0)
        x = epiano(mf(m), 1.0) * (.55 if i % 2 else .7); s0 = int(tn * SR); mus[s0:s0 + len(x)] += x[:len(mus) - s0]
    b = epiano(mf(ch[0] - 24), 2.4) * 1.1; s0 = int(tt * SR); mus[s0:s0 + len(b)] += b[:len(mus) - s0]
    for i in range(4):
        s0 = int((tt + i * beat) * SR)
        if i in (0, 2): mus[s0:s0 + len(kick)] += kick[:len(mus) - s0] * 1.4
        for j in (0, 1): s1 = s0 + int(j * beat / 2 * SR); mus[s1:s1 + len(shk)] += shk[:len(mus) - s1] * (.25 if j else .12)
    tt += 4 * beat; bar += 1
# warm lowpass
X = np.fft.rfft(mus); f = np.fft.rfftfreq(len(mus), 1 / SR); X *= 1 / (1 + (f / 2800) ** 2); mus = np.fft.irfft(X, len(mus))
vo, vsr = sf.read(sys.argv[1], dtype='float32', always_2d=True)
assert vsr == SR, vsr
vo = vo.mean(1); vo = np.pad(vo, (0, len(fx) - len(vo)))[:len(fx)]
ve = np.convolve(np.abs(vo), np.ones(int(.25 * SR)) / int(.25 * SR), 'same'); ve = np.clip(ve / np.percentile(ve, 90), 0, 1)
tm = np.arange(len(mus)) / SR
fade = np.clip(tm / 1.5, 0, 1) * np.clip((dur - tm) / 2.5, 0, 1)
mus = norm(mus, .1) * (1 - .45 * ve) * fade
voN = vo / (np.abs(vo).max() + 1e-9) * .85
out = voN + mus + fx * .9
out = out[:int(dur * SR)]
sf.write('mix_raw.wav', np.stack([out, out], 1).astype(np.float32), SR)
print('peak', np.abs(out).max())
