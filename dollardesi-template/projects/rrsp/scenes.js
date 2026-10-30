// RRSP 2027 video: CFG + scenes. Times are seconds in the voiceover.
const CFG = {
  voiceEnd: 110.03,
  endScene: 108.38,
  tail: 1.9,
  whoosh: [18.98, 29.21, 46.07, 60.14, 84.88],
  checks: [
    { label: 'refund example', expr: '5000 * 0.30', expect: 1500 },
    { label: 'income needed to max RRSP', expr: '35390 / 0.18', expect: 196600, tol: 50 },
  ],
};
const minus = (s, c = INK) => txt(0, 0, s, 50, { fill: c });

// 1. Hook: room can be zero in year 1
scene(0, 7.02,
  A(0.15, 'pop', box('RRSP', 260, 170), { x: 470, y: 760 }) +
  A(1.2, 'drop', coins(4), { x: 480, y: 560 }) +
  A(1.0, 'up', txt(0, 0, 'Canada aate hi RRSP?', 56), { x: 360, y: 170 }) +
  A(2.6, 'stamp', txt(0, 0, 'RUKO!', 110, { fill: RED }), { x: 360, y: 320, sfx: 'stamp+wrong' }) +
  A(4.2, 'up', txt(0, 0, 'Pehle saal ka room:', 46, { fill: '#666' }), { x: 470, y: 900 }) +
  A(5.4, 'stamp', txt(0, 0, '$0', 110, { fill: RED }), { x: 470, y: 1030, sfx: 'stamp+lose' }) +
  character({ x: 150, y: 1200, s: .55, pose: [[0, 'hold'], [1.2, 'point'], [2.6, 'cheeks'], [5.4, 'facepalm']], expr: [[0, 'excited'], [2.6, 'shock'], [4.2, 'worry'], [5.4, 'jawdrop']], act: [[0, 'walk', 1.0, 300], [1.3, 'hop', .45], [2.7, 'jump', .5], [5.5, 'shake', .8]], look: [[0, 'r'], [2.6, 'c'], [4.2, 'r']] }));
// 2. What is RRSP
scene(7.02, 12.60,
  A(7.1, 'up', txt(0, 0, 'Pehle samjho...', 50, { fill: '#666' }), { x: 360, y: 170 }) +
  HL(9.0, 360, 300, 340, 70) +
  A(8.5, 'pop', txt(0, 0, 'RRSP', 120, { fill: BLUE }), { x: 360, y: 335 }) +
  A(10.7, 'up', txt(0, 0, 'Registered Retirement', 50), { x: 360, y: 480 }) +
  A(11.2, 'up', txt(0, 0, 'Savings Plan', 50), { x: 360, y: 545 }) +
  A(10.9, 'pop', piggy(), { x: 470, y: 780, s: .75 }) +
  character({ x: 160, y: 1200, s: .55, pose: [[7.02, 'think'], [8.5, 'pointUp'], [10.7, 'present']], expr: [[7.02, 'think'], [8.5, 'smile'], [10.7, 'happy']], act: [[7.1, 'tilt', 1.0], [8.6, 'hop', .45], [10.8, 'nod', .6]], look: [[7.02, 'u'], [10.7, 'ur']] }));
