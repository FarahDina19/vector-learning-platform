/* Readable, equal-scale examples complement the interactive vector labs. */
(() => {
  const host = document.getElementById('vector-types');
  const v = (ox, oy, dx, dy, color, label) => ({ox, oy, dx, dy, color, label});
  const examples = [
    ['Vektor Sifar (Null)', 'Pangkal dan hujung bertindih.', '0 = (0, 0)',
      'Magnitud ialah 0; arah tidak ditentukan. Ditunjukkan sebagai titik, bukan anak panah.',
      [v(0, 0, 0, 0, 'green', '0')]],
    ['Vektor Unit', 'Panjang tepat 1 unit.', '|i| = |j| = 1',
      'i bergerak 1 unit ke kanan; j bergerak 1 unit ke atas. Mana-mana vektor bermagnitud 1 ialah vektor unit.',
      [v(0, 0, 1, 0, 'blue', 'i'), v(0, 0, 0, 1, 'red', 'j')]],
    ['Vektor Selari', 'Arah sama atau bertentangan.', 'b = 2a; c = −a',
      'a = (2, 1), b = (4, 2), c = (−2, −1). Vektor bukan sifar ini ialah gandaan skalar antara satu sama lain.',
      [v(0, 0, 2, 1, 'blue', 'a'), v(0, 2, 4, 2, 'red', 'b'), v(3, 0, -2, -1, 'green', 'c')]],
    ['Vektor Sama', 'Panjang sama, arah sama.', 'a = b = (3, 1)',
      'Kedudukan pangkal boleh berbeza. Kedua-dua anak panah bergerak 3 unit ke kanan dan 1 unit ke atas.',
      [v(-2, -1, 3, 1, 'blue', 'a'), v(-1, 2, 3, 1, 'red', 'b')]],
    ['Vektor Negatif', 'Panjang sama, arah bertentangan.', '−a = (−3, −1)',
      'Jika a = (3, 1), maka −a membalikkan arah setiap komponen. Jumlah a + (−a) ialah vektor sifar.',
      [v(0, 0, 3, 1, 'blue', 'a'), v(0, 0, -3, -1, 'red', '−a')]]
  ];
  // Keep the original summary notes and badge; diagrams supplement them below.
  const intro = document.createElement('p');
  intro.className = 'visual-intro';
  intro.textContent = 'Bandingkan panjang dan arah anak panah. Setiap diagram menggunakan skala yang sama pada paksi x dan y; semak nilai unit per petak di bawah diagram.';
  host.append(intro);
  const grid = document.createElement('div');
  grid.className = 'vector-type-grid';
  examples.forEach(([title, subtitle, equation, description, vectors], index) => {
    const card = document.createElement('article');
    card.className = 'vector-type-card';
    card.innerHTML = `<span class="visual-number">0${index + 1}</span><h3>${title}</h3><p class="type-subtitle">${subtitle}</p><figure>${buildDiagramSVG(vectors)}<figcaption>${equation}</figcaption></figure><p>${description}</p>`;
    grid.append(card);
  });
  host.append(grid);

  const anatomy = document.createElement('section');
  anatomy.className = 'vector-lab vector-anatomy';
  anatomy.innerHTML = `<div class="lab-kicker">Panduan membaca diagram</div><h3>Anatomi sebuah vektor</h3><div class="anatomy-layout"><svg viewBox="0 0 520 290" role="img" aria-labelledby="anatomy-title anatomy-desc"><title id="anatomy-title">Vektor AB: 4 meter ke Timur</title><desc id="anatomy-desc">Anak panah dari A di kiri ke B di kanan. Panjang mewakili magnitud 4 meter, kepala anak panah menunjukkan arah Timur.</desc><rect x="15" y="15" width="490" height="260" rx="16" fill="#faf8f5"/><path d="M80 145H440 M423 135L440 145L423 155" fill="none" stroke="#227849" stroke-width="5"/><circle cx="80" cy="145" r="6" fill="#2f6fed"/><g fill="#3d2817" font-family="Cambria,serif" font-size="18"><text x="80" y="115" text-anchor="middle">A · Pangkal</text><text x="428" y="115" text-anchor="middle">B · Hujung</text><text x="260" y="72" text-anchor="middle">Arah: Timur →</text><text x="260" y="225" text-anchor="middle">Magnitud: |AB| = 4 m</text></g><path d="M80 180V192 M80 186H440 M440 180V192" stroke="#938477" stroke-width="2" fill="none"/></svg><div><p><strong>Pangkal A</strong> ialah titik mula. <strong>Hujung B</strong> ialah titik akhir.</p><p><strong>Panjang anak panah</strong> mewakili magnitud mengikut skala. <strong>Kepala anak panah</strong> menunjukkan arah.</p><p class="anatomy-example">Contoh sesaran: 4 m ke Timur.<br>Jika arah dibalikkan, BA = −AB.</p></div></div>`;
  host.before(anatomy);
})();
