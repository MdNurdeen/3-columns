// Character sheet for approving Alex's look (not a video)
const CFG = { brand: false, bg: 'dots', voiceEnd: 3, endScene: 3, tail: 0, whoosh: [], checks: [] };
scene(0, 999,
  A(0, 'pop', txt(0, 0, 'Alex', 90, { fill: '#1e5bd8' }), { x: 360, y: 200 }) +
  character({ x: 130, y: 1150, s: .62, pose: [[0, 'idle']], expr: [[0, 'smile']], act: [] }) +
  character({ x: 360, y: 1150, s: .62, pose: [[0, 'thumbs']], expr: [[0, 'wink']], act: [] }) +
  character({ x: 590, y: 1150, s: .62, pose: [[0, 'cheer']], expr: [[0, 'money']], act: [] }) +
  character({ x: 360, y: 640, s: .55, pose: [[0, 'point']], expr: [[0, 'happy']], act: [] }));
