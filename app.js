// app.js - simple quiz with instant feedback

document.addEventListener('DOMContentLoaded', function () {
  // default question set
  const questions = [
    {
      question: "Which of these is NOT a JavaScript primitive type?",
      choices: ["String", "Number", "Object", "Boolean"],
      answer: 2,
      explanation: "Object is not a primitive — String, Number and Boolean are primitives."
    },
    {
      question: "Which method adds elements to the end of an array?",
      choices: ["push()", "pop()", "shift()", "unshift()"],
      answer: 0,
      explanation: "push() appends elements to the end and returns the new length."
    },
    {
      question: "What does DOM stand for?",
      choices: ["Document Object Model", "Data Order Model", "Digital Object Map", "Document Oriented Markup"],
      answer: 0,
      explanation: "DOM stands for Document Object Model — the tree representing HTML elements."
    }
  ];

  // state
  let current = 0;
  const userAnswers = new Array(questions.length).fill(null); // store chosen index or null

  // refs
  const qNumber = document.getElementById('qNumber');
  const total = document.getElementById('total');
  const qText = document.getElementById('qText');
  const choicesDiv = document.getElementById('choices');
  const explain = document.getElementById('explain');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const resetBtn = document.getElementById('resetBtn');
  const scoreSpan = document.getElementById('score');

  total.textContent = questions.length;

  function render() {
    const q = questions[current];
    qNumber.textContent = `Question ${current + 1} of ${questions.length}`;
    qText.textContent = q.question;
    choicesDiv.innerHTML = '';
    explain.textContent = '';

    q.choices.forEach((c, idx) => {
      const div = document.createElement('div');
      div.className = 'choice';
      div.textContent = c;
      div.tabIndex = 0;
      div.setAttribute('role', 'button');

      // if already answered, show result styles and lock
      const ua = userAnswers[current];
      if (ua !== null) {
        div.style.pointerEvents = 'none';
        if (idx === q.answer) div.classList.add('correct');
        if (ua === idx && ua !== q.answer) div.classList.add('wrong');
      } else {
        // clickable
        div.addEventListener('click', () => selectAnswer(idx));
        div.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') selectAnswer(idx); });
      }

      choicesDiv.appendChild(div);
    });

    updateButtons();
    updateScore();
  }

  function selectAnswer(choiceIdx) {
    if (userAnswers[current] !== null) return; // already answered
    userAnswers[current] = choiceIdx;

    // show feedback immediately
    const q = questions[current];
    Array.from(choicesDiv.children).forEach((el, idx) => {
      el.style.pointerEvents = 'none';
      if (idx === q.answer) el.classList.add('correct');
      if (idx === userAnswers[current] && userAnswers[current] !== q.answer) el.classList.add('wrong');
    });

    explain.textContent = q.explanation || '';
    updateScore();

    // auto-move to next after small delay (but don't go past last)
    setTimeout(() => {
      if (current < questions.length - 1) {
        current++;
        render();
      }
    }, 650);
  }

  function updateScore() {
    const correctCount = questions.reduce((acc, q, i) => acc + (userAnswers[i] === q.answer ? 1 : 0), 0);
    scoreSpan.textContent = `${correctCount}/${questions.length}`;
  }

  function updateButtons() {
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === questions.length - 1;
  }

  prevBtn.addEventListener('click', () => {
    if (current > 0) {
      current--;
      render();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (current < questions.length - 1) {
      current++;
      render();
    }
  });

  resetBtn.addEventListener('click', () => {
    if (!confirm('Reset quiz? All answers will be cleared.')) return;
    for (let i = 0; i < userAnswers.length; i++) userAnswers[i] = null;
    current = 0;
    render();
  });

  // initial render
  render();
});
