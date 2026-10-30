// RRSP (English, general Canadian audience, story of "Alex"). Brand: LoonieMath.
const CFG = {
  brand: true,
  logo: 'looniemath-logo.png',
  bg: 'grid',
  voiceEnd: 127.48,
  endScene: 124.23,
  tail: 1.9,
  whoosh: [20.35, 38.34, 63.74, 75.84, 90.04, 104.05],
  checks: [
    { label: 'refund example', expr: '5000 * 0.30', expect: 1500 },
    { label: 'income needed to max RRSP', expr: '35390 / 0.18', expect: 196600, tol: 50 },
  ],
};
// speech bubble with a tail pointing down toward the speaker (tail: -1 left, 1 right)
const say = (w, h, body, tail = -1) => `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="26" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M${tail * w * .18 - 22},${h / 2 - 3} L${tail * w * .34},${h / 2 + 46} L${tail * w * .18 + 22},${h / 2 - 3}" fill="#fff" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><rect x="${tail * w * .18 - 20}" y="${h / 2 - 8}" width="40" height="10" fill="#fff"/>${body}`;
const house = () => `<path d="M-120,0 V-130 L0,-215 L120,-130 V0 Z" fill="#fff4dc" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M-140,-120 L0,-235 L140,-120" fill="none" stroke="${RED}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/><rect x="-28" y="-80" width="56" height="80" fill="${BLUE}" stroke="${INK}" stroke-width="4"/><rect x="50" y="-110" width="44" height="40" fill="#cfe8ff" stroke="${INK}" stroke-width="4"/><rect x="-94" y="-110" width="44" height="40" fill="#cfe8ff" stroke="${INK}" stroke-width="4"/>`;
const shareIcon = () => `<circle r="60" fill="${GREEN}" stroke="${INK}" stroke-width="5"/><path d="M-22,10 L18,-14 M-22,10 L18,30" stroke="#fff" stroke-width="7"/><circle cx="-22" cy="10" r="11" fill="#fff"/><circle cx="20" cy="-16" r="11" fill="#fff"/><circle cx="20" cy="32" r="11" fill="#fff"/>`;
const nameTag = (s, c = BLUE) => `<rect x="-70" y="-24" width="140" height="48" rx="24" fill="${c}" stroke="${INK}" stroke-width="4"/>${txt(0, 12, s, 34, { fill: '#fff' })}`;
const FR = { tie: GREEN, acc: 'glasses' };

// 1. Meet Alex: 3 months in Canada, puts $3,000 in RRSP
scene(0, 8.76,
  A(0.2, 'pop', nameTag('ALEX'), { x: 200, y: 830 }) +
  A(0.6, 'up', txt(0, 0, '3 months in Canada', 50), { x: 360, y: 180 }) +
  A(2.4, 'pop', box('RRSP', 260, 170), { x: 480, y: 760 }) +
  A(3.4, 'drop', coins(4), { x: 490, y: 560 }) +
  A(4.0, 'count', txt(0, 0, '$3,000', 100, { fill: GREEN, extra: 'data-n="3000" data-pre="$"' }), { x: 470, y: 380 }) +
  character({ x: 200, y: 1200, s: .55, pose: [[0, 'idle'], [2.4, 'point'], [4.0, 'hips']], expr: [[0, 'smile'], [2.4, 'excited'], [4.0, 'smug']], act: [[0, 'walk', 1.2, 300], [4.1, 'hop', .45], [6.6, 'nod', .5]], look: [[0, 'r'], [2.4, 'ur']] }) +
  character({ x: 600, y: 1215, s: .5, ...FR, pose: [[6.6, 'idle']], expr: [[6.6, 'think']], act: [[6.6, 'walk', 1.0, -260]], look: [[6.6, 'l']], from: 6.6 }));
