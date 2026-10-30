// Paycheque video: CFG + scenes. Times are seconds in the voiceover.
const CFG = {
  voiceEnd: 121.37,          // voiceover length (s)
  endScene: 120.57,          // when the Follow/logo scene starts
  tail: 1.9,                 // hold after the voice ends so the logo is readable
  whoosh: [11.49, 20.56, 45.55, 64.97, 79.18, 96.27],   // ONLY major section changes (4–6)
  checks: [                  // every on-screen number that is derived from others
    { label: 'gross per paycheque', expr: '60000 / 26', expect: 2308, tol: 1 },
    { label: 'net pay', expr: '2308 - 205 - 150 - 129 - 38', expect: 1786 },
    { label: 'CPP per paycheque (5.95% after $3,500/yr exemption)', expr: '(2308 - 3500 / 26) * 0.0595', expect: 129, tol: 1 },
    { label: 'EI amount', expr: '2308 * 0.0163', expect: 38, tol: 1 },
  ],
};
// 1. Offer letter $60k
scene(0, 2.34,
  A(0.1, 'pop', offer(), { x: 470, y: 520, sfx: 'pop' }) +
  A(1.0, 'pop', '', { sfx: 'cash' }) +
  A(0.2, 'up', txt(0, 0, 'Ruko!', 80, { fill: RED }), { x: 200, y: 200 }) +
  character({ x: 190, y: 1180, s: .7, pose: [[0, 'point']], expr: [[0, 'excited'], [1.0, 'money']], act: [[0.05, 'hop', .45], [1.1, 'hop', .45]], look: [[0, 'ur']] }));
// 2. Bank has less money -> heartbreak
scene(2.34, 4.95,
  A(2.4, 'pop', phone('Deposit', '+ $1,786'), { x: 500, y: 560 }) +
  A(2.9, 'stamp', txt(0, 0, 'Itna kam?!', 70, { fill: RED }), { x: 360, y: 230, sfx: 'wrong' }) +
  A(3.6, 'pop', heart(1.1), { x: 160, y: 520, sfx: 'lose' }) +
  character({ x: 220, y: 1180, s: .7, pose: [[2.34, 'cheeks'], [3.6, 'facepalm']], expr: [[2.34, 'jawdrop'], [3.6, 'cry']], act: [[2.4, 'jump', .55], [3.0, 'shake', .7], [3.7, 'tremble', 1.2]], look: [[2.34, 'ur']] }));
// 3. Employer cut it? Ghapla! Where did the money go?
scene(4.95, 11.49,
  A(5.0, 'up', txt(0, 0, 'Employer ne kaat liya?!', 54), { x: 360, y: 180 }) +
  A(6.3, 'stamp', stamp('GHAPLA!', RED, 84, -6), { x: 360, y: 330 }) +
  A(10.3, 'pop', txt(0, 0, '?', 220, { fill: BLUE }), { x: 360, y: 620, sfx: 'boing' }) +
  A(10.4, 'up', txt(0, 0, 'Paisa gaya kahan?', 60), { x: 360, y: 780 }) +
  character({ x: 360, y: 1190, s: .62, pose: [[4.95, 'hips'], [6.3, 'wag'], [8.4, 'shrug'], [10.28, 'scratch']], expr: [[4.95, 'angry'], [8.4, 'sad'], [10.28, 'think']], act: [[5.0, 'stomp', 1.3], [6.4, 'wag', 1.8], [8.5, 'shakehead', 1.2], [10.3, 'scratch', 1.1]], look: [[4.95, 'c'], [10.28, 'u']] }));
