/* Six extra interactive examples for every existing example area, ordered Easy 1 to Hard 6. */
const VectorExamples = (() => {
  const m = VectorMath.math;
  const col = VectorMath.column;
  const LEVELS = [
    { label: 'Easy 1', tier: 'easy' },
    { label: 'Easy 2', tier: 'easy' },
    { label: 'Easy 3', tier: 'easy' },
    { label: 'Medium 4', tier: 'medium' },
    { label: 'Medium 5', tier: 'medium' },
    { label: 'Medium 6', tier: 'medium' },
    { label: 'Hard 7', tier: 'hard' },
    { label: 'Hard 8', tier: 'hard' }
  ];
  const XP = { easy: 5, medium: 10, hard: 15 };
  const solved = new Set();

  const n = value => String(Number(Number(value).toFixed(4)));
  const vec = (x, y) => `${n(x)}i ${y < 0 ? '−' : '+'} ${n(Math.abs(y))}j`;
  const neg = value => (value < 0 ? `(${n(value)})` : n(value));
  // one shared rendering of a scalar multiple so prompt, diagram, readout and solution agree
  const term = (k, name) => (k === 1 ? name : k === -1 ? `−${name}` : `${n(k)}${name}`);
  const combo = (p, q) => {
    const first = p === 0 ? '' : term(p, 'a');
    if (q === 0) return first || '0';
    const second = term(Math.abs(q), 'b');
    if (!first) return q < 0 ? `−${second}` : second;
    return `${first} ${q < 0 ? '−' : '+'} ${second}`;
  };
  const degrees = (y, x) => ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  const eq = (...lines) => lines.join('<br>');
  const steps = (...items) => `<ol>${items.map(item => `<li>${item}</li>`).join('')}</ol>`;
  const v = (ox, oy, dx, dy, color, label, dashed) => ({ ox, oy, dx, dy, color, label, dashed });
  // a zero-length arrow has no direction, so it is dropped rather than drawn degenerately
  const drawable = arrows => arrows.filter(arrow => arrow.dx !== 0 || arrow.dy !== 0);
  const slider = (key, label, min, max, step, value) => ({ key, label, kind: 'range', min, max, step, value });
  const chooser = (key, label, options, value) => ({ key, label, kind: 'select', options, value });
  const box = (key, label, dp = 0) => ({ key, label, dp });
  const pick = (key, label, options) => ({ key, label, kind: 'select', options });

  /* ---------- Area 1: Intro — everyday quantities and applications ---------- */
  const QUANTITIES = [
    ['Distance of 5 km', '5 km', 'scalar', 'only the length is given, no direction'],
    ['Velocity of 20 m/s towards North', '20 m/s', 'vector', 'direction "towards North" is stated with the magnitude'],
    ['Mass of 3 kg', '3 kg', 'scalar', 'mass does not have a direction'],
    ['Force of 10 N downward', '10 N', 'vector', 'direction "downward" is stated with the magnitude'],
    ['Speed of 60 km/h', '60 km/h', 'scalar', 'speed is only the magnitude of velocity'],
    ['Displacement of 4 m towards East', '4 m', 'vector', 'displacement always includes direction']
  ];

  const introExamples = [
    {
      title: 'Scalar or Vector?',
      controls: [chooser('q', 'Choose a quantity', QUANTITIES.map((item, index) => [index, item[0]]), 0)],
      prompt: st => `Selected quantity: <strong>${QUANTITIES[st.q][0]}</strong>. Is this a scalar or a vector?`,
      readout: st => eq(`Size/Amount: <strong>${QUANTITIES[st.q][1]}</strong>`, 'Check: Does the description tell us a direction? (like "North", "downward", "East")'),
      fields: () => [pick('type', 'Type of quantity', [['scalar', 'Scalar (size/amount only)'], ['vector', 'Vector (size AND direction)']])],
      answers: st => ({ type: QUANTITIES[st.q][2] }),
      hint: () => '<strong>Scalar</strong> = just the size/amount (like 5 km). <strong>Vector</strong> = size AND direction (like 5 km North). Look for direction words: "North", "East", "downward", "upward".',
      solution: st => `${QUANTITIES[st.q][0]} is a <strong>${QUANTITIES[st.q][2]}</strong> because ${QUANTITIES[st.q][3]}.`
    },
    {
      title: 'Magnitude of Displacement: Two Perpendicular Steps',
      controls: [slider('e', 'Steps East (km)', 1, 8, 1, 3), slider('u', 'Steps North (km)', 1, 8, 1, 4)],
      prompt: st => `You walk ${st.e} km EAST, then ${st.u} km NORTH. What is your straight-line displacement (distance from start)? Round to 2 decimal places.`,
      visual: st => buildDiagramSVG([v(0, 0, st.e, 0, 'blue', `${st.e} East`), v(st.e, 0, 0, st.u, 'red', `${st.u} North`), v(0, 0, st.e, st.u, 'green', 'Displacement')]),
      readout: st => eq(`Your path forms a RIGHT ANGLE (90°)`, `You can use Pythagorean Theorem: ${m('Displacement = √(East² + North²) = √(' + st.e + '² + ' + st.u + '²)')}`),
      fields: () => [box('mag', 'Displacement magnitude (km, 2 d.p.)', 2)],
      answers: st => ({ mag: Math.hypot(st.e, st.u) }),
      hint: () => 'Your two paths meet at a RIGHT ANGLE. Use the Pythagorean Theorem: √(x² + y²) where x = East distance, y = North distance.',
      solution: st => steps(`Your path: ${st.e} km East and ${st.u} km North`, `${m('Displacement = √(' + st.e + '² + ' + st.u + '²)')}`, `${m('= √' + (st.e * st.e + st.u * st.u))} = ${m('√' + (st.e * st.e + st.u * st.u) + ' ≈ ' + Math.hypot(st.e, st.u).toFixed(2)))} km`, `Your straight-line distance from start = <strong>${Math.hypot(st.e, st.u).toFixed(2)} km</strong>`)
    },
    {
      title: 'Distance vs Displacement: What\'s the Difference?',
      controls: [slider('f', 'Move EAST (m)', 1, 9, 1, 4), slider('b', 'Then move WEST (m)', 1, 9, 1, 3)],
      prompt: st => `A cart moves ${st.f} m EAST, then ${st.b} m WEST. Find: (1) Total distance traveled, (2) Displacement component (East-West position).`,
      visual: st => buildDiagramSVG([v(0, 0, st.f, 0, 'blue', `${st.f} m East`), v(st.f, 1, -st.b, 0, 'red', `${st.b} m West`), v(0, -1, st.f - st.b, 0, 'green', `Net displacement: ${st.f - st.b} m`)]),
      readout: st => eq(`<strong>Distance</strong> = add ALL path lengths (scalar - no direction)`, `<strong>Displacement</strong> = straight line from START to END (vector - has direction)`),
      fields: () => [box('dist', 'Total distance walked (m)'), box('disp', 'Final position (East = +, West = −, in m)')],
      answers: st => ({ dist: st.f + st.b, disp: st.f - st.b }),
      hint: () => '<strong>Think of it this way:</strong> Distance = "How much walking did you do?" (add all steps). Displacement = "How far from home are you?" (only start and end positions matter).',
      solution: st => steps(`Total distance = ${st.f} + ${st.b} = <strong>${st.f + st.b}</strong> m (you walked this far)`, `Displacement = ${st.f} East − ${st.b} West = <strong>${st.f - st.b}</strong> m (you are ${st.f - st.b} m East of start)`, `<strong>Key difference:</strong> Distance is always positive. Displacement can be positive or negative.`)
    },
    {
      title: 'Real-World Application: Airplane with Wind (Resultant Velocity)',
      controls: [slider('p', 'Airplane velocity North (km/h)', 100, 400, 50, 300), slider('w', 'Wind velocity East (km/h)', 10, 150, 10, 50)],
      prompt: st => `An airplane flies at ${st.p} km/h NORTH. The wind pushes it at ${st.w} km/h EAST. What is the actual velocity (speed + direction) of the airplane? Give speed to 2 d.p. and direction angle in degrees.`,
      visual: st => buildDiagramSVG([v(0, 0, 0, st.p, 'blue', 'Airplane velocity (North)'), v(0, st.p, st.w, 0, 'red', 'Wind (East)'), v(0, 0, st.w, st.p, 'green', 'Actual velocity')]),
      readout: st => eq(`The airplane's ACTUAL path = ${m(vec(st.w, st.p))} km/h`, `Speed = ${m('√(' + st.w + '² + ' + st.p + '²)')}`, `Direction = angle from North`),
      fields: () => [box('mag', 'Actual speed (km/h, 2 d.p.)', 2), box('ang', 'Direction from North (degrees, 2 d.p.)', 2)],
      answers: st => ({ mag: Math.hypot(st.w, st.p), ang: (Math.atan2(st.w, st.p) * 180) / Math.PI }),
      hint: () => 'The North component is the vertical part (j), the East component is the horizontal part (i). Use: angle from North = atan2(East component, North component).',
      solution: st => steps(`Resultant velocity = ${m(vec(st.w, st.p))} km/h`, `Speed = ${m('√(' + st.w + '² + ' + st.p + '²) ≈ ' + Math.hypot(st.w, st.p).toFixed(2))} km/h`, `Direction from North = ${m('atan2(' + st.w + ', ' + st.p + ') ≈ ' + ((Math.atan2(st.w, st.p) * 180) / Math.PI).toFixed(2))}°`)
    },
    {
      title: 'Two Perpendicular Forces on a Hook and Equilibrium (Balance)',
      controls: [slider('a', 'Force 1 pulling EAST (N)', 100, 1000, 100, 800), slider('b', 'Force 2 pulling NORTH (N)', 100, 1000, 100, 600)],
      prompt: st => `Two cables pull on a hook: ${st.a} N EAST and ${st.b} N NORTH. Find: (1) Resultant force magnitude (2 d.p.), (2) The equilibrium force (balancing force) needed to keep hook stationary.`,
      visual: st => buildDiagramSVG([v(0, 0, st.a, 0, 'blue', 'Force 1 →'), v(0, 0, 0, st.b, 'red', 'Force 2 ↑'), v(0, 0, st.a, st.b, 'green', 'Resultant'), v(0, 0, -st.a, -st.b, 'purple', 'Balance (opposite)', true)]),
      readout: st => eq(`<strong>Force 1:</strong> ${m('' + st.a + 'i')} N, <strong>Force 2:</strong> ${m('' + st.b + 'j')} N`, `<strong>For equilibrium:</strong> Force 1 + Force 2 + Balance Force = 0`),
      fields: () => [box('mag', 'Resultant magnitude (N, 2 d.p.)', 2), box('ei', 'East component of balance force (N)'), box('ej', 'North component of balance force (N)')],
      answers: st => ({ mag: Math.hypot(st.a, st.b), ei: -st.a, ej: -st.b }),
      hint: () => 'Step 1: Find the resultant (total) force. Step 2: The balance force is the OPPOSITE direction, so both components change sign (positive becomes negative).',
      solution: st => steps(`Resultant = ${m(vec(st.a, st.b))} N`, `Magnitude = ${m('√(' + st.a + '² + ' + st.b + '²) ≈ ' + Math.hypot(st.a, st.b).toFixed(2))} N`, `Balance Force = −Resultant = ${m(vec(-st.a, -st.b))} N`, `This opposite force keeps the hook from moving.`)
    },
    {
      title: 'Game Object Position After Several Time Steps',
      controls: [slider('vx', 'Velocity in horizontal direction (units/frame)', -5, 5, 1, 2), slider('vy', 'Velocity in vertical direction (units/frame)', -5, 5, 1, 3), slider('t', 'Number of time steps (frames)', 1, 8, 1, 4)],
      prompt: st => `A game object starts at position ${m('(2, 1)')}. Each frame, it moves by velocity ${m(vec(st.vx, st.vy))}. Where is it after ${st.t} frames? Find final position and distance from origin (2 d.p.).`,
      visual: st => buildDiagramSVG([v(0, 0, 2, 1, 'blue', 'Start (2, 1)'), v(2, 1, st.vx * st.t, st.vy * st.t, 'red', `Movement ${st.t} times`), v(0, 0, 2 + st.vx * st.t, 1 + st.vy * st.t, 'green', 'Final position')]),
      readout: st => eq(`<strong>Formula:</strong> Final position = Start + (number of frames × velocity)`, `Start: ${m(vec(2, 1))} · Velocity per frame: ${m(vec(st.vx, st.vy))} · Frames: ${st.t}`),
      fields: () => [box('x', 'Final x position'), box('y', 'Final y position'), box('d', 'Distance from origin (2 d.p.)', 2)],
      answers: st => ({ x: 2 + st.vx * st.t, y: 1 + st.vy * st.t, d: Math.hypot(2 + st.vx * st.t, 1 + st.vy * st.t) }),
      hint: () => 'Step 1: Multiply velocity by number of frames. Step 2: Add this to starting position. Step 3: Use distance formula to find how far from origin.',
      solution: st => steps(`Velocity × Frames = ${m(vec(st.vx, st.t))} × ${st.t} = ${m(vec(st.vx * st.t, st.vy * st.t))}`, `Final position = ${m(vec(2, 1))} + ${m(vec(st.vx * st.t, st.vy * st.t))} = ${m(vec(2 + st.vx * st.t, 1 + st.vy * st.t))}`, `Distance from origin = ${m('√(' + neg(2 + st.vx * st.t) + '² + ' + neg(1 + st.vy * st.t) + '²) ≈ ' + Math.hypot(2 + st.vx * st.t, 1 + st.vy * st.t).toFixed(2))}`)`
    },
    {
      title: 'Robot Movement in 3D Space (Extension to 2D)',
      controls: [slider('x', 'Distance EAST (m)', 1, 8, 1, 3), slider('y', 'Distance NORTH (m)', 1, 8, 1, 4), slider('z', 'Distance UP (m)', 1, 6, 1, 2)],
      prompt: st => `A robot moves ${st.x} m EAST, ${st.y} m NORTH, and ${st.z} m UP. Find the total straight-line distance from start (2 d.p.).`,
      visual: st => buildDiagramSVG([v(0, 0, st.x, 0, 'blue', `${st.x}i`), v(st.x, 0, 0, st.y, 'red', `${st.y}j`), v(0, 0, st.x, st.y, 'green', '2D path')]),
      readout: st => eq(`3D Movement: ${m(vec(st.x, st.y))} + ${st.z}k`, `Magnitude: ${m('√(x² + y² + z²)')}`, `This extends 2D concepts: same ideas work for 3D!`),
      fields: () => [box('mag', 'Total distance (2 d.p.)', 2)],
      answers: st => ({ mag: Math.hypot(st.x, st.y, st.z) }),
      hint: () => '3D Pythagorean Theorem: Square all three components, add them, then take the square root.',
      solution: st => `${m('|r| = √(' + st.x + '² + ' + st.y + '² + ' + st.z + '²) = √' + (st.x * st.x + st.y * st.y + st.z * st.z) + ' ≈ ' + Math.hypot(st.x, st.y, st.z).toFixed(2))} m`
    },
    {
      title: 'Force Balancing in Three Directions (3D Extension)',
      controls: [slider('fx', 'Force EAST (N)', 100, 800, 50, 300), slider('fy', 'Force NORTH (N)', 100, 800, 50, 400), slider('fz', 'Force UP (N)', 100, 800, 50, 250)],
      prompt: st => `Three cables pull on an object: ${st.fx} N EAST, ${st.fy} N NORTH, and ${st.fz} N UP. Find: (1) Resultant force magnitude (2 d.p.), (2) The balancing force needed (in all three directions).`,
      visual: st => buildDiagramSVG([v(0, 0, st.fx, 0, 'blue', 'Fx'), v(0, 0, 0, st.fy, 'red', 'Fy'), v(0, 0, st.fx, st.fy, 'green', '2D resultant')]),
      readout: st => eq(`Resultant: ${m(vec(st.fx, st.fy))} + ${st.fz}k N`, `For equilibrium: ${m('F₁ + F₂ + F₃ + Balance = zero')}`, `Balance force is OPPOSITE to resultant (all components change sign).`),
      fields: () => [box('mag', 'Resultant magnitude (N, 2 d.p.)', 2), box('ei', 'East component of balance force (N)'), box('ej', 'North component of balance force (N)'), box('ek', 'Up component of balance force (N)')],
      answers: st => ({ mag: Math.hypot(st.fx, st.fy, st.fz), ei: -st.fx, ej: -st.fy, ek: -st.fz }),
      hint: () => 'Step 1: Use 3D Pythagorean Theorem for magnitude. Step 2: Balance force is the OPPOSITE of resultant, so change the sign of every component.',
      solution: st => steps(`${m('R = ' + vec(st.fx, st.fy) + ' + ' + st.fz + 'k')} N`, `${m('|R| = √(' + st.fx + '² + ' + st.fy + '² + ' + st.fz + '²) ≈ ' + Math.hypot(st.fx, st.fy, st.fz).toFixed(2))} N`, `${m('Balance = ' + vec(-st.fx, -st.fy) + ' − ' + st.fz + 'k')} N`)
    }
  ];

  /* ---------- Area 2: 5.1 Scalar vs vector, vector types, scalar multiplication ---------- */
  const relation = k => (k === 0 ? 'zero' : k === 1 ? 'same' : k === -1 ? 'negative' : k > 0 ? 'parallel' : 'opposite');
  const RELATION_TEXT = {
    zero: 'zero vector (null vector), because every component becomes 0',
    same: 'the same vector as A, because magnitude and direction do not change',
    negative: 'negative of A, because magnitude stays the same but direction is reversed',
    parallel: 'parallel to A and in the same direction, because k is positive',
    opposite: 'parallel to A but in the opposite direction, because k is negative'
  };

  const scalarExamples = [
    {
      title: 'Negative Vector',
      controls: [slider('x', 'i-component of A', -6, 6, 1, 3), slider('y', 'j-component of A', -6, 6, 1, 2)],
      prompt: st => `Given ${m('A = ' + vec(st.x, st.y))}. Find the components of ${m('−A')}.`,
      visual: st => buildDiagramSVG([v(0, 0, st.x, st.y, 'blue', 'A'), v(0, 0, -st.x, -st.y, 'red', '−A')]),
      readout: st => eq(`${m('A = ' + vec(st.x, st.y))}`, 'The negative of a vector has the SAME LENGTH but OPPOSITE DIRECTION.'),
      fields: () => [box('i', 'i-component'), box('j', 'j-component')],
      answers: st => ({ i: -st.x, j: -st.y }),
      hint: () => 'Change the sign of BOTH components. Negative becomes positive, positive becomes negative.',
      solution: st => `${m('−A = −(' + vec(st.x, st.y) + ') = ' + vec(-st.x, -st.y))}`
    },
    {
      title: 'Magnitude of a Vector',
      controls: [slider('x', 'i-component', -8, 8, 1, 6), slider('y', 'j-component', -8, 8, 1, -8)],
      prompt: st => `Given ${m('v = ' + vec(st.x, st.y))}. Find ${m('|v|')} (magnitude) to 2 decimal places.`,
      visual: st => buildDiagramSVG([v(0, 0, st.x, 0, 'blue', `${st.x}i`), v(st.x, 0, 0, st.y, 'red', `${st.y}j`), v(0, 0, st.x, st.y, 'green', 'v')]),
      readout: st => eq(`${m('|v| = √(x² + y²)')}`, `This is the Pythagorean Theorem applied to vectors`),
      fields: () => [box('mag', 'Magnitude (2 d.p.)', 2)],
      answers: st => ({ mag: Math.hypot(st.x, st.y) }),
      hint: () => 'Squaring a negative number gives a positive result, so negative signs do not affect magnitude. √16 = 4, and √16 from (−4)² = 4 too!',
      solution: st => `${m('|v| = √(' + neg(st.x) + '² + ' + neg(st.y) + '²) = √' + (st.x * st.x + st.y * st.y) + ' ≈ ' + Math.hypot(st.x, st.y).toFixed(2))}`
    },
    {
      title: 'Scalar Multiplication and Effect on Length',
      controls: [slider('k', 'Scalar multiplier k', -3, 3, 0.5, 2), slider('x', 'i-component of v', -5, 5, 1, 2), slider('y', 'j-component of v', -5, 5, 1, 1)],
      prompt: st => `Given ${m('v = ' + vec(st.x, st.y))} and ${m('k = ' + n(st.k))}. Find the components of ${m('kv')} and its magnitude ${m('|kv|')} (2 d.p.).`,
      visual: st => buildDiagramSVG(drawable([v(0, 0, st.x, st.y, 'blue', 'v'), v(0, 0, st.k * st.x, st.k * st.y, 'green', 'kv')])),
      readout: st => eq(`${m('kv = k(xi + yj) = kx i + ky j')}`, `${m('|kv| = |k| × |v|')}`, `Note: magnitudes are always ≥ 0`),
      fields: () => [box('i', 'i-component of kv', 2), box('j', 'j-component of kv', 2), box('mag', 'Magnitude |kv| (2 d.p.)', 2)],
      answers: st => ({ i: st.k * st.x, j: st.k * st.y, mag: Math.abs(st.k) * Math.hypot(st.x, st.y) }),
      hint: () => 'Multiply EACH component by k. For magnitude, use |k| (absolute value), which is always positive, so |kv| is never negative.',
      solution: st => steps(`${m('kv = ' + vec(st.k * st.x, st.k * st.y))}`, `${m('|v| = √' + (st.x * st.x + st.y * st.y) + ' ≈ ' + Math.hypot(st.x, st.y).toFixed(4))}`, `${m('|kv| = |' + n(st.k) + '| × |v| ≈ ' + (Math.abs(st.k) * Math.hypot(st.x, st.y)).toFixed(2))}`)
    },
    {
      title: 'Identifying Vector Relationships',
      controls: [slider('k', 'Scalar multiplier k (for B = kA)', -3, 3, 1, 2), slider('x', 'i-component of A', 1, 5, 1, 2), slider('y', 'j-component of A', 1, 5, 1, 1)],
      prompt: st => `Given ${m('A = ' + vec(st.x, st.y))} and ${m('B = ' + n(st.k) + 'A')}. What is the relationship between B and A?`,
      visual: st => buildDiagramSVG(drawable([v(0, 0, st.x, st.y, 'blue', 'A'), v(0, 0, st.k * st.x, st.k * st.y, 'red', 'B')])),
      readout: st => eq(`${m('B = ' + vec(st.k * st.x, st.k * st.y))}`, 'Compare the lengths and directions of the arrows in the diagram.'),
      fields: () => [pick('rel', 'Relationship of B to A', [['same', 'Same vector'], ['negative', 'Negative of A'], ['parallel', 'Parallel and same direction'], ['opposite', 'Parallel but opposite direction'], ['zero', 'Zero vector (null)']])],
      answers: st => ({ rel: relation(st.k) }),
      hint: () => 'k = 1 gives the same vector | k = −1 gives the negative | k = 0 gives zero vector | Positive k: same direction | Negative k: opposite direction',
      solution: st => `When ${m('k = ' + n(st.k))}, B is ${RELATION_TEXT[relation(st.k)]}.`
    },
    {
      title: 'Find Scalar k for Target Magnitude',
      controls: [slider('x', 'i-component of v', 1, 8, 1, 3), slider('y', 'j-component of v', 1, 8, 1, 4), slider('t', 'Target magnitude |kv|', 2, 30, 1, 10)],
      prompt: st => `Given ${m('v = ' + vec(st.x, st.y))}. Find the positive value of k so that ${m('|kv| = ' + st.t)}. Answer to 4 decimal places.`,
      visual: st => buildDiagramSVG([v(0, 0, st.x, st.y, 'blue', 'v'), v(0, 0, (st.t / Math.hypot(st.x, st.y)) * st.x, (st.t / Math.hypot(st.x, st.y)) * st.y, 'green', 'kv (scaled)')]),
      readout: st => eq(`${m('|kv| = |k| × |v|')}`, `${m('|v| = √' + (st.x * st.x + st.y * st.y) + ' ≈ ' + Math.hypot(st.x, st.y).toFixed(4))}`, `Target: ${m('|kv| = ' + st.t)}`),
      fields: () => [box('k', 'Value of k (4 d.p.)', 4)],
      answers: st => ({ k: st.t / Math.hypot(st.x, st.y) }),
      hint: () => 'Start from |kv| = |k| × |v|. Then solve for k by dividing: k = (target magnitude) ÷ |v|.',
      solution: st => steps(`${m('|v| = √(' + st.x + '² + ' + st.y + '²) = √' + (st.x * st.x + st.y * st.y) + ' ≈ ' + Math.hypot(st.x, st.y).toFixed(4))}`, `${m('k = ' + st.t + '/|v| ≈ ' + (st.t / Math.hypot(st.x, st.y)).toFixed(4))}`)
    },
    {
      title: 'Third Vector that Produces Zero (Closed Triangle)',
      controls: [slider('ax', 'i-component of A', -6, 6, 1, 3), slider('ay', 'j-component of A', -6, 6, 1, 2), slider('bx', 'i-component of B', -6, 6, 1, -1), slider('by', 'j-component of B', -6, 6, 1, 4)],
      prompt: st => `Given ${m('A = ' + vec(st.ax, st.ay))} and ${m('B = ' + vec(st.bx, st.by))}. Find C so that ${m('A + B + C = zero')}. Also find ${m('|C|')} (2 d.p.).`,
      visual: st => buildDiagramSVG([v(0, 0, st.ax, st.ay, 'blue', 'A'), v(st.ax, st.ay, st.bx, st.by, 'red', 'B'), v(st.ax + st.bx, st.ay + st.by, -(st.ax + st.bx), -(st.ay + st.by), 'green', 'C (closes triangle)')]),
      readout: st => eq(`${m('A + B = ' + vec(st.ax + st.bx, st.ay + st.by))}`, `${m('For zero sum: C = −(A + B)')}`),
      fields: () => [box('i', 'i-component of C'), box('j', 'j-component of C'), box('mag', 'Magnitude |C| (2 d.p.)', 2)],
      answers: st => ({ i: -(st.ax + st.bx), j: -(st.ay + st.by), mag: Math.hypot(st.ax + st.bx, st.ay + st.by) }),
      hint: () => 'Step 1: Add A and B first to get the resultant. Step 2: C must be the OPPOSITE to close the triangle and return to the start.',
      solution: st => steps(`${m('A + B = ' + vec(st.ax + st.bx, st.ay + st.by))}`, `${m('C = ' + vec(-(st.ax + st.bx), -(st.ay + st.by)))}`, `${m('|C| = √' + ((st.ax + st.bx) ** 2 + (st.ay + st.by) ** 2) + ' ≈ ' + Math.hypot(st.ax + st.bx, st.ay + st.by).toFixed(2))}`)
    },
    {
      title: 'Comparing Magnitudes of Scaled Vectors',
      controls: [slider('x', 'i-component of v', 1, 6, 1, 2), slider('y', 'j-component of v', 1, 6, 1, 3), slider('k1', 'Scalar k₁', 0.5, 3, 0.5, 1.5), slider('k2', 'Scalar k₂', 0.5, 3, 0.5, 2.5)],
      prompt: st => `Given ${m('v = ' + vec(st.x, st.y))}. Find ${m('|' + n(st.k1) + 'v|')} and ${m('|' + n(st.k2) + 'v|')} (2 d.p.), and the ratio between them.`,
      visual: st => buildDiagramSVG([v(0, 0, st.x, st.y, 'blue', 'v'), v(0, 0, st.k1 * st.x, st.k1 * st.y, 'red', `${n(st.k1)}v`), v(0, 0, st.k2 * st.x, st.k2 * st.y, 'green', `${n(st.k2)}v`)]),
      readout: st => eq(`${m('|kv| = |k| × |v|')}`, `${m('|v| = √' + (st.x * st.x + st.y * st.y) + ' ≈ ' + Math.hypot(st.x, st.y).toFixed(4))}`),
      fields: () => [box('mag1', `Magnitude |${n(st.k1)}v| (2 d.p.)`, 2), box('mag2', `Magnitude |${n(st.k2)}v| (2 d.p.)`, 2), box('ratio', `Ratio |${n(st.k2)}v| : |${n(st.k1)}v| (2 d.p.)`, 2)],
      answers: st => {
        const mag1 = Math.abs(st.k1) * Math.hypot(st.x, st.y);
        const mag2 = Math.abs(st.k2) * Math.hypot(st.x, st.y);
        return { mag1, mag2, ratio: mag2 / mag1 };
      },
      hint: () => 'Calculate each scaled vector\'s magnitude separately. Ratio = (first magnitude) ÷ (second magnitude).',
      solution: st => {
        const magv = Math.hypot(st.x, st.y);
        const mag1 = Math.abs(st.k1) * magv;
        const mag2 = Math.abs(st.k2) * magv;
        return steps(`${m('|' + n(st.k1) + 'v| = ' + n(st.k1) + ' × ' + magv.toFixed(4) + ' ≈ ' + mag1.toFixed(2))}`, `${m('|' + n(st.k2) + 'v| = ' + n(st.k2) + ' × ' + magv.toFixed(4) + ' ≈ ' + mag2.toFixed(2))}`, `Ratio = ${mag2.toFixed(2)} ÷ ${mag1.toFixed(2)} ≈ ${(mag2 / mag1).toFixed(2)}`);
      }
    },
    {
      title: 'Complex Linear Combination: aA + bB + cC',
      controls: [slider('a', 'Coefficient a for A', -2, 3, 1, 2), slider('b', 'Coefficient b for B', -2, 3, 1, 1), slider('c', 'Coefficient c for C', -2, 3, 1, -1)],
      prompt: st => `Given ${m('A = 2i + j')}, ${m('B = i − 3j')}, ${m('C = −i + 2j')}. Find ${m(combo(st.a, 'A') + ' + ' + combo(st.b, 'B') + ' + ' + combo(st.c, 'C'))} and its magnitude (2 d.p.).`,
      visual: st => buildDiagramSVG(drawable([v(0, 0, 2 * st.a, st.a, 'blue', term(st.a, 'A')), v(2 * st.a, st.a, st.b, -3 * st.b, 'red', term(st.b, 'B')), v(2 * st.a + st.b, st.a - 3 * st.b, -st.c, 2 * st.c, 'purple', term(st.c, 'C')), v(0, 0, 2 * st.a + st.b - st.c, st.a - 3 * st.b + 2 * st.c, 'green', 'result')])),
      readout: st => eq(`${m(term(st.a, 'A') + ' = ' + vec(2 * st.a, st.a))}`, `${m(term(st.b, 'B') + ' = ' + vec(st.b, -3 * st.b))}`, `${m(term(st.c, 'C') + ' = ' + vec(-st.c, 2 * st.c))}`),
      fields: () => [box('i', 'i-component'), box('j', 'j-component'), box('mag', 'Magnitude (2 d.p.)', 2)],
      answers: st => ({ i: 2 * st.a + st.b - st.c, j: st.a - 3 * st.b + 2 * st.c, mag: Math.hypot(2 * st.a + st.b - st.c, st.a - 3 * st.b + 2 * st.c) }),
      hint: () => 'Step 1: Do scalar multiplication for each vector (aA, bB, cC). Step 2: Add all i-components together, all j-components together. Step 3: Find magnitude using √(i² + j²).',
      solution: st => {
        const i = 2 * st.a + st.b - st.c;
        const j = st.a - 3 * st.b + 2 * st.c;
        return steps(`${m(term(st.a, 'A') + ' = ' + vec(2 * st.a, st.a))}`, `${m(term(st.b, 'B') + ' = ' + vec(st.b, -3 * st.b))}`, `${m(term(st.c, 'C') + ' = ' + vec(-st.c, 2 * st.c))}`, `Result = ${m(vec(i, j))}`, `Magnitude = √(${i}² + ${j}²) ≈ ${Math.hypot(i, j).toFixed(2)}`);
      }
    }
  ];

  /* ---------- Area 3: 5.2 Component form, magnitude, direction, unit vectors ---------- */
  const componentExamples = [
    {
      title: 'From Coordinates to Position Vector',
      controls: [slider('x', 'x-coordinate of P', -7, 7, 1, -2), slider('y', 'y-coordinate of P', -7, 7, 1, 5)],
      prompt: st => `Point ${m('P')} is at (${st.x}, ${st.y}). Express ${m('OP')} (position vector) in the form ${m('xi + yj')}.`,
      visual: st => buildDiagramSVG([v(0, 0, st.x, st.y, 'green', 'OP')]),
      readout: st => eq('Position vector starts at origin O and ends at the point.', `P = (${st.x}, ${st.y})`),
      fields: () => [box('i', 'i-component'), box('j', 'j-component')],
      answers: st => ({ i: st.x, j: st.y }),
      hint: () => 'x-coordinate becomes i-component, y-coordinate becomes j-component. No calculation needed!',
      solution: st => `${m('OP = ' + vec(st.x, st.y))}`
    },
    {
      title: 'Magnitude from Component Form',
      controls: [slider('x', 'i-component', -9, 9, 1, 6), slider('y', 'j-component', -9, 9, 1, 8)],
      prompt: st => `Given ${m('v = ' + vec(st.x, st.y))}. Find ${m('|v|')} (magnitude, 2 d.p.).`,
      visual: st => buildDiagramSVG([v(0, 0, st.x, 0, 'blue', `${st.x}i`), v(st.x, 0, 0, st.y, 'red', `${st.y}j`), v(0, 0, st.x, st.y, 'green', 'v')]),
      readout: st => eq(`${m('|v| = √(' + neg(st.x) + '² + ' + neg(st.y) + '²)')}`, `This is Pythagorean Theorem in component form`),
      fields: () => [box('mag', 'Magnitude (2 d.p.)', 2)],
      answers: st => ({ mag: Math.hypot(st.x, st.y) }),
      hint: () => 'Square each component, add them, then take the square root.',
      solution: st => `${m('|v| = √' + (st.x * st.x + st.y * st.y) + ' ≈ ' + Math.hypot(st.x, st.y).toFixed(2))}`
    },
    {
      title: 'Vector Between Two Points',
      controls: [slider('px', 'x of P', -7, 7, 1, 1), slider('py', 'y of P', -7, 7, 1, 2), slider('qx', 'x of Q', -7, 7, 1, 4), slider('qy', 'y of Q', -7, 7, 1, 6)],
      prompt: st => `Given P(${st.px}, ${st.py}) and Q(${st.qx}, ${st.qy}). Find the components of ${m('PQ')} and its length (2 d.p.).`,
      visual: st => buildDiagramSVG([v(0, 0, st.px, st.py, 'blue', 'OP', true), v(0, 0, st.qx, st.qy, 'red', 'OQ', true), v(st.px, st.py, st.qx - st.px, st.qy - st.py, 'green', 'PQ')]),
      readout: () => eq(`${m('PQ = OQ − OP')}`, 'End point minus start point: (x₂ − x₁), (y₂ − y₁)'),
      fields: () => [box('i', 'i-component'), box('j', 'j-component'), box('mag', 'Length of PQ (2 d.p.)', 2)],
      answers: st => ({ i: st.qx - st.px, j: st.qy - st.py, mag: Math.hypot(st.qx - st.px, st.qy - st.py) }),
      hint: () => 'Tip: End minus Start gives the vector from P to Q. If you reverse the order, you get QP (opposite direction).',
      solution: st => steps(`${m('PQ = (' + st.qx + ' − ' + neg(st.px) + ')i + (' + st.qy + ' − ' + neg(st.py) + ')j = ' + vec(st.qx - st.px, st.qy - st.py))}`, `${m('|PQ| = √' + ((st.qx - st.px) ** 2 + (st.qy - st.py) ** 2) + ' ≈ ' + Math.hypot(st.qx - st.px, st.qy - st.py).toFixed(2))}`)
    },
    {
      title: 'Vector Direction from Positive X-Axis',
      controls: [slider('x', 'i-component', -8, 8, 1, -3), slider('y', 'j-component', -8, 8, 1, 4)],
      prompt: st => `Given ${m('v = ' + vec(st.x, st.y))}. Find magnitude (2 d.p.) and direction angle from the positive x-axis, measured counterclockwise in range 0° to 360° (2 d.p.).`,
      visual: st => buildDiagramSVG([v(0, 0, st.x, 0, 'blue', `${st.x}i`), v(st.x, 0, 0, st.y, 'red', `${st.y}j`), v(0, 0, st.x, st.y, 'green', 'v')]),
      readout: st => eq(`${m('θ = atan2(y, x)')}`, `x = ${st.x}, y = ${st.y}`, 'Always check which quadrant the vector is in!'),
      fields: () => [box('mag', 'Magnitude (2 d.p.)', 2), box('ang', 'Angle (°, 2 d.p.)', 2)],
      answers: st => ({ mag: Math.hypot(st.x, st.y), ang: degrees(st.y, st.x) }),
      hint: () => 'Calculator gives tan⁻¹ in range −90° to 90°. Add 180° for Q2 and Q3, or 360° for negative angles in Q4.',
      solution: st => steps(`${m('|v| = √' + (st.x * st.x + st.y * st.y) + ' ≈ ' + Math.hypot(st.x, st.y).toFixed(2))}`, `${m('θ = atan2(' + neg(st.y) + ', ' + neg(st.x) + ') ≈ ' + degrees(st.y, st.x).toFixed(2))}°`)
    },
    {
      title: 'Vektor unit dalam arah yang sama',
      invalid: st => (Math.hypot(st.x, st.y) ? '' : 'r ialah vektor sifar, jadi vektor unit tidak tertakrif. Gerakkan peluncur untuk meneruskan.'),
      controls: [slider('x', 'Komponen i', -12, 12, 1, 10), slider('y', 'Komponen j', -12, 12, 1, -1)],
      prompt: st => `Diberi ${m('r = ' + vec(st.x, st.y))}. Cari vektor unit ${m('u')} dalam arah r, kepada 4 tempat perpuluhan.`,
      visual: st => (Math.hypot(st.x, st.y) ? buildDiagramSVG([v(0, 0, st.x, st.y, 'green', 'r'), v(0, 0, st.x / Math.hypot(st.x, st.y), st.y / Math.hypot(st.x, st.y), 'blue', 'u')]) : '<p>Vektor sifar tidak mempunyai arah, jadi vektor unitnya tidak tertakrif.</p>'),
      readout: st => (Math.hypot(st.x, st.y) ? eq(`${m('u = r/|r|')}`, `${m('|r| = √' + (st.x * st.x + st.y * st.y) + ' ≈ ' + Math.hypot(st.x, st.y).toFixed(4))}`) : `${m('r = zero')}: pembahagian dengan magnitud sifar tidak tertakrif. Gerakkan peluncur.`),
      fields: () => [box('ui', 'Komponen i bagi u (4 t.p.)', 4), box('uj', 'Komponen j bagi u (4 t.p.)', 4)],
      answers: st => {
        const mag = Math.hypot(st.x, st.y) || 1;
        return { ui: st.x / mag, uj: st.y / mag };
      },
      hint: () => 'Cari magnitud dahulu, kemudian bahagikan <strong>setiap</strong> komponen dengan magnitud itu. Semak dengan memastikan |u| = 1.',
      solution: st => {
        const mag = Math.hypot(st.x, st.y);
        if (!mag) return 'Vektor sifar tidak mempunyai vektor unit.';
        return steps(`${m('|r| = √' + (st.x * st.x + st.y * st.y) + ' ≈ ' + mag.toFixed(4))}`, `${m('u = (' + vec(st.x, st.y) + ')/|r| ≈ ' + vec(Number((st.x / mag).toFixed(4)), Number((st.y / mag).toFixed(4))))}`, `Semakan: ${m('|u| = 1')}`);
      }
    },
    {
      title: 'From Magnitude and Angle to Components',
      controls: [slider('r', 'Magnitude |v|', 1, 20, 1, 10), slider('a', 'Angle from x-axis (°)', 0, 350, 10, 30)],
      prompt: st => `A vector has magnitude ${st.r} and makes angle ${st.a}° with the positive x-axis. Find i and j components, to 2 decimal places.`,
      visual: st => buildDiagramSVG([v(0, 0, st.r * Math.cos((st.a * Math.PI) / 180), st.r * Math.sin((st.a * Math.PI) / 180), 'green', 'v')]),
      readout: st => eq(`${m('x = |v| cos θ')}`, `${m('y = |v| sin θ')}`, `Horizontal uses cosine, vertical uses sine`),
      fields: () => [box('i', 'i-component (2 d.p.)', 2), box('j', 'j-component (2 d.p.)', 2)],
      answers: st => ({ i: st.r * Math.cos((st.a * Math.PI) / 180), j: st.r * Math.sin((st.a * Math.PI) / 180) }),
      hint: () => 'Horizontal (x) component uses cosine, vertical (y) component uses sine. Make sure calculator is in DEGREE mode!',
      solution: st => steps(`${m('x = ' + st.r + ' cos ' + st.a)}° ${m('≈ ' + (st.r * Math.cos((st.a * Math.PI) / 180)).toFixed(2))}`, `${m('y = ' + st.r + ' sin ' + st.a)}° ${m('≈ ' + (st.r * Math.sin((st.a * Math.PI) / 180)).toFixed(2))}`)
    },
    {
      title: 'Angle Between Two Vectors',
      controls: [slider('r1', 'Magnitude |v₁|', 2, 15, 1, 8), slider('a1', 'Angle of v₁ (°)', 0, 350, 15, 45), slider('r2', 'Magnitude |v₂|', 2, 15, 1, 10), slider('a2', 'Angle of v₂ (°)', 0, 350, 15, 120)],
      prompt: st => `Two vectors have magnitudes |v₁| = ${st.r1} and |v₂| = ${st.r2}, at angles ${st.a1}° and ${st.a2}° from the x-axis. Find the angle between them (2 d.p.).`,
      visual: st => buildDiagramSVG([v(0, 0, st.r1 * Math.cos((st.a1 * Math.PI) / 180), st.r1 * Math.sin((st.a1 * Math.PI) / 180), 'blue', 'v₁'), v(0, 0, st.r2 * Math.cos((st.a2 * Math.PI) / 180), st.r2 * Math.sin((st.a2 * Math.PI) / 180), 'red', 'v₂')]),
      readout: st => eq(`Angle between: |θ₂ − θ₁|`, `θ₁ = ${st.a1}°, θ₂ = ${st.a2}°`, `Always take the SMALLER angle`),
      fields: () => [box('angle', 'Angle between vectors (°, 2 d.p.)', 2)],
      answers: st => {
        let diff = Math.abs(st.a2 - st.a1);
        if (diff > 180) diff = 360 - diff;
        return { angle: diff };
      },
      hint: () => 'Angle between = difference of their direction angles. If difference > 180°, take 360° − difference to get the smaller angle.',
      solution: st => {
        let diff = Math.abs(st.a2 - st.a1);
        if (diff > 180) diff = 360 - diff;
        return `Difference = |${st.a2}° − ${st.a1}°| = ${Math.abs(st.a2 - st.a1)}°, so angle between = ${diff.toFixed(2)}°`;
      }
    },
    {
      title: 'Unit Vector in Direction of Sum',
      invalid: st => {
        const x = 3 * Math.cos((st.a1 * Math.PI) / 180) + 4 * Math.cos((st.a2 * Math.PI) / 180);
        const y = 3 * Math.sin((st.a1 * Math.PI) / 180) + 4 * Math.sin((st.a2 * Math.PI) / 180);
        return Math.hypot(x, y) ? '' : 'Resultant is zero vector. Change angles to continue.';
      },
      controls: [slider('a1', 'Angle of v₁ (°)', 0, 350, 15, 60), slider('a2', 'Angle of v₂ (°)', 0, 350, 15, 180)],
      prompt: st => `Given ${m('v₁')} with magnitude 3 at angle ${st.a1}° and ${m('v₂')} with magnitude 4 at angle ${st.a2}°. Find the unit vector in the direction of ${m('v₁ + v₂')} (4 d.p.).`,
      visual: st => {
        const x1 = 3 * Math.cos((st.a1 * Math.PI) / 180);
        const y1 = 3 * Math.sin((st.a1 * Math.PI) / 180);
        const x2 = 4 * Math.cos((st.a2 * Math.PI) / 180);
        const y2 = 4 * Math.sin((st.a2 * Math.PI) / 180);
        const sx = x1 + x2;
        const sy = y1 + y2;
        return buildDiagramSVG([v(0, 0, x1, y1, 'blue', 'v₁'), v(0, 0, x2, y2, 'red', 'v₂'), v(0, 0, sx, sy, 'green', 'v₁ + v₂')]);
      },
      readout: st => {
        const x1 = 3 * Math.cos((st.a1 * Math.PI) / 180);
        const y1 = 3 * Math.sin((st.a1 * Math.PI) / 180);
        const x2 = 4 * Math.cos((st.a2 * Math.PI) / 180);
        const y2 = 4 * Math.sin((st.a2 * Math.PI) / 180);
        const sx = x1 + x2;
        const sy = y1 + y2;
        const mag = Math.hypot(sx, sy);
        return mag ? eq(`Resultant = ${m(vec(Number(sx.toFixed(4)), Number(sy.toFixed(4))))}`, `Magnitude = ${mag.toFixed(4)}`, `${m('u = resultant / magnitude')}`) : 'Resultant is zero vector. Change angles.';
      },
      fields: () => [box('ui', 'i-component of u (4 d.p.)', 4), box('uj', 'j-component of u (4 d.p.)', 4)],
      answers: st => {
        const x1 = 3 * Math.cos((st.a1 * Math.PI) / 180);
        const y1 = 3 * Math.sin((st.a1 * Math.PI) / 180);
        const x2 = 4 * Math.cos((st.a2 * Math.PI) / 180);
        const y2 = 4 * Math.sin((st.a2 * Math.PI) / 180);
        const sx = x1 + x2;
        const sy = y1 + y2;
        const mag = Math.hypot(sx, sy) || 1;
        return { ui: sx / mag, uj: sy / mag };
      },
      hint: () => 'Step 1: Convert magnitude-angle to components. Step 2: Add components to get resultant. Step 3: Divide each resultant component by its magnitude.',
      solution: st => {
        const x1 = 3 * Math.cos((st.a1 * Math.PI) / 180);
        const y1 = 3 * Math.sin((st.a1 * Math.PI) / 180);
        const x2 = 4 * Math.cos((st.a2 * Math.PI) / 180);
        const y2 = 4 * Math.sin((st.a2 * Math.PI) / 180);
        const sx = x1 + x2;
        const sy = y1 + y2;
        const mag = Math.hypot(sx, sy);
        if (!mag) return 'Resultant is zero vector, so no unit vector exists.';
        return steps(`${m('v₁ = 3 cos ' + st.a1 + '° i + 3 sin ' + st.a1 + '° j ≈ ' + vec(Number(x1.toFixed(4)), Number(y1.toFixed(4))))}`, `${m('v₂ = 4 cos ' + st.a2 + '° i + 4 sin ' + st.a2 + '° j ≈ ' + vec(Number(x2.toFixed(4)), Number(y2.toFixed(4))))}`, `${m('v₁ + v₂ ≈ ' + vec(Number(sx.toFixed(4)), Number(sy.toFixed(4))))}`, `${m('u ≈ ' + vec(Number((sx / mag).toFixed(4)), Number((sy / mag).toFixed(4))))}`);
      }
    }
  ];

  /* ---------- Area 4: 5.3 Addition, subtraction and geometric routes ---------- */
  const additionExamples = [
    {
      title: 'Menambah dua vektor komponen demi komponen',
      controls: [slider('ax', 'i bagi A', -6, 6, 1, 3), slider('ay', 'j bagi A', -6, 6, 1, 4), slider('bx', 'i bagi B', -6, 6, 1, 2), slider('by', 'j bagi B', -6, 6, 1, -1)],
      prompt: st => `Cari ${m('A + B')} apabila ${m('A = ' + vec(st.ax, st.ay))} dan ${m('B = ' + vec(st.bx, st.by))}.`,
      visual: st => buildDiagramSVG([v(0, 0, st.ax, st.ay, 'blue', 'A'), v(st.ax, st.ay, st.bx, st.by, 'red', 'B'), v(0, 0, st.ax + st.bx, st.ay + st.by, 'green', 'A + B')]),
      readout: () => eq('Hukum segitiga: letakkan ekor B di hujung A; paduan menutup segitiga.', `${m('A + B = (A_x + B_x)i + (A_y + B_y)j')}`),
      fields: () => [box('i', 'Komponen i'), box('j', 'Komponen j')],
      answers: st => ({ i: st.ax + st.bx, j: st.ay + st.by }),
      hint: () => 'Tambah komponen i bersama-sama, kemudian komponen j bersama-sama. Jangan campurkan kedua-duanya.',
      solution: st => `${m('A + B = (' + st.ax + ' + ' + neg(st.bx) + ')i + (' + st.ay + ' + ' + neg(st.by) + ')j = ' + vec(st.ax + st.bx, st.ay + st.by))}`
    },
    {
      title: 'Menolak vektor sebagai menambah negatifnya',
      controls: [slider('ax', 'i bagi A', -6, 6, 1, 4), slider('ay', 'j bagi A', -6, 6, 1, -2), slider('bx', 'i bagi B', -6, 6, 1, 1), slider('by', 'j bagi B', -6, 6, 1, 3)],
      prompt: st => `Cari ${m('A − B')} apabila ${m('A = ' + vec(st.ax, st.ay))} dan ${m('B = ' + vec(st.bx, st.by))}.`,
      visual: st => buildDiagramSVG([v(0, 0, st.ax, st.ay, 'blue', 'A'), v(st.ax, st.ay, -st.bx, -st.by, 'red', '−B'), v(0, 0, st.ax - st.bx, st.ay - st.by, 'green', 'A − B')]),
      readout: st => eq(`${m('A − B = A + (−B)')}`, `${m('−B = ' + vec(-st.bx, -st.by))}`),
      fields: () => [box('i', 'Komponen i'), box('j', 'Komponen j')],
      answers: st => ({ i: st.ax - st.bx, j: st.ay - st.by }),
      hint: () => 'Tulis semula penolakan sebagai penambahan −B supaya tanda setiap komponen jelas.',
      solution: st => `${m('A − B = (' + st.ax + ' − ' + neg(st.bx) + ')i + (' + st.ay + ' − ' + neg(st.by) + ')j = ' + vec(st.ax - st.bx, st.ay - st.by))}`
    },
    {
      title: 'Gabungan linear pA + qB',
      controls: [slider('p', 'Pekali p', -3, 3, 1, 2), slider('q', 'Pekali q', -3, 3, 1, 1)],
      prompt: st => `Diberi ${m('a = 2i + 5j')} dan ${m('b = i − 4j')}. Cari ${m(combo(st.p, st.q))}.`,
      visual: st => buildDiagramSVG(drawable([v(0, 0, 2 * st.p, 5 * st.p, 'blue', term(st.p, 'a')), v(2 * st.p, 5 * st.p, st.q, -4 * st.q, 'red', term(st.q, 'b')), v(0, 0, 2 * st.p + st.q, 5 * st.p - 4 * st.q, 'green', 'hasil')])),
      readout: st => eq(`${m(term(st.p, 'a') + ' = ' + vec(2 * st.p, 5 * st.p))}`, `${m(term(st.q, 'b') + ' = ' + vec(st.q, -4 * st.q))}`),
      fields: () => [box('i', 'Komponen i'), box('j', 'Komponen j')],
      answers: st => ({ i: 2 * st.p + st.q, j: 5 * st.p - 4 * st.q }),
      hint: () => 'Lakukan setiap pendaraban skalar dahulu, kemudian tambah kedua-dua hasil komponen demi komponen.',
      solution: st => steps(`${m(term(st.p, 'a') + ' = ' + vec(2 * st.p, 5 * st.p))}`, `${m(term(st.q, 'b') + ' = ' + vec(st.q, -4 * st.q))}`, `Jumlah: ${m(vec(2 * st.p + st.q, 5 * st.p - 4 * st.q))}`)
    },
    {
      title: 'Magnitud dan arah vektor paduan',
      controls: [slider('ax', 'i bagi A', -7, 7, 1, 3), slider('ay', 'j bagi A', -7, 7, 1, 2), slider('bx', 'i bagi B', -7, 7, 1, 2), slider('by', 'j bagi B', -7, 7, 1, 1)],
      prompt: st => `Dengan ${m('A = ' + vec(st.ax, st.ay))} dan ${m('B = ' + vec(st.bx, st.by))}, cari ${m('|A + B|')} (2 t.p.) dan arahnya dari paksi x positif dalam darjah (2 t.p.).`,
      visual: st => buildDiagramSVG([v(0, 0, st.ax, st.ay, 'blue', 'A'), v(st.ax, st.ay, st.bx, st.by, 'red', 'B'), v(0, 0, st.ax + st.bx, st.ay + st.by, 'green', 'R')]),
      readout: st => eq(`${m('R = ' + vec(st.ax + st.bx, st.ay + st.by))}`, `${m('|R| = √(R_x² + R_y²)')}`, `${m('θ = atan2(R_y, R_x)')}`),
      fields: () => [box('mag', 'Magnitud |A + B| (2 t.p.)', 2), box('ang', 'Sudut (°, 2 t.p.)', 2)],
      answers: st => ({ mag: Math.hypot(st.ax + st.bx, st.ay + st.by), ang: degrees(st.ay + st.by, st.ax + st.bx) }),
      hint: () => 'Tambah komponen dahulu. Jangan tambah magnitud |A| dan |B| secara terus kecuali kedua-duanya sehala.',
      solution: st => steps(`${m('R = ' + vec(st.ax + st.bx, st.ay + st.by))}`, `${m('|R| = √' + ((st.ax + st.bx) ** 2 + (st.ay + st.by) ** 2) + ' ≈ ' + Math.hypot(st.ax + st.bx, st.ay + st.by).toFixed(2))}`, `${m('θ ≈ ' + degrees(st.ay + st.by, st.ax + st.bx).toFixed(2))}°`)
    },
    {
      title: 'Menyelesaikan persamaan vektor A + X = B',
      controls: [slider('ax', 'i bagi A', -7, 7, 1, 2), slider('ay', 'j bagi A', -7, 7, 1, -3), slider('bx', 'i bagi B', -7, 7, 1, 5), slider('by', 'j bagi B', -7, 7, 1, 1)],
      prompt: st => `Diberi ${m('A = ' + vec(st.ax, st.ay))} dan ${m('B = ' + vec(st.bx, st.by))}. Cari X supaya ${m('A + X = B')}, dan nyatakan ${m('|X|')} (2 t.p.).`,
      visual: st => buildDiagramSVG([v(0, 0, st.ax, st.ay, 'blue', 'A'), v(0, 0, st.bx, st.by, 'red', 'B'), v(st.ax, st.ay, st.bx - st.ax, st.by - st.ay, 'green', 'X')]),
      readout: () => eq(`${m('X = B − A')}`, 'Pada rajah, X menghubungkan hujung A ke hujung B.'),
      fields: () => [box('i', 'Komponen i bagi X'), box('j', 'Komponen j bagi X'), box('mag', 'Magnitud |X| (2 t.p.)', 2)],
      answers: st => ({ i: st.bx - st.ax, j: st.by - st.ay, mag: Math.hypot(st.bx - st.ax, st.by - st.ay) }),
      hint: () => 'Asingkan X dengan menolak A daripada kedua-dua belah persamaan, kemudian kerjakan komponen demi komponen.',
      solution: st => steps(`${m('X = B − A = ' + vec(st.bx - st.ax, st.by - st.ay))}`, `${m('|X| = √' + ((st.bx - st.ax) ** 2 + (st.by - st.ay) ** 2) + ' ≈ ' + Math.hypot(st.bx - st.ax, st.by - st.ay).toFixed(2))}`)
    },
    {
      title: 'Laluan vektor dalam rajah ABCD',
      controls: [chooser('target', 'Vektor sasaran', [['DB', 'DB'], ['AC', 'AC'], ['CD', 'CD']], 'DB'), slider('p', 'Pekali p dalam AB = p y', 2, 6, 1, 4), slider('q', 'Pekali q dalam AD = q x', 3, 8, 1, 5), slider('r', 'Pekali r dalam BC = r x', 1, 5, 1, 2)],
      prompt: st => `Dalam rajah ABCD, ${m('AB = ' + st.p + 'y')}, ${m('AD = ' + st.q + 'x')} dan ${m('BC = ' + st.r + 'x')}. Nyatakan ${m(st.target)} dalam sebutan x dan y dengan memasukkan kedua-dua pekali.`,
      visual: st => VectorExtensions.polygon(st.p, st.q, st.r),
      readout: st => eq(`Laluan: ${{ DB: 'D → A → B', AC: 'A → B → C', CD: 'C → B → A → D' }[st.target]}`, 'Membalikkan arah sesuatu sisi menukar tandanya.'),
      fields: () => [box('x', 'Pekali x'), box('y', 'Pekali y')],
      answers: st => {
        const [x, y] = VectorExtensions.routeResult(st.p, st.q, st.r, st.target);
        return { x, y };
      },
      hint: () => 'Tulis laluan sebagai hasil tambah sisi berlabel. Setiap kali anda bergerak melawan anak panah yang diberi, tukar tandanya.',
      solution: st => m(VectorExtensions.routeWork(st.p, st.q, st.r, st.target))
    },
    {
      title: 'Kesamarataan vektor: mengenal vektor yang sama',
      controls: [slider('x1', 'Komponen i A', -5, 5, 1, 2), slider('y1', 'Komponen j A', -5, 5, 1, 3), slider('x2', 'Komponen i B', -5, 5, 1, 2), slider('y2', 'Komponen j B', -5, 5, 1, 3)],
      prompt: st => `Diberi ${m('A = ' + vec(st.x1, st.y1))} dan ${m('B = ' + vec(st.x2, st.y2))}. Adakah A sama dengan B? Jika tidak, cari ${m('A − B')}.`,
      visual: st => buildDiagramSVG([v(0, 0, st.x1, st.y1, 'blue', 'A'), v(0, 0, st.x2, st.y2, 'red', 'B'), (st.x1 !== st.x2 || st.y1 !== st.y2) && v(0, 0, st.x1 - st.x2, st.y1 - st.y2, 'green', 'A − B')].filter(Boolean)),
      readout: st => st.x1 === st.x2 && st.y1 === st.y2 ? `${m('A = B')}: vektor sama kerana kedua-dua komponen sama.` : eq(`${m('A ≠ B')}`, `${m('A − B = ' + vec(st.x1 - st.x2, st.y1 - st.y2))}`),
      fields: () => [pick('equal', 'Adakah A = B?', [['yes', 'Ya, A sama dengan B'], ['no', 'Tidak, A berbeza daripada B']]), box('i', 'Jika tidak sama, komponen i A − B'), box('j', 'Jika tidak sama, komponen j A − B')],
      answers: st => {
        const equal = st.x1 === st.x2 && st.y1 === st.y2 ? 'yes' : 'no';
        return { equal, i: st.x1 - st.x2, j: st.y1 - st.y2 };
      },
      hint: () => 'Dua vektor sama jika dan hanya jika semua komponen mereka sama. Jika tidak, tolak komponen demi komponen.',
      solution: st => {
        if (st.x1 === st.x2 && st.y1 === st.y2) {
          return `${m('A = B')}: Kedua-dua vektor mempunyai komponen i = ${st.x1} dan komponen j = ${st.y1}.`;
        }
        return steps(`Bandingkan komponen:`, `Komponen i: ${st.x1} ${st.x1 === st.x2 ? '=' : '≠'} ${st.x2}`, `Komponen j: ${st.y1} ${st.y1 === st.y2 ? '=' : '≠'} ${st.y2}`, `Oleh itu, ${m('A ≠ B')}`, `${m('A − B = ' + vec(st.x1 - st.x2, st.y1 - st.y2))}`);
      }
    },
    {
      title: 'Keseimbangan: mencari vektor ketiga dalam persamaan tertutup',
      controls: [slider('ax', 'Komponen i A', -6, 6, 1, 2), slider('ay', 'Komponen j A', -6, 6, 1, 3), slider('bx', 'Komponen i B', -6, 6, 1, 1), slider('by', 'Komponen j B', -6, 6, 1, -2), slider('cx', 'Komponen i C (ubah)', -6, 6, 1, -3)],
      prompt: st => `Dalam segitiga tertutup, ${m('A + B + C = zero')}. Diberi ${m('A = ' + vec(st.ax, st.ay))}} dan ${m('B = ' + vec(st.bx, st.by))}}. Cari C supaya jumlah ketiga-tiga ialah sifar. Komponen i harus ${st.ax + st.bx + st.cx}} sama dengan sifar.`,
      visual: st => buildDiagramSVG([v(0, 0, st.ax, st.ay, 'blue', 'A'), v(st.ax, st.ay, st.bx, st.by, 'red', 'B'), v(st.ax + st.bx, st.ay + st.by, -st.ax - st.bx, -st.ay - st.by, 'green', 'C')]),
      readout: st => {
        const cy = -(st.ay + st.by);
        const sumI = st.ax + st.bx + st.cx;
        const sumJ = st.ay + st.by + cy;
        return eq(`Untuk keseimbangan: ${m('A + B + C = zero')}`, `Jumlah i: ${st.ax} + ${st.bx} + ${st.cx} = ${sumI}`, `Jumlah j: ${st.ay} + ${st.by} + ${cy} = ${sumJ}`);
      },
      fields: () => [box('cy', 'Komponen j C (untuk keseimbangan)'), box('i_sum', 'Jumlah komponen i (mesti 0)'), box('j_sum', 'Jumlah komponen j (mesti 0)')],
      answers: st => ({
        cy: -(st.ay + st.by),
        i_sum: 0,
        j_sum: 0
      }),
      hint: () => 'Untuk keseimbangan (vektor jumlah = sifar), jumlah kesemua komponen i mesti 0 dan jumlah kesemua komponen j mesti 0. C = −(A + B).',
      solution: st => steps(`${m('A + B = ' + vec(st.ax + st.bx, st.ay + st.by))}`, `Untuk jumlah = sifar: ${m('C = −(A + B) = ' + vec(-(st.ax + st.bx), -(st.ay + st.by)))}`, `Semakan: ${m(vec(st.ax, st.ay) + ' + ' + vec(st.bx, st.by) + ' + ' + vec(-(st.ax + st.bx), -(st.ay + st.by)) + ' = zero')}`)
    }
  ];

  /* ---------- Area 5: Practice — exam-style column vector drills ---------- */
  const practiceExamples = [
    {
      title: 'Membaca vektor lajur',
      controls: [slider('x', 'Baris atas', -8, 8, 1, 3), slider('y', 'Baris bawah', -8, 8, 1, -4)],
      prompt: st => `Diberi ${m('a')} = ${col(st.x, st.y)}. Tulis a dalam bentuk ${m('xi + yj')}.`,
      visual: st => buildDiagramSVG([v(0, 0, st.x, st.y, 'green', 'a')]),
      readout: () => 'Baris atas vektor lajur ialah komponen i; baris bawah ialah komponen j.',
      fields: () => [box('i', 'Komponen i'), box('j', 'Komponen j')],
      answers: st => ({ i: st.x, j: st.y }),
      hint: () => 'Tiada pengiraan diperlukan; hanya tukar tatatanda daripada bentuk lajur kepada bentuk i, j.',
      solution: st => `${m('a = ' + vec(st.x, st.y))}`
    },
    {
      title: 'Pendaraban skalar dalam bentuk lajur',
      controls: [slider('k', 'Pengganda k', -4, 5, 1, 4), slider('x', 'Baris atas bagi a', -6, 6, 1, 3), slider('y', 'Baris bawah bagi a', -6, 6, 1, 1)],
      prompt: st => `Diberi ${m('a')} = ${col(st.x, st.y)}. Cari ${m('' + st.k + 'a')}.`,
      visual: st => buildDiagramSVG([v(0, 0, st.x, st.y, 'blue', 'a'), v(0, 0, st.k * st.x, st.k * st.y, 'green', `${st.k}a`)]),
      readout: st => eq(`${m('' + st.k + 'a')} bermaksud darab setiap baris dengan ${st.k}.`),
      fields: () => [box('i', 'Komponen i'), box('j', 'Komponen j')],
      answers: st => ({ i: st.k * st.x, j: st.k * st.y }),
      hint: () => 'Darab kedua-dua baris, bukan hanya baris pertama.',
      solution: st => `${m('' + st.k + 'a = ' + vec(st.k * st.x, st.k * st.y))}`
    },
    {
      title: 'Hasil ka − b dalam bentuk komponen',
      controls: [slider('k', 'Pengganda k', -3, 5, 1, 4), slider('bx', 'Baris atas bagi b', -6, 6, 1, 2), slider('by', 'Baris bawah bagi b', -6, 6, 1, 5)],
      prompt: st => `Diberi ${m('a')} = ${col(3, 1)} dan ${m('b')} = ${col(st.bx, st.by)}. Cari ${m('r = ' + st.k + 'a − b')} dalam bentuk ${m('xi + yj')}.`,
      visual: st => buildDiagramSVG([v(0, 0, 3 * st.k, st.k, 'blue', `${st.k}a`), v(3 * st.k, st.k, -st.bx, -st.by, 'red', '−b'), v(0, 0, 3 * st.k - st.bx, st.k - st.by, 'green', 'r')]),
      readout: st => eq(`${m('' + st.k + 'a = ' + vec(3 * st.k, st.k))}`, `${m('b = ' + vec(st.bx, st.by))}`),
      fields: () => [box('i', 'Komponen i'), box('j', 'Komponen j')],
      answers: st => ({ i: 3 * st.k - st.bx, j: st.k - st.by }),
      hint: () => 'Darab dengan k dahulu, kemudian tolak b. Jangan tolak sebelum mendarab.',
      solution: st => `${m('r = ' + vec(3 * st.k, st.k) + ' − (' + vec(st.bx, st.by) + ') = ' + vec(3 * st.k - st.bx, st.k - st.by))}`
    },
    {
      title: 'Magnitud bagi ka − b',
      controls: [slider('k', 'Pengganda k', -3, 5, 1, 4), slider('bx', 'Baris atas bagi b', -6, 6, 1, 2), slider('by', 'Baris bawah bagi b', -6, 6, 1, 5)],
      prompt: st => `Diberi ${m('a')} = ${col(3, 1)} dan ${m('b')} = ${col(st.bx, st.by)}, cari ${m('|' + st.k + 'a − b|')} kepada 4 tempat perpuluhan.`,
      visual: st => buildDiagramSVG([v(0, 0, 3 * st.k, st.k, 'blue', `${st.k}a`), v(3 * st.k, st.k, -st.bx, -st.by, 'red', '−b'), v(0, 0, 3 * st.k - st.bx, st.k - st.by, 'green', 'r')]),
      readout: st => eq(`${m('r = ' + vec(3 * st.k - st.bx, st.k - st.by))}`, `${m('|r| = √(r_x² + r_y²)')}`),
      fields: () => [box('mag', 'Magnitud (4 t.p.)', 4)],
      answers: st => ({ mag: Math.hypot(3 * st.k - st.bx, st.k - st.by) }),
      hint: () => 'Dapatkan vektor hasil dahulu, kemudian gunakan formula magnitud pada komponennya.',
      solution: st => `${m('|r| = √(' + neg(3 * st.k - st.bx) + '² + ' + neg(st.k - st.by) + '²) = √' + ((3 * st.k - st.bx) ** 2 + (st.k - st.by) ** 2) + ' ≈ ' + Math.hypot(3 * st.k - st.bx, st.k - st.by).toFixed(4))}`
    },
    {
      title: 'Vektor unit dalam arah ka − b',
      invalid: st => (Math.hypot(3 * st.k - st.bx, st.k - st.by) ? '' : 'Hasil ka − b ialah vektor sifar, jadi vektor unit tidak tertakrif. Ubah tetapan untuk meneruskan.'),
      controls: [slider('k', 'Pengganda k', -3, 5, 1, 4), slider('bx', 'Baris atas bagi b', -6, 6, 1, 2), slider('by', 'Baris bawah bagi b', -6, 6, 1, 5)],
      prompt: st => `Dengan ${m('a')} = ${col(3, 1)} dan ${m('b')} = ${col(st.bx, st.by)}, cari vektor unit dalam arah ${m('' + st.k + 'a − b')} kepada 4 tempat perpuluhan.`,
      visual: st => VectorExtensions.unitCircle(3 * st.k - st.bx, st.k - st.by),
      readout: st => {
        const x = 3 * st.k - st.bx;
        const y = st.k - st.by;
        const mag = Math.hypot(x, y);
        return mag ? eq(`${m('r = ' + vec(x, y))}`, `${m('|r| = √' + (x * x + y * y) + ' ≈ ' + mag.toFixed(4))}`, `${m('u = r/|r|')}`) : `${m('r = zero')}: vektor unit tidak tertakrif untuk tetapan ini.`;
      },
      fields: () => [box('ui', 'Komponen i bagi u (4 t.p.)', 4), box('uj', 'Komponen j bagi u (4 t.p.)', 4)],
      answers: st => {
        const x = 3 * st.k - st.bx;
        const y = st.k - st.by;
        const mag = Math.hypot(x, y) || 1;
        return { ui: x / mag, uj: y / mag };
      },
      hint: () => 'Urutan: darab, tolak, magnitud, bahagi. Jangan bahagi dengan magnitud sebelum vektor hasil ditemui.',
      solution: st => {
        const x = 3 * st.k - st.bx;
        const y = st.k - st.by;
        const mag = Math.hypot(x, y);
        if (!mag) return 'Vektor hasil ialah vektor sifar, jadi tiada vektor unit.';
        return steps(`${m('r = ' + vec(x, y))}`, `${m('|r| = √' + (x * x + y * y) + ' ≈ ' + mag.toFixed(4))}`, `${m('u ≈ ' + vec(Number((x / mag).toFixed(4)), Number((y / mag).toFixed(4))))}`);
      }
    },
    {
      title: 'Mencari k yang menghapuskan komponen i',
      controls: [slider('ax', 'Baris atas bagi a', 1, 6, 1, 3), slider('bx', 'Baris atas bagi b', 1, 9, 1, 2), slider('by', 'Baris bawah bagi b', -6, 6, 1, 5)],
      prompt: st => `Diberi ${m('a')} = ${col(st.ax, 1)} dan ${m('b')} = ${col(st.bx, st.by)}. Cari nilai k supaya komponen i bagi ${m('ka − b')} ialah sifar, serta komponen j yang terhasil. Jawab kepada 4 tempat perpuluhan.`,
      visual: st => buildDiagramSVG([v(0, 0, st.bx, st.bx / st.ax, 'blue', 'ka'), v(st.bx, st.bx / st.ax, -st.bx, -st.by, 'red', '−b'), v(0, 0, 0, st.bx / st.ax - st.by, 'green', 'r')]),
      readout: st => eq(`Komponen i: ${m('k × ' + st.ax + ' − ' + neg(st.bx) + ' = 0')}`, 'Selesaikan untuk k, kemudian gantikan semula untuk mendapatkan komponen j.'),
      fields: () => [box('k', 'Nilai k (4 t.p.)', 4), box('j', 'Komponen j yang terhasil (4 t.p.)', 4)],
      answers: st => ({ k: st.bx / st.ax, j: st.bx / st.ax - st.by }),
      hint: () => 'Tetapkan komponen i hasil kepada sifar: k·aₓ − bₓ = 0, jadi k = bₓ/aₓ. Gunakan nilai k yang sama dalam komponen j.',
      solution: st => steps(`${m('k = ' + st.bx + '/' + st.ax + ' ≈ ' + (st.bx / st.ax).toFixed(4))}`, `Komponen j: ${m('k × 1 − ' + neg(st.by) + ' ≈ ' + (st.bx / st.ax - st.by).toFixed(4))}`, `${m('r ≈ ' + vec(0, Number((st.bx / st.ax - st.by).toFixed(4))))}`)
    },
    {
      title: 'Penyelesaian sistem: dua vektor, dua parameter',
      controls: [slider('kx', 'Komponen i vektor hasil', -6, 6, 1, 5), slider('ky', 'Komponen j vektor hasil', -6, 6, 1, 2)],
      prompt: st => `Diberi ${m('a')} = ${col(2, 1)} dan ${m('b')} = ${col(1, -2)}. Cari p dan q supaya ${m('pa + qb = ' + vec(st.kx, st.ky))}}. Jawab kepada 2 tempat perpuluhan.`,
      visual: st => {
        const p = (2 * st.ky + st.kx) / 5;
        const q = (2 * st.kx - st.ky) / 5;
        return buildDiagramSVG(drawable([v(0, 0, 2 * p, p, 'blue', 'pa'), v(2 * p, p, q, -2 * q, 'red', 'qb'), v(0, 0, 2 * p + q, p - 2 * q, 'green', 'hasil')]));
      },
      readout: st => eq(`Persamaan: ${m('2p + q = ' + st.kx)}`, `${m('p − 2q = ' + st.ky)}`),
      fields: () => [box('p', 'Nilai p (2 t.p.)', 2), box('q', 'Nilai q (2 t.p.)', 2)],
      answers: st => {
        const p = (2 * st.ky + st.kx) / 5;
        const q = (2 * st.kx - st.ky) / 5;
        return { p, q };
      },
      hint: () => 'Tuliskan dua persamaan komponen: komponen i dan komponen j. Selesaikan sistem dua persamaan, dua pemboleh ubah menggunakan penggantian atau penghapusan.',
      solution: st => {
        const p = (2 * st.ky + st.kx) / 5;
        const q = (2 * st.kx - st.ky) / 5;
        return steps(`Sistem: ${m('2p + q = ' + st.kx + ', p − 2q = ' + st.ky)}`, `Daripada persamaan kedua: ${m('p = ' + st.ky + ' + 2q')}`, `Gantikan ke persamaan pertama: ${m('2(' + st.ky + ' + 2q) + q = ' + st.kx)}`, `${m('5q = ' + (2 * st.kx - st.ky).toFixed(2))}`, `${m('p ≈ ' + p.toFixed(2) + ', q ≈ ' + q.toFixed(2))}`);
      }
    },
    {
      title: 'Magnitud gabungan vektor lajur dengan pekali negatif',
      controls: [slider('p', 'Pekali p', -4, -1, 1, -2), slider('q', 'Pekali q', 1, 5, 1, 3)],
      prompt: st => `Diberi ${m('a')} = ${col(3, 2)} dan ${m('b')} = ${col(-1, 4)}. Cari ${m('|' + st.p + 'a + ' + st.q + 'b|')} kepada 4 tempat perpuluhan.`,
      visual: st => buildDiagramSVG(drawable([v(0, 0, 3 * st.p, 2 * st.p, 'blue', `${st.p}a`), v(3 * st.p, 2 * st.p, -st.q, 4 * st.q, 'red', `${st.q}b`), v(0, 0, 3 * st.p - st.q, 2 * st.p + 4 * st.q, 'green', 'hasil')])),
      readout: st => eq(`${m(st.p + 'a = ' + vec(3 * st.p, 2 * st.p))}`, `${m(st.q + 'b = ' + vec(-st.q, 4 * st.q))}`, `${m('Hasil = ' + vec(3 * st.p - st.q, 2 * st.p + 4 * st.q))}`),
      fields: () => [box('mag', 'Magnitud (4 t.p.)', 4)],
      answers: st => ({ mag: Math.hypot(3 * st.p - st.q, 2 * st.p + 4 * st.q) }),
      hint: () => 'Lakukan pendaraban skalar untuk kedua-dua vektor, tambah komponen, kemudian gunakan formula magnitud √(x² + y²).',
      solution: st => {
        const x = 3 * st.p - st.q;
        const y = 2 * st.p + 4 * st.q;
        return steps(`${m(st.p + 'a = ' + vec(3 * st.p, 2 * st.p))}`, `${m(st.q + 'b = ' + vec(-st.q, 4 * st.q))}`, `${m('Hasil = ' + vec(x, y))}`, `${m('|Hasil| = √(' + neg(x) + '² + ' + neg(y) + '²) = √' + (x * x + y * y) + ' ≈ ' + Math.hypot(x, y).toFixed(4))}`);
      }
    }
  ];

  /* ---------- Area 6: Resources — applying each reference formula ---------- */
  const resourceExamples = [
    {
      title: 'Formula vektor antara dua titik',
      controls: [slider('px', 'x bagi P', -8, 8, 1, 1), slider('py', 'y bagi P', -8, 8, 1, 2), slider('qx', 'x bagi Q', -8, 8, 1, 4), slider('qy', 'y bagi Q', -8, 8, 1, 6)],
      prompt: st => `Gunakan ${m('PQ = (x₂ − x₁)i + (y₂ − y₁)j')} bagi P(${st.px}, ${st.py}) dan Q(${st.qx}, ${st.qy}).`,
      visual: st => buildDiagramSVG([v(st.px, st.py, st.qx - st.px, st.qy - st.py, 'green', 'PQ')]),
      readout: () => 'Titik kedua tolak titik pertama, mengikut urutan huruf dalam nama vektor.',
      fields: () => [box('i', 'Komponen i'), box('j', 'Komponen j')],
      answers: st => ({ i: st.qx - st.px, j: st.qy - st.py }),
      hint: () => 'PQ bermula di P. Jika anda menolak dalam urutan terbalik, anda mendapat QP.',
      solution: st => `${m('PQ = ' + vec(st.qx - st.px, st.qy - st.py))}`
    },
    {
      title: 'Formula jarak antara dua titik',
      controls: [slider('px', 'x bagi P', -8, 8, 1, 1), slider('py', 'y bagi P', -8, 8, 1, 2), slider('qx', 'x bagi Q', -8, 8, 1, 4), slider('qy', 'y bagi Q', -8, 8, 1, 6)],
      prompt: st => `Cari ${m('|PQ|')} bagi P(${st.px}, ${st.py}) dan Q(${st.qx}, ${st.qy}), betul kepada 2 tempat perpuluhan.`,
      visual: st => buildDiagramSVG([v(st.px, st.py, st.qx - st.px, 0, 'blue', 'Δx'), v(st.qx, st.py, 0, st.qy - st.py, 'red', 'Δy'), v(st.px, st.py, st.qx - st.px, st.qy - st.py, 'green', 'PQ')]),
      readout: st => eq(`${m('PQ = ' + vec(st.qx - st.px, st.qy - st.py))}`, `${m('|PQ| = √(Δx² + Δy²)')}`),
      fields: () => [box('mag', 'Jarak (2 t.p.)', 2)],
      answers: st => ({ mag: Math.hypot(st.qx - st.px, st.qy - st.py) }),
      hint: () => 'Cari komponen PQ dahulu, kemudian gunakan formula magnitud pada komponen tersebut.',
      solution: st => `${m('|PQ| = √' + ((st.qx - st.px) ** 2 + (st.qy - st.py) ** 2) + ' ≈ ' + Math.hypot(st.qx - st.px, st.qy - st.py).toFixed(2))}`
    },
    {
      title: 'Vektor kedudukan titik tengah',
      controls: [slider('px', 'x bagi P', -8, 8, 1, -3), slider('py', 'y bagi P', -8, 8, 1, 2), slider('qx', 'x bagi Q', -8, 8, 1, 5), slider('qy', 'y bagi Q', -8, 8, 1, 6)],
      prompt: st => `Cari vektor kedudukan titik tengah M bagi PQ dengan P(${st.px}, ${st.py}) dan Q(${st.qx}, ${st.qy}). Jawab kepada 2 tempat perpuluhan.`,
      visual: st => buildDiagramSVG([v(0, 0, st.px, st.py, 'blue', 'OP', true), v(0, 0, st.qx, st.qy, 'red', 'OQ', true), v(0, 0, (st.px + st.qx) / 2, (st.py + st.qy) / 2, 'green', 'OM')]),
      readout: () => eq(`${m('OM = ½(OP + OQ)')}`, 'Purata setiap pasangan koordinat.'),
      fields: () => [box('i', 'Komponen i (2 t.p.)', 2), box('j', 'Komponen j (2 t.p.)', 2)],
      answers: st => ({ i: (st.px + st.qx) / 2, j: (st.py + st.qy) / 2 }),
      hint: () => 'Tambah kedua-dua vektor kedudukan, kemudian darab dengan separuh. Ini ialah pendaraban skalar dengan k = ½.',
      solution: st => steps(`${m('OP + OQ = ' + vec(st.px + st.qx, st.py + st.qy))}`, `${m('OM = ½(' + vec(st.px + st.qx, st.py + st.qy) + ') = ' + vec((st.px + st.qx) / 2, (st.py + st.qy) / 2))}`)
    },
    {
      title: 'Formula pendaraban skalar negatif',
      controls: [slider('k', 'Pengganda k', 1, 5, 1, 2), slider('x', 'Komponen i bagi v', -6, 6, 1, 2), slider('y', 'Komponen j bagi v', -6, 6, 1, -3)],
      prompt: st => `Gunakan ${m('kv = kx i + ky j')} untuk mencari ${m('−' + st.k + 'v')} apabila ${m('v = ' + vec(st.x, st.y))}, serta magnitudnya (2 t.p.).`,
      visual: st => buildDiagramSVG([v(0, 0, st.x, st.y, 'blue', 'v'), v(0, 0, -st.k * st.x, -st.k * st.y, 'green', `−${st.k}v`)]),
      readout: st => eq(`${m('|kv| = |k| × |v|')}`, `${m('|v| = √' + (st.x * st.x + st.y * st.y) + ' ≈ ' + Math.hypot(st.x, st.y).toFixed(4))}`),
      fields: () => [box('i', 'Komponen i'), box('j', 'Komponen j'), box('mag', 'Magnitud (2 t.p.)', 2)],
      answers: st => ({ i: -st.k * st.x, j: -st.k * st.y, mag: st.k * Math.hypot(st.x, st.y) }),
      hint: () => 'Pengganda negatif membalikkan arah tetapi magnitud menggunakan |k|, jadi ia sentiasa positif.',
      solution: st => steps(`${m('−' + st.k + 'v = ' + vec(-st.k * st.x, -st.k * st.y))}`, `${m('|−' + st.k + 'v| = ' + st.k + ' × √' + (st.x * st.x + st.y * st.y) + ' ≈ ' + (st.k * Math.hypot(st.x, st.y)).toFixed(2))}`)
    },
    {
      title: 'Formula sudut arah dengan semakan sukuan',
      controls: [slider('x', 'Komponen i', -9, 9, 1, -4), slider('y', 'Komponen j', -9, 9, 1, -3)],
      prompt: st => `Bagi ${m('v = ' + vec(st.x, st.y))}, cari magnitud (2 t.p.) dan sudut dari paksi x positif dalam julat 0° hingga 360° (2 t.p.).`,
      visual: st => buildDiagramSVG([v(0, 0, st.x, st.y, 'green', 'v')]),
      readout: st => eq(`${m('θ = atan2(y, x)')}`, `Sukuan: ${st.x >= 0 && st.y >= 0 ? 'I' : st.x < 0 && st.y >= 0 ? 'II' : st.x < 0 ? 'III' : 'IV'}`),
      fields: () => [box('mag', 'Magnitud (2 t.p.)', 2), box('ang', 'Sudut (°, 2 t.p.)', 2)],
      answers: st => ({ mag: Math.hypot(st.x, st.y), ang: degrees(st.y, st.x) }),
      hint: () => 'Kira sudut rujukan dengan tan⁻¹|y/x|, kemudian laraskan mengikut sukuan supaya jawapan berada dalam 0° hingga 360°.',
      solution: st => steps(`${m('|v| = √' + (st.x * st.x + st.y * st.y) + ' ≈ ' + Math.hypot(st.x, st.y).toFixed(2))}`, `${m('θ ≈ ' + degrees(st.y, st.x).toFixed(2))}°`)
    },
    {
      title: 'Formula bahagian: titik pada PQ',
      controls: [slider('px', 'x bagi P', -8, 8, 1, 1), slider('py', 'y bagi P', -8, 8, 1, 2), slider('qx', 'x bagi Q', -8, 8, 1, 7), slider('qy', 'y bagi Q', -8, 8, 1, 6), slider('t', 'Pecahan t sepanjang PQ', 0, 1, 0.1, 0.5)],
      prompt: st => `Titik R terletak pada PQ supaya ${m('OR = OP + t(OQ − OP)')} dengan t = ${n(st.t)}. Cari koordinat R kepada 2 tempat perpuluhan, dengan P(${st.px}, ${st.py}) dan Q(${st.qx}, ${st.qy}).`,
      visual: st => buildDiagramSVG([v(st.px, st.py, st.qx - st.px, st.qy - st.py, 'blue', 'PQ', true), v(0, 0, st.px + st.t * (st.qx - st.px), st.py + st.t * (st.qy - st.py), 'green', 'OR')]),
      readout: st => eq(`${m('PQ = ' + vec(st.qx - st.px, st.qy - st.py))}`, `${m('t PQ = ' + vec(st.t * (st.qx - st.px), st.t * (st.qy - st.py)))}`),
      fields: () => [box('i', 'Koordinat x bagi R (2 t.p.)', 2), box('j', 'Koordinat y bagi R (2 t.p.)', 2)],
      answers: st => ({ i: st.px + st.t * (st.qx - st.px), j: st.py + st.t * (st.qy - st.py) }),
      hint: () => 't = 0 memberi P dan t = 1 memberi Q. Darab PQ dengan t dahulu, kemudian tambah kepada OP.',
      solution: st => steps(`${m('PQ = ' + vec(st.qx - st.px, st.qy - st.py))}`, `${m('OR = ' + vec(st.px, st.py) + ' + ' + n(st.t) + '(' + vec(st.qx - st.px, st.qy - st.py) + ')')}`, `${m('OR ≈ ' + vec(Number((st.px + st.t * (st.qx - st.px)).toFixed(2)), Number((st.py + st.t * (st.qy - st.py)).toFixed(2))))}`)
    },
    {
      title: 'Formula nisbah bahagian dalam: titik yang membahagi PQ',
      controls: [slider('px', 'x bagi P', -6, 6, 1, -2), slider('py', 'y bagi P', -6, 6, 1, 1), slider('qx', 'x bagi Q', -6, 6, 1, 4), slider('qy', 'y bagi Q', -6, 6, 1, 5), slider('m', 'Nisbah m dalam m:n', 1, 4, 1, 2), slider('n', 'Nisbah n dalam m:n', 1, 4, 1, 1)],
      prompt: st => `Titik R membahagi PQ dengan nisbah ${st.m}:${st.n}. Gunakan ${m('OR = (m·OQ + n·OP)/(m+n)')}} untuk cari koordinat R (2 t.p.), dengan P(${st.px}, ${st.py}) dan Q(${st.qx}, ${st.qy}).`,
      visual: st => {
        const total = st.m + st.n;
        const rx = (st.m * st.qx + st.n * st.px) / total;
        const ry = (st.m * st.qy + st.n * st.py) / total;
        return buildDiagramSVG([v(st.px, st.py, st.qx - st.px, st.qy - st.py, 'blue', 'PQ', true), v(0, 0, rx, ry, 'green', 'R')]);
      },
      readout: st => eq(`Nisbah: ${st.m}:${st.n}`, `${m('OR = (' + st.m + 'OQ + ' + st.n + 'OP)/' + (st.m + st.n))}`),
      fields: () => [box('i', 'Koordinat x bagi R (2 t.p.)', 2), box('j', 'Koordinat y bagi R (2 t.p.)', 2)],
      answers: st => {
        const total = st.m + st.n;
        return { i: (st.m * st.qx + st.n * st.px) / total, j: (st.m * st.qy + st.n * st.py) / total };
      },
      hint: () => 'Formula nisbah bahagian: pembilang = m kali titik akhir + n kali titik awal; penyebut = m + n.',
      solution: st => {
        const total = st.m + st.n;
        const rx = (st.m * st.qx + st.n * st.px) / total;
        const ry = (st.m * st.qy + st.n * st.py) / total;
        return steps(`${m('OR = (' + st.m + ' × ' + st.qx + ' + ' + st.n + ' × ' + neg(st.px) + ')/' + total + ' i')}`, `${m('OR = (' + st.m + ' × ' + st.qy + ' + ' + st.n + ' × ' + neg(st.py) + ')/' + total + ' j')}`, `${m('OR ≈ (' + rx.toFixed(2) + ', ' + ry.toFixed(2) + ')')})`);
      }
    },
    {
      title: 'Kesamaan vektor dalam penyelesaian masalah geometri',
      controls: [slider('k', 'Pengganda k dalam AB = ka', 1, 6, 1, 3), slider('m', 'Pekali m dalam OC = m·OA', 0.2, 2, 0.2, 1)],
      prompt: st => `Dalam segi empat OABC, ${m('OA = a')}, ${m('OB = b')}, ${m('AB = ' + st.k + 'a')}. Guna kesamarataan vektor untuk menunjukkan bahawa ${m('OC = ' + n(st.m) + '(b − a + ' + st.k + 'a)')} dan cari ${m('|OC|')}} jika ${m('|a| = 2')} dan ${m('|b| = 5')}} dan a, b berserenjang.`,
      visual: st => buildDiagramSVG([v(0, 0, 2, 0, 'blue', 'a'), v(0, 0, 0, 5, 'red', 'b'), v(2, 0, st.k * 2, 0, 'purple', 'AB')]),
      readout: st => eq(`Guna kesamarataan: ${m('OB = OA + AB')}`, `${m('b = a + ' + st.k + 'a = (1 + ' + st.k + ')a')}`, `Kerana a ⊥ b: ${m('|OC|² = |b − a + ' + st.k + 'a|² = |' + (st.k - 1) + 'b|²')}}`),
      fields: () => [box('mag', `Magnitud |OC| (2 t.p.)`, 2)],
      answers: st => {
        const resultMag = Math.abs(st.k - 1) * 5;
        return { mag: st.m * resultMag };
      },
      hint: () => 'Gunakan kesamarataan vektor untuk menulis hubungan antara OA, OB dan AB. Kerana berserenjang, gunakan teorem Pythagoras untuk magnitud.',
      solution: st => {
        const resultMag = Math.abs(st.k - 1) * 5;
        const ocMag = st.m * resultMag;
        return steps(`Kesamarataan vektor: ${m('OB = OA + AB')}`, `${m('b = a + ' + st.k + 'a')}`, `${m('OC = ' + n(st.m) + '(b − a + ' + st.k + 'a) = ' + n(st.m) + ' × ' + (st.k - 1) + 'a')}`, `Kerana a ⊥ b, dan |a| = 2, |b| = 5:`, `${m('|OC| = ' + n(st.m) + ' × ' + (st.k - 1) + ' × 5 = ' + ocMag.toFixed(2))}`);
      }
    }
  ];

  const AREAS = [
    { tab: 'intro', key: 'intro', title: 'Enam contoh interaktif: kuantiti harian kepada aplikasi', examples: introExamples },
    { tab: 'concept1', key: 'scalar', title: 'Enam contoh interaktif: skalar, vektor dan pendaraban skalar', examples: scalarExamples },
    { tab: 'concept2', key: 'component', title: 'Enam contoh interaktif: komponen, magnitud, arah dan vektor unit', examples: componentExamples },
    { tab: 'concept3', key: 'addition', title: 'Enam contoh interaktif: tambah, tolak dan laluan geometri', examples: additionExamples },
    { tab: 'practice', key: 'drill', title: 'Enam contoh interaktif: latih tubi gaya peperiksaan', examples: practiceExamples },
    { tab: 'resources', key: 'formula', title: 'Enam contoh interaktif: setiap formula rujukan digunakan', examples: resourceExamples }
  ];

  /* ---------- rendering and interaction ---------- */
  const escapeCache=new Map();const MAX_CACHE=64;
  function escapeAttr(text) {
    const key=String(text);if(escapeCache.has(key))return escapeCache.get(key);
    const result=key.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
    if(escapeCache.size>=MAX_CACHE)escapeCache.delete(escapeCache.keys().next().value);
    escapeCache.set(key,result);return result;
  }

  function controlValue(input) {
    if (input.tagName === 'SELECT') {
      const asNumber = Number(input.value);
      return input.value !== '' && !Number.isNaN(asNumber) ? asNumber : input.value;
    }
    return Number(input.value);
  }

  function readState(card) {
    const state = {};
    card.querySelectorAll('.ex-controls [data-control]').forEach(input => {
      state[input.dataset.control] = controlValue(input);
    });
    return state;
  }

  function buildCard(area, spec, index) {
    const level = LEVELS[index];
    const id = `ex-${area.key}-${index + 1}`;
    const card = document.createElement('article');
    card.className = 'ex-card';
    card.id = id;
    card.dataset.tier = level.tier;
    card.dataset.level = String(index + 1);
    const controls = (spec.controls || []).map(control => {
      const controlId = `${id}-c-${control.key}`;
      if (control.kind === 'select') {
        const options = control.options.map(([value, label]) => `<option value="${escapeAttr(value)}"${String(value) === String(control.value) ? ' selected' : ''}>${escapeAttr(label)}</option>`).join('');
        return `<label for="${controlId}"><span>${escapeAttr(control.label)}</span><select id="${controlId}" data-control="${control.key}">${options}</select></label>`;
      }
      return `<label class="ex-slider" for="${controlId}"><span>${escapeAttr(control.label)}<output for="${controlId}">${control.value}</output></span><input id="${controlId}" data-control="${control.key}" type="range" min="${control.min}" max="${control.max}" step="${control.step}" value="${control.value}"></label>`;
    }).join('');
    card.innerHTML = `<header class="ex-head"><span class="ex-badge">${level.label}</span><h4>${escapeAttr(spec.title)}</h4></header>
      <div class="ex-controls">${controls}</div>
      <div class="ex-grid">
        <div class="ex-visual"></div>
        <div class="ex-side">
          <p class="ex-prompt"></p>
          <div class="ex-readout" aria-live="polite"></div>
          <div class="ex-answer"></div>
          <div class="ex-actions">
            <button type="button" data-act="check">✓ Semak jawapan</button>
            <button type="button" data-act="hint">💡 Petua</button>
            <button type="button" data-act="solution">📖 Penyelesaian</button>
            <button type="button" data-act="reset">↺ Set semula</button>
          </div>
          <p class="ex-feedback" role="status"></p>
          <div class="ex-hint" hidden></div>
          <div class="ex-solution" hidden></div>
        </div>
      </div>`;
    const answerArea = card.querySelector('.ex-answer');
    const initialState = {};
    (spec.controls || []).forEach(control => { initialState[control.key] = control.kind === 'select' ? control.value : Number(control.value); });
    (spec.fields ? spec.fields(initialState) : []).forEach(field => {
      const fieldId = `${id}-a-${field.key}`;
      const label = document.createElement('label');
      label.setAttribute('for', fieldId);
      if (field.kind === 'select') {
        label.innerHTML = `<span>${escapeAttr(field.label)}</span><select id="${fieldId}" data-key="${field.key}"><option value="">— Pilih —</option>${field.options.map(([value, text]) => `<option value="${escapeAttr(value)}">${escapeAttr(text)}</option>`).join('')}</select>`;
      } else {
        label.innerHTML = `<span>${escapeAttr(field.label)}</span><input id="${fieldId}" data-key="${field.key}" data-dp="${field.dp || 0}" type="text" inputmode="decimal" autocomplete="off">`;
      }
      answerArea.append(label);
    });
    return card;
  }

  function clearAnswers(card) {
    card.querySelectorAll('.ex-answer [data-key]').forEach(element => {
      element.value = '';
      element.classList.remove('ex-ok', 'ex-no');
    });
    const feedback = card.querySelector('.ex-feedback');
    feedback.textContent = '';
    feedback.removeAttribute('data-state');
    card.querySelector('.ex-hint').hidden = true;
    card.querySelector('.ex-solution').hidden = true;
  }

  function update(card, spec) {
    const state = readState(card);
    card.querySelectorAll('.ex-controls input[type="range"]').forEach(input => {
      const output = card.querySelector(`output[for="${input.id}"]`);
      if (output) output.textContent = input.value;
    });
    const visual = spec.visual ? spec.visual(state) : '';
    const holder = card.querySelector('.ex-visual');
    holder.innerHTML = visual;
    holder.hidden = !visual;
    card.querySelector('.ex-grid').classList.toggle('ex-single', !visual);
    card.querySelector('.ex-prompt').innerHTML = spec.prompt(state);
    card.querySelector('.ex-readout').innerHTML = spec.readout ? spec.readout(state) : '';
    VectorMath.render(card.querySelector('.ex-prompt'));
    VectorMath.render(card.querySelector('.ex-readout'));
    const blocked = spec.invalid ? spec.invalid(state) : '';
    card.querySelectorAll('.ex-answer [data-key]').forEach(element => { element.disabled = !!blocked; });
    ['check', 'hint', 'solution'].forEach(act => { card.querySelector(`[data-act="${act}"]`).disabled = !!blocked; });
    if (blocked) {
      const feedback = card.querySelector('.ex-feedback');
      feedback.dataset.state = 'empty';
      feedback.textContent = blocked;
    }
    return state;
  }

  function check(card, spec) {
    const state = readState(card);
    if (spec.invalid && spec.invalid(state)) return false;
    const expected = spec.answers(state);
    const feedback = card.querySelector('.ex-feedback');
    let complete = true;
    let correct = true;
    card.querySelectorAll('.ex-answer [data-key]').forEach(element => {
      const key = element.dataset.key;
      let ok;
      if (element.tagName === 'SELECT') {
        if (element.value === '') { complete = false; return; }
        ok = element.value === String(expected[key]);
      } else {
        const raw = element.value.trim().replace(/−/g, '-');
        if (!/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(raw)) { complete = false; return; }
        const value = Number(raw);
        if (!Number.isFinite(value)) { complete = false; return; }
        const dp = Number(element.dataset.dp) || 0;
        const tolerance = dp ? 0.5 * 10 ** -dp + 1e-9 : 1e-6;
        ok = Math.abs(value - expected[key]) < tolerance;
      }
      element.classList.toggle('ex-ok', ok);
      element.classList.toggle('ex-no', !ok);
      if (!ok) correct = false;
    });
    if (!complete) {
      feedback.dataset.state = 'empty';
      feedback.textContent = 'Lengkapkan setiap medan dengan nombor atau pilihan yang sah dahulu.';
      return false;
    }
    feedback.dataset.state = correct ? 'correct' : 'wrong';
    if (correct) {
      const tier = card.dataset.tier;
      let message = '✓ Betul. Ubah peluncur atau pilihan untuk mencuba kes baharu.';
      if (!solved.has(card.id) && typeof addXp === 'function') {
        solved.add(card.id);
        addXp(XP[tier]);
        message += ` (+${XP[tier]} XP)`;
      }
      feedback.textContent = message;
    } else {
      feedback.textContent = '✗ Belum tepat. Medan merah perlu disemak semula; cuba Petua.';
    }
    return correct;
  }

  function mount(area) {
    const host = document.getElementById(area.tab);
    if (!host) return null;
    const anchor = host.querySelector('.worked-examples');
    if (!anchor) return null;
    const section = document.createElement('section');
    section.className = 'example-ladder';
    section.id = `ladder-${area.key}`;
    section.innerHTML = `<div class="lab-kicker">Lapan contoh tambahan · mudah ke sukar</div>
      <h3>${escapeAttr(area.title)}</h3>
      <p class="ex-ladder-intro">Lapan contoh interaktif berikut melanjutkan konsep dengan progres pembelajaran yang jelas. Tahap 1−3 menguji pengecaman atau pengiraan terus, tahap 4−6 memerlukan penaakulan vektor beberapa langkah dengan kesamarataan (keseimbangan), dan tahap 7−8 ialah masalah gunaan, geometri atau sistem kompleks. Ubah kawalan, masukkan jawapan anda, kemudian semak.</p>
      <ol class="ex-ladder-scale">${LEVELS.map(level => `<li>${level.label}</li>`).join('')}</ol>`;
    area.examples.forEach((spec, index) => {
      const card = buildCard(area, spec, index);
      section.append(card);
      card.querySelectorAll('.ex-controls [data-control]').forEach(input => {
        input.addEventListener('input', () => { clearAnswers(card); update(card, spec); });
        input.addEventListener('change', () => { clearAnswers(card); update(card, spec); });
      });
      card.querySelector('[data-act="check"]').addEventListener('click', () => check(card, spec));
      card.querySelector('[data-act="hint"]').addEventListener('click', () => {
        const hint = card.querySelector('.ex-hint');
        hint.innerHTML = `<strong>Petua:</strong> ${spec.hint(readState(card))}`;
        hint.hidden = false;
        VectorMath.render(hint);
      });
      card.querySelector('[data-act="solution"]').addEventListener('click', () => {
        const solution = card.querySelector('.ex-solution');
        solution.innerHTML = `<strong>Penyelesaian:</strong> ${spec.solution(readState(card))}`;
        solution.hidden = false;
        VectorMath.render(solution);
      });
      card.querySelector('[data-act="reset"]').addEventListener('click', () => {
        (spec.controls || []).forEach(control => {
          const input = card.querySelector(`[data-control="${control.key}"]`);
          if (input) input.value = control.value;
        });
        clearAnswers(card);
        update(card, spec);
      });
      update(card, spec);
    });
    anchor.insertAdjacentElement('afterend', section);
    return section;
  }

  const sections = AREAS.map(mount).filter(Boolean);
  return { AREAS, LEVELS, sections, check, update, readState };
})();