// 3. Deduction -> less tax, more refund
scene(12.60, 18.98,
  A(12.7, 'up', txt(0, 0, 'Jo paisa RRSP mein daaloge...', 46), { x: 360, y: 170 }) +
  A(13.9, 'pop', card('Income', `<g transform="scale(.6)">${bill()}</g>`, 190, 130), { x: 160, y: 380 }) +
  A(14.6, 'pop', minus('−', RED), { x: 290, y: 395 }) +
  A(14.8, 'pop', card('RRSP', `<g transform="scale(.5)">${coins(3)}</g>`, 170, 130), { x: 410, y: 380 }) +
  A(15.5, 'pop', minus('=', INK), { x: 525, y: 395 }) +
  A(15.7, 'pop', txt(0, 0, 'KAM', 54, { fill: GREEN }), { x: 620, y: 370 }) +
  A(15.9, 'up', txt(0, 0, 'taxable', 30, { fill: '#666', w: 400 }), { x: 620, y: 415 }) +
  A(16.5, 'up', txt(0, 0, '↓ Tax KAM', 58, { fill: RED }), { x: 360, y: 600 }) +
  A(17.6, 'stamp', txt(0, 0, '↑ Refund ZYADA', 64, { fill: GREEN }), { x: 360, y: 720, sfx: 'stamp+cash' }) +
  character({ x: 150, y: 1200, s: .55, pose: [[12.6, 'hold'], [13.9, 'pointUp'], [16.5, 'thumbs'], [17.6, 'cheer']], expr: [[12.6, 'smile'], [14.8, 'think'], [16.5, 'happy'], [17.6, 'money']], act: [[13.9, 'nod', .5], [17.7, 'jump', .6]], look: [[12.6, 'ur']] }).replace('pose: [[12.6', 'pose: [[12.6'));
// 4. Example: $5,000 at 30% -> $1,500
scene(18.98, 29.21,
  A(19.0, 'up', txt(0, 0, 'Example se samjho:', 54), { x: 360, y: 170 }) +
  A(20.6, 'count', txt(0, 0, '$5,000', 100, { fill: BLUE, extra: 'data-n="5000" data-pre="$"' }), { x: 360, y: 320 }) +
  A(21.3, 'up', txt(0, 0, 'RRSP mein daale', 42, { fill: '#666' }), { x: 360, y: 380 }) +
  A(22.6, 'pop', pill('Tax rate ≈ 30%', '#f2a93b', '#fff', 44), { x: 360, y: 490 }) +
  A(24.6, 'up', txt(0, 0, 'Refund:', 50), { x: 360, y: 620 }) +
  A(25.9, 'count', txt(0, 0, '≈ $1,500', 110, { fill: GREEN, extra: 'data-n="1500" data-pre="≈ $"' }), { x: 380, y: 750 }) +
  A(27.4, 'up', txt(0, 0, 'Seedha jeb mein!', 50, { fill: GREEN }), { x: 420, y: 870 }) +
  character({ x: 140, y: 1205, s: .5, pose: [[18.98, 'scratch'], [20.6, 'point'], [22.6, 'think'], [25.9, 'cheer'], [27.4, 'thumbs']], expr: [[18.98, 'think'], [20.6, 'smile'], [22.6, 'think'], [25.9, 'money'], [27.4, 'wink']], act: [[19.0, 'scratch', 1.0], [20.7, 'nod', .5], [26.0, 'hops', 1.4], [27.5, 'spin', .6]], look: [[18.98, 'u'], [20.6, 'ur']] }));
// 5. 2027 limit $35,390
scene(29.21, 36.22,
  A(29.3, 'up', txt(0, 0, 'Ab asli limit:', 56), { x: 360, y: 170 }) +
  A(30.5, 'pop', calendar('YEAR', '2027', 'max limit', 190), { x: 360, y: 380 }) +
  A(33.2, 'count', txt(0, 0, '$35,390', 120, { fill: GREEN, extra: 'data-n="35390" data-pre="$"' }), { x: 360, y: 640 }) +
  A(34.8, 'stamp', stamp('Lekin dhyaan do!', RED, 46, -4), { x: 400, y: 790 }) +
  character({ x: 140, y: 1205, s: .52, pose: [[29.21, 'pointUp'], [33.2, 'cheer'], [34.8, 'wag']], expr: [[29.21, 'smile'], [33.2, 'excited'], [34.8, 'smug']], act: [[29.3, 'hop', .45], [33.3, 'jump', .6], [34.9, 'wag', 1.2]], look: [[29.21, 'ur']] }));