// 4. Gross pay
scene(11.49, 20.56,
  A(11.55, 'up', txt(0, 0, 'Line 1:', 48, { fill: '#666' }), { x: 360, y: 150 }) +
  HL(12.2, 360, 212, 420, 54) +
  A(11.9, 'up', txt(0, 0, 'GROSS PAY', 80, { fill: BLUE }), { x: 360, y: 235 }) +
  A(12.9, 'up', txt(0, 0, '(katne se pehle ki kamai)', 38, { fill: '#666', w: 400 }), { x: 360, y: 295 }) +
  A(13.8, 'pop', card('Rate × Hours', `${txt(-40, 10, '$', 54, { fill: GREEN })}${txt(10, 10, '×', 44)}<circle cx="56" cy="-4" r="22" fill="#fff" stroke="${INK}" stroke-width="4"/><path d="M56,-4 V-18 M56,-4 L66,4" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`, 270, 130), { x: 470, y: 450 }) +
  A(15.4, 'pop', pill('Overtime = 1.5×', '#f2a93b', '#fff', 40), { x: 450, y: 590 }) +
  A(17.0, 'up', txt(0, 0, 'Har 2 hafte:', 50), { x: 450, y: 720 }) +
  A(18.74, 'count', txt(0, 0, '$2,308', 110, { fill: GREEN, extra: 'data-n="2308" data-pre="$"' }), { x: 450, y: 850 }) +
  character({ x: 150, y: 1190, s: .6, pose: [[11.49, 'pointUp'], [13.8, 'point'], [18.74, 'cheer']], expr: [[11.49, 'smile'], [15.4, 'excited'], [18.74, 'money']], act: [[11.5, 'walk', .9, 300], [15.4, 'nod', .6], [18.8, 'jump', .7]], look: [[11.49, 'ur'], [17, 'r']] }));
// 5. Income tax, twice
scene(20.56, 26.03,
  A(20.6, 'up', txt(0, 0, 'Ab sabse bada cut:', 56), { x: 360, y: 170 }) +
  A(21.6, 'stamp', stamp('INCOME TAX', RED, 78, -5), { x: 360, y: 320 }) +
  A(23.3, 'up', txt(0, 0, 'Ek baar nahi...', 52, { fill: '#666' }), { x: 360, y: 500 }) +
  A(24.4, 'stamp', txt(0, 0, 'DO BAAR!', 110, { fill: RED }), { x: 360, y: 640, sfx: 'stamp+wrong' }) +
  A(24.6, 'pop', txt(0, 0, '×2', 90, { fill: INK }), { x: 590, y: 800 }) +
  character({ x: 300, y: 1190, s: .62, pose: [[20.56, 'cheeks'], [24.4, 'idle']], expr: [[20.56, 'scared'], [21.6, 'shock'], [24.4, 'dizzy']], act: [[20.6, 'tremble', 1.0], [21.7, 'jump', .5], [24.5, 'wobble', 1.5]], look: [[20.56, 'u']] }));
// 6. Federal + provincial
scene(26.03, 34.58,
  A(26.1, 'up', txt(0, 0, 'Dhyaan se suno:', 52), { x: 360, y: 160 }) +
  A(27.4, 'pop', `<rect x="-150" y="-130" width="300" height="260" rx="18" fill="#fff" stroke="${INK}" stroke-width="5"/>${leaf(.9)}${txt(0, 90, 'FEDERAL', 44, { fill: RED })}<g transform="translate(0,-60)"></g>`, { x: 190, y: 400 }) +
  A(28.6, 'up', txt(0, 0, 'Canada govt', 40, { fill: '#666' }), { x: 190, y: 570 }) +
  A(30.45, 'pop', `<rect x="-150" y="-130" width="300" height="260" rx="18" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M-70,30 L-40,-50 L-10,0 L20,-70 L70,30 Z" fill="${GREEN}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>${txt(0, 90, 'PROVINCIAL', 42, { fill: BLUE })}`, { x: 530, y: 400 }) +
  A(31.2, 'up', txt(0, 0, 'Tumhara province', 40, { fill: '#666' }), { x: 530, y: 570 }) +
  A(32.6, 'up', txt(0, 0, 'Har province ka rate alag!', 46), { x: 360, y: 680 }) +
  [['ON', BLUE], ['BC', GREEN], ['AB', RED], ['QC', '#8a5cc4']].map(([p, c], i) => A(33.0 + i * .2, 'drop', tag(p, c), { x: 180 + i * 120, y: 790 })).join('') +
  character({ x: 360, y: 1200, s: .5, pose: [[26.03, 'shh'], [27.4, 'pointL'], [30.45, 'point'], [32.6, 'shrug']], expr: [[26.03, 'smug'], [27.4, 'smile'], [32.6, 'wink']], act: [[27.5, 'nod', .6], [30.5, 'nod', .6], [32.7, 'hop', .45]], look: [[26.03, 'c'], [27.4, 'ul'], [30.45, 'ur']] }));
