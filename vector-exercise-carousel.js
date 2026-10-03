/* Interactive Exercise Carousel System */
const ExerciseCarousel = (() => {
  const m = VectorMath.math;
  const n = value => String(Number(Number(value).toFixed(4)));
  const vec = (x, y) => `${n(x)}i ${y < 0 ? '−' : '+'} ${n(Math.abs(y))}j`;

  // Progress tracking storage
  const progressState = {
    concept1: { completed: new Set(), total: 0 },
    concept2: { completed: new Set(), total: 0 },
    concept3: { completed: new Set(), total: 0 }
  };

  // Update progress display
  const updateProgressDisplay = (conceptId, exerciseIndex, totalExercises) => {
    const state = progressState[conceptId];
    if (!state) return;

    state.total = totalExercises;
    state.completed.add(exerciseIndex);

    const completed = state.completed.size;
    const percentage = Math.round((completed / totalExercises) * 100);

    // Update progress sidebar
    const percentEl = document.getElementById(`${conceptId}-percent`);
    const barEl = document.getElementById(`${conceptId}-bar`);
    const completedEl = document.getElementById(`${conceptId}-completed`);
    const totalEl = document.getElementById(`${conceptId}-total`);

    if (percentEl) percentEl.textContent = `${percentage}%`;
    if (barEl) barEl.style.width = `${percentage}%`;
    if (completedEl) completedEl.textContent = completed;
    if (totalEl) totalEl.textContent = totalExercises;

    // Update exercise list
    const exercisesList = document.getElementById(`${conceptId}-exercises-list`);
    if (exercisesList) {
      let html = '';
      for (let i = 0; i < totalExercises; i++) {
        const isCompleted = state.completed.has(i);
        html += `<div class="progress-exercise-item ${isCompleted ? 'completed' : 'incomplete'}">
          <div class="icon">${isCompleted ? '✓' : '○'}</div>
          <div class="label">Latihan ${i + 1}</div>
        </div>`;
      }
      exercisesList.innerHTML = html;
    }
  };

  // Exercises for Scalar Multiplication (Pendaraban Skalar)
  const scalarExercises = [
    {
      title: 'Pendaraban Skalar Asas',
      question: 'Jika <strong>a = 2i + 3j</strong>, cari <strong>2a</strong>.',
      answer: '4i + 6j',
      hint: 'Darabkan setiap komponen dengan 2. Ingat: 2(2i + 3j) = 2(2)i + 2(3)j',
      steps: [
        'Vektor asal: <strong>a = 2i + 3j</strong>',
        'Darabkan komponen i: 2 × 2 = 4',
        'Darabkan komponen j: 2 × 3 = 6',
        'Hasil: <strong>2a = 4i + 6j</strong>'
      ],
      solution: '<strong>2a = 4i + 6j</strong>'
    },
    {
      title: 'Pendaraban Skalar Negatif',
      question: 'Jika <strong>b = 3i − 2j</strong>, cari <strong>−b</strong>.',
      answer: '-3i + 2j',
      hint: 'Darabkan dengan -1 membalikkan arah. Tanda negatif ditukar ke positif dan sebaliknya.',
      steps: [
        'Vektor asal: <strong>b = 3i − 2j</strong>',
        'Darabkan dengan −1: (−1) × 3i = −3i',
        'Darabkan dengan −1: (−1) × (−2j) = +2j',
        'Hasil: <strong>−b = −3i + 2j</strong>'
      ],
      solution: '<strong>−b = −3i + 2j</strong>'
    },
    {
      title: 'Pendaraban Dengan Pecahan',
      question: 'Jika <strong>c = 4i + 8j</strong>, cari <strong>½c</strong>.',
      answer: '2i + 4j',
      hint: 'Darabkan setiap komponen dengan ½. Bahagi komponen dengan 2.',
      steps: [
        'Vektor asal: <strong>c = 4i + 8j</strong>',
        'Darabkan komponen i: ½ × 4 = 2',
        'Darabkan komponen j: ½ × 8 = 4',
        'Hasil: <strong>½c = 2i + 4j</strong>'
      ],
      solution: '<strong>½c = 2i + 4j</strong>'
    }
  ];

  // Exercises for Component Form (Komponen Cartes)
  const componentExercises = [
    {
      title: 'Titik ke Bentuk Komponen - Set 1',
      question: 'Titik A berada pada koordinat (7, 3). Tulis vektor OA dalam bentuk <strong>xi + yj</strong>.',
      answer: '7i + 3j',
      hint: 'Vektor dari asalan O ke titik A ialah 7 unit mendatar dan 3 unit menegak.',
      steps: [
        'Koordinat titik A: (7, 3)',
        'Komponen i (mendatar/x): 7',
        'Komponen j (menegak/y): 3',
        'Vektor OA = 7i + 3j'
      ],
      solution: '<strong>OA = 7i + 3j</strong>'
    },
    {
      title: 'Magnitud - Pythagoras 3-4-5',
      question: 'Cari magnitud vektor <strong>a = 3i + 4j</strong>. Bundarkan ke 2 tempat perpuluhan.',
      answer: '5.00',
      hint: '|a| = √(3² + 4²) = √(9 + 16) = √25 = 5.',
      steps: [
        'Vektor: <strong>a = 3i + 4j</strong>',
        'Formula magnitud: |a| = √(x² + y²)',
        '|a| = √(3² + 4²) = √25 = 5.00'
      ],
      solution: '<strong>|a| = 5.00</strong>'
    },
    {
      title: 'Magnitud - Pythagoras 5-12-13',
      question: 'Cari magnitud vektor <strong>b = 5i + 12j</strong>. Bundarkan ke 2 tempat perpuluhan.',
      answer: '13.00',
      hint: '|b| = √(5² + 12²) = √(25 + 144) = √169 = 13.',
      steps: [
        'Vektor: <strong>b = 5i + 12j</strong>',
        'Formula magnitud: |b| = √(x² + y²)',
        '|b| = √(5² + 12²) = √169 = 13.00'
      ],
      solution: '<strong>|b| = 13.00</strong>'
    },
    {
      title: 'Sudut Arah - 45 Darjah',
      question: 'Vektor <strong>c = 2i + 2j</strong> membuat sudut berapakah dengan paksi-x positif?',
      answer: '45',
      hint: 'Tan(θ) = y/x = 2/2 = 1. Jadi θ = 45°.',
      steps: [
        'Vektor: <strong>c = 2i + 2j</strong>, x = 2, y = 2',
        'Formula sudut: tan(θ) = y/x = 2/2 = 1',
        'θ = arctan(1) = 45°'
      ],
      solution: '<strong>θ = 45°</strong>'
    },
    {
      title: 'Sudut Arah - 60 Darjah',
      question: 'Vektor <strong>d = 1i + √3j</strong> membuat sudut berapakah dengan paksi-x positif?',
      answer: '60',
      hint: 'Tan(θ) = √3/1 = √3. Jadi θ = 60°.',
      steps: [
        'Vektor: <strong>d = 1i + √3j</strong>, x = 1, y = √3',
        'Formula sudut: tan(θ) = √3/1 = √3',
        'θ = arctan(√3) = 60°'
      ],
      solution: '<strong>θ = 60°</strong>'
    },
    {
      title: 'Titik ke Bentuk Komponen - Set 2',
      question: 'Titik B berada pada koordinat (−4, 6). Tulis vektor OB dalam bentuk <strong>xi + yj</strong>.',
      answer: '-4i + 6j',
      hint: 'Koordinat negatif bermakna ke kiri. Tulis dengan tanda negatif.',
      steps: [
        'Koordinat titik B: (−4, 6)',
        'Komponen i: −4 (ke sebelah kiri)',
        'Komponen j: 6 (ke atas)',
        'Vektor OB = −4i + 6j'
      ],
      solution: '<strong>OB = −4i + 6j</strong>'
    }
  ];

  // Exercises for Addition & Subtraction (Tambah dan Tolak)
  const additionExercises = [
    {
      title: 'Penambahan Vektor Asas',
      question: 'Tambah vektor <strong>a = 2i + 3j</strong> dan <strong>b = 1i + 2j</strong>. Cari a + b.',
      answer: '3i + 5j',
      hint: 'Tambah komponen yang sama: (2+1)i dan (3+2)j.',
      steps: [
        'Vektor pertama: <strong>a = 2i + 3j</strong>',
        'Vektor kedua: <strong>b = 1i + 2j</strong>',
        'Tambah komponen i: 2 + 1 = 3',
        'Tambah komponen j: 3 + 2 = 5',
        'Hasil: <strong>a + b = 3i + 5j</strong>'
      ],
      solution: '<strong>a + b = 3i + 5j</strong>'
    },
    {
      title: 'Pengurangan Vektor',
      question: 'Tolak: <strong>c = 5i + 7j</strong> dan <strong>d = 2i + 3j</strong>. Cari c − d.',
      answer: '3i + 4j',
      hint: 'Tolak komponen yang sama: (5-2)i dan (7-3)j.',
      steps: [
        'Vektor pertama: <strong>c = 5i + 7j</strong>',
        'Vektor kedua: <strong>d = 2i + 3j</strong>',
        'Tolak komponen i: 5 − 2 = 3',
        'Tolak komponen j: 7 − 3 = 4',
        'Hasil: <strong>c − d = 3i + 4j</strong>'
      ],
      solution: '<strong>c − d = 3i + 4j</strong>'
    },
    {
      title: 'Penambahan Dengan Negatif',
      question: 'Tambah <strong>e = 4i + 1j</strong> dan <strong>f = −2i + 3j</strong>. Cari e + f.',
      answer: '2i + 4j',
      hint: 'Tambah komponen termasuk tanda negatif: (4-2)i dan (1+3)j.',
      steps: [
        'Vektor pertama: <strong>e = 4i + 1j</strong>',
        'Vektor kedua: <strong>f = −2i + 3j</strong>',
        'Tambah komponen i: 4 + (−2) = 2',
        'Tambah komponen j: 1 + 3 = 4',
        'Hasil: <strong>e + f = 2i + 4j</strong>'
      ],
      solution: '<strong>e + f = 2i + 4j</strong>'
    }
  ];

  // Exercises for Geometry Route (Laluan Rajah ABCD)
  const geometryExercises = [
    {
      title: 'Laluan DB - Set 1',
      question: 'Dalam segi empat selari ABCD: <strong>AB = 3p</strong>, <strong>AD = 2q</strong>. Cari vektor <strong>DB</strong>.',
      answer: '-2q + 3p',
      hint: 'DB = DA + AB. Ingat: DA adalah negatif AD.',
      steps: [
        'Diberi: AB = 3p, AD = 2q',
        'DA = −AD = −2q',
        'Gunakan hukum segitiga: DB = DA + AB',
        'DB = −2q + 3p'
      ],
      solution: '<strong>DB = −2q + 3p</strong>'
    },
    {
      title: 'Laluan AC - Set 1',
      question: 'Dalam segi empat selari ABCD: <strong>AB = 5q</strong>, <strong>AD = 3p</strong>. Cari vektor <strong>AC</strong>.',
      answer: '3p + 5q',
      hint: 'AC = AD + DC, dan DC = AB kerana sisi selari.',
      steps: [
        'Diberi: AB = 5q, AD = 3p',
        'DC = AB = 5q (sisi selari sama)',
        'AC = AD + DC = 3p + 5q',
        'AC = 3p + 5q'
      ],
      solution: '<strong>AC = 3p + 5q</strong>'
    },
    {
      title: 'Laluan CD - Set 2',
      question: 'Dalam segi empat selari ABCD: <strong>AB = 2r</strong>, <strong>AD = 4s</strong>. Cari vektor <strong>CD</strong>.',
      answer: '-2r',
      hint: 'CD adalah sisi selari dengan BA (berlawanan arah AB).',
      steps: [
        'Diberi: AB = 2r, AD = 4s',
        'CD = −AB (sisi selari, arah berlawanan)',
        'CD = −2r'
      ],
      solution: '<strong>CD = −2r</strong>'
    }
  ];

  // Exercises for Unit Vector (Vektor Unit)
  const unitVectorExercises = [
    {
      title: 'Vektor Unit - Pythagoras 3-4-5',
      question: 'Cari vektor unit dalam arah <strong>u = 3i + 4j</strong>. Bundarkan ke 2 tempat perpuluhan.',
      answer: '0.60i + 0.80j',
      hint: 'Vektor unit = u / |u|. Gunakan Pythagoras: |u| = √(3² + 4²) = 5.',
      steps: [
        'Vektor: <strong>u = 3i + 4j</strong>',
        'Cari magnitud menggunakan Pythagoras: |u| = √(3² + 4²) = √25 = 5',
        'Vektor unit: ê = u/|u| = (3i + 4j)/5',
        'Hasil: 0.60i + 0.80j'
      ],
      solution: '<strong>ê = 0.60i + 0.80j</strong>'
    },
    {
      title: 'Vektor Unit - Pythagoras 6-8-10',
      question: 'Cari vektor unit dalam arah <strong>v = 6i − 8j</strong>. Bundarkan ke 2 tempat perpuluhan.',
      answer: '0.60i − 0.80j',
      hint: '|v| = √(36 + 64) = √100 = 10. Perhatian: j-komponen negatif.',
      steps: [
        'Vektor: <strong>v = 6i − 8j</strong>',
        'Cari magnitud: |v| = √(6² + (−8)²) = √100 = 10',
        'Vektor unit: ê = v/|v| = (6i − 8j)/10',
        'Hasil: 0.60i − 0.80j'
      ],
      solution: '<strong>ê = 0.60i − 0.80j</strong>'
    },
    {
      title: 'Vektor Unit - Pythagoras 5-12-13',
      question: 'Cari vektor unit dalam arah <strong>w = −5i + 12j</strong>. Bundarkan ke 4 tempat perpuluhan.',
      answer: '-0.3846i + 0.9231j',
      hint: '|w| = √(25 + 144) = √169 = 13. Perhatian: i-komponen negatif.',
      steps: [
        'Vektor: <strong>w = −5i + 12j</strong>',
        'Cari magnitud: |w| = √((−5)² + 12²) = √169 = 13',
        'Vektor unit: ê = w/|w| = (−5i + 12j)/13',
        'Hasil: −0.3846i + 0.9231j'
      ],
      solution: '<strong>ê = −0.3846i + 0.9231j</strong>'
    }
  ];

  const solutionWithFinalAnswer = (stepsList, finalAnswer) => {
    const stepsHTML = `<div class="solution-steps"><ol>${stepsList.map(item => `<li>${item}</li>`).join('')}</ol></div>`;
    const answerHTML = `<div class="solution-final-answer"><strong>Final Answer:</strong> ${finalAnswer}</div>`;
    return stepsHTML + answerHTML;
  };

  const createCarousel = (containerId, exercises, title, conceptId = null) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    let currentIndex = 0;
    let answered = new Set();

    // Initialize progress display
    if (conceptId) {
      updateProgressDisplay(conceptId, -1, exercises.length);
    }

    const renderExercise = () => {
      const ex = exercises[currentIndex];
      const isAnswered = answered.has(currentIndex);

      container.innerHTML = `
        <div class="carousel-header">
          <h3 class="carousel-title">${title}</h3>
          <div class="carousel-progress">
            Soalan <span>${currentIndex + 1}</span>/${exercises.length}
          </div>
        </div>
        <div class="exercise-card">
          <div class="exercise-question">${ex.question}</div>
          <div class="exercise-input-group">
            <label for="answer-${containerId}">Jawapan anda:</label>
            <input
              type="text"
              id="answer-${containerId}"
              placeholder="Masukkan jawapan"
              ${isAnswered ? 'disabled' : ''}
            >
          </div>
          <div class="exercise-actions">
            <button class="exercise-btn primary" onclick="ExerciseCarousel.checkAnswer('${containerId}', ${currentIndex})">Semak Jawapan</button>
            <button class="exercise-btn" onclick="ExerciseCarousel.showHint('${containerId}', ${currentIndex})">Petunjuk</button>
            <button class="exercise-btn" onclick="ExerciseCarousel.showSolution('${containerId}', ${currentIndex})">Penyelesaian</button>
          </div>
          <div class="exercise-feedback" id="feedback-${containerId}"></div>
          <div class="exercise-hint" id="hint-${containerId}"><strong>💡 Petunjuk:</strong> ${ex.hint}</div>
          <div class="exercise-solution" id="solution-${containerId}"></div>
        </div>
        <div class="carousel-nav">
          <button onclick="ExerciseCarousel.prevExercise('${containerId}')" ${currentIndex === 0 ? 'disabled' : ''}>← Sebelumnya</button>
          <button onclick="ExerciseCarousel.nextExercise('${containerId}')" ${currentIndex === exercises.length - 1 ? 'disabled' : ''}>Seterusnya →</button>
        </div>
      `;
    };

    window.ExerciseCarousel = window.ExerciseCarousel || {};

    window.ExerciseCarousel.checkAnswer = (id, index) => {
      const input = document.getElementById(`answer-${id}`);
      const feedback = document.getElementById(`feedback-${id}`);
      const hintEl = document.getElementById(`hint-${id}`);
      const solutionEl = document.getElementById(`solution-${id}`);
      const userAnswer = input.value.trim().toLowerCase().replace(/\s+/g, '');
      const correctAnswer = exercises[index].answer.toLowerCase().replace(/\s+/g, '');

      answered.add(index);
      input.disabled = true;

      if (userAnswer === correctAnswer) {
        feedback.className = 'exercise-feedback show correct';
        feedback.textContent = '✓ Betul! Jawapan anda adalah tepat.';
      } else {
        feedback.className = 'exercise-feedback show incorrect';
        feedback.textContent = `✗ Kurang tepat. Jawapan yang betul ialah: ${exercises[index].answer}`;
      }

      if (hintEl) hintEl.classList.remove('show');
      if (solutionEl) solutionEl.classList.remove('show');

      // Update progress if conceptId is set
      if (conceptId) {
        updateProgressDisplay(conceptId, index, exercises.length);
      }
    };

    window.ExerciseCarousel.showHint = (id, index) => {
      const hintEl = document.getElementById(`hint-${id}`);
      if (hintEl) hintEl.classList.toggle('show');
    };

    window.ExerciseCarousel.showSolution = (id, index) => {
      const solutionDiv = document.getElementById(`solution-${id}`);
      const ex = exercises[index];
      solutionDiv.innerHTML = solutionWithFinalAnswer(ex.steps, ex.solution);
      solutionDiv.classList.toggle('show');
    };

    window.ExerciseCarousel.nextExercise = (id) => {
      if (currentIndex < exercises.length - 1) {
        currentIndex++;
        renderExercise();
      }
    };

    window.ExerciseCarousel.prevExercise = (id) => {
      if (currentIndex > 0) {
        currentIndex--;
        renderExercise();
      }
    };

    renderExercise();
  };

  // Practice exercises (for Practice tab) - different questions with same patterns
  const practiceScalarExercises = [
    {
      title: 'Pendaraban Skalar - Set Praktis 1',
      question: 'Jika <strong>m = 3i + 2j</strong>, cari <strong>3m</strong>.',
      answer: '9i + 6j',
      hint: 'Darabkan setiap komponen dengan 3.',
      steps: ['Vektor asal: <strong>m = 3i + 2j</strong>', 'Darabkan i: 3 × 3 = 9', 'Darabkan j: 3 × 2 = 6', 'Hasil: <strong>3m = 9i + 6j</strong>'],
      solution: '<strong>3m = 9i + 6j</strong>'
    },
    {
      title: 'Pendaraban Skalar - Set Praktis 2',
      question: 'Jika <strong>n = 5i − 4j</strong>, cari <strong>−2n</strong>.',
      answer: '-10i + 8j',
      hint: 'Darabkan dengan -2 menukar arah dan memperbesar magnitud.',
      steps: ['Vektor asal: <strong>n = 5i − 4j</strong>', 'Darabkan i: −2 × 5 = −10', 'Darabkan j: −2 × (−4) = +8', 'Hasil: <strong>−2n = −10i + 8j</strong>'],
      solution: '<strong>−2n = −10i + 8j</strong>'
    },
    {
      title: 'Pendaraban Skalar - Set Praktis 3',
      question: 'Jika <strong>p = 6i + 10j</strong>, cari <strong>⅕p</strong>.',
      answer: '1.2i + 2j',
      hint: 'Darabkan dengan ⅕ (bahagi dengan 5).',
      steps: ['Vektor asal: <strong>p = 6i + 10j</strong>', 'Darabkan i: ⅕ × 6 = 1.2', 'Darabkan j: ⅕ × 10 = 2', 'Hasil: <strong>⅕p = 1.2i + 2j</strong>'],
      solution: '<strong>⅕p = 1.2i + 2j</strong>'
    }
  ];

  const practiceComponentExercises = [
    {
      title: 'Komponen - Set Praktis 1',
      question: 'Titik C berada pada koordinat (8, 5). Tulis vektor OC dalam bentuk <strong>xi + yj</strong>.',
      answer: '8i + 5j',
      hint: 'Ambil koordinat titik sebagai komponen.',
      steps: ['Koordinat C: (8, 5)', 'Komponen i: 8', 'Komponen j: 5', 'Vektor OC = 8i + 5j'],
      solution: '<strong>OC = 8i + 5j</strong>'
    },
    {
      title: 'Magnitud - Set Praktis 1',
      question: 'Cari magnitud vektor <strong>e = 8i + 15j</strong>. Bundarkan ke 2 tempat perpuluhan.',
      answer: '17.00',
      hint: '|e| = √(8² + 15²) = √(64 + 225) = √289 = 17.',
      steps: ['Vektor: <strong>e = 8i + 15j</strong>', 'Formula: |e| = √(x² + y²)', '|e| = √(8² + 15²) = √289 = 17.00'],
      solution: '<strong>|e| = 17.00</strong>'
    },
    {
      title: 'Sudut Arah - Set Praktis 1',
      question: 'Vektor <strong>f = 3i + 3j</strong> membuat sudut berapakah dengan paksi-x positif?',
      answer: '45',
      hint: 'tan(θ) = 3/3 = 1, jadi θ = 45°.',
      steps: ['Vektor: <strong>f = 3i + 3j</strong>', 'tan(θ) = y/x = 3/3 = 1', 'θ = 45°'],
      solution: '<strong>θ = 45°</strong>'
    }
  ];

  const practiceAdditionExercises = [
    {
      title: 'Penambahan - Set Praktis 1',
      question: 'Tambah <strong>g = 3i + 4j</strong> dan <strong>h = 2i + 5j</strong>. Cari g + h.',
      answer: '5i + 9j',
      hint: 'Tambah komponen yang sama.',
      steps: ['Vektor g: <strong>3i + 4j</strong>', 'Vektor h: <strong>2i + 5j</strong>', 'i: 3 + 2 = 5', 'j: 4 + 5 = 9', 'g + h = 5i + 9j'],
      solution: '<strong>g + h = 5i + 9j</strong>'
    },
    {
      title: 'Pengurangan - Set Praktis 1',
      question: 'Tolak: <strong>i = 8i + 9j</strong> dan <strong>j = 3i + 2j</strong>. Cari i − j.',
      answer: '5i + 7j',
      hint: 'Tolak komponen yang sama.',
      steps: ['Vektor i: <strong>8i + 9j</strong>', 'Vektor j: <strong>3i + 2j</strong>', 'i: 8 − 3 = 5', 'j: 9 − 2 = 7', 'i − j = 5i + 7j'],
      solution: '<strong>i − j = 5i + 7j</strong>'
    }
  ];

  const practiceUnitVectorExercises = [
    {
      title: 'Vektor Unit - Set Praktis 1',
      question: 'Cari vektor unit dalam arah <strong>k = 5i + 12j</strong>. Bundarkan ke 2 tempat perpuluhan.',
      answer: '0.38i + 0.92j',
      hint: '|k| = √(25 + 144) = 13. Vektor unit = k/|k|.',
      steps: ['Vektor: <strong>k = 5i + 12j</strong>', 'Magnitud: |k| = √(5² + 12²) = √169 = 13', 'Vektor unit: 5i/13 + 12j/13 = 0.38i + 0.92j'],
      solution: '<strong>ê = 0.38i + 0.92j</strong>'
    },
    {
      title: 'Vektor Unit - Set Praktis 2',
      question: 'Cari vektor unit dalam arah <strong>l = 12i − 9j</strong>. Bundarkan ke 2 tempat perpuluhan.',
      answer: '0.80i − 0.60j',
      hint: '|l| = √(144 + 81) = √225 = 15.',
      steps: ['Vektor: <strong>l = 12i − 9j</strong>', 'Magnitud: |l| = √(12² + 9²) = 15', 'Vektor unit: 12i/15 − 9j/15 = 0.80i − 0.60j'],
      solution: '<strong>ê = 0.80i − 0.60j</strong>'
    }
  ];

  const practiceGeometryExercises = [
    {
      title: 'Laluan Praktis - DB',
      question: 'Dalam segi empat selari EFGH: <strong>EF = 4p</strong>, <strong>EH = 3q</strong>. Cari vektor <strong>GB</strong>.',
      answer: '-3q + 4p',
      hint: 'Gunakan hukum segitiga: GB = GH + HB, dimana HB = EF.',
      steps: ['Diberi: EF = 4p, EH = 3q', 'HE = −3q', 'GB = GH + HB = HE + EF = −3q + 4p'],
      solution: '<strong>GB = −3q + 4p</strong>'
    },
    {
      title: 'Laluan Praktis - AC',
      question: 'Dalam segi empat selari IJKL: <strong>IJ = 6q</strong>, <strong>IL = 2p</strong>. Cari vektor <strong>IK</strong>.',
      answer: '2p + 6q',
      hint: 'IK = IL + LK, dan LK = IJ kerana sisi selari sama.',
      steps: ['Diberi: IJ = 6q, IL = 2p', 'LK = IJ = 6q', 'IK = IL + LK = 2p + 6q'],
      solution: '<strong>IK = 2p + 6q</strong>'
    }
  ];

  return {
    init: () => {
      createCarousel('scalar-exercises', scalarExercises, 'Pendaraban Skalar · 3 Soalan', 'concept1');
      createCarousel('component-exercises', componentExercises, 'Komponen Cartes · 6 Soalan', 'concept2');
      createCarousel('addition-exercises', additionExercises, 'Tambah dan Tolak · 5 Soalan', 'concept3');
      createCarousel('geometry-exercises', geometryExercises, 'Laluan Rajah ABCD · 3 Soalan', 'concept3');
      createCarousel('unit-vector-exercises', unitVectorExercises, 'Vektor Unit · 3 Soalan', 'concept2');
    },
    updateProgress: updateProgressDisplay,
    getProgress: () => progressState
  };
})();

