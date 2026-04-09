// Maple Math Challenge Data - Simple arithmetic questions
const mathProblems = [
    { text: "5 + 3 = ?", answer: 8, tolerance: 0.1 },
    { text: "12 - 7 = ?", answer: 5, tolerance: 0.1 },
    { text: "6 × 4 = ?", answer: 24, tolerance: 0.1 },
    { text: "15 + 8 = ?", answer: 23, tolerance: 0.1 },
    { text: "20 - 13 = ?", answer: 7, tolerance: 0.1 },
    { text: "9 × 7 = ?", answer: 63, tolerance: 0.1 },
    { text: "25 + 17 = ?", answer: 42, tolerance: 0.1 },
    { text: "30 - 12 = ?", answer: 18, tolerance: 0.1 },
    { text: "8 × 5 = ?", answer: 40, tolerance: 0.1 },
    { text: "11 + 14 = ?", answer: 25, tolerance: 0.1 },
    { text: "50 - 23 = ?", answer: 27, tolerance: 0.1 },
    { text: "7 × 6 = ?", answer: 42, tolerance: 0.1 },
    { text: "33 + 19 = ?", answer: 52, tolerance: 0.1 },
    { text: "45 - 18 = ?", answer: 27, tolerance: 0.1 },
    { text: "12 × 3 = ?", answer: 36, tolerance: 0.1 },
    { text: "22 + 16 = ?", answer: 38, tolerance: 0.1 },
    { text: "40 - 14 = ?", answer: 26, tolerance: 0.1 },
    { text: "11 × 8 = ?", answer: 88, tolerance: 0.1 },
    { text: "17 + 26 = ?", answer: 43, tolerance: 0.1 },
    { text: "60 - 35 = ?", answer: 25, tolerance: 0.1 },
    { text: "9 × 9 = ?", answer: 81, tolerance: 0.1 },
    { text: "28 + 14 = ?", answer: 42, tolerance: 0.1 },
    { text: "55 - 29 = ?", answer: 26, tolerance: 0.1 },
    { text: "10 × 7 = ?", answer: 70, tolerance: 0.1 },
    { text: "19 + 32 = ?", answer: 51, tolerance: 0.1 },
    { text: "72 - 48 = ?", answer: 24, tolerance: 0.1 },
    { text: "13 × 4 = ?", answer: 52, tolerance: 0.1 },
    { text: "41 + 23 = ?", answer: 64, tolerance: 0.1 },
    { text: "80 - 31 = ?", answer: 49, tolerance: 0.1 },
    { text: "6 × 11 = ?", answer: 66, tolerance: 0.1 },
];


let mathGameActive = false;
let mathCurrentScore = 0;
let mathCurrentStreak = 0;
let mathTimeRemaining = 45;
let mathTimerInterval = null;
let currentProblem = null;
let usedProblems = [];
let mathAdvancePending = false;
// Maple Math Challenge Functions
function startMathGame() {
    mathGameActive = true;
    mathCurrentScore = 0;
    mathCurrentStreak = 0;
    mathTimeRemaining = 45;
    usedProblems = [];
    mathAdvancePending = false;
    
    mathScore.textContent = "0";
    mathStreak.textContent = "0";
    mathTimer.textContent = "45";
    
    startMathBtn.textContent = "Start Challenge";
    startMathBtn.style.display = "none";
    mathAnswer.disabled = false;
    mathAnswer.value = "";
    mathAnswer.focus();

    if (equationText) {
        equationText.textContent = "";
    }
    
    mathTimerInterval = setInterval(() => {
        mathTimeRemaining--;
        mathTimer.textContent = mathTimeRemaining;
        
        if (mathTimeRemaining <= 0) {
            endMathGame();
        }
    }, 1000);
    
    showNextMathProblem();
}

function showNextMathProblem() {
    if (!mathGameActive) return;
    mathAdvancePending = false;
    
    // Reset used problems if we've gone through all of them
    if (usedProblems.length === mathProblems.length) {
        usedProblems = [];
    }
    
    // Get a random unused problem
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * mathProblems.length);
    } while (usedProblems.includes(randomIndex));
    
    usedProblems.push(randomIndex);
    currentProblem = mathProblems[randomIndex];
    
    // Display text
    if (equationText) {
        equationText.textContent = currentProblem.text;
    } else if (equationDisplay) {
        equationDisplay.textContent = currentProblem.text;
    }
    
    mathAnswer.value = "";
    mathAnswer.focus();
}

function checkMathAnswer(showFeedback = false) {
    if (!mathGameActive || !currentProblem) return;

    const inputValue = mathAnswer.value.trim();
    if (inputValue.length === 0) {
        return;
    }

    const userAnswer = parseFloat(inputValue);

    if (isNaN(userAnswer)) {
        if (showFeedback) {
            showToast("Please enter a number");
        }
        return;
    }

    const difference = Math.abs(userAnswer - currentProblem.answer);

    if (difference <= currentProblem.tolerance) {
        if (mathAdvancePending) {
            return;
        }

        mathAdvancePending = true;
        // Correct!
        mathCurrentScore++;
        mathCurrentStreak++;
        mathScore.textContent = mathCurrentScore;
        mathStreak.textContent = mathCurrentStreak;

        showToast("✓ Correct!");
        setTimeout(() => showNextMathProblem(), 120);
        return;
    }

    if (showFeedback) {
        // Wrong answer feedback only when manually requested (Enter key)
        mathCurrentStreak = 0;
        mathStreak.textContent = "0";
        showToast(`✗ Wrong! Answer: ${currentProblem.answer.toFixed(2)}`);
        setTimeout(() => showNextMathProblem(), 400);
    }
}

function endMathGame() {
    mathGameActive = false;
    mathAdvancePending = false;
    currentProblem = null;
    mathAnswer.disabled = true;
    startMathBtn.textContent = "Play Again";
    startMathBtn.style.display = "inline-block";

    if (equationText) {
        equationText.textContent = "";
    }
    
    if (mathTimerInterval) {
        clearInterval(mathTimerInterval);
        mathTimerInterval = null;
    }
    
    showToast(`Challenge Over! Final Score: ${mathCurrentScore}`);
}

if (startMathBtn) {
    startMathBtn.addEventListener("click", startMathGame);
}

if (mathAnswer) {
    mathAnswer.addEventListener("input", () => {
        checkMathAnswer(false);
    });

    mathAnswer.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            checkMathAnswer(true);
        }
    });
}