// 2. The question
scene(8.76, 17.01,
  A(9.0, 'pop', say(460, 170, txt(0, -18, 'How much RRSP room', 40) + txt(0, 34, 'do you actually have?', 40, { fill: BLUE }), 1), { x: 400, y: 330 }) +
  A(14.2, 'pop', say(240, 110, txt(0, 16, 'Room? 😂', 50), -1), { x: 230, y: 610 }) +
  A(15.3, 'pop', say(440, 110, txt(0, 14, 'I just opened the account!', 36), -1), { x: 300, y: 760 }) +
  character({ x: 170, y: 1200, s: .55, pose: [[8.76, 'idle'], [12.79, 'shrug'], [15.3, 'present']], expr: [[8.76, 'think'], [12.79, 'happy'], [15.3, 'smug']], act: [[12.8, 'hops', 1.3], [15.4, 'nod', .5]], look: [[8.76, 'r']] }) +
  character({ x: 600, y: 1215, s: .5, ...FR, pose: [[8.76, 'pointL'], [12.79, 'facepalm']], expr: [[8.76, 'smile'], [12.79, 'worry']], act: [[9.0, 'nod', .5], [15.4, 'shakehead', 1.2]], look: [[8.76, 'l']] }));
// 3. His room was $0
scene(17.01, 20.35,
  A(17.1, 'up', txt(0, 0, 'His room was...', 64, { fill: '#666' }), { x: 360, y: 260 }) +
  A(18.5, 'stamp', txt(0, 0, '$0', 200, { fill: RED }), { x: 360, y: 520, sfx: 'stamp+lose' }) +
  character({ x: 220, y: 1200, s: .6, pose: [[17.01, 'idle'], [18.5, 'cheeks']], expr: [[17.01, 'worry'], [18.5, 'jawdrop']], act: [[18.55, 'jump', .55], [19.1, 'shake', .8]], look: [[17.01, 'u']] }) +
  character({ x: 590, y: 1215, s: .5, ...FR, pose: [[17.01, 'facepalm']], expr: [[17.01, 'sad']], act: [[18.6, 'shakehead', 1.2]], look: [[17.01, 'l']] }));
// 4. What an RRSP is
scene(20.35, 30.63,
  A(20.4, 'up', txt(0, 0, 'See, an RRSP is a', 50, { fill: '#666' }), { x: 360, y: 160 }) +
  HL(21.8, 360, 222, 600, 56) +
  A(21.4, 'up', txt(0, 0, 'special retirement account', 52, { fill: BLUE }), { x: 360, y: 240 }) +
  A(24.5, 'pop', card('Income', `<g transform="scale(.6)">${bill()}</g>`, 190, 130), { x: 160, y: 430 }) +
  A(25.1, 'pop', txt(0, 0, '−', 54, { fill: RED }), { x: 290, y: 445 }) +
  A(25.3, 'pop', card('RRSP', `<g transform="scale(.5)">${coins(3)}</g>`, 170, 130), { x: 410, y: 430 }) +
  A(26.0, 'pop', txt(0, 0, '=', 54), { x: 525, y: 445 }) +
  A(26.2, 'pop', txt(0, 0, 'LESS', 50, { fill: GREEN }), { x: 620, y: 420 }) +
  A(26.4, 'up', txt(0, 0, 'taxable', 30, { fill: '#666', w: 400 }), { x: 620, y: 465 }) +
  A(27.6, 'up', txt(0, 0, '↓ Less tax', 60, { fill: RED }), { x: 360, y: 640 }) +
  A(28.8, 'stamp', txt(0, 0, '↑ Bigger refund', 64, { fill: GREEN }), { x: 360, y: 760, sfx: 'stamp+cash' }) +
  character({ x: 150, y: 1200, s: .55, pose: [[20.35, 'think'], [21.4, 'pointUp'], [24.5, 'present'], [28.8, 'cheer']], expr: [[20.35, 'think'], [21.4, 'smile'], [24.5, 'smile'], [28.8, 'money']], act: [[20.4, 'tilt', 1.0], [24.6, 'nod', .5], [28.9, 'jump', .6]], look: [[20.35, 'u'], [24.5, 'ur']] }));