// Combination/Mixed Exercises for Extra Practice
const combinationExercises = [
  {
    title: 'Gabungan: Skalar dan Komponen',
    question: 'Jika vektor <strong>x = 2i + 3j</strong>, cari <strong>2x</strong> dan kemudian cari magnitud vektor tersebut. Bundarkan ke 2 tempat perpuluhan.',
    answer: '5 × √13 atau 18.03',
    hint: '1. Cari 2x = 4i + 6j. 2. Cari |2x| = √(16 + 36) = √52 ≈ 7.21. Atau langsung: |2x| = 2|x| = 2√13.',
    steps: ['Vektor asal: <strong>x = 2i + 3j</strong>', 'Darabkan dengan 2: <strong>2x = 4i + 6j</strong>', 'Cari magnitud: |2x| = √(4² + 6²) = √(16 + 36) = √52', 'Hasil: √52 = 2√13 ≈ 7.21'],
    solution: '<strong>|2x| = 2√13 atau 7.21</strong>'
  },
  {
    title: 'Gabungan: Penambahan dan Unit Vektor',
    question: 'Diberi <strong>u = 3i + 4j</strong> dan <strong>v = 5i + 12j</strong>. Cari u + v, kemudian cari vektor unit dalam arah u + v. Bundarkan ke 2 tempat perpuluhan.',
    answer: '0.62i + 0.78j',
    hint: '1. u + v = 8i + 16j. 2. |u + v| = √(64 + 256) = √320 ≈ 17.89. 3. Unit vector = (8i + 16j)/17.89',
    steps: ['Vektor u: <strong>3i + 4j</strong>', 'Vektor v: <strong>5i + 12j</strong>', 'Jumlah: u + v = 8i + 16j', 'Magnitud: |u + v| = √(8² + 16²) = √320 ≈ 17.89', 'Unit vektor: (8i + 16j) / 17.89 ≈ 0.45i + 0.89j'],
    solution: '<strong>ê ≈ 0.45i + 0.89j</strong>'
  },
  {
    title: 'Gabungan: Laluan dan Pendaraban',
    question: 'Dalam segi empat selari PQRS: <strong>PQ = 2i + j</strong>, <strong>PS = i + 2j</strong>. Cari <strong>PR</strong> dan kemudian cari <strong>2PR</strong>.',
    answer: '6i + 6j',
    hint: 'PR = PQ + PS = 3i + 3j. Kemudian 2PR = 6i + 6j.',
    steps: ['Sisi PQ: <strong>2i + j</strong>', 'Sisi PS: <strong>i + 2j</strong>', 'Diagonal PR = PQ + PS = 3i + 3j', 'Pendaraban: 2PR = 2(3i + 3j) = 6i + 6j'],
    solution: '<strong>2PR = 6i + 6j</strong>'
  },
  {
    title: 'Gabungan: Komponen dan Laluan',
    question: 'Titik A(3, 4), B(7, 2), C(5, 8). Cari vektor AB, kemudian cari magnitud AB.',
    answer: '4.47',
    hint: 'AB = OB - OA = (7i + 2j) - (3i + 4j) = 4i - 2j. |AB| = √(16 + 4) = √20 ≈ 4.47',
    steps: ['Titik A: (3, 4) → OA = 3i + 4j', 'Titik B: (7, 2) → OB = 7i + 2j', 'Vektor AB = OB - OA = 4i - 2j', 'Magnitud: |AB| = √(4² + (-2)²) = √20 ≈ 4.47'],
    solution: '<strong>|AB| = √20 atau 4.47</strong>'
  },
  {
    title: 'Gabungan: Skalar dan Unit Vektor',
    question: 'Jika <strong>m = 2i + 3j</strong>, cari <strong>3m</strong> dan kemudian cari vektor unit dalam arah 3m.',
    answer: '0.56i + 0.83j',
    hint: '3m = 6i + 9j. |3m| = √(36 + 81) = √117 ≈ 10.82. Unit vektor = (6i + 9j) / 10.82',
    steps: ['Vektor m: <strong>2i + 3j</strong>', 'Pendaraban: 3m = 6i + 9j', 'Magnitud: |3m| = √(36 + 81) = √117 ≈ 10.82', 'Unit vektor: (6i + 9j) / 10.82 ≈ 0.55i + 0.83j'],
    solution: '<strong>ê ≈ 0.55i + 0.83j</strong>'
  }
];

