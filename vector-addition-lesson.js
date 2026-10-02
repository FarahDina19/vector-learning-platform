/* Focused Malay practice for the vector addition lesson. */
(() => {
  const questions = [
    {
      level: 'Asas',
      prompt: 'Diberi A = (2, 3) dan B = (4, −1). Cari A + B.',
      answer: [6, 2],
      steps: ['Komponen pertama: 2 + 4 = 6.', 'Komponen kedua: 3 + (−1) = 2.']
    },
    {
      level: 'Asas',
      prompt: 'Diberi P = (−3, 5) dan Q = (2, −4). Cari P + Q.',
      answer: [-1, 1],
      steps: ['Komponen pertama: −3 + 2 = −1.', 'Komponen kedua: 5 + (−4) = 1.']
    },
    {
      level: 'Sederhana',
      prompt: 'Diberi A = 3i + 4j dan B = 2i − j. Nyatakan A + B sebagai pasangan tertib.',
      answer: [5, 3],
      steps: ['Komponen i: 3 + 2 = 5.', 'Komponen j: 4 + (−1) = 3.']
    },
    {
      level: 'Sederhana',
      prompt: 'Dalam rajah hujung-ke-pangkal, A = (2, −1) dan B = (−3, 4). Cari resultan R = A + B.',
      answer: [-1, 3],
      steps: ['Komponen mengufuk: 2 + (−3) = −1.', 'Komponen menegak: −1 + 4 = 3.', 'R bermula di pangkal A dan berakhir di hujung B.']
    },
    {
      level: 'KBAT / bercampur bentuk',
      prompt: 'Tiga gerakan berturutan ialah A = (4, 2), B = (−1, 3) dan C = (2, −2). Cari jumlah gerakan A + B + C.',
      answer: [5, 3],
      steps: ['Jumlah komponen pertama: 4 + (−1) + 2 = 5.', 'Jumlah komponen kedua: 2 + 3 + (−2) = 3.', 'Resultan keseluruhan ialah (5, 3).']
    },
    {
      level: 'KBAT / bercampur bentuk',
      prompt: 'A = 2i + 3j dan B = −i + 4j. Cari resultan A + B dalam bentuk i-j.',
      answer: [1, 7],
      steps: ['Kumpulkan komponen i: 2i + (−i) = i.', 'Kumpulkan komponen j: 3j + 4j = 7j.', 'Maka A + B = i + 7j, iaitu pasangan tertib (1, 7).']
    }
  ];

  const container = document.getElementById('addition-quiz-list');
  if (!container) return;

  const make = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };

  questions.forEach((question, index) => {
    const card = make('article', 'addition-question');
    card.dataset.level = question.level.startsWith('Asas') ? 'asas' : question.level.startsWith('Sederhana') ? 'sederhana' : 'kbat';

    const heading = make('h5');
    heading.append(document.createTextNode(`Soalan ${index + 1}`), make('span', 'addition-level', question.level));
    card.append(heading, make('p', 'addition-question-prompt', question.prompt));

    const fields = make('div', 'addition-answer-fields');
    ['i', 'j'].forEach((component, componentIndex) => {
      const id = `addition-answer-${index + 1}-${component}`;
      const label = make('label', '', `Komponen ${component}`);
      const input = document.createElement('input');
      input.id = id;
      input.type = 'number';
      input.step = 'any';
      input.inputMode = 'decimal';
      input.dataset.component = component;
      input.setAttribute('aria-label', `Soalan ${index + 1}, komponen ${component}`);
      label.htmlFor = id;
      label.append(input);
      fields.append(label);
    });
    card.append(fields);

    const check = make('button', '', 'Semak jawapan');
    check.type = 'button';
    const reset = make('button', '', 'Kosongkan');
    reset.type = 'button';
    card.append(check, reset);

    const feedback = make('div', 'addition-question-feedback');
    feedback.hidden = true;
    feedback.setAttribute('aria-live', 'polite');
    feedback.setAttribute('role', 'status');
    card.append(feedback);

    const inputs = [...fields.querySelectorAll('input')];
    check.addEventListener('click', () => {
      if (inputs.some(input => input.value.trim() === '' || !Number.isFinite(Number(input.value)))) {
        feedback.dataset.state = 'incomplete';
        feedback.textContent = 'Lengkapkan kedua-dua komponen dengan nombor sebelum menyemak.';
        feedback.hidden = false;
        return;
      }

      const actual = inputs.map(input => Number(input.value));
      const correct = actual.every((value, componentIndex) => Math.abs(value - question.answer[componentIndex]) < 1e-9);
      feedback.dataset.state = correct ? 'correct' : 'wrong';
      feedback.replaceChildren(make('strong', '', correct ? 'Betul! ' : 'Belum tepat. '));
      feedback.append(document.createTextNode(`Jawapan: (${question.answer[0]}, ${question.answer[1]}). `));
      const explanation = make('ol');
      question.steps.forEach(step => explanation.append(make('li', '', step)));
      feedback.append(explanation);
      feedback.hidden = false;
    });

    reset.addEventListener('click', () => {
      inputs.forEach(input => { input.value = ''; });
      feedback.hidden = true;
      feedback.removeAttribute('data-state');
      feedback.replaceChildren();
    });

    inputs.forEach(input => input.addEventListener('input', () => {
      feedback.hidden = true;
      feedback.removeAttribute('data-state');
      feedback.replaceChildren();
    }));
    container.append(card);
  });
})();