// 5. $5,000 at 30% -> ~$1,500
scene(30.63, 38.34,
  A(30.7, 'count', txt(0, 0, '$5,000', 110, { fill: BLUE, extra: 'data-n="5000" data-pre="$"' }), { x: 360, y: 230 }) +
  A(31.4, 'up', txt(0, 0, 'into your RRSP', 44, { fill: '#666' }), { x: 360, y: 295 }) +
  A(32.4, 'pop', pill('30% tax rate', '#f2a93b', '#fff', 46), { x: 360, y: 410 }) +
  A(33.8, 'up', txt(0, 0, 'Back in your pocket:', 48), { x: 360, y: 540 }) +
  A(34.5, 'count', txt(0, 0, '≈ $1,500', 120, { fill: GREEN, extra: 'data-n="1500" data-pre="≈ $"' }), { x: 380, y: 680 }) +
  A(36.8, 'stamp', stamp('Sounds amazing, right?', BLUE, 40, -4), { x: 420, y: 830 }) +
  character({ x: 140, y: 1205, s: .52, pose: [[30.63, 'point'], [32.4, 'think'], [34.5, 'cheer'], [36.8, 'thumbs']], expr: [[30.63, 'smile'], [32.4, 'think'], [34.5, 'money'], [36.8, 'wink']], act: [[30.7, 'nod', .5], [34.6, 'hops', 1.4], [36.9, 'spin', .6]], look: [[30.63, 'ur']] }));
// 6. But room is earned last year
scene(38.34, 45.40,
  A(38.4, 'up', txt(0, 0, 'But...', 70, { fill: RED }), { x: 360, y: 170 }) +
  A(39.0, 'up', txt(0, 0, 'you can only use room', 50), { x: 360, y: 280 }) +
  HL(40.4, 360, 330, 460, 54) +
  A(39.8, 'up', txt(0, 0, 'you ALREADY have', 56, { fill: BLUE }), { x: 360, y: 350 }) +
  A(41.3, 'pop', calendar('LAST YEAR', 'EARN', 'room', 190), { x: 230, y: 620, s: .9 }) +
  A(42.0, 'draw', arrowR(80), { x: 340, y: 620 }) +
  A(42.4, 'pop', calendar('THIS YEAR', 'USE', 'room', 190), { x: 530, y: 620, s: .9, sfx: 'ding' }) +
  A(43.5, 'up', txt(0, 0, 'Every year you earn new room', 42, { fill: '#666' }), { x: 360, y: 820 }) +
  character({ x: 600, y: 1235, s: .45, pose: [[38.34, 'wag'], [41.3, 'pointL'], [43.5, 'present']], expr: [[38.34, 'smug'], [41.3, 'smile'], [43.5, 'happy']], act: [[38.4, 'wag', 1.4], [41.4, 'nod', .5], [43.6, 'hop', .45]], look: [[38.34, 'c'], [41.3, 'l']] }));
// 7. 18% of last year's Canadian income, max $35,390, income ~$196,600
scene(45.40, 58.06,
  A(45.5, 'stamp', txt(0, 0, '18%', 130, { fill: BLUE }), { x: 360, y: 220 }) +
  A(46.2, 'up', txt(0, 0, "of last year's", 46), { x: 360, y: 310 }) +
  HL(47.0, 360, 357, 400, 50) +
  A(46.6, 'up', txt(0, 0, 'CANADIAN income', 52, { fill: RED }), { x: 360, y: 375 }) +
  A(48.0, 'up', txt(0, 0, 'Max for 2027:', 46, { fill: '#666' }), { x: 360, y: 500 }) +
  A(49.0, 'count', txt(0, 0, '$35,390', 110, { fill: GREEN, extra: 'data-n="35390" data-pre="$"' }), { x: 360, y: 620 }) +
  A(52.9, 'up', txt(0, 0, 'To max it out, income near', 44, { fill: '#666' }), { x: 360, y: 750 }) +
  A(54.3, 'count', txt(0, 0, '$196,600', 96, { fill: BLUE, extra: 'data-n="196600" data-pre="$"' }), { x: 400, y: 870 }) +
  character({ x: 130, y: 1215, s: .5, pose: [[45.4, 'pointUp'], [48.0, 'point'], [49.0, 'cheer'], [54.3, 'cheeks']], expr: [[45.4, 'smile'], [46.6, 'think'], [49.0, 'excited'], [54.3, 'jawdrop']], act: [[45.5, 'nod', .5], [49.1, 'jump', .6], [54.4, 'shake', .8]], look: [[45.4, 'ur']] }));