// 7. TD1 relief, but still $205
scene(34.58, 45.55,
  A(34.65, 'up', txt(0, 0, 'Ek relax wali news', 54, { fill: GREEN }), { x: 360, y: 160 }) +
  A(35.3, 'pop', doc('TD1 FORM', 200, 250).replace('Gross', 'Basic').replace('$$$', '✓').replace("'Tax'", "'Tax'"), { x: 170, y: 410 }) +
  A(36.4, 'up', txt(0, 0, 'Pehle', 44, { fill: '#666', anchor: 'start' }), { x: 320, y: 340 }) +
  A(36.9, 'count', txt(0, 0, '$16,452', 84, { fill: GREEN, anchor: 'start', extra: 'data-n="16452" data-pre="$"' }), { x: 310, y: 430 }) +
  A(38.9, 'stamp', stamp('Federal tax ≈ $0', GREEN, 50, -4), { x: 360, y: 600, sfx: 'stamp+ding' }) +
  A(41.6, 'up', txt(0, 0, 'Phir bhi har paycheque:', 46), { x: 360, y: 760 }) +
  A(43.0, 'count', txt(0, 0, '−$205', 100, { fill: RED, extra: 'data-n="205" data-pre="−$"' }), { x: 300, y: 880 }) +
  A(43.4, 'up', txt(0, 0, 'federal', 40, { fill: '#666', anchor: 'start' }), { x: 450, y: 875 }) +
  character({ x: 600, y: 1220, s: .48, pose: [[34.58, 'hips'], [38.9, 'cheer'], [41.6, 'shrug'], [43.0, 'facepalm']], expr: [[34.58, 'happy'], [38.9, 'star'], [41.6, 'sad'], [43.0, 'cry']], act: [[34.7, 'nod', .6], [38.9, 'dance', 2.2], [43.1, 'shake', .6]], look: [[34.58, 'l']] }));
// 8. CPP
scene(45.55, 57.58,
  A(45.6, 'up', txt(0, 0, 'Katauti #2', 50, { fill: '#666' }), { x: 360, y: 150 }) +
  HL(46.1, 360, 212, 360, 56) +
  A(45.9, 'up', txt(0, 0, 'CPP', 96, { fill: BLUE }), { x: 360, y: 240 }) +
  A(46.6, 'up', txt(0, 0, 'Canada Pension Plan', 44), { x: 360, y: 300 }) +
  A(49.1, 'pop', shield(), { x: 170, y: 470, sfx: 'ding' }) +
  A(49.6, 'up', txt(0, 0, 'Budhape ki', 44, { anchor: 'start' }), { x: 270, y: 450 }) +
  A(50.0, 'up', txt(0, 0, 'suraksha', 44, { anchor: 'start' }), { x: 270, y: 505 }) +
  A(51.6, 'pop', pill('Rate: 5.95%', BLUE, '#fff', 44), { x: 360, y: 640 }) +
  A(53.4, 'up', txt(0, 0, 'Pehle $3,500 chhod kar...', 44), { x: 360, y: 760 }) +
  A(55.3, 'count', txt(0, 0, '≈ −$129', 96, { fill: RED, extra: 'data-n="129" data-pre="≈ −$"' }), { x: 400, y: 890 }) +
  A(55.8, 'up', txt(0, 0, '/ paycheque', 38, { fill: '#666' }), { x: 400, y: 945 }) +
  character({ x: 130, y: 1215, s: .5, pose: [[45.55, 'idle'], [46.6, 'think'], [49.1, 'thumbs'], [51.6, 'point'], [55.3, 'shrug']], expr: [[45.55, 'smile'], [46.6, 'think'], [49.1, 'happy'], [51.6, 'smile'], [55.3, 'worry']], act: [[45.6, 'walk', .9, 260], [49.2, 'nod', .6], [55.4, 'shakehead', .9]], look: [[45.55, 'ur']] }));