// 6. Room = 18% of last year's income; ~$196,600 to max
scene(36.22, 46.07,
  A(36.3, 'up', txt(0, 0, 'Tumhara room =', 54), { x: 360, y: 170 }) +
  A(37.6, 'stamp', txt(0, 0, '18%', 130, { fill: BLUE }), { x: 360, y: 330 }) +
  A(38.4, 'up', txt(0, 0, 'pichle saal ki earned income ka', 42), { x: 360, y: 420 }) +
  A(40.4, 'up', txt(0, 0, 'Max tak pahunchne ke liye income:', 42, { fill: '#666' }), { x: 360, y: 560 }) +
  A(42.3, 'count', txt(0, 0, '≈ $196,600', 104, { fill: GREEN, extra: 'data-n="196600" data-pre="≈ $"' }), { x: 360, y: 690 }) +
  A(44.4, 'pop', coins(6), { x: 560, y: 960 }) + A(44.6, 'pop', coins(4), { x: 640, y: 980 }) +
  character({ x: 220, y: 1205, s: .55, pose: [[36.22, 'point'], [37.6, 'pointUp'], [40.4, 'scratch'], [42.3, 'cheeks']], expr: [[36.22, 'smile'], [37.6, 'think'], [40.4, 'think'], [42.3, 'jawdrop']], act: [[37.7, 'nod', .6], [40.5, 'scratch', 1.2], [42.4, 'jump', .55], [43.0, 'shake', .7]], look: [[36.22, 'u']] }));
// 7. Newcomers: room comes from last year's Canadian income
scene(46.07, 60.14,
  A(46.1, 'up', txt(0, 0, 'Newcomers ki', 52), { x: 360, y: 160 }) +
  A(47.2, 'stamp', stamp('SABSE BADI GALTI', RED, 54, -4), { x: 360, y: 260 }) +
  A(50.1, 'up', txt(0, 0, 'Room banta hai pichle saal ki', 42), { x: 360, y: 390 }) +
  HL(51.5, 360, 436, 380, 46) +
  A(51.0, 'up', txt(0, 0, 'CANADIAN income se', 46, { fill: BLUE }), { x: 360, y: 450 }) +
  A(53.3, 'pop', calendar('THIS YEAR', '$0', 'room', 150), { x: 200, y: 640, s: .85 }) +
  A(54.4, 'draw', arrowR(90), { x: 290, y: 640 }) +
  A(54.8, 'pop', calendar('NEXT YEAR', '✓', 'room', 150), { x: 500, y: 640, s: .85, sfx: 'ding' }) +
  A(56.6, 'pop', laptop('CRA My Account', 'RRSP room'), { x: 470, y: 960, s: .8 }) +
  A(58.0, 'up', txt(0, 0, 'ya Notice of Assessment', 36, { fill: '#666' }), { x: 470, y: 1060 }) +
  character({ x: 110, y: 1220, s: .48, pose: [[46.07, 'cheeks'], [50.1, 'point'], [53.3, 'shrug'], [54.8, 'thumbs'], [56.6, 'point']], expr: [[46.07, 'scared'], [50.1, 'smile'], [53.3, 'sad'], [54.8, 'happy'], [56.6, 'smile']], act: [[46.1, 'tremble', 1.2], [50.2, 'nod', .5], [53.4, 'shakehead', .9], [54.9, 'hop', .45]], look: [[46.07, 'ur'], [56.6, 'r']] }));