// 8. Alex earned $0 last year -> room $0 -> newcomer mistake
scene(58.06, 65.78,
  A(58.1, 'up', txt(0, 0, "Alex's Canadian income", 48), { x: 360, y: 170 }) +
  A(58.7, 'up', txt(0, 0, 'last year:', 48, { fill: '#666' }), { x: 360, y: 230 }) +
  A(59.8, 'stamp', txt(0, 0, '$0', 110, { fill: RED }), { x: 360, y: 350, sfx: 'stamp' }) +
  A(61.0, 'up', txt(0, 0, "So Alex's room:", 50), { x: 360, y: 490 }) +
  A(62.5, 'stamp', txt(0, 0, '$0', 140, { fill: RED }), { x: 360, y: 630, sfx: 'stamp+wrong' }) +
  A(63.8, 'stamp', stamp('THE NEWCOMER MISTAKE', RED, 44, -4), { x: 400, y: 800 }) +
  character({ x: 140, y: 1205, s: .52, pose: [[58.06, 'shrug'], [62.5, 'facepalm']], expr: [[58.06, 'worry'], [62.5, 'cry']], act: [[58.1, 'shakehead', .9], [62.6, 'shake', .8], [63.8, 'tremble', 1.6]], look: [[58.06, 'ur']] }));
// 9. Arrived this year -> room next year; check CRA My Account; never guess
scene(65.78, 75.84,
  A(65.8, 'pop', calendar('ARRIVED', '2026', 'room: $0', 190), { x: 200, y: 330, s: .85 }) +
  A(66.6, 'draw', arrowR(80), { x: 310, y: 330 }) +
  A(67.0, 'pop', calendar('ROOM', '2027', 'starts', 190), { x: 520, y: 330, s: .85, sfx: 'ding' }) +
  A(68.5, 'up', txt(0, 0, 'Before you deposit a dollar:', 44), { x: 360, y: 530 }) +
  A(69.4, 'up', txt(0, 0, 'check your REAL room', 52, { fill: BLUE }), { x: 360, y: 595 }) +
  A(71.4, 'pop', laptop('CRA My Account', 'RRSP room'), { x: 470, y: 860, s: .8 }) +
  A(72.6, 'up', txt(0, 0, 'or your Notice of Assessment', 34, { fill: '#666' }), { x: 470, y: 960 }) +
  A(74.5, 'stamp', stamp('NEVER GUESS', RED, 50, -5), { x: 440, y: 1075 }) +
  character({ x: 110, y: 1220, s: .48, pose: [[65.78, 'pointUp'], [68.5, 'point'], [71.4, 'thumbs'], [74.5, 'wag']], expr: [[65.78, 'think'], [68.5, 'smile'], [71.4, 'happy'], [74.5, 'smug']], act: [[65.9, 'nod', .5], [71.5, 'hop', .45], [74.6, 'wag', 1.1]], look: [[65.78, 'u'], [71.4, 'r']] }));
