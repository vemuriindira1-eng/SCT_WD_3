const quizData = [
      {
        type: 'single',
        question: 'Which language is mainly used for web styling?',
        options: ['HTML', 'CSS', 'Python', 'Java'],
        answer: 'CSS'
      },
      {
        type: 'multi',
        question: 'Select JavaScript frameworks/libraries.',
        options: ['React', 'Laravel', 'Vue', 'Django'],
        answer: ['React', 'Vue']
      },
      {
        type: 'fill',
        question: 'Fill in the blank: HTML stands for HyperText ______ Language.',
        answer: 'Markup'
      },
      {
        type: 'single',
        question: 'Which company developed JavaScript?',
        options: ['Netscape', 'Google', 'Microsoft', 'Apple'],
        answer: 'Netscape'
      },
      {
        type: 'multi',
        question: 'Which of these are programming languages?',
        options: ['Python', 'HTML', 'Java', 'CSS'],
        answer: ['Python', 'Java']
      }
    ];

    let currentQuestion = 0;
    let userAnswers = [];
    let timeLeft = 60;
    let timer;

    const questionEl = document.getElementById('question');
    const optionsEl = document.getElementById('options');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const questionNumber = document.getElementById('questionNumber');
    const questionType = document.getElementById('questionType');
    const progressBar = document.getElementById('progressBar');

    function startTimer() {
      timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time').innerText = timeLeft;

        if (timeLeft <= 0) {
          clearInterval(timer);
          showResult();
        }
      }, 1000);
    }

    function loadQuestion() {
      const currentQuiz = quizData[currentQuestion];

      questionNumber.innerText = `Question ${currentQuestion + 1} of ${quizData.length}`;

      progressBar.style.width = `${((currentQuestion + 1) / quizData.length) * 100}%`;

      questionEl.innerText = currentQuiz.question;
      optionsEl.innerHTML = '';

      if (currentQuiz.type === 'single') {
        questionType.innerHTML = '🔘 Single Select Question';

        currentQuiz.options.forEach(option => {
          const div = document.createElement('div');
          div.classList.add('option');

          div.innerHTML = `
            <input type="radio" name="option" value="${option}">
            <label>${option}</label>
          `;

          div.addEventListener('click', () => {
            document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
            div.classList.add('selected');
            div.querySelector('input').checked = true;
          });

          optionsEl.appendChild(div);
        });
      }

      else if (currentQuiz.type === 'multi') {
        questionType.innerHTML = '☑️ Multi Select Question';

        currentQuiz.options.forEach(option => {
          const div = document.createElement('div');
          div.classList.add('option');

          div.innerHTML = `
            <input type="checkbox" value="${option}">
            <label>${option}</label>
          `;

          div.addEventListener('click', () => {
            div.classList.toggle('selected');
            const checkbox = div.querySelector('input');
            checkbox.checked = !checkbox.checked;
          });

          optionsEl.appendChild(div);
        });
      }

      else if (currentQuiz.type === 'fill') {
        questionType.innerHTML = '✍️ Fill in the Blank';

        optionsEl.innerHTML = `
          <input type="text" id="fillInput" placeholder="Type your answer here...">
        `;
      }

      prevBtn.style.display = currentQuestion === 0 ? 'none' : 'block';

      nextBtn.innerText = currentQuestion === quizData.length - 1 ? 'Submit Quiz' : 'Next';
    }

    function saveAnswer() {
      const currentQuiz = quizData[currentQuestion];

      if (currentQuiz.type === 'single') {
        const selected = document.querySelector('input[name="option"]:checked');
        userAnswers[currentQuestion] = selected ? selected.value : null;
      }

      else if (currentQuiz.type === 'multi') {
        const checked = [...document.querySelectorAll('input[type="checkbox"]:checked')]
          .map(input => input.value);

        userAnswers[currentQuestion] = checked;
      }

      else if (currentQuiz.type === 'fill') {
        const input = document.getElementById('fillInput').value.trim();
        userAnswers[currentQuestion] = input;
      }
    }

    nextBtn.addEventListener('click', () => {
      saveAnswer();

      if (currentQuestion < quizData.length - 1) {
        currentQuestion++;
        loadQuestion();
      } else {
        clearInterval(timer);
        showResult();
      }
    });

    prevBtn.addEventListener('click', () => {
      saveAnswer();

      if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
      }
    });

    function showResult() {
      document.getElementById('quiz-box').style.display = 'none';
      document.getElementById('resultBox').style.display = 'block';

      let score = 0;
      let reviewHTML = '';

      quizData.forEach((quiz, index) => {
        const userAnswer = userAnswers[index];
        let correct = false;

        if (quiz.type === 'single' || quiz.type === 'fill') {
          correct = String(userAnswer).toLowerCase() === String(quiz.answer).toLowerCase();
        }

        else if (quiz.type === 'multi') {
          correct = JSON.stringify((userAnswer || []).sort()) ===
                    JSON.stringify(quiz.answer.sort());
        }

        if (correct) score++;

        reviewHTML += `
          <div class="review-item">
            <p><strong>Q${index + 1}:</strong> ${quiz.question}</p>
            <p>Your Answer: <span class="${correct ? 'correct' : 'wrong'}">
              ${Array.isArray(userAnswer) ? userAnswer.join(', ') : userAnswer || 'No Answer'}
            </span></p>
            <p>Correct Answer: <span class="correct">
              ${Array.isArray(quiz.answer) ? quiz.answer.join(', ') : quiz.answer}
            </span></p>
          </div>
        `;
      });

      document.getElementById('score').innerText = `You scored ${score} / ${quizData.length}`;

      let message = '';

      if (score === quizData.length) {
        message = '🏆 Excellent! Perfect Score!';
      } else if (score >= 3) {
        message = '👏 Great Job! Keep Learning!';
      } else {
        message = '📚 Practice More and Try Again!';
      }

      document.getElementById('message').innerHTML = `<h3>${message}</h3>`;
      document.getElementById('review').innerHTML = reviewHTML;
    }

    function restartQuiz() {
      currentQuestion = 0;
      userAnswers = [];
      timeLeft = 60;

      document.getElementById('time').innerText = timeLeft;

      document.getElementById('quiz-box').style.display = 'block';
      document.getElementById('resultBox').style.display = 'none';

      clearInterval(timer);
      startTimer();
      loadQuestion();
    }

    startTimer();
    loadQuestion();