const questionSets = [
  [
    "Kaç yaşındasın?",
    "Boyun kaç?",
    "Kaç kardeşin var?",
    "Bugün hangi gün?",
    "Buraya neyle geldin?",
    "Nerede oturuyorsun?",
    "Buraya gelmeden önce ne yaptın?",
    "7x8=?",
    "Hangi aydayız?",
    "Ayakkabın hangi renk?"
  ],
  [
    "Nerelisin?",
    "Hangi bölümde okuyorsun?",
    "Kaç kardeşin var?",
    "Dün hangi gündü?",
    "Adın ne?",
    "Nerede oturuyorsun?",
    "Buraya gelmeden önce ne yaptın?",
    "6x7=?",
    "Hangi yıldayız?",
    "Gözlerin hangi renk?"
  ]
];

let activeSetIndex = 0;
let questions = [...questionSets[activeSetIndex]];
let currentIndex = 0;
let secondsLeft = 120;
let timerId = null;
let started = false;

const timer = document.getElementById("timer");
const questionCount = document.getElementById("questionCount");
const progressFill = document.getElementById("progressFill");
const questionButton = document.getElementById("questionButton");
const partnerButton = document.getElementById("partnerButton");
const backButton = document.getElementById("backButton");

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function shuffleQuestions() {
  questions = [...questionSets[activeSetIndex]];
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
}

function updateScreen() {
  timer.textContent = formatTime(secondsLeft);
  timer.classList.toggle("warning", started && secondsLeft <= 30);

  const completed = started ? Math.min(currentIndex + 1, questions.length) : 0;
  progressFill.style.width = `${(completed / questions.length) * 100}%`;

  if (!started) {
    questionButton.textContent = "Başla";
    questionButton.classList.remove("done");
    questionButton.classList.add("start-mode");
    questionCount.textContent = `0 / ${questions.length}`;
    backButton.disabled = true;
    return;
  }

  backButton.disabled = currentIndex <= 0;

  if (secondsLeft <= 0 && currentIndex < questions.length) {
    questionButton.textContent = "Süre doldu!";
    questionButton.classList.remove("start-mode");
    questionButton.classList.add("done");
    return;
  }

  if (currentIndex >= questions.length) {
    questionButton.textContent = "Bitti!";
    questionButton.classList.remove("start-mode");
    questionButton.classList.add("done");
    questionCount.textContent = `${questions.length} / ${questions.length}`;
    stopTimer();
    return;
  }

  questionButton.classList.remove("done");
  questionButton.classList.remove("start-mode");
  questionButton.textContent = questions[currentIndex];
  questionCount.textContent = `${currentIndex + 1} / ${questions.length}`;
}

function startTimer() {
  if (timerId) return;
  timerId = setInterval(() => {
    secondsLeft--;
    updateScreen();

    if (secondsLeft <= 0) {
      stopTimer();
    }
  }, 1000);
}

function stopTimer() {
  if (timerId) clearInterval(timerId);
  timerId = null;
}

function prepareRound() {
  stopTimer();
  shuffleQuestions();
  currentIndex = 0;
  secondsLeft = 120;
  started = false;
  updateScreen();
}

function switchPartner() {
  activeSetIndex = (activeSetIndex + 1) % questionSets.length;
  prepareRound();
}

questionButton.addEventListener("click", () => {
  if (!started) {
    started = true;
    updateScreen();
    startTimer();
    return;
  }

  if (currentIndex >= questions.length || secondsLeft <= 0) return;
  currentIndex++;
  updateScreen();
});

backButton.addEventListener("click", () => {
  if (!started || currentIndex <= 0) return;
  currentIndex--;
  updateScreen();
});

partnerButton.addEventListener("click", switchPartner);

shuffleQuestions();
updateScreen();
