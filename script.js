const quizData = [
  {
    question: "What does HTML stand for?",
    choices: [
      "Hyper Text Markup Language",
      "Home Tool Markup Language",
      "Hyperlinks and Text Markup Language",
      "Hyper Transfer Markup Language"
    ],
    correct: "Hyper Text Markup Language"
  },
  {
    question: "Which HTML element do we put JavaScript in?",
    choices: ["<js>", "<script>", "<javascript>", "<code>"],
    correct: "<script>"
  },
  {
    question: "What does CSS stand for?",
    choices: [
      "Creative Style Sheets",
      "Cascading Style Sheets",
      "Computer Style Sheets",
      "Colorful Style Sheets"
    ],
    correct: "Cascading Style Sheets"
  },
  {
    question: "Which property is used to change text color in CSS?",
    choices: ["color", "text-color", "font-color", "style-color"],
    correct: "color"
  },
  {
    question: "What is the correct way to link a CSS file in HTML?",
    choices: [
      "<link rel='stylesheet' href='styles.css'>",
      "<style src='styles.css'>",
      "<css src='styles.css'>",
      "<script href='styles.css'>"
    ],
    correct: "<link rel='stylesheet' href='styles.css'>"
  },
];
let timePerQuestion = 30; // seconds
let timerInterval;

let currentQuestion = 0;
const userAnswers = Array(quizData.length).fill(null);
const visitedQuestions = Array(quizData.length).fill(false);

const questionPalette = document.getElementById("question-palette");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const submitBtn = document.getElementById("submit-btn");
const resultDiv = document.getElementById("result");

function startTimer() {
  clearInterval(timerInterval);
  let timeLeft = timePerQuestion;
  document.getElementById("time-left").textContent = timeLeft;

  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("time-left").textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      const radios = document.querySelectorAll("input[name='option']");
      radios.forEach((radio) => (radio.disabled = true));
      if (currentQuestion < quizData.length - 1) {
        currentQuestion++;
        renderQuestion();
      } else {
        submitBtn.click(); 
      }
    }
  }, 1000);
}

// Render question palette
function renderPalette() {
  questionPalette.innerHTML = "";
  quizData.forEach((_, index) => {
    const circle = document.createElement("div");
    circle.textContent = index + 1;
    circle.classList.add("palette-item");

    if (index === currentQuestion) {
      circle.classList.add("current-question"); // Highlight current question
    } else if (userAnswers[index] !== null) {
      circle.classList.add("answered"); // Green if answered
    } else if (visitedQuestions[index]) {
      circle.classList.add("visited-not-answered"); // Purple if visited but not answered
    } else {
      circle.classList.add("not-visited"); // Grey if not visited
    }

    if (index > currentQuestion) {
      circle.addEventListener("click", () => {
        currentQuestion = index;
        renderQuestion();
      });
    } else {
      circle.style.cursor = "not-allowed";
      circle.style.opacity = 0.5;
    }
    questionPalette.appendChild(circle);
  });
}

// Render current question and options
function renderQuestion() {
  visitedQuestions[currentQuestion] = true; // Mark as visited
  const q = quizData[currentQuestion];
  questionText.textContent = `${currentQuestion + 1}. ${q.question}`;
  optionsContainer.innerHTML = "";

//   q.choices.forEach((choice) => {
//     const label = document.createElement("label");
//     label.innerHTML = `
//       <input type="radio" name="option" value="${choice}" 
//       ${userAnswers[currentQuestion] === choice ? "checked" : ""}>
//       ${choice}
//     `;
//     label.querySelector("input").addEventListener("change", (e) => {
//       userAnswers[currentQuestion] = e.target.value;
//       renderPalette(); // Update palette color when answered
//     });
//     optionsContainer.appendChild(label);
//   });
 startTimer();
    q.choices.forEach((choice) => {
    const label = document.createElement("label");

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "option";
    input.value = choice;
    if (userAnswers[currentQuestion] === choice) {
        input.checked = true;
    }
    input.addEventListener("change", (e) => {
        userAnswers[currentQuestion] = e.target.value;
        renderPalette(); // Update palette color when answered
    });

    label.appendChild(input);
    const textNode = document.createTextNode(` ${choice}`);
    label.appendChild(textNode);

    optionsContainer.appendChild(label);
    });


  // Enable/disable navigation buttons
//   prevBtn.disabled = currentQuestion === 0;
  nextBtn.disabled = currentQuestion === quizData.length - 1;

  renderPalette();
}