// 9. Employer matches + QPP
scene(57.58, 64.97,
  A(57.65, 'up', txt(0, 0, 'Lekin ruko... good news!', 52, { fill: GREEN }), { x: 360, y: 170 }) +
  A(59.4, 'up', txt(0, 0, 'Employer bhi daalta hai', 46), { x: 360, y: 290 }) +
  A(60.2, 'count', txt(0, 0, '+$129', 100, { fill: GREEN, extra: 'data-n="129" data-pre="+$"' }), { x: 360, y: 410 }) +
  A(60.0, 'pop', coins(5), { x: 360, y: 640 }) +
  A(61.7, 'pop', pill('Quebec? → QPP', '#8a5cc4', '#fff', 44), { x: 360, y: 770 }) +
  character({ x: 170, y: 1200, s: .55, pose: [[57.58, 'cheer'], [60.2, 'clap'], [61.7, 'thumbs']], expr: [[57.58, 'excited'], [60.2, 'happy'], [61.7, 'wink']], act: [[57.7, 'hop', .45], [60.3, 'clap', 1.3], [61.8, 'hop', .45]], look: [[57.58, 'r']] }) +
  character({ x: 540, y: 1200, s: .55, tie: RED, acc: 'boss', pose: [[57.58, 'idle'], [59.4, 'present'], [61.7, 'thumbs']], expr: [[57.58, 'smile'], [60.2, 'happy']], act: [[58.4, 'walk', 1.0, -330], [60.3, 'nod', .6]], look: [[57.58, 'l']] }));
// 10. EI
scene(64.97, 79.18,
  A(65.0, 'up', txt(0, 0, 'Teesri katauti?!', 60, { fill: RED }), { x: 360, y: 160 }) +
  HL(67.8, 360, 252, 560, 50) +
  A(67.35, 'up', txt(0, 0, 'EI = Employment Insurance', 50, { fill: BLUE }), { x: 360, y: 265 }) +
  A(68.9, 'rain', rain(40, 700, 380, 1100), { dur: 99 }) +
  A(69.2, 'drop', umbrella(), { x: 200, y: 790 }) +
  A(69.5, 'up', txt(0, 0, 'Naukri gayi?', 46, { anchor: 'start' }), { x: 360, y: 430 }) +
  A(70.3, 'up', txt(0, 0, 'Yeh bachayega!', 46, { anchor: 'start', fill: GREEN }), { x: 360, y: 490 }) +
  A(71.8, 'pop', pill('Rate: sirf 1.63%', BLUE, '#fff', 40), { x: 490, y: 610 }) +
  A(74.2, 'up', txt(0, 0, 'Employer deta hai', 44, { anchor: 'start' }), { x: 340, y: 740 }) +
  A(75.0, 'stamp', txt(0, 0, '1.4× zyada', 70, { fill: GREEN, anchor: 'start' }), { x: 340, y: 830 }) +
  character({ x: 200, y: 1190, s: .6, pose: [[64.97, 'hips'], [67.35, 'scratch'], [69.2, 'shrug'], [70.3, 'thumbs'], [75, 'cheer']], expr: [[64.97, 'angry'], [67.35, 'think'], [69.2, 'scared'], [70.3, 'happy'], [75, 'excited']], act: [[65.0, 'stomp', 1.2], [67.4, 'scratch', 1.2], [69.2, 'tremble', 1.0], [70.4, 'hop', .45], [75.1, 'hops', 1.5]], look: [[64.97, 'c'], [69.2, 'u'], [71.8, 'ur']] }) +
  character({ x: 600, y: 1215, s: .42, tie: RED, acc: 'boss', pose: [[73.8, 'present'], [75, 'thumbs']], expr: [[73.8, 'smile'], [75, 'wink']], act: [[73.8, 'walk', .9, -260]], look: [[73.8, 'l']], from: 73.8 }));