// 8. The trap: TFSA room comes back, RRSP room is gone
scene(60.14, 73.62,
  A(60.2, 'pop', warn(.7), { x: 170, y: 170, sfx: 'alert' }) +
  A(60.3, 'up', txt(0, 0, 'TRAP!', 90, { fill: RED, anchor: 'start' }), { x: 240, y: 200 }) +
  A(61.8, 'pop', box('TFSA', 280, 170), { x: 190, y: 480, s: .7 }) +
  A(62.6, 'draw', arrowR(80), { x: 300, y: 400 }) +
  A(62.8, 'pop', `<g transform="scale(.6)">${bill()}</g>`, { x: 430, y: 400 }) +
  A(64.0, 'pop', `${check(24)}${txt(40, 14, 'Room wapas', 42, { anchor: 'start', fill: GREEN })}`, { x: 330, y: 500, sfx: 'ding' }) +
  A(65.4, 'pop', box('RRSP', 280, 170), { x: 190, y: 780, s: .7 }) +
  A(66.0, 'draw', arrowR(80), { x: 300, y: 700 }) +
  A(66.2, 'pop', `<g transform="scale(.6)">${bill()}</g>`, { x: 430, y: 700 }) +
  A(66.9, 'stamp', `<g transform="scale(.35)">${bigX(60)}</g>${txt(36, 14, 'Room GAYA!', 46, { anchor: 'start', fill: RED })}`, { x: 330, y: 800, sfx: 'stamp+wrong' }) +
  A(68.4, 'up', txt(0, 0, 'Paisa = income', 46, { anchor: 'start' }), { x: 300, y: 920 }) +
  A(71.4, 'stamp', pill('Tax katega!', RED, '#fff', 44), { x: 360, y: 1020 }) +
  character({ x: 600, y: 1235, s: .42, pose: [[60.14, 'cheeks'], [61.8, 'pointL'], [64, 'thumbs'], [66.9, 'facepalm'], [68.4, 'shrug'], [71.4, 'hips']], expr: [[60.14, 'scared'], [61.8, 'smile'], [64, 'happy'], [66.9, 'cry'], [68.4, 'worry'], [71.4, 'angry']], act: [[60.2, 'tremble', 1.2], [64.1, 'hop', .45], [67.0, 'shake', .7], [71.5, 'stomp', 1.2]], look: [[60.14, 'l']] }));
// 9. Home Buyers' Plan
scene(73.62, 84.88,
  A(73.7, 'up', txt(0, 0, 'Lekin ek achhi baat!', 54, { fill: GREEN }), { x: 360, y: 170 }) +
  A(75.4, 'pop', house(), { x: 480, y: 520, s: .9 }) +
  A(75.8, 'up', txt(0, 0, 'Pehla ghar?', 50, { anchor: 'start' }), { x: 40, y: 330 }) +
  HL(77.4, 360, 627, 470, 50) +
  A(77.0, 'up', txt(0, 0, "Home Buyers' Plan", 56, { fill: BLUE }), { x: 360, y: 645 }) +
  A(78.6, 'count', txt(0, 0, '$60,000 tak', 96, { fill: GREEN, extra: 'data-n="60000" data-pre="$"' }), { x: 360, y: 780 }) +
  A(81.3, 'pop', calendar('SHART', '15', 'saal', 150), { x: 330, y: 960, s: .8 }) +
  A(82.0, 'up', txt(0, 0, 'mein wapas', 44, { anchor: 'start' }), { x: 410, y: 950 }) +
  A(82.4, 'up', txt(0, 0, 'daalna', 44, { anchor: 'start' }), { x: 410, y: 1002 }) +
  character({ x: 150, y: 1205, s: .5, pose: [[73.62, 'cheer'], [75.4, 'point'], [78.6, 'cheer'], [81.3, 'wag']], expr: [[73.62, 'excited'], [75.4, 'happy'], [78.6, 'star'], [81.3, 'smug']], act: [[73.7, 'hop', .45], [78.7, 'dance', 1.8], [81.4, 'wag', 1.2]], look: [[73.62, 'ur']] }));