// 10. "I'll just take it out later" -> TFSA vs RRSP withdrawal
scene(75.84, 90.04,
  A(75.9, 'pop', say(500, 110, txt(0, 14, '"Fine, I\'ll just take it out later."', 32), -1), { x: 330, y: 160 }) +
  A(78.9, 'pop', warn(.6), { x: 110, y: 330, sfx: 'alert' }) +
  A(79.0, 'up', txt(0, 0, 'Careful!', 70, { fill: RED, anchor: 'start' }), { x: 170, y: 355 }) +
  A(79.6, 'pop', box('TFSA', 280, 170), { x: 190, y: 560, s: .65 }) +
  A(80.4, 'draw', arrowR(70), { x: 300, y: 490 }) +
  A(80.6, 'pop', `<g transform="scale(.55)">${bill()}</g>`, { x: 420, y: 490 }) +
  A(81.6, 'pop', `${check(22)}${txt(36, 13, 'Room comes back', 38, { anchor: 'start', fill: GREEN })}`, { x: 320, y: 580, sfx: 'ding' }) +
  A(82.8, 'pop', box('RRSP', 280, 170), { x: 190, y: 800, s: .65 }) +
  A(83.6, 'draw', arrowR(70), { x: 300, y: 730 }) +
  A(83.8, 'pop', `<g transform="scale(.55)">${bill()}</g>`, { x: 420, y: 730 }) +
  A(84.8, 'stamp', `<g transform="scale(.33)">${bigX(60)}</g>${txt(32, 13, 'Room GONE forever', 38, { anchor: 'start', fill: RED })}`, { x: 320, y: 820, sfx: 'stamp+wrong' }) +
  A(86.4, 'up', txt(0, 0, '+ it counts as income', 42, { anchor: 'start' }), { x: 230, y: 935 }) +
  A(88.0, 'stamp', pill('Taxed on the way out', RED, '#fff', 38), { x: 320, y: 1030 }) +
  character({ x: 650, y: 1240, s: .4, pose: [[75.84, 'shrug'], [78.9, 'cheeks'], [81.6, 'thumbs'], [84.8, 'facepalm'], [88.0, 'hips']], expr: [[75.84, 'smug'], [78.9, 'shock'], [81.6, 'happy'], [84.8, 'cry'], [88.0, 'angry']], act: [[75.9, 'nod', .5], [79.0, 'jump', .5], [84.9, 'shake', .7], [88.1, 'stomp', 1.2]], look: [[75.84, 'l']] }));
// 11. Home Buyers' Plan
scene(90.04, 104.05,
  A(90.1, 'up', txt(0, 0, 'One good news story:', 54, { fill: GREEN }), { x: 360, y: 170 }) +
  A(93.0, 'pop', house(), { x: 480, y: 520, s: .9 }) +
  A(93.1, 'up', txt(0, 0, 'First home?', 50, { anchor: 'start' }), { x: 40, y: 330 }) +
  HL(95.2, 360, 627, 470, 50) +
  A(94.9, 'up', txt(0, 0, "Home Buyers' Plan", 56, { fill: BLUE }), { x: 360, y: 645 }) +
  A(96.4, 'up', txt(0, 0, 'pull up to', 40, { fill: '#666' }), { x: 360, y: 720 }) +
  A(97.3, 'count', txt(0, 0, '$60,000', 100, { fill: GREEN, extra: 'data-n="60000" data-pre="$"' }), { x: 360, y: 830 }) +
  A(101.0, 'pop', calendar('PAY BACK', '15', 'years', 150), { x: 330, y: 1010, s: .8 }) +
  A(101.6, 'up', txt(0, 0, 'within', 44, { anchor: 'start' }), { x: 410, y: 1000 }) +
  A(102.0, 'up', txt(0, 0, '15 years', 44, { anchor: 'start' }), { x: 410, y: 1052 }) +
  character({ x: 140, y: 1215, s: .48, pose: [[90.04, 'cheer'], [93.0, 'point'], [97.3, 'cheer'], [101.0, 'wag']], expr: [[90.04, 'excited'], [93.0, 'happy'], [97.3, 'star'], [101.0, 'smug']], act: [[90.1, 'hop', .45], [97.4, 'dance', 2.0], [101.1, 'wag', 1.2]], look: [[90.04, 'ur']] }));
// 12. Alex's rule
scene(104.05, 113.69,
  A(104.1, 'up', txt(0, 0, "So Alex's rule now:", 56), { x: 360, y: 170 }) +
  A(106.0, 'up', `<rect x="-290" y="-75" width="580" height="150" rx="18" fill="#eaf3fc" stroke="${INK}" stroke-width="4"/>${txt(-260, -14, 'High income, high tax bracket', 36, { anchor: 'start' })}${txt(-260, 46, '→ RRSP shines', 54, { anchor: 'start', fill: BLUE })}`, { x: 360, y: 370 }) +
  A(110.4, 'up', `<rect x="-290" y="-75" width="580" height="150" rx="18" fill="#eaf7ec" stroke="${INK}" stroke-width="4"/>${txt(-260, -14, 'Lower income', 36, { anchor: 'start' })}${txt(-260, 46, '→ TFSA first', 54, { anchor: 'start', fill: GREEN })}`, { x: 360, y: 580 }) +
  character({ x: 200, y: 1205, s: .55, pose: [[104.05, 'scratch'], [106.0, 'pointUp'], [108.4, 'cheer'], [110.4, 'point'], [111.7, 'thumbs']], expr: [[104.05, 'think'], [106.0, 'smile'], [108.4, 'star'], [110.4, 'smile'], [111.7, 'wink']], act: [[104.1, 'scratch', 1.0], [108.5, 'hop', .45], [111.8, 'hop', .45]], look: [[104.05, 'u'], [106.0, 'ur']] }) +
  character({ x: 580, y: 1215, s: .48, ...FR, pose: [[104.05, 'thumbs'], [108.4, 'clap']], expr: [[104.05, 'happy'], [108.4, 'excited']], act: [[108.5, 'clap', 1.4], [111.8, 'nod', .6]], look: [[104.05, 'l']] }));