// 11. Full calculation
scene(79.18, 96.27,
  A(79.2, 'up', txt(0, 0, 'Ab poora hisaab!', 60), { x: 360, y: 150 }) +
  A(81.4, 'pop', pill('Ready?', '#f2a93b', '#fff', 40), { x: 360, y: 225 }) +
  A(79.6, 'pop', `<path d="M-280,-40 H280 V560 l-20,18 l-20,-18 l-20,18 l-20,-18 l-20,18 l-20,-18 l-20,18 l-20,-18 l-20,18 l-20,-18 l-20,18 l-20,-18 l-20,18 l-20,-18 l-20,18 l-20,-18 l-20,18 l-20,-18 l-20,18 l-20,-18 l-20,18 l-20,-18 l-20,18 l-20,-18 l-20,18 l-20,-18 l-20,18 l-20,-18 Z" fill="#fff" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`, { x: 360, y: 320 }) +
  row(80.3, 0, 'Gross pay', '$2,308', GREEN) +
  row(83.4, 1, 'Federal tax', '−$205', RED) +
  row(85.6, 2, 'Provincial tax*', '≈ −$150', RED) +
  row(88.4, 3, 'CPP', '−$129', RED) +
  row(90.0, 4, 'EI', '−$38', RED) +
  A(91.2, 'draw', line(120, 0, 600, 0, INK, 5), { y: 760 }) +
  A(92.1, 'count', txt(0, 0, 'NET  $1,786', 80, { fill: GREEN, extra: 'data-n="1786" data-pre="NET  $"' }), { x: 360, y: 840 }) +
  A(86.6, 'up', txt(0, 0, '*average, province pe depend', 26, { fill: '#888', w: 400, anchor: 'start' }), { x: 120, y: 940 }) +
  A(93.8, 'pop', bank(), { x: 120, y: 1050, s: .8 }) +
  A(94.2, 'up', txt(0, 0, 'Yahi bank mein aata hai', 34, { anchor: 'start' }), { x: 210, y: 1065 }) +
  character({ x: 650, y: 1240, s: .36, pose: [[79.18, 'pointUp'], [83.4, 'pointL'], [92.1, 'cheer'], [93.8, 'thumbs']], expr: [[79.18, 'excited'], [83.4, 'worry'], [92.1, 'money'], [93.8, 'wink']], act: [[81.5, 'hop', .45], [83.5, 'nod', .5], [88.5, 'nod', .5], [92.2, 'jump', .6]], look: [[79.18, 'ul']] }));
// 12. Secret 1: estimate, April, refund/bill
scene(96.27, 108.16,
  A(96.3, 'up', txt(0, 0, 'Jaane se pehle...', 50, { fill: '#666' }), { x: 360, y: 150 }) +
  A(97.4, 'stamp', stamp('2 RAAZ', '#8a5cc4', 80, -5), { x: 360, y: 270 }) +
  A(99.4, 'pop', pill('Raaz #1', '#8a5cc4', '#fff', 38), { x: 160, y: 410 }) +
  A(100.2, 'up', txt(0, 0, 'Paycheque tax = sirf ESTIMATE', 42), { x: 360, y: 500 }) +
  A(102.2, 'pop', calendar('APRIL', '30', 'tax filing', 150), { x: 160, y: 660, s: .85 }) +
  A(102.6, 'up', txt(0, 0, 'Asli hisaab', 44, { anchor: 'start' }), { x: 270, y: 640 }) +
  A(103.0, 'up', txt(0, 0, 'tax return mein', 44, { anchor: 'start' }), { x: 270, y: 695 }) +
  A(104.5, 'pop', `${check(26)}${txt(46, 14, 'Zyada kata → REFUND', 44, { anchor: 'start', fill: GREEN })}`, { x: 90, y: 830, sfx: 'cash' }) +
  A(106.3, 'pop', `<g transform="scale(.4)">${bigX(60)}</g>${txt(46, 14, 'Kam kata → BILL', 44, { anchor: 'start', fill: RED })}`, { x: 90, y: 920, sfx: 'wrong' }) +
  character({ x: 600, y: 1235, s: .45, pose: [[96.27, 'shh'], [99.4, 'pointL'], [104.5, 'cheer'], [106.3, 'facepalm']], expr: [[96.27, 'smug'], [99.4, 'smile'], [104.5, 'money'], [106.3, 'cry']], act: [[97.5, 'hop', .45], [104.6, 'hops', 1.4], [106.4, 'shake', .6]], look: [[96.27, 'c'], [99.4, 'l']] }));
