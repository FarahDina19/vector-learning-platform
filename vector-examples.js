/* Six extra interactive examples for every existing example area, ordered Easy 1 to Hard 6. */
const VectorExamples = (() => {
  const m = VectorMath.math;
  const col = VectorMath.column;
  const LEVELS = [
    { label: 'Easy 1', tier: 'easy' },
    { label: 'Easy 2', tier: 'easy' },
    { label: 'Medium 3', tier: 'medium' },
    { label: 'Medium 4', tier: 'medium' },
    { label: 'Hard 5', tier: 'hard' },
    { label: 'Hard 6', tier: 'hard' }
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
  // Enhanced solution formatter with final answer box
  const solutionWithFinalAnswer = (stepsList, finalAnswer) => {
    const stepsHTML = `<div class="solution-steps"><ol>${stepsList.map(item => `<li>${item}</li>`).join('')}</ol></div>`;
    const answerHTML = `<div class="solution-final-answer"><strong>Final Answer:</strong> ${finalAnswer}</div>`;
    return stepsHTML + answerHTML;
  };
  const v = (ox, oy, dx, dy, color, label, dashed, showComponents) => ({ ox, oy, dx, dy, color, label, dashed, showComponents });
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
      solution: st => solutionWithFinalAnswer(
        [
          `Your path: ${st.e} km East and ${st.u} km North`,
          `${m('Displacement = √(East² + North²) = √(' + st.e + '² + ' + st.u + '²)')}`,
          `${m('= √(' + (st.e * st.e + st.u * st.u) + ')')}`,
          `${m('= ' + Math.hypot(st.e, st.u).toFixed(2))} km`
        ],
        `<strong>${Math.hypot(st.e, st.u).toFixed(2)} km</strong>`
      )
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
      solution: st => solutionWithFinalAnswer(
        [
          `Total distance = ${st.f} + ${st.b} = ${st.f + st.b} m (sum of all path lengths)`,
          `Displacement = ${st.f} m East − ${st.b} m West = ${st.f - st.b} m (net position from start)`,
          `<strong>Key difference:</strong> Distance is scalar (always positive). Displacement is vector (can be negative).`
        ],
        `Total distance: <strong>${st.f + st.b} m</strong> | Displacement: <strong>${st.f - st.b} m East</strong>`
      )
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
      solution: st => solutionWithFinalAnswer(
        [
          `Resultant velocity = ${m(vec(st.w, st.p))} km/h`,
          `Speed = ${m('√(' + st.w + '² + ' + st.p + '²) = √' + (st.w * st.w + st.p * st.p))}`,
          `Speed ≈ ${m(Math.hypot(st.w, st.p).toFixed(2))} km/h`,
          `Direction from North = ${m('atan2(' + st.w + ', ' + st.p + ') ≈ ' + ((Math.atan2(st.w, st.p) * 180) / Math.PI).toFixed(2))}°`
        ],
        `Speed: <strong>${Math.hypot(st.w, st.p).toFixed(2)} km/h</strong> | Direction: <strong>${((Math.atan2(st.w, st.p) * 180) / Math.PI).toFixed(2)}° from North</strong>`
      )
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
      solution: st => solutionWithFinalAnswer(
        [
          `Resultant = Force 1 + Force 2 = ${m(vec(st.a, st.b))} N`,
          `Magnitude = ${m('√(' + st.a + '² + ' + st.b + '²) = √' + (st.a * st.a + st.b * st.b))}`,
          `Magnitude ≈ ${m(Math.hypot(st.a, st.b).toFixed(2))} N`,
          `Balance Force = −Resultant = ${m(vec(-st.a, -st.b))} N (opposite direction)`
        ],
        `Resultant: <strong>${Math.hypot(st.a, st.b).toFixed(2)} N</strong> | Balance Force: <strong>${m(vec(-st.a, -st.b))} N</strong>`
      )
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
      solution: st => solutionWithFinalAnswer(
        [
          `Velocity per frame × Number of frames = ${m(vec(st.vx, st.vy))} × ${st.t} = ${m(vec(st.vx * st.t, st.vy * st.t))}`,
          `Final position = Start + Total movement = ${m(vec(2, 1))} + ${m(vec(st.vx * st.t, st.vy * st.t))} = ${m(vec(2 + st.vx * st.t, 1 + st.vy * st.t))}`,
          `Distance = ${m('√(x² + y²) = √(' + neg(2 + st.vx * st.t) + '² + ' + neg(1 + st.vy * st.t) + '²) = √' + ((2 + st.vx * st.t) ** 2 + (1 + st.vy * st.t) ** 2))}`,
          `Distance ≈ ${m(Math.hypot(2 + st.vx * st.t, 1 + st.vy * st.t).toFixed(2))} units`
        ],
        `Position: <strong>${m(vec(2 + st.vx * st.t, 1 + st.vy * st.t))}</strong> | Distance from origin: <strong>${Math.hypot(2 + st.vx * st.t, 1 + st.vy * st.t).toFixed(2)} units</strong>`
      )
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
      solution: st => solutionWithFinalAnswer(
        [
          `Apply 3D Pythagorean Theorem: ${m('√(x² + y² + z²)')}`,
          `Substitute values: ${m('√(' + st.x + '² + ' + st.y + '² + ' + st.z + '²) = √(' + (st.x * st.x + st.y * st.y + st.z * st.z) + ')')}`,
          `Calculate: ${m('≈ ' + Math.hypot(st.x, st.y, st.z).toFixed(2))} m`
        ],
        `Total distance from start: <strong>${Math.hypot(st.x, st.y, st.z).toFixed(2)} m</strong>`
      )
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
      solution: st => solutionWithFinalAnswer(
        [
          `Resultant vector: ${m('R = ' + vec(st.fx, st.fy) + ' + ' + st.fz + 'k')} N`,
          `Magnitude using 3D theorem: ${m('|R| = √(' + st.fx + '² + ' + st.fy + '² + ' + st.fz + '²) = √' + (st.fx * st.fx + st.fy * st.fy + st.fz * st.fz))}`,
          `Magnitude ≈ ${m(Math.hypot(st.fx, st.fy, st.fz).toFixed(2))} N`,
          `Balance force (opposite): ${m('−R = ' + vec(-st.fx, -st.fy) + ' − ' + st.fz + 'k')} N`
        ],
        `Resultant magnitude: <strong>${Math.hypot(st.fx, st.fy, st.fz).toFixed(2)} N</strong> | Balance force: <strong>${m(vec(-st.fx, -st.fy) + ' − ' + st.fz + 'k')} N</strong>`
      )
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
      solution: st => solutionWithFinalAnswer(
        [
          `Apply negative sign to each component: ${m('−A = −(' + vec(st.x, st.y) + ')')}`,
          `Change all signs: i-component: ${m(st.x)} becomes ${m(-st.x)}, j-component: ${m(st.y)} becomes ${m(-st.y)}`
        ],
        `${m('−A = ' + vec(-st.x, -st.y))}`
      )
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
      solution: st => solutionWithFinalAnswer(
        [
          `Square each component: ${m(neg(st.x))}² = ${st.x * st.x}, ${m(neg(st.y))}² = ${st.y * st.y}`,
          `Add the squares: ${st.x * st.x} + ${st.y * st.y} = ${st.x * st.x + st.y * st.y}`,
          `Take the square root: ${m('√' + (st.x * st.x + st.y * st.y))}`
        ],
        `${m('|v| ≈ ' + Math.hypot(st.x, st.y).toFixed(2))}`
      )
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
      solution: st => solutionWithFinalAnswer(
        [
          `Multiply each component of v by k = ${m(n(st.k))}`,
          `i-component: ${m(n(st.k))} × ${m(n(st.x))} = ${m(n(st.k * st.x))}`,
          `j-component: ${m(n(st.k))} × ${m(n(st.y))} = ${m(n(st.k * st.y))}`,
          `Calculate original magnitude: ${m('|v| = √' + (st.x * st.x + st.y * st.y) + ' ≈ ' + Math.hypot(st.x, st.y).toFixed(4))}`,
          `Magnitude of scaled vector: ${m('|kv| = |' + n(st.k) + '| × ' + Math.hypot(st.x, st.y).toFixed(4) + ' ≈ ' + (Math.abs(st.k) * Math.hypot(st.x, st.y)).toFixed(2))}`
        ],
        `kv = <strong>${m(vec(st.k * st.x, st.k * st.y))}</strong> | Magnitude: <strong>${m((Math.abs(st.k) * Math.hypot(st.x, st.y)).toFixed(2))}</strong>`
      )
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
      solution: st => solutionWithFinalAnswer(
        [
          `Calculate B: ${m('B = ' + n(st.k) + 'A = ' + n(st.k) + '(' + vec(st.x, st.y) + ') = ' + vec(st.k * st.x, st.k * st.y))}`
        ],
        `When k = ${m(n(st.k))}, B is <strong>${RELATION_TEXT[relation(st.k)]}</strong>`
      )
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
      solution: st => solutionWithFinalAnswer(
        [
          `Calculate magnitude of original vector: ${m('|v| = √(' + st.x + '² + ' + st.y + '²) = √' + (st.x * st.x + st.y * st.y))}`,
          `Calculate magnitude: ${m('|v| ≈ ' + Math.hypot(st.x, st.y).toFixed(4))}`,
          `Set up equation: ${m('|k| × ' + Math.hypot(st.x, st.y).toFixed(4) + ' = ' + st.t)}``,
          `Solve for k: ${m('k = ' + st.t + ' ÷ ' + Math.hypot(st.x, st.y).toFixed(4))}`
        ],
        `k = <strong>${(st.t / Math.hypot(st.x, st.y)).toFixed(4)}</strong>`
      )
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
      solution: st => solutionWithFinalAnswer(
        [
          `Add A and B: ${m('A + B = ' + vec(st.ax + st.bx, st.ay + st.by))}`,
          `For zero sum, C must be opposite: ${m('C = −(A + B) = ' + vec(-(st.ax + st.bx), -(st.ay + st.by)))}`,
          `Calculate magnitude: ${m('|C| = √' + ((st.ax + st.bx) ** 2 + (st.ay + st.by) ** 2))}`,
          `Magnitude ≈ ${m(Math.hypot(st.ax + st.bx, st.ay + st.by).toFixed(2))}`
        ],
        `C = <strong>${m(vec(-(st.ax + st.bx), -(st.ay + st.by)))}</strong> | Magnitude: <strong>${Math.hypot(st.ax + st.bx, st.ay + st.by).toFixed(2)}</strong>`
      )
    },
    {
      title: 'Comparing Magnitudes of Scaled Vectors',
      controls: [slider('x', 'i-component of v', 1, 6, 1, 2), slider('y', 'j-component of v', 1, 6, 1, 3), slider('k1', 'Scalar k₁', 0.5, 3, 0.5, 1.5), slider('k2', 'Scalar k₂', 0.5, 3, 0.5, 2.5)],
      prompt: st => `Given ${m('v = ' + vec(st.x, st.y))}. Find ${m('|' + n(st.k1) + 'v|')} and ${m('|' + n(st.k2) + 'v|')} (2 d.p.), and the ratio between them.`,
      visual: st => buildDiagramSVG([v(0, 0, st.x, st.y, 'blue', 'v'), v(0, 0, st.k1 * st.x, st.k1 * st.y, 'red', `${n(st.k1)}v`), v(0, 0, st.k2 * st.x, st.k2 * st.y, 'green', `${n(st.k2)}v`)]),
      readout: st => eq(`${m('|kv| = |k| × |v|')}`, `${m('|v| = √' + (st.x * st.x + st.y * st.y) + ' ≈ ' + Math.hypot(st.x, st.y).toFixed(4))}`),
      fields: st => [box('mag1', `Magnitude |${n(st.k1)}v| (2 d.p.)`, 2), box('mag2', `Magnitude |${n(st.k2)}v| (2 d.p.)`, 2), box('ratio', `Ratio |${n(st.k2)}v| : |${n(st.k1)}v| (2 d.p.)`, 2)],
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
      visual: st => buildDiagramSVG([v(0, 0, st.x, st.y, 'green', 'OP', false, true)]),
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
      visual: st => buildDiagramSVG([v(0, 0, st.x, 0, 'blue', `${st.x}i`), v(st.x, 0, 0, st.y, 'red', `${st.y}j`), v(0, 0, st.x, st.y, 'green', 'v', false, true)]),
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
      visual: st => buildDiagramSVG([v(0, 0, st.px, st.py, 'blue', 'OP', true), v(0, 0, st.qx, st.qy, 'red', 'OQ', true), v(st.px, st.py, st.qx - st.px, st.qy - st.py, 'green', 'PQ', false, true)]),
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
      visual: st => buildDiagramSVG([v(0, 0, st.x, 0, 'blue', `${st.x}i`), v(st.x, 0, 0, st.y, 'red', `${st.y}j`), v(0, 0, st.x, st.y, 'green', 'v', false, true)]),
      readout: st => eq(`${m('θ = atan2(y, x)')}`, `x = ${st.x}, y = ${st.y}`, 'Always check which quadrant the vector is in!'),
      fields: () => [box('mag', 'Magnitude (2 d.p.)', 2), box('ang', 'Angle (°, 2 d.p.)', 2)],
      answers: st => ({ mag: Math.hypot(st.x, st.y), ang: degrees(st.y, st.x) }),
      hint: () => 'Calculator gives tan⁻¹ in range −90° to 90°. Add 180° for Q2 and Q3, or 360° for negative angles in Q4.',
      solution: st => steps(`${m('|v| = √' + (st.x * st.x + st.y * st.y) + ' ≈ ' + Math.hypot(st.x, st.y).toFixed(2))}`, `${m('θ = atan2(' + neg(st.y) + ', ' + neg(st.x) + ') ≈ ' + degrees(st.y, st.x).toFixed(2))}°`)
    },
    {
      title: 'Unit Vector in the Same Direction',
      invalid: st => (Math.hypot(st.x, st.y) ? '' : 'r is the zero vector, so no unit vector is defined. Move the slider to continue.'),
      controls: [slider('x', 'i-component', -12, 12, 1, 10), slider('y', 'j-component', -12, 12, 1, -1)],
      prompt: st => `Given ${m('r = ' + vec(st.x, st.y))}. Find the unit vector ${m('u')} in the direction of r, to 4 decimal places.`,
      visual: st => (Math.hypot(st.x, st.y) ? buildDiagramSVG([v(0, 0, st.x, st.y, 'green', 'r'), v(0, 0, st.x / Math.hypot(st.x, st.y), st.y / Math.hypot(st.x, st.y), 'blue', 'u')]) : '<p>The zero vector has no direction, so its unit vector is not defined.</p>'),
      readout: st => (Math.hypot(st.x, st.y) ? eq(`${m('u = r/|r|')}`, `${m('|r| = √' + (st.x * st.x + st.y * st.y) + ' ≈ ' + Math.hypot(st.x, st.y).toFixed(4))}`) : `${m('r = zero')}: division by zero magnitude is not defined. Move the slider.`),
      fields: () => [box('ui', 'i-component of u (4 d.p.)', 4), box('uj', 'j-component of u (4 d.p.)', 4)],
      answers: st => {
        const mag = Math.hypot(st.x, st.y) || 1;
        return { ui: st.x / mag, uj: st.y / mag };
      },
      hint: () => 'Find the magnitude first, then divide <strong>each</strong> component by that magnitude. Check by verifying that |u| = 1.',
      solution: st => {
        const mag = Math.hypot(st.x, st.y);
        if (!mag) return 'The zero vector has no unit vector.';
        return steps(`${m('|r| = √' + (st.x * st.x + st.y * st.y) + ' ≈ ' + mag.toFixed(4))}`, `${m('u = (' + vec(st.x, st.y) + ')/|r| ≈ ' + vec(Number((st.x / mag).toFixed(4)), Number((st.y / mag).toFixed(4))))}`, `Check: ${m('|u| = 1')}`);
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
      title: 'Adding Two Vectors Component by Component',
      controls: [slider('ax', 'i of A', -6, 6, 1, 3), slider('ay', 'j of A', -6, 6, 1, 4), slider('bx', 'i of B', -6, 6, 1, 2), slider('by', 'j of B', -6, 6, 1, -1)],
      prompt: st => `Find ${m('A + B')} when ${m('A = ' + vec(st.ax, st.ay))} and ${m('B = ' + vec(st.bx, st.by))}.`,
      visual: st => buildDiagramSVG([v(0, 0, st.ax, st.ay, 'blue', 'A'), v(st.ax, st.ay, st.bx, st.by, 'red', 'B'), v(0, 0, st.ax + st.bx, st.ay + st.by, 'green', 'A + B', false, true)]),
      readout: () => eq('Triangle Law: place the tail of B at the head of A; the resultant closes the triangle.', `${m('A + B = (A_x + B_x)i + (A_y + B_y)j')}`),
      fields: () => [box('i', 'i-component'), box('j', 'j-component')],
      answers: st => ({ i: st.ax + st.bx, j: st.ay + st.by }),
      hint: () => 'Add i-components together, then j-components together. DO NOT MIX THEM!',
      solution: st => `${m('A + B = (' + st.ax + ' + ' + neg(st.bx) + ')i + (' + st.ay + ' + ' + neg(st.by) + ')j = ' + vec(st.ax + st.bx, st.ay + st.by))}`
    },
    {
      title: 'Subtracting Vectors: A − B = A + (−B)',
      controls: [slider('ax', 'i of A', -6, 6, 1, 4), slider('ay', 'j of A', -6, 6, 1, -2), slider('bx', 'i of B', -6, 6, 1, 1), slider('by', 'j of B', -6, 6, 1, 3)],
      prompt: st => `Find ${m('A − B')} when ${m('A = ' + vec(st.ax, st.ay))} and ${m('B = ' + vec(st.bx, st.by))}.`,
      visual: st => buildDiagramSVG([v(0, 0, st.ax, st.ay, 'blue', 'A'), v(st.ax, st.ay, -st.bx, -st.by, 'red', '−B'), v(0, 0, st.ax - st.bx, st.ay - st.by, 'green', 'A − B', false, true)]),
      readout: st => eq(`${m('A − B = A + (−B)')}`, `${m('−B = ' + vec(-st.bx, -st.by))}`),
      fields: () => [box('i', 'i-component'), box('j', 'j-component')],
      answers: st => ({ i: st.ax - st.bx, j: st.ay - st.by }),
      hint: () => 'Rewrite subtraction as adding negative B so the signs of each component are clear.',
      solution: st => `${m('A − B = (' + st.ax + ' − ' + neg(st.bx) + ')i + (' + st.ay + ' − ' + neg(st.by) + ')j = ' + vec(st.ax - st.bx, st.ay - st.by))}`
    },
    {
      title: 'Linear Combination pA + qB',
      controls: [slider('p', 'Coefficient p', -3, 3, 1, 2), slider('q', 'Coefficient q', -3, 3, 1, 1)],
      prompt: st => `Given ${m('a = 2i + 5j')} and ${m('b = i − 4j')}. Find ${m(combo(st.p, st.q))}.`,
      visual: st => buildDiagramSVG(drawable([v(0, 0, 2 * st.p, 5 * st.p, 'blue', term(st.p, 'a')), v(2 * st.p, 5 * st.p, st.q, -4 * st.q, 'red', term(st.q, 'b')), v(0, 0, 2 * st.p + st.q, 5 * st.p - 4 * st.q, 'green', 'result')])),
      readout: st => eq(`${m(term(st.p, 'a') + ' = ' + vec(2 * st.p, 5 * st.p))}`, `${m(term(st.q, 'b') + ' = ' + vec(st.q, -4 * st.q))}`),
      fields: () => [box('i', 'i-component'), box('j', 'j-component')],
      answers: st => ({ i: 2 * st.p + st.q, j: 5 * st.p - 4 * st.q }),
      hint: () => 'Perform each scalar multiplication first, then add the two results component by component.',
      solution: st => steps(`${m(term(st.p, 'a') + ' = ' + vec(2 * st.p, 5 * st.p))}`, `${m(term(st.q, 'b') + ' = ' + vec(st.q, -4 * st.q))}`, `Sum: ${m(vec(2 * st.p + st.q, 5 * st.p - 4 * st.q))}`)
    },
    {
      title: 'Magnitude and Direction of the Resultant Vector',
      controls: [slider('ax', 'i of A', -7, 7, 1, 3), slider('ay', 'j of A', -7, 7, 1, 2), slider('bx', 'i of B', -7, 7, 1, 2), slider('by', 'j of B', -7, 7, 1, 1)],
      prompt: st => `Given ${m('A = ' + vec(st.ax, st.ay))} and ${m('B = ' + vec(st.bx, st.by))}, find the magnitude ${m('|A + B|')} (2 d.p.) and its direction from the positive x-axis in degrees (2 d.p.).`,
      visual: st => buildDiagramSVG([v(0, 0, st.ax, st.ay, 'blue', 'A'), v(st.ax, st.ay, st.bx, st.by, 'red', 'B'), v(0, 0, st.ax + st.bx, st.ay + st.by, 'green', 'R', false, true)]),
      readout: st => eq(`${m('R = ' + vec(st.ax + st.bx, st.ay + st.by))}`, `${m('|R| = √(R_x² + R_y²)')}`, `${m('θ = atan2(R_y, R_x)')}`),
      fields: () => [box('mag', 'Magnitude |A + B| (2 d.p.)', 2), box('ang', 'Angle (°, 2 d.p.)', 2)],
      answers: st => ({ mag: Math.hypot(st.ax + st.bx, st.ay + st.by), ang: degrees(st.ay + st.by, st.ax + st.bx) }),
      hint: () => 'Add components first. Do NOT add |A| and |B| directly unless both vectors point in the same direction.',
      solution: st => steps(`${m('R = ' + vec(st.ax + st.bx, st.ay + st.by))}`, `${m('|R| = √' + ((st.ax + st.bx) ** 2 + (st.ay + st.by) ** 2) + ' ≈ ' + Math.hypot(st.ax + st.bx, st.ay + st.by).toFixed(2))}`, `${m('θ ≈ ' + degrees(st.ay + st.by, st.ax + st.bx).toFixed(2))}°`)
    },
    {
      title: 'Solving Vector Equations: A + X = B',
      controls: [slider('ax', 'i of A', -7, 7, 1, 2), slider('ay', 'j of A', -7, 7, 1, -3), slider('bx', 'i of B', -7, 7, 1, 5), slider('by', 'j of B', -7, 7, 1, 1)],
      prompt: st => `Given ${m('A = ' + vec(st.ax, st.ay))} and ${m('B = ' + vec(st.bx, st.by))}. Find X so that ${m('A + X = B')}, and state the magnitude ${m('|X|')} (2 d.p.).`,
      visual: st => buildDiagramSVG([v(0, 0, st.ax, st.ay, 'blue', 'A'), v(0, 0, st.bx, st.by, 'red', 'B'), v(st.ax, st.ay, st.bx - st.ax, st.by - st.ay, 'green', 'X')]),
      readout: () => eq(`${m('X = B − A')}`, 'On the diagram, X connects the tip of A to the tip of B.'),
      fields: () => [box('i', 'i-component of X'), box('j', 'j-component of X'), box('mag', 'Magnitude |X| (2 d.p.)', 2)],
      answers: st => ({ i: st.bx - st.ax, j: st.by - st.ay, mag: Math.hypot(st.bx - st.ax, st.by - st.ay) }),
      hint: () => 'Isolate X by subtracting A from both sides of the equation, then work component by component.',
      solution: st => steps(`${m('X = B − A = ' + vec(st.bx - st.ax, st.by - st.ay))}`, `${m('|X| = √' + ((st.bx - st.ax) ** 2 + (st.by - st.ay) ** 2) + ' ≈ ' + Math.hypot(st.bx - st.ax, st.by - st.ay).toFixed(2))}`)
    },
    {
      title: 'Vector Routes in Quadrilateral ABCD',
      controls: [chooser('target', 'Target vector', [['DB', 'DB'], ['AC', 'AC'], ['CD', 'CD']], 'DB'), slider('p', 'Coefficient p in AB = p y', 2, 6, 1, 4), slider('q', 'Coefficient q in AD = q x', 3, 8, 1, 5), slider('r', 'Coefficient r in BC = r x', 1, 5, 1, 2)],
      prompt: st => `In quadrilateral ABCD, ${m('AB = ' + st.p + 'y')}, ${m('AD = ' + st.q + 'x')} and ${m('BC = ' + st.r + 'x')}. Express ${m(st.target)} in terms of x and y, including both coefficients.`,
      visual: st => VectorExtensions.polygon(st.p, st.q, st.r),
      readout: st => eq(`Route: ${{ DB: 'D → A → B', AC: 'A → B → C', CD: 'C → B → A → D' }[st.target]}`, 'Reversing the direction of a side reverses its sign.'),
      fields: () => [box('x', 'Coefficient of x'), box('y', 'Coefficient of y')],
      answers: st => {
        const [x, y] = VectorExtensions.routeResult(st.p, st.q, st.r, st.target);
        return { x, y };
      },
      hint: () => 'Write the route as a sum of labeled sides. Each time you move against the given arrow, flip the sign.',
      solution: st => m(VectorExtensions.routeWork(st.p, st.q, st.r, st.target))
    },
    {
      title: 'Vector Equality: Recognizing Equal Vectors',
      controls: [slider('x1', 'i-component of A', -5, 5, 1, 2), slider('y1', 'j-component of A', -5, 5, 1, 3), slider('x2', 'i-component of B', -5, 5, 1, 2), slider('y2', 'j-component of B', -5, 5, 1, 3)],
      prompt: st => `Given ${m('A = ' + vec(st.x1, st.y1))} and ${m('B = ' + vec(st.x2, st.y2))}. Is A equal to B? If not, find ${m('A − B')}.`,
      visual: st => buildDiagramSVG([v(0, 0, st.x1, st.y1, 'blue', 'A'), v(0, 0, st.x2, st.y2, 'red', 'B'), (st.x1 !== st.x2 || st.y1 !== st.y2) && v(0, 0, st.x1 - st.x2, st.y1 - st.y2, 'green', 'A − B')].filter(Boolean)),
      readout: st => st.x1 === st.x2 && st.y1 === st.y2 ? `${m('A = B')}: vectors are equal because both components are the same.` : eq(`${m('A ≠ B')}`, `${m('A − B = ' + vec(st.x1 - st.x2, st.y1 - st.y2))}`),
      fields: () => [pick('equal', 'Is A = B?', [['yes', 'Yes, A equals B'], ['no', 'No, A differs from B']]), box('i', 'If different, i-component of A − B'), box('j', 'If different, j-component of A − B')],
      answers: st => {
        const equal = st.x1 === st.x2 && st.y1 === st.y2 ? 'yes' : 'no';
        return { equal, i: st.x1 - st.x2, j: st.y1 - st.y2 };
      },
      hint: () => 'Two vectors are equal if and only if all their components are equal. If not, subtract component by component.',
      solution: st => {
        if (st.x1 === st.x2 && st.y1 === st.y2) {
          return `${m('A = B')}: Both vectors have i-component = ${st.x1} and j-component = ${st.y1}.`;
        }
        return steps(`Compare components:`, `i-component: ${st.x1} ${st.x1 === st.x2 ? '=' : '≠'} ${st.x2}`, `j-component: ${st.y1} ${st.y1 === st.y2 ? '=' : '≠'} ${st.y2}`, `Therefore, ${m('A ≠ B')}`, `${m('A − B = ' + vec(st.x1 - st.x2, st.y1 - st.y2))}`);
      }
    },
    {
      title: 'Equilibrium: Finding the Third Vector in a Closed Triangle',
      controls: [slider('ax', 'i-component of A', -6, 6, 1, 2), slider('ay', 'j-component of A', -6, 6, 1, 3), slider('bx', 'i-component of B', -6, 6, 1, 1), slider('by', 'j-component of B', -6, 6, 1, -2), slider('cx', 'i-component of C (adjustable)', -6, 6, 1, -3)],
      prompt: st => `In a closed triangle, ${m('A + B + C = zero')}. Given ${m('A = ' + vec(st.ax, st.ay))} and ${m('B = ' + vec(st.bx, st.by))}. Find C so that the sum of all three equals zero. The i-component sum must equal ${st.ax + st.bx + st.cx}}.`,
      visual: st => buildDiagramSVG([v(0, 0, st.ax, st.ay, 'blue', 'A'), v(st.ax, st.ay, st.bx, st.by, 'red', 'B'), v(st.ax + st.bx, st.ay + st.by, -st.ax - st.bx, -st.ay - st.by, 'green', 'C')]),
      readout: st => {
        const cy = -(st.ay + st.by);
        const sumI = st.ax + st.bx + st.cx;
        const sumJ = st.ay + st.by + cy;
        return eq(`For equilibrium: ${m('A + B + C = zero')}`, `Sum of i: ${st.ax} + ${st.bx} + ${st.cx} = ${sumI}`, `Sum of j: ${st.ay} + ${st.by} + ${cy} = ${sumJ}`);
      },
      fields: () => [box('cy', 'j-component of C (for equilibrium)'), box('i_sum', 'Sum of all i-components (must be 0)'), box('j_sum', 'Sum of all j-components (must be 0)')],
      answers: st => ({
        cy: -(st.ay + st.by),
        i_sum: 0,
        j_sum: 0
      }),
      hint: () => 'For equilibrium (sum of vectors = zero), the sum of all i-components must be 0 and the sum of all j-components must be 0. Notice that C = −(A + B).',
      solution: st => steps(`${m('A + B = ' + vec(st.ax + st.bx, st.ay + st.by))}`, `For sum = zero: ${m('C = −(A + B) = ' + vec(-(st.ax + st.bx), -(st.ay + st.by)))}`, `Check: ${m(vec(st.ax, st.ay) + ' + ' + vec(st.bx, st.by) + ' + ' + vec(-(st.ax + st.bx), -(st.ay + st.by)) + ' = zero')}`)
    }
  ];

  /* ---------- Area 5: Practice — exam-style column vector drills ---------- */
  const practiceExamples = [
    {
      title: 'Reading Column Vector Notation',
      controls: [slider('x', 'Top row', -8, 8, 1, 3), slider('y', 'Bottom row', -8, 8, 1, -4)],
      prompt: st => `Given ${m('a')} = ${col(st.x, st.y)}. Write a in the form ${m('xi + yj')}.`,
      visual: st => buildDiagramSVG([v(0, 0, st.x, st.y, 'green', 'a', false, true)]),
      readout: () => 'The top row of a column vector is the i-component; the bottom row is the j-component.',
      fields: () => [box('i', 'i-component'), box('j', 'j-component')],
      answers: st => ({ i: st.x, j: st.y }),
      hint: () => 'No calculation needed; simply convert from column vector form to i, j form.',
      solution: st => `${m('a = ' + vec(st.x, st.y))}`
    },
    {
      title: 'Scalar Multiplication in Column Form',
      controls: [slider('k', 'Multiplier k', -4, 5, 1, 4), slider('x', 'Top row of a', -6, 6, 1, 3), slider('y', 'Bottom row of a', -6, 6, 1, 1)],
      prompt: st => `Given ${m('a')} = ${col(st.x, st.y)}. Find ${m('' + st.k + 'a')}.`,
      visual: st => buildDiagramSVG([v(0, 0, st.x, st.y, 'blue', 'a'), v(0, 0, st.k * st.x, st.k * st.y, 'green', `${st.k}a`, false, true)]),
      readout: st => eq(`${m('' + st.k + 'a')} means multiply each row by ${st.k}.`),
      fields: () => [box('i', 'i-component'), box('j', 'j-component')],
      answers: st => ({ i: st.k * st.x, j: st.k * st.y }),
      hint: () => 'Multiply both rows, not just the first one.',
      solution: st => `${m('' + st.k + 'a = ' + vec(st.k * st.x, st.k * st.y))}`
    },
    {
      title: 'Result ka − b in Component Form',
      controls: [slider('k', 'Multiplier k', -3, 5, 1, 4), slider('bx', 'Top row of b', -6, 6, 1, 2), slider('by', 'Bottom row of b', -6, 6, 1, 5)],
      prompt: st => `Given ${m('a')} = ${col(3, 1)} and ${m('b')} = ${col(st.bx, st.by)}. Find ${m('r = ' + st.k + 'a − b')} in the form ${m('xi + yj')}.`,
      visual: st => buildDiagramSVG([v(0, 0, 3 * st.k, st.k, 'blue', `${st.k}a`), v(3 * st.k, st.k, -st.bx, -st.by, 'red', '−b'), v(0, 0, 3 * st.k - st.bx, st.k - st.by, 'green', 'r', false, true)]),
      readout: st => eq(`${m('' + st.k + 'a = ' + vec(3 * st.k, st.k))}`, `${m('b = ' + vec(st.bx, st.by))}`),
      fields: () => [box('i', 'i-component'), box('j', 'j-component')],
      answers: st => ({ i: 3 * st.k - st.bx, j: st.k - st.by }),
      hint: () => 'Multiply by k first, then subtract b. Do NOT subtract before multiplying.',
      solution: st => `${m('r = ' + vec(3 * st.k, st.k) + ' − (' + vec(st.bx, st.by) + ') = ' + vec(3 * st.k - st.bx, st.k - st.by))}`
    },
    {
      title: 'Magnitude of ka − b',
      controls: [slider('k', 'Multiplier k', -3, 5, 1, 4), slider('bx', 'Top row of b', -6, 6, 1, 2), slider('by', 'Bottom row of b', -6, 6, 1, 5)],
      prompt: st => `Given ${m('a')} = ${col(3, 1)} and ${m('b')} = ${col(st.bx, st.by)}, find ${m('|' + st.k + 'a − b|')} to 4 decimal places.`,
      visual: st => buildDiagramSVG([v(0, 0, 3 * st.k, st.k, 'blue', `${st.k}a`), v(3 * st.k, st.k, -st.bx, -st.by, 'red', '−b'), v(0, 0, 3 * st.k - st.bx, st.k - st.by, 'green', 'r', false, true)]),
      readout: st => eq(`${m('r = ' + vec(3 * st.k - st.bx, st.k - st.by))}`, `${m('|r| = √(r_x² + r_y²)')}`),
      fields: () => [box('mag', 'Magnitude (4 d.p.)', 4)],
      answers: st => ({ mag: Math.hypot(3 * st.k - st.bx, st.k - st.by) }),
      hint: () => 'Get the resultant vector first, then use the magnitude formula on its components.',
      solution: st => `${m('|r| = √(' + neg(3 * st.k - st.bx) + '² + ' + neg(st.k - st.by) + '²) = √' + ((3 * st.k - st.bx) ** 2 + (st.k - st.by) ** 2) + ' ≈ ' + Math.hypot(3 * st.k - st.bx, st.k - st.by).toFixed(4))}`
    },
    {
      title: 'Unit Vector in Direction of ka − b',
      invalid: st => (Math.hypot(3 * st.k - st.bx, st.k - st.by) ? '' : 'The result ka − b is the zero vector, so no unit vector is defined. Adjust settings to continue.'),
      controls: [slider('k', 'Multiplier k', -3, 5, 1, 4), slider('bx', 'Top row of b', -6, 6, 1, 2), slider('by', 'Bottom row of b', -6, 6, 1, 5)],
      prompt: st => `Given ${m('a')} = ${col(3, 1)} and ${m('b')} = ${col(st.bx, st.by)}, find the unit vector in the direction of ${m('' + st.k + 'a − b')} to 4 decimal places.`,
      visual: st => VectorExtensions.unitCircle(3 * st.k - st.bx, st.k - st.by),
      readout: st => {
        const x = 3 * st.k - st.bx;
        const y = st.k - st.by;
        const mag = Math.hypot(x, y);
        return mag ? eq(`${m('r = ' + vec(x, y))}`, `${m('|r| = √' + (x * x + y * y) + ' ≈ ' + mag.toFixed(4))}`, `${m('u = r/|r|')}`) : `${m('r = zero')}: unit vector is undefined for these settings.`;
      },
      fields: () => [box('ui', 'i-component of u (4 d.p.)', 4), box('uj', 'j-component of u (4 d.p.)', 4)],
      answers: st => {
        const x = 3 * st.k - st.bx;
        const y = st.k - st.by;
        const mag = Math.hypot(x, y) || 1;
        return { ui: x / mag, uj: y / mag };
      },
      hint: () => 'Order of steps: multiply, subtract, find magnitude, divide. Do NOT divide by magnitude before finding the resultant vector.',
      solution: st => {
        const x = 3 * st.k - st.bx;
        const y = st.k - st.by;
        const mag = Math.hypot(x, y);
        if (!mag) return 'The resultant vector is zero, so no unit vector exists.';
        return steps(`${m('r = ' + vec(x, y))}`, `${m('|r| = √' + (x * x + y * y) + ' ≈ ' + mag.toFixed(4))}`, `${m('u ≈ ' + vec(Number((x / mag).toFixed(4)), Number((y / mag).toFixed(4))))}`);
      }
    },
    {
      title: 'Finding k That Eliminates the i-Component',
      controls: [slider('ax', 'Top row of a', 1, 6, 1, 3), slider('bx', 'Top row of b', 1, 9, 1, 2), slider('by', 'Bottom row of b', -6, 6, 1, 5)],
      prompt: st => `Given ${m('a')} = ${col(st.ax, 1)} and ${m('b')} = ${col(st.bx, st.by)}. Find the value of k so that the i-component of ${m('ka − b')} equals zero, and find the resulting j-component. Answer to 4 decimal places.`,
      visual: st => buildDiagramSVG([v(0, 0, st.bx, st.bx / st.ax, 'blue', 'ka'), v(st.bx, st.bx / st.ax, -st.bx, -st.by, 'red', '−b'), v(0, 0, 0, st.bx / st.ax - st.by, 'green', 'r', false, true)]),
      readout: st => eq(`i-component: ${m('k × ' + st.ax + ' − ' + neg(st.bx) + ' = 0')}`, 'Solve for k, then substitute back to find the j-component.'),
      fields: () => [box('k', 'Value of k (4 d.p.)', 4), box('j', 'Resulting j-component (4 d.p.)', 4)],
      answers: st => ({ k: st.bx / st.ax, j: st.bx / st.ax - st.by }),
      hint: () => 'Set the i-component to zero: k·aₓ − bₓ = 0, so k = bₓ/aₓ. Use this same k value for the j-component.',
      solution: st => steps(`${m('k = ' + st.bx + '/' + st.ax + ' ≈ ' + (st.bx / st.ax).toFixed(4))}`, `j-component: ${m('k × 1 − ' + neg(st.by) + ' ≈ ' + (st.bx / st.ax - st.by).toFixed(4))}`, `${m('r ≈ ' + vec(0, Number((st.bx / st.ax - st.by).toFixed(4))))}`)
    },
    {
      title: 'System Solution: Two Vectors, Two Parameters',
      controls: [slider('kx', 'i-component of result', -6, 6, 1, 5), slider('ky', 'j-component of result', -6, 6, 1, 2)],
      prompt: st => `Given ${m('a')} = ${col(2, 1)} and ${m('b')} = ${col(1, -2)}. Find p and q so that ${m('pa + qb = ' + vec(st.kx, st.ky))}. Answer to 2 decimal places.`,
      visual: st => {
        const p = (2 * st.ky + st.kx) / 5;
        const q = (2 * st.kx - st.ky) / 5;
        return buildDiagramSVG(drawable([v(0, 0, 2 * p, p, 'blue', 'pa'), v(2 * p, p, q, -2 * q, 'red', 'qb'), v(0, 0, 2 * p + q, p - 2 * q, 'green', 'result', false, true)]));
      },
      readout: st => eq(`Equations: ${m('2p + q = ' + st.kx)}`, `${m('p − 2q = ' + st.ky)}`),
      fields: () => [box('p', 'Value of p (2 d.p.)', 2), box('q', 'Value of q (2 d.p.)', 2)],
      answers: st => {
        const p = (2 * st.ky + st.kx) / 5;
        const q = (2 * st.kx - st.ky) / 5;
        return { p, q };
      },
      hint: () => 'Write two component equations: one for i-component, one for j-component. Solve the system using substitution or elimination.',
      solution: st => {
        const p = (2 * st.ky + st.kx) / 5;
        const q = (2 * st.kx - st.ky) / 5;
        return steps(`System: ${m('2p + q = ' + st.kx + ', p − 2q = ' + st.ky)}`, `From the second equation: ${m('p = ' + st.ky + ' + 2q')}`, `Substitute into the first: ${m('2(' + st.ky + ' + 2q) + q = ' + st.kx)}`, `${m('5q = ' + (2 * st.kx - st.ky).toFixed(2))}`, `${m('p ≈ ' + p.toFixed(2) + ', q ≈ ' + q.toFixed(2))}`);
      }
    },
    {
      title: 'Magnitude of Vector Combination With Negative Coefficients',
      controls: [slider('p', 'Coefficient p', -4, -1, 1, -2), slider('q', 'Coefficient q', 1, 5, 1, 3)],
      prompt: st => `Given ${m('a')} = ${col(3, 2)} and ${m('b')} = ${col(-1, 4)}. Find ${m('|' + st.p + 'a + ' + st.q + 'b|')} to 4 decimal places.`,
      visual: st => buildDiagramSVG(drawable([v(0, 0, 3 * st.p, 2 * st.p, 'blue', `${st.p}a`), v(3 * st.p, 2 * st.p, -st.q, 4 * st.q, 'red', `${st.q}b`), v(0, 0, 3 * st.p - st.q, 2 * st.p + 4 * st.q, 'green', 'result')])),
      readout: st => eq(`${m(st.p + 'a = ' + vec(3 * st.p, 2 * st.p))}`, `${m(st.q + 'b = ' + vec(-st.q, 4 * st.q))}`, `${m('Result = ' + vec(3 * st.p - st.q, 2 * st.p + 4 * st.q))}`),
      fields: () => [box('mag', 'Magnitude (4 d.p.)', 4)],
      answers: st => ({ mag: Math.hypot(3 * st.p - st.q, 2 * st.p + 4 * st.q) }),
      hint: () => 'Perform scalar multiplication on both vectors, add the components together, then use the magnitude formula √(x² + y²).',
      solution: st => {
        const x = 3 * st.p - st.q;
        const y = 2 * st.p + 4 * st.q;
        return steps(`${m(st.p + 'a = ' + vec(3 * st.p, 2 * st.p))}`, `${m(st.q + 'b = ' + vec(-st.q, 4 * st.q))}`, `${m('Result = ' + vec(x, y))}`, `${m('|Result| = √(' + neg(x) + '² + ' + neg(y) + '²) = √' + (x * x + y * y) + ' ≈ ' + Math.hypot(x, y).toFixed(4))}`);
      }
    }
  ];

  /* ---------- Area 6: Resources — applying each reference formula ---------- */
  const resourceExamples = [
    {
      title: 'Vector Between Two Points Formula',
      controls: [slider('px', 'x of P', -8, 8, 1, 1), slider('py', 'y of P', -8, 8, 1, 2), slider('qx', 'x of Q', -8, 8, 1, 4), slider('qy', 'y of Q', -8, 8, 1, 6)],
      prompt: st => `Use the formula ${m('PQ = (x₂ − x₁)i + (y₂ − y₁)j')} for P(${st.px}, ${st.py}) and Q(${st.qx}, ${st.qy}).`,
      visual: st => buildDiagramSVG([v(st.px, st.py, st.qx - st.px, st.qy - st.py, 'green', 'PQ')]),
      readout: () => 'Subtract the first point from the second point, following the order of letters in the vector name.',
      fields: () => [box('i', 'i-component'), box('j', 'j-component')],
      answers: st => ({ i: st.qx - st.px, j: st.qy - st.py }),
      hint: () => 'PQ starts at P. If you subtract in reverse order, you get QP instead.',
      solution: st => `${m('PQ = ' + vec(st.qx - st.px, st.qy - st.py))}`
    },
    {
      title: 'Distance Formula Between Two Points',
      controls: [slider('px', 'x of P', -8, 8, 1, 1), slider('py', 'y of P', -8, 8, 1, 2), slider('qx', 'x of Q', -8, 8, 1, 4), slider('qy', 'y of Q', -8, 8, 1, 6)],
      prompt: st => `Find ${m('|PQ|')} for P(${st.px}, ${st.py}) and Q(${st.qx}, ${st.qy}), correct to 2 decimal places.`,
      visual: st => buildDiagramSVG([v(st.px, st.py, st.qx - st.px, 0, 'blue', 'Δx'), v(st.qx, st.py, 0, st.qy - st.py, 'red', 'Δy'), v(st.px, st.py, st.qx - st.px, st.qy - st.py, 'green', 'PQ')]),
      readout: st => eq(`${m('PQ = ' + vec(st.qx - st.px, st.qy - st.py))}`, `${m('|PQ| = √(Δx² + Δy²)')}`),
      fields: () => [box('mag', 'Distance (2 d.p.)', 2)],
      answers: st => ({ mag: Math.hypot(st.qx - st.px, st.qy - st.py) }),
      hint: () => 'Find the components of PQ first, then use the magnitude formula on those components.',
      solution: st => `${m('|PQ| = √' + ((st.qx - st.px) ** 2 + (st.qy - st.py) ** 2) + ' ≈ ' + Math.hypot(st.qx - st.px, st.qy - st.py).toFixed(2))}`
    },
    {
      title: 'Midpoint Position Vector',
      controls: [slider('px', 'x of P', -8, 8, 1, -3), slider('py', 'y of P', -8, 8, 1, 2), slider('qx', 'x of Q', -8, 8, 1, 5), slider('qy', 'y of Q', -8, 8, 1, 6)],
      prompt: st => `Find the position vector of the midpoint M of PQ where P(${st.px}, ${st.py}) and Q(${st.qx}, ${st.qy}). Answer to 2 decimal places.`,
      visual: st => buildDiagramSVG([v(0, 0, st.px, st.py, 'blue', 'OP', true), v(0, 0, st.qx, st.qy, 'red', 'OQ', true), v(0, 0, (st.px + st.qx) / 2, (st.py + st.qy) / 2, 'green', 'OM')]),
      readout: () => eq(`${m('OM = ½(OP + OQ)')}`, 'Average each pair of coordinates.'),
      fields: () => [box('i', 'i-component (2 d.p.)', 2), box('j', 'j-component (2 d.p.)', 2)],
      answers: st => ({ i: (st.px + st.qx) / 2, j: (st.py + st.qy) / 2 }),
      hint: () => 'Add the two position vectors, then multiply by one-half. This is scalar multiplication with k = ½.',
      solution: st => steps(`${m('OP + OQ = ' + vec(st.px + st.qx, st.py + st.qy))}`, `${m('OM = ½(' + vec(st.px + st.qx, st.py + st.qy) + ') = ' + vec((st.px + st.qx) / 2, (st.py + st.qy) / 2))}`)
    },
    {
      title: 'Negative Scalar Multiplication Formula',
      controls: [slider('k', 'Multiplier k', 1, 5, 1, 2), slider('x', 'i-component of v', -6, 6, 1, 2), slider('y', 'j-component of v', -6, 6, 1, -3)],
      prompt: st => `Use the formula ${m('kv = kx i + ky j')} to find ${m('−' + st.k + 'v')} when ${m('v = ' + vec(st.x, st.y))}, and its magnitude (2 d.p.).`,
      visual: st => buildDiagramSVG([v(0, 0, st.x, st.y, 'blue', 'v'), v(0, 0, -st.k * st.x, -st.k * st.y, 'green', `−${st.k}v`)]),
      readout: st => eq(`${m('|kv| = |k| × |v|')}`, `${m('|v| = √' + (st.x * st.x + st.y * st.y) + ' ≈ ' + Math.hypot(st.x, st.y).toFixed(4))}`),
      fields: () => [box('i', 'i-component'), box('j', 'j-component'), box('mag', 'Magnitude (2 d.p.)', 2)],
      answers: st => ({ i: -st.k * st.x, j: -st.k * st.y, mag: st.k * Math.hypot(st.x, st.y) }),
      hint: () => 'A negative multiplier reverses the direction, but magnitude always uses |k|, which is always positive.',
      solution: st => steps(`${m('−' + st.k + 'v = ' + vec(-st.k * st.x, -st.k * st.y))}`, `${m('|−' + st.k + 'v| = ' + st.k + ' × √' + (st.x * st.x + st.y * st.y) + ' ≈ ' + (st.k * Math.hypot(st.x, st.y)).toFixed(2))}`)
    },
    {
      title: 'Direction Angle Formula With Quadrant Checking',
      controls: [slider('x', 'i-component', -9, 9, 1, -4), slider('y', 'j-component', -9, 9, 1, -3)],
      prompt: st => `For ${m('v = ' + vec(st.x, st.y))}, find the magnitude (2 d.p.) and the angle from the positive x-axis in the range 0° to 360° (2 d.p.).`,
      visual: st => buildDiagramSVG([v(0, 0, st.x, st.y, 'green', 'v')]),
      readout: st => eq(`${m('θ = atan2(y, x)')}`, `Quadrant: ${st.x >= 0 && st.y >= 0 ? 'I' : st.x < 0 && st.y >= 0 ? 'II' : st.x < 0 ? 'III' : 'IV'}`),
      fields: () => [box('mag', 'Magnitude (2 d.p.)', 2), box('ang', 'Angle (°, 2 d.p.)', 2)],
      answers: st => ({ mag: Math.hypot(st.x, st.y), ang: degrees(st.y, st.x) }),
      hint: () => 'Calculate the reference angle using tan⁻¹|y/x|, then adjust based on the quadrant so the answer is between 0° and 360°.',
      solution: st => steps(`${m('|v| = √' + (st.x * st.x + st.y * st.y) + ' ≈ ' + Math.hypot(st.x, st.y).toFixed(2))}`, `${m('θ ≈ ' + degrees(st.y, st.x).toFixed(2))}°`)
    },
    {
      title: 'Division Formula: Point on PQ',
      controls: [slider('px', 'x of P', -8, 8, 1, 1), slider('py', 'y of P', -8, 8, 1, 2), slider('qx', 'x of Q', -8, 8, 1, 7), slider('qy', 'y of Q', -8, 8, 1, 6), slider('t', 'Fraction t along PQ', 0, 1, 0.1, 0.5)],
      prompt: st => `Point R lies on PQ so that ${m('OR = OP + t(OQ − OP)')} where t = ${n(st.t)}. Find the coordinates of R to 2 decimal places, with P(${st.px}, ${st.py}) and Q(${st.qx}, ${st.qy}).`,
      visual: st => buildDiagramSVG([v(st.px, st.py, st.qx - st.px, st.qy - st.py, 'blue', 'PQ', true), v(0, 0, st.px + st.t * (st.qx - st.px), st.py + st.t * (st.qy - st.py), 'green', 'OR')]),
      readout: st => eq(`${m('PQ = ' + vec(st.qx - st.px, st.qy - st.py))}`, `${m('t PQ = ' + vec(st.t * (st.qx - st.px), st.t * (st.qy - st.py)))}`),
      fields: () => [box('i', 'x-coordinate of R (2 d.p.)', 2), box('j', 'y-coordinate of R (2 d.p.)', 2)],
      answers: st => ({ i: st.px + st.t * (st.qx - st.px), j: st.py + st.t * (st.qy - st.py) }),
      hint: () => 't = 0 gives P and t = 1 gives Q. Multiply PQ by t first, then add to OP.',
      solution: st => steps(`${m('PQ = ' + vec(st.qx - st.px, st.qy - st.py))}`, `${m('OR = ' + vec(st.px, st.py) + ' + ' + n(st.t) + '(' + vec(st.qx - st.px, st.qy - st.py) + ')')}`, `${m('OR ≈ ' + vec(Number((st.px + st.t * (st.qx - st.px)).toFixed(2)), Number((st.py + st.t * (st.qy - st.py)).toFixed(2))))}`)
    },
    {
      title: 'Internal Division Formula: Point Dividing PQ',
      controls: [slider('px', 'x of P', -6, 6, 1, -2), slider('py', 'y of P', -6, 6, 1, 1), slider('qx', 'x of Q', -6, 6, 1, 4), slider('qy', 'y of Q', -6, 6, 1, 5), slider('m', 'Ratio m in m:n', 1, 4, 1, 2), slider('n', 'Ratio n in m:n', 1, 4, 1, 1)],
      prompt: st => `Point R divides PQ in the ratio ${st.m}:${st.n}. Use the formula ${m('OR = (m·OQ + n·OP)/(m+n)')}} to find the coordinates of R (2 d.p.), with P(${st.px}, ${st.py}) and Q(${st.qx}, ${st.qy}).`,
      visual: st => {
        const total = st.m + st.n;
        const rx = (st.m * st.qx + st.n * st.px) / total;
        const ry = (st.m * st.qy + st.n * st.py) / total;
        return buildDiagramSVG([v(st.px, st.py, st.qx - st.px, st.qy - st.py, 'blue', 'PQ', true), v(0, 0, rx, ry, 'green', 'R')]);
      },
      readout: st => eq(`Ratio: ${st.m}:${st.n}`, `${m('OR = (' + st.m + 'OQ + ' + st.n + 'OP)/' + (st.m + st.n))}`),
      fields: () => [box('i', 'x-coordinate of R (2 d.p.)', 2), box('j', 'y-coordinate of R (2 d.p.)', 2)],
      answers: st => {
        const total = st.m + st.n;
        return { i: (st.m * st.qx + st.n * st.px) / total, j: (st.m * st.qy + st.n * st.py) / total };
      },
      hint: () => 'Division formula: numerator = m times the end point + n times the start point; denominator = m + n.',
      solution: st => {
        const total = st.m + st.n;
        const rx = (st.m * st.qx + st.n * st.px) / total;
        const ry = (st.m * st.qy + st.n * st.py) / total;
        return steps(`${m('OR = (' + st.m + ' × ' + st.qx + ' + ' + st.n + ' × ' + neg(st.px) + ')/' + total + ' i')}`, `${m('OR = (' + st.m + ' × ' + st.qy + ' + ' + st.n + ' × ' + neg(st.py) + ')/' + total + ' j')}`, `${m('OR ≈ (' + rx.toFixed(2) + ', ' + ry.toFixed(2) + ')')})`);
      }
    },
    {
      title: 'Vector Equality in Solving Geometric Problems',
      controls: [slider('k', 'Multiplier k in AB = ka', 1, 6, 1, 3), slider('m', 'Coefficient m in OC = m·OA', 0.2, 2, 0.2, 1)],
      prompt: st => `In quadrilateral OABC, ${m('OA = a')}, ${m('OB = b')}, and ${m('AB = ' + st.k + 'a')}. Use vector equality to show that ${m('OC = ' + n(st.m) + '(b − a + ' + st.k + 'a)')} and find ${m('|OC|')}} if ${m('|a| = 2')}, ${m('|b| = 5')}} and a, b are perpendicular.`,
      visual: st => buildDiagramSVG([v(0, 0, 2, 0, 'blue', 'a'), v(0, 0, 0, 5, 'red', 'b'), v(2, 0, st.k * 2, 0, 'purple', 'AB')]),
      readout: st => eq(`Use vector equality: ${m('OB = OA + AB')}`, `${m('b = a + ' + st.k + 'a = (1 + ' + st.k + ')a')}`, `Since a ⊥ b: ${m('|OC|² = |b − a + ' + st.k + 'a|² = |' + (st.k - 1) + 'b|²')}}`),
      fields: () => [box('mag', `Magnitude |OC| (2 d.p.)`, 2)],
      answers: st => {
        const resultMag = Math.abs(st.k - 1) * 5;
        return { mag: st.m * resultMag };
      },
      hint: () => 'Use vector equality to write the relationship between OA, OB and AB. Since they are perpendicular, use the Pythagorean theorem for magnitude.',
      solution: st => {
        const resultMag = Math.abs(st.k - 1) * 5;
        const ocMag = st.m * resultMag;
        return steps(`Vector equality: ${m('OB = OA + AB')}`, `${m('b = a + ' + st.k + 'a')}`, `${m('OC = ' + n(st.m) + '(b − a + ' + st.k + 'a) = ' + n(st.m) + ' × ' + (st.k - 1) + 'a')}`, `Since a ⊥ b and |a| = 2, |b| = 5:`, `${m('|OC| = ' + n(st.m) + ' × ' + (st.k - 1) + ' × 5 = ' + ocMag.toFixed(2))}`);
      }
    }
  ];

  const AREAS = [
    { tab: 'intro', key: 'intro', title: 'Six Interactive Examples: Daily Quantities to Applications', examples: introExamples },
    { tab: 'concept1', key: 'scalar', title: 'Six Interactive Examples: Scalars, Vectors, and Scalar Multiplication', examples: scalarExamples },
    { tab: 'concept2', key: 'component', title: 'Six Interactive Examples: Components, Magnitude, Direction, and Unit Vectors', examples: componentExamples },
    { tab: 'concept3', key: 'addition', title: 'Six Interactive Examples: Addition, Subtraction, and Geometric Routes', examples: additionExamples },
    { tab: 'practice', key: 'drill', title: 'Six Interactive Examples: Exam-Style Practice Drills', examples: practiceExamples },
    { tab: 'resources', key: 'formula', title: 'Six Interactive Examples: Each Reference Formula Applied', examples: resourceExamples },
    { tab: 'glossary', key: 'glossary', title: 'Six Interactive Examples: Vector Terms in Action',
      examples: [introExamples[0], scalarExamples[0], scalarExamples[2], componentExamples[0], componentExamples[4], additionExamples[0]] }
  ].map(area => ({ ...area, examples: area.examples.slice(0, LEVELS.length) }));

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
            <button type="button" data-act="check">✓ Check Answer</button>
            <button type="button" data-act="hint">💡 Hint</button>
            <button type="button" data-act="solution">📖 Solution</button>
            <button type="button" data-act="reset">↺ Reset</button>
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
        label.innerHTML = `<span>${escapeAttr(field.label)}</span><select id="${fieldId}" data-key="${field.key}"><option value="">— Select —</option>${field.options.map(([value, text]) => `<option value="${escapeAttr(value)}">${escapeAttr(text)}</option>`).join('')}</select>`;
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
      feedback.textContent = 'Complete each field with a valid number or choice first.';
      return false;
    }
    feedback.dataset.state = correct ? 'correct' : 'wrong';
    if (correct) {
      const tier = card.dataset.tier;
      let message = '✓ Correct! Change the slider or choice to try a new case.';
      if (!solved.has(card.id) && typeof addXp === 'function') {
        solved.add(card.id);
        addXp(XP[tier]);
        message += ` (+${XP[tier]} XP)`;
      }
      feedback.textContent = message;
    } else {
      feedback.textContent = '✗ Not quite right. The fields in red need to be checked again; try the Hint.';
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
    section.innerHTML = `<div class="lab-kicker">Six Interactive Examples · Easy to Hard</div>
      <h3>${escapeAttr(area.title)}</h3>
      <p class="ex-ladder-intro">Each tab includes six interactive examples. Levels 1–2 test recognition or direct calculation. Levels 3–4 require multi-step vector reasoning. Levels 5–6 explore applications and geometry. Adjust the controls, enter your answer, then check. Use Hint, Solution, or Reset whenever you need them.</p>
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
