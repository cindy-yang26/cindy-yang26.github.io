// Moose vs Deer Game Data
const animalImages = [
    { image: "images/moose.jpg", answer: "moose", label: "Moose" },
    { image: "images/moose.jpg", answer: "moose", label: "Moose" },
    { image: "images/moose.jpg", answer: "moose", label: "Moose" },
    { image: "images/moose.jpg", answer: "moose", label: "Moose" },
    { image: "images/deer.jpg", answer: "deer", label: "Deer" },
    { image: "images/deer.jpg", answer: "deer", label: "Deer" },
    { image: "images/deer.jpg", answer: "deer", label: "Deer" },
    { image: "images/deer.jpg", answer: "deer", label: "Deer" }
];

let animalGameActive = false;
let animalLivesRemaining = 3;
let animalCurrentScore = 0;
let animalCurrentStreak = 0;
let animalTimeRemaining = 60;
let animalTimerInterval = null;
let currentAnimal = null;
let animalGameTimer = null;
let animalRoundCount = 0;

function startAnimalGame() {
    animalGameActive = true;
    animalLivesRemaining = 3;
    animalCurrentScore = 0;
    animalCurrentStreak = 0;
    animalTimeRemaining = 60;
    animalRoundCount = 0;
    
    animalScore.textContent = "0";
    animalLives.textContent = "3";
    animalStreak.textContent = "0";
    animalTimer.textContent = "60";
    if (animalRoundIndicator) {
        animalRoundIndicator.textContent = "Round 0";
    }
    
    startAnimalBtn.textContent = "Start Game";
    startAnimalBtn.style.display = "none";
    mooseBtn.disabled = false;
    deerBtn.disabled = false;
    
    // Start countdown timer
    animalTimerInterval = setInterval(() => {
        animalTimeRemaining--;
        animalTimer.textContent = animalTimeRemaining;
        
        if (animalTimeRemaining <= 0) {
            endAnimalGame();
        }
    }, 1000);
    
    showNextAnimal();
}

function showNextAnimal() {
    if (!animalGameActive) return;
    
    currentAnimal = animalImages[Math.floor(Math.random() * animalImages.length)];
    animalRoundCount++;
    if (animalRoundIndicator) {
        animalRoundIndicator.textContent = `Round ${animalRoundCount}`;
    }
    if (animalDisplay) {
        animalDisplay.classList.remove("new-round");
        // Force reflow so animation restarts even for consecutive rounds.
        void animalDisplay.offsetWidth;
        animalDisplay.classList.add("new-round");
    }
    animalImage.src = currentAnimal.image;
    animalImage.alt = currentAnimal.label;
}

function checkAnimal(guess) {
    if (!animalGameActive || !currentAnimal) return;
    
    if (guess === currentAnimal.answer) {
        // Correct!
        animalCurrentScore++;
        animalCurrentStreak++;
        animalScore.textContent = animalCurrentScore;
        animalStreak.textContent = animalCurrentStreak;
        
        showToast("✓ Correct!");
        setTimeout(() => showNextAnimal(), 10);
    } else {
        // Wrong!
        animalLivesRemaining--;
        animalLives.textContent = animalLivesRemaining;
        animalCurrentStreak = 0;
        animalStreak.textContent = "0";
        
        showToast("✗ Wrong!");
        
        if (animalLivesRemaining <= 0) {
            endAnimalGame();
        } else {
            setTimeout(() => showNextAnimal(), 10);
        }
    }
}

function endAnimalGame() {
    animalGameActive = false;
    mooseBtn.disabled = true;
    deerBtn.disabled = true;
    if (animalDisplay) {
        animalDisplay.classList.remove("new-round");
    }
    animalImage.src = "";
    animalImage.alt = "Animal";
    startAnimalBtn.textContent = "Play Again";
    startAnimalBtn.style.display = "inline-block";
    
    // Clear the timer interval
    if (animalTimerInterval) {
        clearInterval(animalTimerInterval);
        animalTimerInterval = null;
    }
    
    showToast(`Game Over! Final Score: ${animalCurrentScore}`);
}

if (startAnimalBtn) {
    startAnimalBtn.addEventListener("click", startAnimalGame);
}

if (mooseBtn) {
    mooseBtn.addEventListener("click", () => checkAnimal("moose"));
}

if (deerBtn) {
    deerBtn.addEventListener("click", () => checkAnimal("deer"));
}