// 13. Secret 2: year-end bigger paycheque
scene(108.16, 117.09,
  A(108.2, 'pop', pill('Raaz #2', '#8a5cc4', '#fff', 38), { x: 160, y: 160 }) +
  A(108.9, 'up', txt(0, 0, 'CPP + EI ki saalana limit', 46), { x: 360, y: 270 }) +
  A(109.6, 'up', txt(0, 0, 'poori ho gayi?', 46), { x: 360, y: 330 }) +
  months(110.4) +
  A(111.6, 'up', txt(0, 0, 'Saal ke end: paycheque BADA!', 42, { fill: BLUE }), { x: 360, y: 960 }) +
  A(113.2, 'stamp', stamp('RAISE NAHI!', RED, 70, -6), { x: 360, y: 520, sfx: 'stamp+lose' }) +
  A(115.2, 'up', txt(0, 0, 'Bas katauti khatam', 46, { fill: '#666' }), { x: 360, y: 1035 }) +
  character({ x: 610, y: 1240, s: .36, pose: [[108.16, 'scratch'], [110.9, 'pointL'], [111.6, 'cheer'], [113.2, 'cheeks'], [115.2, 'shrug']], expr: [[108.16, 'think'], [110.9, 'smile'], [111.6, 'money'], [113.2, 'jawdrop'], [115.2, 'sad']], act: [[108.2, 'scratch', 1.2], [111.7, 'hops', 1.4], [113.3, 'shake', .8], [115.3, 'shakehead', 1.0]], look: [[108.16, 'u'], [110.9, 'l']] }));
// 14. Read every line
scene(117.09, 120.57,
  A(117.1, 'up', txt(0, 0, 'Toh seekho:', 54, { fill: '#666' }), { x: 360, y: 160 }) +
  HL(117.9, 360, 238, 520, 56) +
  A(117.7, 'up', txt(0, 0, 'Har line padho!', 70, { fill: BLUE }), { x: 360, y: 262 }) +
  A(117.5, 'pop', stub(), { x: 450, y: 600 }) +
  A(118.2, 'slide', magnifier(), { x: 420, y: 560, attr: 'data-dx="80" data-dy="160"', dur: 2.2 }) +
  A(119.2, 'stamp', stamp('Paisa wahin hai!', GREEN, 44, -4), { x: 450, y: 930 }) +
  character({ x: 150, y: 1200, s: .55, pose: [[117.09, 'point'], [119.2, 'thumbs']], expr: [[117.09, 'smile'], [119.2, 'wink']], act: [[117.1, 'nod', .6], [119.3, 'hop', .45]], look: [[117.09, 'ur']] }));
// 15. Follow + logo
scene(120.57, 999,
  A(120.7, 'pop', '', { sfx: 'sparkle' }) + A(121.4, 'pop', bell(), { x: 600, y: 590, s: .75, sfx: 'bell' }) +
  A(121.0, 'stamp', pill('FOLLOW', DG, '#fff', 70, 42), { x: 330, y: 600 }) +
  A(120.75, 'pop', sparks(150), { x: 360, y: 300, s: 1.35 }) +
  A(121.6, 'up', txt(0, 0, 'Next: aur paisa ke raaz!', 40, { fill: '#666' }), { x: 360, y: 720 }) +
  character({ x: 360, y: 1200, s: .72, pose: [[120.57, 'wave'], [122.2, 'thumbs']], expr: [[120.57, 'happy'], [121.0, 'excited'], [122.2, 'wink']], act: [[120.6, 'wave', 1.5], [121.0, 'hop', .45], [122.2, 'spin', .6]] }));