// Export practice exercises organized by tab
window.PracticeExercises = {
  // Tab 1: Scalar & Vector - Scalar multiplication practice
  concept1: [
    { title: 'Pendaraban Skalar - Set Praktis 1', question: 'Jika <strong>m = 3i + 2j</strong>, cari <strong>3m</strong>.', answer: '9i + 6j', hint: 'Darabkan setiap komponen dengan 3.', steps: ['Vektor asal: <strong>m = 3i + 2j</strong>', 'Darabkan i: 3 × 3 = 9', 'Darabkan j: 3 × 2 = 6', 'Hasil: <strong>3m = 9i + 6j</strong>'], solution: '<strong>3m = 9i + 6j</strong>' },
    { title: 'Pendaraban Skalar - Set Praktis 2', question: 'Jika <strong>n = 5i − 4j</strong>, cari <strong>−2n</strong>.', answer: '-10i + 8j', hint: 'Darabkan dengan -2 menukar arah dan memperbesar magnitud.', steps: ['Vektor asal: <strong>n = 5i − 4j</strong>', 'Darabkan i: −2 × 5 = −10', 'Darabkan j: −2 × (−4) = +8', 'Hasil: <strong>−2n = −10i + 8j</strong>'], solution: '<strong>−2n = −10i + 8j</strong>' },
    { title: 'Pendaraban Skalar - Set Praktis 3', question: 'Jika <strong>p = 6i + 10j</strong>, cari <strong>⅕p</strong>.', answer: '1.2i + 2j', hint: 'Darabkan dengan ⅕ (bahagi dengan 5).', steps: ['Vektor asal: <strong>p = 6i + 10j</strong>', 'Darabkan i: ⅕ × 6 = 1.2', 'Darabkan j: ⅕ × 10 = 2', 'Hasil: <strong>⅕p = 1.2i + 2j</strong>'], solution: '<strong>⅕p = 1.2i + 2j</strong>' }
  ],

  // Tab 2: Component Form - Component and unit vector practice
  concept2: [
    { title: 'Komponen - Set Praktis 1', question: 'Titik C berada pada koordinat (8, 5). Tulis vektor OC dalam bentuk <strong>xi + yj</strong>.', answer: '8i + 5j', hint: 'Ambil koordinat titik sebagai komponen.', steps: ['Koordinat C: (8, 5)', 'Komponen i: 8', 'Komponen j: 5', 'Vektor OC = 8i + 5j'], solution: '<strong>OC = 8i + 5j</strong>' },
    { title: 'Magnitud - Set Praktis 1', question: 'Cari magnitud vektor <strong>e = 8i + 15j</strong>. Bundarkan ke 2 tempat perpuluhan.', answer: '17.00', hint: '|e| = √(8² + 15²) = √(64 + 225) = √289 = 17.', steps: ['Vektor: <strong>e = 8i + 15j</strong>', 'Formula: |e| = √(x² + y²)', '|e| = √(8² + 15²) = √289 = 17.00'], solution: '<strong>|e| = 17.00</strong>' },
    { title: 'Sudut Arah - Set Praktis 1', question: 'Vektor <strong>f = 3i + 3j</strong> membuat sudut berapakah dengan paksi-x positif?', answer: '45', hint: 'tan(θ) = 3/3 = 1, jadi θ = 45°.', steps: ['Vektor: <strong>f = 3i + 3j</strong>', 'tan(θ) = y/x = 3/3 = 1', 'θ = 45°'], solution: '<strong>θ = 45°</strong>' },
    { title: 'Vektor Unit - Set Praktis 1', question: 'Cari vektor unit dalam arah <strong>k = 5i + 12j</strong>. Bundarkan ke 2 tempat perpuluhan.', answer: '0.38i + 0.92j', hint: '|k| = √(25 + 144) = 13. Vektor unit = k/|k|.', steps: ['Vektor: <strong>k = 5i + 12j</strong>', 'Magnitud: |k| = √(5² + 12²) = √169 = 13', 'Vektor unit: 5i/13 + 12j/13 = 0.38i + 0.92j'], solution: '<strong>ê = 0.38i + 0.92j</strong>' },
    { title: 'Vektor Unit - Set Praktis 2', question: 'Cari vektor unit dalam arah <strong>l = 12i − 9j</strong>. Bundarkan ke 2 tempat perpuluhan.', answer: '0.80i − 0.60j', hint: '|l| = √(144 + 81) = √225 = 15.', steps: ['Vektor: <strong>l = 12i − 9j</strong>', 'Magnitud: |l| = √(12² + 9²) = 15', 'Vektor unit: 12i/15 − 9j/15 = 0.80i − 0.60j'], solution: '<strong>ê = 0.80i − 0.60j</strong>' }
  ],

  // Tab 3: Addition - Addition, subtraction and geometry practice
  concept3: [
    { title: 'Penambahan - Set Praktis 1', question: 'Tambah <strong>g = 3i + 4j</strong> dan <strong>h = 2i + 5j</strong>. Cari g + h.', answer: '5i + 9j', hint: 'Tambah komponen yang sama.', steps: ['Vektor g: <strong>3i + 4j</strong>', 'Vektor h: <strong>2i + 5j</strong>', 'i: 3 + 2 = 5', 'j: 4 + 5 = 9', 'g + h = 5i + 9j'], solution: '<strong>g + h = 5i + 9j</strong>' },
    { title: 'Pengurangan - Set Praktis 1', question: 'Tolak: <strong>i = 8i + 9j</strong> dan <strong>j = 3i + 2j</strong>. Cari i − j.', answer: '5i + 7j', hint: 'Tolak komponen yang sama.', steps: ['Vektor i: <strong>8i + 9j</strong>', 'Vektor j: <strong>3i + 2j</strong>', 'i: 8 − 3 = 5', 'j: 9 − 2 = 7', 'i − j = 5i + 7j'], solution: '<strong>i − j = 5i + 7j</strong>' },
    { title: 'Penambahan Negatif - Set Praktis 1', question: 'Tambah <strong>k = 6i + 2j</strong> dan <strong>l = −3i + 4j</strong>. Cari k + l.', answer: '3i + 6j', hint: 'Tambah dengan tanda: (6-3)i dan (2+4)j.', steps: ['Vektor k: <strong>6i + 2j</strong>', 'Vektor l: <strong>−3i + 4j</strong>', 'i: 6 + (−3) = 3', 'j: 2 + 4 = 6', 'k + l = 3i + 6j'], solution: '<strong>k + l = 3i + 6j</strong>' },
    { title: 'Laluan Praktis - DB', question: 'Dalam segi empat selari EFGH: <strong>EF = 4p</strong>, <strong>EH = 3q</strong>. Cari vektor <strong>GB</strong>.', answer: '-3q + 4p', hint: 'Gunakan hukum segitiga: GB = GH + HB, dimana HB = EF.', steps: ['Diberi: EF = 4p, EH = 3q', 'HE = −3q', 'GB = GH + HB = HE + EF = −3q + 4p'], solution: '<strong>GB = −3q + 4p</strong>' },
    { title: 'Laluan Praktis - AC', question: 'Dalam segi empat selari IJKL: <strong>IJ = 6q</strong>, <strong>IL = 2p</strong>. Cari vektor <strong>IK</strong>.', answer: '2p + 6q', hint: 'IK = IL + LK, dan LK = IJ kerana sisi selari sama.', steps: ['Diberi: IJ = 6q, IL = 2p', 'LK = IJ = 6q', 'IK = IL + LK = 2p + 6q'], solution: '<strong>IK = 2p + 6q</strong>' }
  ],

  // Extra/Advanced combination exercises
  combination: combinationExercises,

  // Legacy aliases for backward compatibility with Practice tab
  scalar: [],
  component: [],
  addition: [],
  unitvector: [],
  geometry: []
};

// Initialize carousels when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  ExerciseCarousel.init();
});