// 13. Deadline
scene(113.69, 118.14,
  A(113.75, 'pop', warn(.6), { x: 130, y: 170, sfx: 'alert' }) +
  A(113.85, 'up', txt(0, 0, 'Deadline', 60, { anchor: 'start', fill: RED }), { x: 190, y: 192 }) +
  A(114.6, 'up', txt(0, 0, 'for the 2026 tax year:', 46), { x: 360, y: 330 }) +
  A(116.3, 'stamp', calendar('MARCH', '1', '2027', 220), { x: 360, y: 570, sfx: 'stamp' }) +
  character({ x: 150, y: 1205, s: .52, pose: [[113.69, 'cheeks'], [116.3, 'wag']], expr: [[113.69, 'shock'], [116.3, 'smug']], act: [[113.75, 'jump', .5], [116.4, 'wag', 1.4]], look: [[113.69, 'u'], [116.3, 'ur']] }));
// 14. Share + disclaimer
scene(118.14, 124.23,
  A(118.2, 'pop', shareIcon(), { x: 520, y: 300, sfx: 'pop' }) +
  A(118.6, 'up', txt(0, 0, 'Send this to a friend', 54), { x: 360, y: 470 }) +
  A(119.2, 'up', txt(0, 0, 'who just landed', 54, { fill: BLUE }), { x: 360, y: 535 }) +
  A(120.1, 'up', txt(0, 0, '...before they become Alex 😅', 42, { fill: '#666' }), { x: 360, y: 620 }) +
  HL(121.9, 360, 745, 560, 48) +
  A(121.6, 'up', txt(0, 0, 'Education, not financial advice', 40), { x: 360, y: 760 }) +
  character({ x: 160, y: 1205, s: .52, pose: [[118.14, 'point'], [120.1, 'facepalm'], [121.6, 'hips']], expr: [[118.14, 'excited'], [120.1, 'sad'], [121.6, 'smile']], act: [[118.2, 'hop', .45], [120.2, 'shakehead', 1.0], [121.7, 'nod', .6]], look: [[118.14, 'ur']] }));
// 15. Follow LoonieMath (logo reveal comes from the engine at the top)
scene(124.23, 999,
  A(124.3, 'pop', '', { sfx: 'sparkle' }) +
  A(124.75, 'stamp', pill('FOLLOW', BLUE, '#fff', 74, 44), { x: 320, y: 600 }) +
  A(125.2, 'pop', bell(), { x: 600, y: 590, s: .75, sfx: 'bell' }) +
  A(125.6, 'up', txt(0, 0, 'Money stories, every day', 46, { fill: '#666' }), { x: 360, y: 720 }) +
  character({ x: 220, y: 1200, s: .6, pose: [[124.23, 'wave'], [126.6, 'thumbs']], expr: [[124.23, 'happy'], [124.75, 'excited'], [126.6, 'wink']], act: [[124.3, 'wave', 1.6], [124.75, 'hop', .45], [126.6, 'spin', .6]] }) +
  character({ x: 540, y: 1210, s: .52, ...FR, pose: [[124.23, 'cheer'], [126.6, 'thumbs']], expr: [[124.23, 'excited'], [126.6, 'happy']], act: [[124.4, 'hops', 1.5]] }));
