/* Interactive Exercise Carousel System */
const ExerciseCarousel = (() => {
  const m = VectorMath.math;
  const n = value => String(Number(Number(value).toFixed(4)));
  const vec = (x, y) => `${n(x)}i ${y < 0 ? '−' : '+'} ${n(Math.abs(y))}j`;

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
      title: 'Titik ke Bentuk Komponen',
      question: 'Titik P berada pada koordinat (5, 2). Tulis vektor OP dalam bentuk <strong>xi + yj</strong>.',
      answer: '5i + 2j',
      hint: 'Vektor dari asalan O ke titik P(5, 2) ialah: 5 unit ke kanan dan 2 unit ke atas.',
      steps: [
        'Koordinat titik: P(5, 2)',
        'Komponen x (mendatar): 5',
        'Komponen y (menegak): 2',
        'Vektor OP = 5i + 2j'
      ],
      solution: '<strong>OP = 5i + 2j</strong>'
    },
    {
      title: 'Magnitud Vektor Komponen',
      question: 'Cari magnitud vektor <strong>v = 3i + 4j</strong>. Bundarkan ke 2 tempat perpuluhan.',
      answer: '5.00',
      hint: '|v| = √(x² + y²) = √(3² + 4²) = √(9 + 16) = √25 = 5',
      steps: [
        'Vektor: <strong>v = 3i + 4j</strong>',
        'Gunakan formula Pythagoras: |v| = √(x² + y²)',
        'Gantikan: |v| = √(3² + 4²)',
        '|v| = √(9 + 16) = √25 = 5.00'
      ],
      solution: '<strong>|v| = 5.00</strong>'
    },
    {
      title: 'Sudut Arah Komponen',
      question: 'Vektor <strong>w = 1i + 1j</strong> membuat sudut berapakah dengan paksi-x positif?',
      answer: '45',
      hint: 'Tan(θ) = y/x = 1/1 = 1. Jadi θ = 45°.',
      steps: [
        'Vektor: <strong>w = 1i + 1j</strong> jadi x = 1, y = 1',
        'Cari sudut: tan(θ) = y/x = 1/1 = 1',
        'θ = arctan(1) = 45°',
        'Vektor membuat sudut <strong>45°</strong> dengan paksi-x'
      ],
      solution: '<strong>45°</strong>'
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

  const solutionWithFinalAnswer = (stepsList, finalAnswer) => {
    const stepsHTML = `<div class="solution-steps"><ol>${stepsList.map(item => `<li>${item}</li>`).join('')}</ol></div>`;
    const answerHTML = `<div class="solution-final-answer"><strong>Final Answer:</strong> ${finalAnswer}</div>`;
    return stepsHTML + answerHTML;
  };

  const createCarousel = (containerId, exercises, title) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    let currentIndex = 0;
    let answered = new Set();

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

      document.querySelector(`#${id} .exercise-hint`).classList.remove('show');
      document.querySelector(`#${id} .exercise-solution`).classList.remove('show');
    };

    window.ExerciseCarousel.showHint = (id, index) => {
      document.getElementById(`hint-${id}`).classList.toggle('show');
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

  return {
    init: () => {
      createCarousel('scalar-exercises', scalarExercises, 'Pendaraban Skalar · 3 Soalan');
      createCarousel('component-exercises', componentExercises, 'Komponen Cartes · 6 Soalan');
      createCarousel('addition-exercises', additionExercises, 'Tambah dan Tolak · 5 Soalan');
    }
  };
})();

// Initialize carousels when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  ExerciseCarousel.init();
});