// 10. RRSP or TFSA?
scene(84.88, 95.24,
  A(84.9, 'up', txt(0, 0, 'Sabse bada sawaal:', 52, { fill: '#666' }), { x: 360, y: 160 }) +
  A(86.0, 'stamp', txt(0, 0, 'RRSP ya TFSA?', 80, { fill: BLUE }), { x: 360, y: 280 }) +
  A(87.9, 'pop', pill('Simple rule', '#8a5cc4', '#fff', 38), { x: 360, y: 400 }) +
  A(89.4, 'up', `<rect x="-290" y="-70" width="580" height="140" rx="18" fill="#eaf3fc" stroke="${INK}" stroke-width="4"/>${txt(-260, -12, 'Income HIGH + tax HIGH', 40, { anchor: 'start' })}${txt(-260, 44, '→ RRSP', 52, { anchor: 'start', fill: BLUE })}`, { x: 360, y: 560 }) +
  A(92.4, 'up', `<rect x="-290" y="-70" width="580" height="140" rx="18" fill="#eaf7ec" stroke="${INK}" stroke-width="4"/>${txt(-260, -12, 'Income kam', 40, { anchor: 'start' })}${txt(-260, 44, '→ pehle TFSA', 52, { anchor: 'start', fill: GREEN })}`, { x: 360, y: 760 }) +
  character({ x: 600, y: 1235, s: .45, pose: [[84.88, 'scratch'], [86.0, 'shrug'], [87.9, 'pointUp'], [89.4, 'pointL'], [92.4, 'thumbs']], expr: [[84.88, 'think'], [86.0, 'worry'], [87.9, 'smile'], [89.4, 'smile'], [92.4, 'wink']], act: [[84.9, 'scratch', 1.0], [86.1, 'tilt', 1.0], [89.5, 'nod', .5], [92.5, 'hop', .45]], look: [[84.88, 'u'], [89.4, 'l']] }));
// 11. Deadline March 1, 2027
scene(95.24, 101.88,
  A(95.3, 'pop', warn(.6), { x: 150, y: 170, sfx: 'alert' }) +
  A(95.4, 'up', txt(0, 0, 'Deadline mat bhoolna!', 46, { anchor: 'start', fill: RED }), { x: 200, y: 190 }) +
  A(97.2, 'up', txt(0, 0, '2026 ke tax ke liye:', 48), { x: 360, y: 360 }) +
  A(99.3, 'stamp', calendar('MARCH', '1', '2027', 220), { x: 360, y: 590, sfx: 'stamp' }) +
  A(100.4, 'up', txt(0, 0, 'last date', 46, { fill: '#666' }), { x: 360, y: 760 }) +
  character({ x: 150, y: 1205, s: .52, pose: [[95.24, 'cheeks'], [97.2, 'point'], [99.3, 'wag']], expr: [[95.24, 'shock'], [97.2, 'smile'], [99.3, 'smug']], act: [[95.3, 'jump', .5], [97.3, 'nod', .5], [99.4, 'wag', 1.4]], look: [[95.24, 'u'], [97.2, 'ur']] }));
// 12. Share + disclaimer
scene(101.88, 108.38,
  A(101.9, 'pop', shareIcon(), { x: 520, y: 330, sfx: 'pop' }) +
  A(102.3, 'up', txt(0, 0, 'Us dost ko bhejo', 54), { x: 360, y: 500 }) +
  A(103.4, 'up', txt(0, 0, 'jo har saal refund miss karta hai!', 40, { fill: '#666' }), { x: 360, y: 565 }) +
  HL(105.8, 360, 705, 560, 48) +
  A(105.4, 'up', txt(0, 0, 'Education hai, financial advice nahi', 38), { x: 360, y: 720 }) +
  character({ x: 160, y: 1205, s: .52, pose: [[101.88, 'point'], [103.4, 'facepalm'], [105.4, 'hips']], expr: [[101.88, 'excited'], [103.4, 'sad'], [105.4, 'smile']], act: [[101.9, 'hop', .45], [103.5, 'shakehead', 1.0], [105.5, 'nod', .6]], look: [[101.88, 'ur']] }));
// 13. Follow + logo
scene(108.38, 999,
  A(108.5, 'pop', '', { sfx: 'sparkle' }) + A(109.2, 'pop', bell(), { x: 600, y: 590, s: .75, sfx: 'bell' }) +
  A(108.8, 'stamp', pill('FOLLOW', DG, '#fff', 70, 42), { x: 330, y: 600 }) +
  A(108.55, 'pop', sparks(150), { x: 360, y: 300, s: 1.35 }) +
  character({ x: 360, y: 1200, s: .72, pose: [[108.38, 'wave'], [110.2, 'thumbs']], expr: [[108.38, 'happy'], [108.8, 'excited'], [110.2, 'wink']], act: [[108.4, 'wave', 1.6], [108.8, 'hop', .45], [110.2, 'spin', .6]] }));
