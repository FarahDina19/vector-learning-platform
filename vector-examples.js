/* Six extra interactive examples for every existing example area, ordered Easy 1 to Hard 6. */
const VectorExamples = (() => {
  const m = VectorMath.math;
  const col = VectorMath.column;
  const LEVELS = [
    { label: 'Mudah 1 · Easy 1', tier: 'easy' },
    { label: 'Mudah 2 · Easy 2', tier: 'easy' },
    { label: 'Sederhana 3 · Medium 3', tier: 'medium' },
    { label: 'Sederhana 4 · Medium 4', tier: 'medium' },
    { label: 'Sukar 5 · Hard 5', tier: 'hard' },
    { label: 'Sukar 6 · Hard 6', tier: 'hard' }
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
    ['Jarak 5 km', '5 km', 'skalar', 'hanya panjang laluan diberi, tiada arah'],
    ['Halaju 20 m/s ke Utara', '20 m/s', 'vektor', 'arah "ke Utara" dinyatakan bersama magnitud'],
    ['Jisim 3 kg', '3 kg', 'skalar', 'jisim tidak mempunyai arah'],
    ['Daya 10 N ke bawah', '10 N', 'vektor', 'arah "ke bawah" dinyatakan bersama magnitud'],
    ['Laju 60 km/j', '60 km/j', 'skalar', 'laju ialah magnitud halaju sahaja'],
    ['Sesaran 4 m ke Timur', '4 m', 'vektor', 'sesaran sentiasa membawa arah']
  ];

  const introExamples = [
    {
      title: 'Skalar atau vektor?',
      controls: [chooser('q', 'Pilih kuantiti', QUANTITIES.map((item, index) => [index, item[0]]), 0)],
      prompt: st => `Kuantiti dipilih: <strong>${QUANTITIES[st.q][0]}</strong>. Klasifikasikan kuantiti ini.`,
      readout: st => eq(`Magnitud: <strong>${QUANTITIES[st.q][1]}</strong>`, 'Soalan semakan: adakah ayat kuantiti menyatakan satu arah?'),
      fields: () => [pick('type', 'Jenis kuantiti', [['skalar', 'Skalar'], ['vektor', 'Vektor']])],
      answers: st => ({ type: QUANTITIES[st.q][2] }),
      hint: () => 'Skalar = magnitud sahaja. Vektor = magnitud <em>dan</em> arah. Cari perkataan arah seperti "ke Utara", "ke bawah" atau "ke Timur".',
      solution: st => `${QUANTITIES[st.q][0]} ialah <strong>${QUANTITIES[st.q][2]}</strong> kerana ${QUANTITIES[st.q][3]}.`
    },
    {
      title: 'Magnitud sesaran dua langkah serenjang',
      controls: [slider('e', 'Langkah ke Timur (km)', 1, 8, 1, 3), slider('u', 'Langkah ke Utara (km)', 1, 8, 1, 4)],
      prompt: st => `Satu perjalanan ${st.e} km ke Timur diikuti ${st.u} km ke Utara. Cari magnitud sesaran, betul kepada 2 tempat perpuluhan.`,
      visual: st => buildDiagramSVG([v(0, 0, st.e, 0, 'blue', `${st.e}i`), v(st.e, 0, 0, st.u, 'red', `${st.u}j`), v(0, 0, st.e, st.u, 'green', 's')]),
      readout: st => eq(`${m('s')} = ${m(vec(st.e, st.u))} km`, `Formula: ${m('|s| = √(x² + y²)')}`),
      fields: () => [box('mag', 'Magnitud |s| (km, 2 t.p.)', 2)],
      answers: st => ({ mag: Math.hypot(st.e, st.u) }),
      hint: () => 'Kedua-dua langkah bersudut tepat, jadi gunakan teorem Pythagoras pada komponen i dan j.',
      solution: st => steps(`${m('s = ' + vec(st.e, st.u))} km`, `${m('|s| = √(' + st.e + '² + ' + st.u + '²)')}`, `${m('|s| = √' + (st.e * st.e + st.u * st.u) + ' ≈ ' + Math.hypot(st.e, st.u).toFixed(2))} km`)
    },
    {
      title: 'Jarak berbeza daripada sesaran',
      controls: [slider('f', 'Ke Timur (m)', 1, 9, 1, 4), slider('b', 'Kemudian ke Barat (m)', 1, 9, 1, 3)],
      prompt: st => `Sebuah troli bergerak ${st.f} m ke Timur, kemudian ${st.b} m ke Barat. Cari jumlah jarak dan komponen i bagi sesaran akhir.`,
      visual: st => buildDiagramSVG([v(0, 0, st.f, 0, 'blue', `${st.f} Timur`), v(st.f, 1, -st.b, 0, 'red', `${st.b} Barat`), v(0, -1, st.f - st.b, 0, 'green', 'sesaran')]),
      readout: st => eq('Jarak menjumlahkan setiap panjang laluan.', 'Sesaran hanya bergantung pada titik mula dan titik akhir.'),
      fields: () => [box('dist', 'Jumlah jarak (m)'), box('disp', 'Komponen i sesaran (m)')],
      answers: st => ({ dist: st.f + st.b, disp: st.f - st.b }),
      hint: () => 'Jarak ialah skalar, jadi kedua-dua langkah ditambah. Sesaran ialah vektor, jadi gerakan ke Barat adalah negatif.',
      solution: st => steps(`Jarak = ${st.f} + ${st.b} = <strong>${st.f + st.b}</strong> m`, `Sesaran = ${m('' + st.f + 'i − ' + st.b + 'i')} = ${m(st.f - st.b + 'i')} m`, `Komponen i = <strong>${st.f - st.b}</strong>`)
    },
    {
      title: 'Pesawat dan angin: halaju paduan',
      controls: [slider('p', 'Halaju pesawat ke Utara (km/j)', 100, 400, 50, 300), slider('w', 'Halaju angin ke Timur (km/j)', 10, 150, 10, 50)],
      prompt: st => `Pesawat terbang ${st.p} km/j ke Utara sementara angin bertiup ${st.w} km/j ke Timur. Cari laju paduan (2 t.p.) dan sudut sisihan dari Utara (darjah, 2 t.p.).`,
      visual: st => buildDiagramSVG([v(0, 0, 0, st.p, 'blue', 'pesawat'), v(0, st.p, st.w, 0, 'red', 'angin'), v(0, 0, st.w, st.p, 'green', 'paduan')]),
      readout: st => eq(`Paduan = ${m(vec(st.w, st.p))} km/j`, `Laju: ${m('|R| = √(x² + y²)')}`, `Sudut dari Utara: ${m('θ = atan2(x, y)')}`),
      fields: () => [box('mag', 'Laju paduan (km/j, 2 t.p.)', 2), box('ang', 'Sudut dari Utara (°, 2 t.p.)', 2)],
      answers: st => ({ mag: Math.hypot(st.w, st.p), ang: (Math.atan2(st.w, st.p) * 180) / Math.PI }),
      hint: () => 'Komponen Utara ialah j dan komponen Timur ialah i. Sudut dari Utara diukur dari paksi j, jadi gunakan tan θ = (komponen Timur) / (komponen Utara).',
      solution: st => steps(`${m('R = ' + vec(st.w, st.p))} km/j`, `${m('|R| = √(' + st.w + '² + ' + st.p + '²) ≈ ' + Math.hypot(st.w, st.p).toFixed(2))} km/j`, `${m('θ = atan2(' + st.w + ', ' + st.p + ') ≈ ' + ((Math.atan2(st.w, st.p) * 180) / Math.PI).toFixed(2))}°`)
    },
    {
      title: 'Dua daya pada hook dan daya pengimbang',
      controls: [slider('a', 'Daya 1 ke Timur (N)', 100, 1000, 100, 800), slider('b', 'Daya 2 ke Utara (N)', 100, 1000, 100, 600)],
      prompt: st => `Dua kabel serenjang menarik satu hook dengan ${st.a} N ke Timur dan ${st.b} N ke Utara. Cari magnitud daya paduan (2 t.p.) dan komponen daya pengimbang yang menjadikan jumlah daya sifar.`,
      visual: st => buildDiagramSVG([v(0, 0, st.a, 0, 'blue', 'F₁'), v(0, 0, 0, st.b, 'red', 'F₂'), v(0, 0, st.a, st.b, 'green', 'R'), v(0, 0, -st.a, -st.b, 'purple', 'E', true)]),
      readout: st => eq(`${m('F₁ = ' + st.a + 'i')} N, ${m('F₂ = ' + st.b + 'j')} N`, `Syarat keseimbangan: ${m('F₁ + F₂ + E = zero')}`),
      fields: () => [box('mag', 'Magnitud paduan (N, 2 t.p.)', 2), box('ei', 'Komponen i pengimbang (N)'), box('ej', 'Komponen j pengimbang (N)')],
      answers: st => ({ mag: Math.hypot(st.a, st.b), ei: -st.a, ej: -st.b }),
      hint: () => 'Cari paduan dahulu. Daya pengimbang ialah negatif bagi paduan, jadi kedua-dua komponennya bertukar tanda.',
      solution: st => steps(`${m('R = ' + vec(st.a, st.b))} N`, `${m('|R| = √(' + st.a + '² + ' + st.b + '²) ≈ ' + Math.hypot(st.a, st.b).toFixed(2))} N`, `${m('E = −R = ' + vec(-st.a, -st.b))} N`)
    },
    {
      title: 'Objek permainan selepas beberapa bingkai',
      controls: [slider('vx', 'Halaju vx (unit/bingkai)', -5, 5, 1, 2), slider('vy', 'Halaju vy (unit/bingkai)', -5, 5, 1, 3), slider('t', 'Bilangan bingkai', 1, 8, 1, 4)],
      prompt: st => `Kedudukan awal objek ialah ${m('(2, 1)')}. Setiap bingkai, halaju ${m(vec(st.vx, st.vy))} ditambah kepada kedudukan. Cari kedudukan selepas ${st.t} bingkai dan jaraknya dari asalan (2 t.p.).`,
      visual: st => buildDiagramSVG([v(0, 0, 2, 1, 'blue', 'p₀'), v(2, 1, st.vx * st.t, st.vy * st.t, 'red', `${st.t}v`), v(0, 0, 2 + st.vx * st.t, 1 + st.vy * st.t, 'green', 'p')]),
      readout: st => eq('Kedudukan akhir = kedudukan awal + (bilangan bingkai × halaju).', `Awal: ${m(vec(2, 1))} · Halaju: ${m(vec(st.vx, st.vy))} · Bingkai: ${st.t}`),
      fields: () => [box('x', 'Kedudukan x'), box('y', 'Kedudukan y'), box('d', 'Jarak dari asalan (2 t.p.)', 2)],
      answers: st => ({ x: 2 + st.vx * st.t, y: 1 + st.vy * st.t, d: Math.hypot(2 + st.vx * st.t, 1 + st.vy * st.t) }),
      hint: () => 'Darab halaju dengan bilangan bingkai terlebih dahulu, kemudian tambah kepada kedudukan awal komponen demi komponen.',
      solution: st => steps(`${m(st.t + 'v = ' + vec(st.vx * st.t, st.vy * st.t))}`, `${m('p = ' + vec(2, 1) + ' + ' + '(' + vec(st.vx * st.t, st.vy * st.t) + ')')} = ${m(vec(2 + st.vx * st.t, 1 + st.vy * st.t))}`, `${m('|p| = √(' + neg(2 + st.vx * st.t) + '² + ' + neg(1 + st.vy * st.t) + '²) ≈ ' + Math.hypot(2 + st.vx * st.t, 1 + st.vy * st.t).toFixed(2))}`)
    }
  ];

  /* ---------- Area 2: 5.1 Scalar vs vector, vector types, scalar multiplication ---------- */
  const relation = k => (k === 0 ? 'sifar' : k === 1 ? 'sama' : k === -1 ? 'negatif' : k > 0 ? 'selari' : 'bertentangan');
  const RELATION_TEXT = {
    sifar: 'vektor sifar (null), kerana setiap komponen menjadi 0',
    sama: 'vektor yang sama dengan A, kerana magnitud dan arah tidak berubah',
    negatif: 'negatif bagi A, kerana magnitud kekal tetapi arah berbalik',
    selari: 'selari dengan A dan sehala, kerana k positif',
    bertentangan: 'selari dengan A tetapi bertentangan arah, kerana k negatif'
  };

  const scalarExamples = [
    {
      title: 'Vektor negatif',
      controls: [slider('x', 'Komponen i bagi A', -6, 6, 1, 3), slider('y', 'Komponen j bagi A', -6, 6, 1, 2)],
      prompt: st => `Diberi ${m('A = ' + vec(st.x, st.y))}. Nyatakan komponen bagi ${m('−A')}.`,
      visual: st => buildDiagramSVG([v(0, 0, st.x, st.y, 'blue', 'A'), v(0, 0, -st.x, -st.y, 'red', '−A')]),
      readout: st => eq(`${m('A = ' + vec(st.x, st.y))}`, 'Negatif sesuatu vektor mempunyai panjang yang sama tetapi arah bertentangan.'),
      fields: () => [box('i', 'Komponen i'), box('j', 'Komponen j')],
      answers: st => ({ i: -st.x, j: -st.y }),
      hint: () => 'Tukar tanda kedua-dua komponen. Komponen negatif menjadi positif.',
      solution: st => `${m('−A = −(' + vec(st.x, st.y) + ') = ' + vec(-st.x, -st.y))}`
    },
    {
      title: 'Magnitud sesuatu vektor',
      controls: [slider('x', 'Komponen i', -8, 8, 1, 6), slider('y', 'Komponen j', -8, 8, 1, -8)],
      prompt: st => `Diberi ${m('v = ' + vec(st.x, st.y))}. Cari ${m('|v|')} betul kepada 2 tempat perpuluhan.`,
      visual: st => buildDiagramSVG([v(0, 0, st.x, 0, 'blue', `${st.x}i`), v(st.x, 0, 0, st.y, 'red', `${st.y}j`), v(0, 0, st.x, st.y, 'green', 'v')]),
      readout: st => eq(`${m('|v| = √(x² + y²)')}`, `x = ${st.x}, y = ${st.y}`),
      fields: () => [box('mag', 'Magnitud (2 t.p.)', 2)],
      answers: st => ({ mag: Math.hypot(st.x, st.y) }),
      hint: () => 'Kuasa dua sesuatu nombor negatif adalah positif, jadi tanda tidak menjejaskan magnitud.',
      solution: st => `${m('|v| = √(' + neg(st.x) + '² + ' + neg(st.y) + '²) = √' + (st.x * st.x + st.y * st.y) + ' ≈ ' + Math.hypot(st.x, st.y).toFixed(2))}`
    },
    {
      title: 'Pendaraban skalar dan kesannya pada panjang',
      controls: [slider('k', 'Pengganda k', -3, 3, 0.5, 2), slider('x', 'Komponen i bagi v', -5, 5, 1, 2), slider('y', 'Komponen j bagi v', -5, 5, 1, 1)],
      prompt: st => `Diberi ${m('v = ' + vec(st.x, st.y))} dan ${m('k = ' + n(st.k))}. Cari komponen ${m('kv')} dan ${m('|kv|')} (2 t.p.).`,
      visual: st => buildDiagramSVG(drawable([v(0, 0, st.x, st.y, 'blue', 'v'), v(0, 0, st.k * st.x, st.k * st.y, 'green', 'kv')])),
      readout: st => eq(`${m('kv = k(xi + yj) = kx i + ky j')}`, `${m('|kv| = |k| × |v|')}`),
      fields: () => [box('i', 'Komponen i bagi kv', 2), box('j', 'Komponen j bagi kv', 2), box('mag', 'Magnitud |kv| (2 t.p.)', 2)],
      answers: st => ({ i: st.k * st.x, j: st.k * st.y, mag: Math.abs(st.k) * Math.hypot(st.x, st.y) }),
      hint: () => 'Darab setiap komponen dengan k. Magnitud didarab dengan |k| sahaja, jadi ia tidak pernah negatif.',
      solution: st => steps(`${m('kv = ' + vec(st.k * st.x, st.k * st.y))}`, `${m('|v| = √' + (st.x * st.x + st.y * st.y) + ' ≈ ' + Math.hypot(st.x, st.y).toFixed(4))}`, `${m('|kv| = |' + n(st.k) + '| × |v| ≈ ' + (Math.abs(st.k) * Math.hypot(st.x, st.y)).toFixed(2))}`)
    },
    {
      title: 'Mengenal pasti jenis vektor',
      controls: [slider('k', 'Pengganda k bagi B = kA', -3, 3, 1, 2), slider('x', 'Komponen i bagi A', 1, 5, 1, 2), slider('y', 'Komponen j bagi A', 1, 5, 1, 1)],
      prompt: st => `Diberi ${m('A = ' + vec(st.x, st.y))} dan ${m('B = ' + n(st.k) + 'A')}. Apakah hubungan antara B dan A?`,
      visual: st => buildDiagramSVG(drawable([v(0, 0, st.x, st.y, 'blue', 'A'), v(0, 0, st.k * st.x, st.k * st.y, 'red', 'B')])),
      readout: st => eq(`${m('B = ' + vec(st.k * st.x, st.k * st.y))}`, 'Bandingkan panjang dan arah anak panah pada rajah.'),
      fields: () => [pick('rel', 'Hubungan B dengan A', [['sama', 'Vektor sama'], ['negatif', 'Vektor negatif'], ['selari', 'Selari dan sehala'], ['bertentangan', 'Selari tetapi bertentangan arah'], ['sifar', 'Vektor sifar (null)']])],
      answers: st => ({ rel: relation(st.k) }),
      hint: () => 'k = 1 memberi vektor yang sama, k = −1 memberi vektor negatif, k = 0 memberi vektor sifar. Tanda k menentukan arah bagi nilai lain.',
      solution: st => `Dengan ${m('k = ' + n(st.k))}, B ialah ${RELATION_TEXT[relation(st.k)]}.`
    },
    {
      title: 'Cari pengganda yang memberi magnitud sasaran',
      controls: [slider('x', 'Komponen i bagi v', 1, 8, 1, 3), slider('y', 'Komponen j bagi v', 1, 8, 1, 4), slider('t', 'Magnitud sasaran |kv|', 2, 30, 1, 10)],
      prompt: st => `Diberi ${m('v = ' + vec(st.x, st.y))}. Cari nilai positif k supaya ${m('|kv| = ' + st.t)}. Jawab kepada 4 tempat perpuluhan.`,
      visual: st => buildDiagramSVG([v(0, 0, st.x, st.y, 'blue', 'v'), v(0, 0, (st.t / Math.hypot(st.x, st.y)) * st.x, (st.t / Math.hypot(st.x, st.y)) * st.y, 'green', 'kv')]),
      readout: st => eq(`${m('|kv| = |k| × |v|')}`, `${m('|v| = √' + (st.x * st.x + st.y * st.y) + ' ≈ ' + Math.hypot(st.x, st.y).toFixed(4))}`, `Sasaran: ${m('|kv| = ' + st.t)}`),
      fields: () => [box('k', 'Nilai k (4 t.p.)', 4)],
      answers: st => ({ k: st.t / Math.hypot(st.x, st.y) }),
      hint: () => 'Mulakan daripada |kv| = |k| × |v|, kemudian selesaikan k dengan membahagikan magnitud sasaran dengan |v|.',
      solution: st => steps(`${m('|v| = √(' + st.x + '² + ' + st.y + '²) = √' + (st.x * st.x + st.y * st.y) + ' ≈ ' + Math.hypot(st.x, st.y).toFixed(4))}`, `${m('k = ' + st.t + '/|v| ≈ ' + (st.t / Math.hypot(st.x, st.y)).toFixed(4))}`)
    },
    {
      title: 'Vektor ketiga yang menghasilkan vektor sifar',
      controls: [slider('ax', 'Komponen i bagi A', -6, 6, 1, 3), slider('ay', 'Komponen j bagi A', -6, 6, 1, 2), slider('bx', 'Komponen i bagi B', -6, 6, 1, -1), slider('by', 'Komponen j bagi B', -6, 6, 1, 4)],
      prompt: st => `Diberi ${m('A = ' + vec(st.ax, st.ay))} dan ${m('B = ' + vec(st.bx, st.by))}. Cari C supaya ${m('A + B + C = zero')}, serta ${m('|C|')} (2 t.p.).`,
      visual: st => buildDiagramSVG([v(0, 0, st.ax, st.ay, 'blue', 'A'), v(st.ax, st.ay, st.bx, st.by, 'red', 'B'), v(st.ax + st.bx, st.ay + st.by, -(st.ax + st.bx), -(st.ay + st.by), 'green', 'C')]),
      readout: st => eq(`${m('A + B = ' + vec(st.ax + st.bx, st.ay + st.by))}`, `${m('C = −(A + B)')}`),
      fields: () => [box('i', 'Komponen i bagi C'), box('j', 'Komponen j bagi C'), box('mag', 'Magnitud |C| (2 t.p.)', 2)],
      answers: st => ({ i: -(st.ax + st.bx), j: -(st.ay + st.by), mag: Math.hypot(st.ax + st.bx, st.ay + st.by) }),
      hint: () => 'Tambah A dan B dahulu. C mesti menjadi negatif bagi hasil itu supaya laluan tertutup kembali ke titik mula.',
      solution: st => steps(`${m('A + B = ' + vec(st.ax + st.bx, st.ay + st.by))}`, `${m('C = ' + vec(-(st.ax + st.bx), -(st.ay + st.by)))}`, `${m('|C| = √' + ((st.ax + st.bx) ** 2 + (st.ay + st.by) ** 2) + ' ≈ ' + Math.hypot(st.ax + st.bx, st.ay + st.by).toFixed(2))}`)
    }
  ];

  /* ---------- Area 3: 5.2 Component form, magnitude, direction, unit vectors ---------- */
  const componentExamples = [
    {
      title: 'Daripada koordinat kepada vektor kedudukan',
      controls: [slider('x', 'Koordinat x bagi P', -7, 7, 1, -2), slider('y', 'Koordinat y bagi P', -7, 7, 1, 5)],
      prompt: st => `Titik ${m('P')} berada pada (${st.x}, ${st.y}). Nyatakan ${m('OP')} dalam bentuk ${m('xi + yj')}.`,
      visual: st => buildDiagramSVG([v(0, 0, st.x, st.y, 'green', 'OP')]),
      readout: st => eq('Vektor kedudukan bermula di asalan O dan berakhir di titik itu.', `P = (${st.x}, ${st.y})`),
      fields: () => [box('i', 'Komponen i'), box('j', 'Komponen j')],
      answers: st => ({ i: st.x, j: st.y }),
      hint: () => 'Koordinat x menjadi komponen i dan koordinat y menjadi komponen j; tiada pengiraan tambahan diperlukan.',
      solution: st => `${m('OP = ' + vec(st.x, st.y))}`
    },
    {
      title: 'Magnitud daripada bentuk komponen',
      controls: [slider('x', 'Komponen i', -9, 9, 1, 6), slider('y', 'Komponen j', -9, 9, 1, 8)],
      prompt: st => `Diberi ${m('v = ' + vec(st.x, st.y))}. Cari ${m('|v|')} (2 t.p.).`,
      visual: st => buildDiagramSVG([v(0, 0, st.x, 0, 'blue', `${st.x}i`), v(st.x, 0, 0, st.y, 'red', `${st.y}j`), v(0, 0, st.x, st.y, 'green', 'v')]),
      readout: st => eq(`${m('|v| = √(' + neg(st.x) + '² + ' + neg(st.y) + '²)')}`),
      fields: () => [box('mag', 'Magnitud (2 t.p.)', 2)],
      answers: st => ({ mag: Math.hypot(st.x, st.y) }),
      hint: () => 'Kuasa duakan setiap komponen, tambah, kemudian ambil punca kuasa dua.',
      solution: st => `${m('|v| = √' + (st.x * st.x + st.y * st.y) + ' ≈ ' + Math.hypot(st.x, st.y).toFixed(2))}`
    },
    {
      title: 'Vektor antara dua titik',
      controls: [slider('px', 'x bagi P', -7, 7, 1, 1), slider('py', 'y bagi P', -7, 7, 1, 2), slider('qx', 'x bagi Q', -7, 7, 1, 4), slider('qy', 'y bagi Q', -7, 7, 1, 6)],
      prompt: st => `Diberi P(${st.px}, ${st.py}) dan Q(${st.qx}, ${st.qy}). Cari komponen ${m('PQ')} dan panjangnya (2 t.p.).`,
      visual: st => buildDiagramSVG([v(0, 0, st.px, st.py, 'blue', 'OP', true), v(0, 0, st.qx, st.qy, 'red', 'OQ', true), v(st.px, st.py, st.qx - st.px, st.qy - st.py, 'green', 'PQ')]),
      readout: () => eq(`${m('PQ = OQ − OP')}`, 'Tolak koordinat titik mula daripada koordinat titik akhir.'),
      fields: () => [box('i', 'Komponen i'), box('j', 'Komponen j'), box('mag', 'Panjang PQ (2 t.p.)', 2)],
      answers: st => ({ i: st.qx - st.px, j: st.qy - st.py, mag: Math.hypot(st.qx - st.px, st.qy - st.py) }),
      hint: () => 'Hujung tolak mula: (x₂ − x₁) untuk i dan (y₂ − y₁) untuk j. Terbalikkan urutan dan anda akan mendapat QP.',
      solution: st => steps(`${m('PQ = (' + st.qx + ' − ' + neg(st.px) + ')i + (' + st.qy + ' − ' + neg(st.py) + ')j = ' + vec(st.qx - st.px, st.qy - st.py))}`, `${m('|PQ| = √' + ((st.qx - st.px) ** 2 + (st.qy - st.py) ** 2) + ' ≈ ' + Math.hypot(st.qx - st.px, st.qy - st.py).toFixed(2))}`)
    },
    {
      title: 'Arah vektor diukur dari paksi x positif',
      controls: [slider('x', 'Komponen i', -8, 8, 1, -3), slider('y', 'Komponen j', -8, 8, 1, 4)],
      prompt: st => `Diberi ${m('v = ' + vec(st.x, st.y))}. Cari magnitud (2 t.p.) dan sudut arah dari paksi x positif, diukur lawan jam dalam julat 0° hingga 360° (2 t.p.).`,
      visual: st => buildDiagramSVG([v(0, 0, st.x, 0, 'blue', `${st.x}i`), v(st.x, 0, 0, st.y, 'red', `${st.y}j`), v(0, 0, st.x, st.y, 'green', 'v')]),
      readout: st => eq(`${m('θ = atan2(y, x)')}`, `x = ${st.x}, y = ${st.y}`, 'Perhatikan sukuan tempat anak panah berada sebelum menerima nilai kalkulator.'),
      fields: () => [box('mag', 'Magnitud (2 t.p.)', 2), box('ang', 'Sudut (°, 2 t.p.)', 2)],
      answers: st => ({ mag: Math.hypot(st.x, st.y), ang: degrees(st.y, st.x) }),
      hint: () => 'Kalkulator memberi tan⁻¹ dalam julat −90° hingga 90°. Tambah 180° untuk sukuan kedua dan ketiga, atau 360° untuk sudut negatif dalam sukuan keempat.',
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
      title: 'Daripada magnitud dan sudut kepada komponen',
      controls: [slider('r', 'Magnitud |v|', 1, 20, 1, 10), slider('a', 'Sudut dari paksi x (°)', 0, 350, 10, 30)],
      prompt: st => `Sebuah vektor mempunyai magnitud ${st.r} dan membuat sudut ${st.a}° dengan paksi x positif. Cari komponen i dan j, masing-masing kepada 2 tempat perpuluhan.`,
      visual: st => buildDiagramSVG([v(0, 0, st.r * Math.cos((st.a * Math.PI) / 180), st.r * Math.sin((st.a * Math.PI) / 180), 'green', 'v')]),
      readout: st => eq(`${m('x = |v| cos θ')}`, `${m('y = |v| sin θ')}`, `|v| = ${st.r}, θ = ${st.a}°`),
      fields: () => [box('i', 'Komponen i (2 t.p.)', 2), box('j', 'Komponen j (2 t.p.)', 2)],
      answers: st => ({ i: st.r * Math.cos((st.a * Math.PI) / 180), j: st.r * Math.sin((st.a * Math.PI) / 180) }),
      hint: () => 'Komponen mendatar menggunakan kosinus dan komponen menegak menggunakan sinus. Pastikan kalkulator dalam mod darjah.',
      solution: st => steps(`${m('x = ' + st.r + ' cos ' + st.a)}° ${m('≈ ' + (st.r * Math.cos((st.a * Math.PI) / 180)).toFixed(2))}`, `${m('y = ' + st.r + ' sin ' + st.a)}° ${m('≈ ' + (st.r * Math.sin((st.a * Math.PI) / 180)).toFixed(2))}`)
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
  function escapeAttr(text) {
    return String(text).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
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
    section.innerHTML = `<div class="lab-kicker">Enam contoh tambahan · mudah ke sukar</div>
      <h3>${escapeAttr(area.title)}</h3>
      <p class="ex-ladder-intro">Enam contoh interaktif berikut melanjutkan contoh di atas. Tahap 1 dan 2 menguji pengecaman atau pengiraan terus, tahap 3 dan 4 memerlukan penaakulan vektor beberapa langkah, dan tahap 5 dan 6 ialah masalah gunaan atau geometri. Ubah kawalan, masukkan jawapan anda, kemudian semak.</p>
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