// prevBtn.addEventListener("click", () => {
//   if (currentQuestion > 0) {
//     currentQuestion--;
//     renderQuestion();
//   }
// });

nextBtn.addEventListener("click", () => {
  if (currentQuestion < quizData.length - 1) {
    currentQuestion++;
    renderQuestion();
  }
});

// submitBtn.addEventListener("click", () => {
//   let score = 0;
//   quizData.forEach((q, index) => {
//     if (userAnswers[index] === q.correct) {
//       score++;
//     }
//   });
//   resultDiv.textContent = `🎉 You scored ${score} out of ${quizData.length}!`;
//   submitBtn.disabled = true;
// });
submitBtn.addEventListener("click", () => {
    clearInterval(timerInterval); 
    document.getElementById("timer").style.display = "none";
  let score = 0;
  quizData.forEach((q, index) => {
    if (userAnswers[index] === q.correct) {
      score++;
    }
  });

  // Update modal content
  const modal = document.getElementById("result-modal");
  const modalEmoji = document.getElementById("modal-emoji");
  const modalText = document.getElementById("modal-text");
  const modalMessage = document.getElementById("modal-message");

  if (score === quizData.length) {
    // modalEmoji.innerHTML = "";
    // const trophyIcon = document.createElement("i");
    // trophyIcon.classList.add("fa-solid", "fa-trophy");
    // trophyIcon.style.color = "#d8b713";
    // trophyIcon.style.fontSize = "50px";
    modalEmoji.innerHTML = `<i class="fa-solid fa-trophy" style="color: #d8b713; font-size: 50px;"></i>`;

    // modalEmoji.appendChild(trophyIcon);
    modalMessage.innerHTML = `Perfect! You’re a quiz master! `;
  } else if (score >= quizData.length / 2) {
    modalEmoji.innerHTML = `<i class="fa-solid fa-champagne-glasses" style="color: #b08d57;;"></i>`;
    modalMessage.innerHTML = `Good job! Keep practicing! <i class="fa-solid fa-rocket" style="color: #f5148c;"></i>`;
  } else {
    modalEmoji.innerHTML = `<i class="fa-solid fa-face-frown" style="color: #dfa849;"></i>`;
    modalMessage.innerHTML = `Don’t worry, try again and you’ll improve! <i class="fa-solid fa-thumbs-up" style="color: #dfa849;"></i>`;
  }

  modalText.textContent = `You scored ${score} out of ${quizData.length}!`;
  modal.style.display = "block"; // Show modal
  submitBtn.disabled = true;
});

function resetQuiz() {
  window.location.reload(); 
}

// Close modal

document.getElementById("close-modal").addEventListener("click", () => {
  document.getElementById("result-modal").style.display = "none";

  // Hide question and palette
  document.getElementById("question-box").innerHTML = `
    <h2><i>Do you want to reattempt the quiz?</i></h2>
    <button id="reattempt-btn" class="reattempt-btn">Reattempt Quiz</button>
  `;
  document.getElementById("question-box").style.color="red";
  document.getElementById("question-box").style.textAlign="center";
  document.getElementById("reattempt-btn").style.backgroundColor="#4CAF50";
  document.getElementById("reattempt-btn").style.color="white";
  document.getElementById("question-palette").style.display = "none";
  document.getElementById("submit-btn").style.display = "none";
  document.getElementById("next-btn").style.display = "none";
  document.getElementById("ques-legend").style.display = "none";

  // Add reattempt functionality
  document.getElementById("reattempt-btn").addEventListener("click", () => {
    resetQuiz();
  });
});


// Initial render
renderQuestion();
