const menuToggle = document.getElementById("menuToggle");
const navList = document.getElementById("navList");
const revealItems = document.querySelectorAll(".reveal");
const easterTargets = document.querySelectorAll("[data-easter]");
const mapPins = document.querySelectorAll(".map-pin");
const mapDetailTitle = document.getElementById("mapDetailTitle");
const mapDetailText = document.getElementById("mapDetailText");
const factButton = document.getElementById("factButton");
const factOutput = document.getElementById("factOutput");
const toast = document.getElementById("toast");
const motifLayer = document.getElementById("motifLayer");
const yearTarget = document.getElementById("year");
const gameBoard = document.getElementById("gameBoard");
const resetGameBtn = document.getElementById("resetGameBtn");
const matchCount = document.getElementById("matchCount");
const productList = document.getElementById("productList");
const descriptionList = document.getElementById("descriptionList");
const resetFarmerBtn = document.getElementById("resetFarmerBtn");
const farmerMatchCount = document.getElementById("farmerMatchCount");
const flavorList = document.getElementById("flavorList");
const flavorDescriptionList = document.getElementById("flavorDescriptionList");
const resetFlavorBtn = document.getElementById("resetFlavorBtn");
const flavorMatchCount = document.getElementById("flavorMatchCount");
const syrupColor = document.getElementById("syrupColor");
const timeLeft = document.getElementById("timeLeft");
const startMapleBtn = document.getElementById("startMapleBtn");
const syrupScore = document.getElementById("syrupScore");
const syrupStreak = document.getElementById("syrupStreak");
const gradeButtons = document.querySelectorAll(".grade-btn");
const raceButtons = document.querySelectorAll(".race-btn");
const resetRaceBtn = document.getElementById("resetRaceBtn");
const racingResult = document.getElementById("racingResult");
const animalImage = document.getElementById("animalImage");
const mooseBtn = document.getElementById("mooseBtn");
const deerBtn = document.getElementById("deerBtn");
const startAnimalBtn = document.getElementById("startAnimalBtn");
const resetAnimalBtn = document.getElementById("resetAnimalBtn");
const animalScore = document.getElementById("animalScore");
const animalLives = document.getElementById("animalLives");
const animalStreak = document.getElementById("animalStreak");
const animalTimer = document.getElementById("animalTimer");
const equationDisplay = document.getElementById("equationDisplay");
const mathAnswer = document.getElementById("mathAnswer");
const submitMathBtn = document.getElementById("submitMathBtn");
const startMathBtn = document.getElementById("startMathBtn");
const resetMathBtn = document.getElementById("resetMathBtn");
const mathScore = document.getElementById("mathScore");
const mathStreak = document.getElementById("mathStreak");
const mathTimer = document.getElementById("mathTimer");
const availableModes = [...new Set(Array.from(easterTargets, (el) => el.dataset.mode).filter(Boolean))];

let toastTimer;
let factIndex = 0;

// Vermont Memory Game Data
const vermontCards = [
    { image: "images/maple-leaf.png", name: "Maple Leaf" },
    { image: "images/maple-leaf.png", name: "Maple Leaf" },
    { image: "images/mountains.jpg", name: "Mountains" },
    { image: "images/mountains.jpg", name: "Mountains" },
    { image: "images/tree.jpg", name: "Pine Tree" },
    { image: "images/tree.jpg", name: "Pine Tree" },
    { image: "images/bridge.jpg", name: "Covered Bridge" },
    { image: "images/bridge.jpg", name: "Covered Bridge" },
    { image: "images/lake-champlain.jpg", name: "Lake Champlain" },
    { image: "images/lake-champlain.jpg", name: "Lake Champlain" },
    { image: "images/cow.jpg", name: "Vermont Cow" },
    { image: "images/cow.jpg", name: "Vermont Cow" },
];

let gameCards = [];
let flipped = [];
let matched = [];

// Maple Syrup Grade Roulette Data
const syrupGrades = [
    { grade: "golden", hex: "#f4d460", rgb: "244, 212, 96" },
    { grade: "amber", hex: "#d4a040", rgb: "212, 160, 64" },
    { grade: "dark", hex: "#8a6b3a", rgb: "138, 107, 58" },
    { grade: "very-dark", hex: "#5a4a2a", rgb: "90, 74, 42" }
];

let maplegameActive = false;
let mapleSyrupTimer = null;
let mapleSyrupTime = 10;
let mapleSyrupScore = 0;
let mapleSyrupStreak = 0;
let currentSyrupGrade = null;
let syrupTimeMultiplier = 1;

// Farmer's Market Game Data
const farmerMarketPairs = [
    {
        product: "Apple",
        image: "images/apple.svg",
        description: "Crisp autumn harvest from Champlain Valley orchards, especially McIntosh and Honeycrisp varieties.",
        id: "apple"
    },
    {
        product: "Corn",
        image: "images/corn.svg",
        description: "Sweet corn that peaks in summer. Local farmers sell it fresh at farmers markets by the dozen.",
        id: "corn"
    },
    {
        product: "Tomato",
        image: "images/tomato.svg",
        description: "Rich, vine-ripened heirlooms that taste like summer. A staple at Vermont farm stands.",
        id: "tomato"
    },
    {
        product: "Carrot",
        image: "images/carrot.svg",
        description: "Sweet root vegetables, often sold in colorful bunches. Storage varieties last through winter.",
        id: "carrot"
    },
    {
        product: "Butternut Squash",
        image: "images/butternut-squash.svg",
        description: "Golden winter squash perfect for soup and roasting. Stores beautifully for months.",
        id: "squash"
    },
    {
        product: "Cheese",
        image: "images/cheese.svg",
        description: "Vermont cheddar and artisan cheeses from local dairies. Sharp, aged varieties are prized.",
        id: "cheese"
    }
];

// Ben & Jerry's Flavor Quiz Data
const benJerrysFlavors = [
    {
        name: "Cherry Garcia",
        description: "Cherry ice cream with cherry pieces and dark chocolate chunks. Named after the Grateful Dead's Jerry Garcia.",
        id: "cherry-garcia"
    },
    {
        name: "Chunky Monkey",
        description: "Banana ice cream loaded with chocolate chunks and walnuts. A playful, fun flavor.",
        id: "chunky-monkey"
    },
    {
        name: "Phish Food",
        description: "Caramel and chocolate ice cream with marshmallow swirls, brownie pieces, and fudge. A Vermont jam band favorite.",
        id: "phish-food"
    },
    {
        name: "Half Baked",
        description: "Vanilla ice cream with chunks of brownie and cookie dough. The name says it all.",
        id: "half-baked"
    },
    {
        name: "Mint Chocolate Chip",
        description: "Cool mint ice cream with dark chocolate chips. A classic favorite loved worldwide.",
        id: "mint-chip"
    },
    {
        name: "Pistachio Pistachio",
        description: "Real pistachio ice cream with pistachio pieces and pistachios throughout.",
        id: "pistachio"
    },
    {
        name: "Vanilla",
        description: "Pure, simple, and delicious. Ben & Jerry's signature vanilla made with Madagascar vanilla beans.",
        id: "vanilla"
    },
    {
        name: "Cookie Dough",
        description: "Sweet cream ice cream with edible chocolate chip cookie dough. An all-time favorite.",
        id: "cookie-dough"
    }
];

let flavorSelected = null;
let flavorMatched = [];

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function initializeGame() {
    gameCards = shuffleArray(vermontCards);
    flipped = [];
    matched = [];
    matchCount.textContent = "0";
    gameBoard.innerHTML = "";

    gameCards.forEach((card, index) => {
        const cardEl = document.createElement("button");
        cardEl.className = "game-card";
        cardEl.dataset.index = index;
        cardEl.type = "button";
        
        // Create the back of the card (?)
        const back = document.createElement("div");
        back.className = "card-back";
        back.textContent = "?";
        cardEl.appendChild(back);
        
        // Create the front of the card (image)
        const front = document.createElement("img");
        front.className = "card-front";
        front.src = card.image;
        front.alt = card.name;
        cardEl.appendChild(front);
        
        cardEl.addEventListener("click", () => flipCard(cardEl, index));
        gameBoard.appendChild(cardEl);
    });
}

function flipCard(cardEl, index) {
    if (flipped.includes(index) || matched.includes(index) || flipped.length === 2) {
        return;
    }

    cardEl.classList.add("flipped");
    flipped.push(index);

    if (flipped.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    const [first, second] = flipped;
    const firstCard = gameBoard.querySelector(`[data-index="${first}"]`);
    const secondCard = gameBoard.querySelector(`[data-index="${second}"]`);

    if (gameCards[first].name === gameCards[second].name) {
        // Match found
        matched.push(first, second);
        matchCount.textContent = matched.length / 2;
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        flipped = [];

        if (matched.length === gameCards.length) {
            setTimeout(() => {
                showToast("🎉 You matched all Vermont pairs!");
            }, 300);
        }
    } else {
        // No match
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            flipped = [];
        }, 800);
    }
}

if (resetGameBtn) {
    resetGameBtn.addEventListener("click", initializeGame);
}

// Ben & Jerry's Game Functions
function initializeFlavorGame() {
    flavorMatched = [];
    flavorSelected = null;
    flavorMatchCount.textContent = "0";
    flavorList.innerHTML = "";
    flavorDescriptionList.innerHTML = "";

    const shuffledFlavors = shuffleArray(benJerrysFlavors);

    // Create flavor buttons
    shuffledFlavors.forEach((flavor) => {
        const flavorBtn = document.createElement("button");
        flavorBtn.className = "flavor-button";
        flavorBtn.type = "button";
        flavorBtn.dataset.id = flavor.id;
        flavorBtn.textContent = flavor.name;

        flavorBtn.addEventListener("click", () => selectFlavor(flavor.id, flavorBtn));
        flavorList.appendChild(flavorBtn);
    });

    // Create description buttons (shuffled separately)
    const shuffledDescs = shuffleArray(benJerrysFlavors);
    shuffledDescs.forEach((flavor) => {
        const descBtn = document.createElement("button");
        descBtn.className = "flavor-description-button";
        descBtn.type = "button";
        descBtn.dataset.id = flavor.id;
        descBtn.textContent = flavor.description;

        descBtn.addEventListener("click", () => selectFlavorDescription(flavor.id, descBtn));
        flavorDescriptionList.appendChild(descBtn);
    });
}

function selectFlavor(id, btn) {
    if (flavorMatched.includes(id)) return;

    if (flavorSelected) {
        const prevBtn = flavorList.querySelector(`[data-id="${flavorSelected}"]`);
        prevBtn.classList.remove("selected");
    }

    flavorSelected = id;
    btn.classList.add("selected");
}

function selectFlavorDescription(id, btn) {
    if (flavorMatched.includes(id)) return;
    if (!flavorSelected) return;

    if (flavorSelected === id) {
        // Match found
        flavorMatched.push(id);
        flavorMatchCount.textContent = flavorMatched.length;

        flavorList.querySelector(`[data-id="${id}"]`).classList.add("matched");
        btn.classList.add("matched");
        flavorSelected = null;

        if (flavorMatched.length === benJerrysFlavors.length) {
            setTimeout(() => {
                showToast("🍦 You're a Ben & Jerry's flavor expert!");
            }, 300);
        }
    } else {
        // Wrong match - brief highlight then reset
        btn.classList.add("wrong");
        setTimeout(() => {
            btn.classList.remove("wrong");
        }, 400);
    }
}

if (resetFlavorBtn) {
    resetFlavorBtn.addEventListener("click", initializeFlavorGame);
}

// Maple Syrup Racing Game Functions
let raceInProgress = false;
let playerChoice = null;

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

// Maple Math Challenge Data - Simple arithmetic questions
const mathProblems = [
    { latex: "5 + 3 = ?", answer: 8, tolerance: 0.1 },
    { latex: "12 - 7 = ?", answer: 5, tolerance: 0.1 },
    { latex: "6 \\times 4 = ?", answer: 24, tolerance: 0.1 },
    { latex: "15 + 8 = ?", answer: 23, tolerance: 0.1 },
    { latex: "20 - 13 = ?", answer: 7, tolerance: 0.1 },
    { latex: "9 \\times 7 = ?", answer: 63, tolerance: 0.1 },
    { latex: "25 + 17 = ?", answer: 42, tolerance: 0.1 },
    { latex: "30 - 12 = ?", answer: 18, tolerance: 0.1 },
    { latex: "8 \\times 5 = ?", answer: 40, tolerance: 0.1 },
    { latex: "11 + 14 = ?", answer: 25, tolerance: 0.1 },
    { latex: "50 - 23 = ?", answer: 27, tolerance: 0.1 },
    { latex: "7 \\times 6 = ?", answer: 42, tolerance: 0.1 },
    { latex: "33 + 19 = ?", answer: 52, tolerance: 0.1 },
    { latex: "45 - 18 = ?", answer: 27, tolerance: 0.1 },
    { latex: "12 \\times 3 = ?", answer: 36, tolerance: 0.1 },
    { latex: "22 + 16 = ?", answer: 38, tolerance: 0.1 },
    { latex: "40 - 14 = ?", answer: 26, tolerance: 0.1 },
    { latex: "11 \\times 8 = ?", answer: 88, tolerance: 0.1 },
    { latex: "17 + 26 = ?", answer: 43, tolerance: 0.1 },
    { latex: "60 - 35 = ?", answer: 25, tolerance: 0.1 },
    { latex: "9 \\times 9 = ?", answer: 81, tolerance: 0.1 },
    { latex: "28 + 14 = ?", answer: 42, tolerance: 0.1 },
    { latex: "55 - 29 = ?", answer: 26, tolerance: 0.1 },
    { latex: "10 \\times 7 = ?", answer: 70, tolerance: 0.1 },
    { latex: "19 + 32 = ?", answer: 51, tolerance: 0.1 },
    { latex: "72 - 48 = ?", answer: 24, tolerance: 0.1 },
    { latex: "13 \\times 4 = ?", answer: 52, tolerance: 0.1 },
    { latex: "41 + 23 = ?", answer: 64, tolerance: 0.1 },
    { latex: "80 - 31 = ?", answer: 49, tolerance: 0.1 },
    { latex: "6 \\times 11 = ?", answer: 66, tolerance: 0.1 },
];


let mathGameActive = false;
let mathCurrentScore = 0;
let mathCurrentStreak = 0;
let mathTimeRemaining = 45;
let mathTimerInterval = null;
let currentProblem = null;
let usedProblems = [];
function startRace(chosenLane) {
    if (raceInProgress) return;
    
    raceInProgress = true;
    playerChoice = chosenLane;
    racingResult.textContent = "";
    raceButtons.forEach(btn => btn.disabled = true);
    
    // Reset all syrup streams to starting position
    const streams = document.querySelectorAll(".syrup-stream");
    streams.forEach(stream => {
        stream.style.width = "0%";
    });
    
    // Simulate random race speeds for each lane
    const raceSpeeds = [
        Math.random() * 3000 + 2000,  // Golden
        Math.random() * 3000 + 2000,  // Amber
        Math.random() * 3000 + 2000,  // Dark
        Math.random() * 3000 + 2000   // Very Dark
    ];
    
    const minSpeed = Math.min(...raceSpeeds);
    const winner = raceSpeeds.indexOf(minSpeed) + 1;
    
    // Animate all streams racing
    const startTime = Date.now();
    
    const animateRace = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / minSpeed, 1);
        
        streams.forEach((stream, index) => {
            const streamSpeed = raceSpeeds[index];
            const streamProgress = Math.min(elapsed / streamSpeed, 1);
            stream.style.width = (streamProgress * 100) + "%";
        });
        
        if (progress < 1) {
            requestAnimationFrame(animateRace);
        } else {
            // Race finished
            finishRace(winner);
        }
    };
    
    animateRace();
}

function finishRace(winner) {
    raceInProgress = false;
    const grades = ["Golden", "Amber", "Dark", "Very Dark"];
    const winnerGrade = grades[winner - 1];
    
    if (winner === parseInt(playerChoice)) {
        racingResult.textContent = `🎉 You won! ${winnerGrade} syrup finished first!`;
        racingResult.className = "racing-result winner";
        showToast(`You picked the winner! ${winnerGrade} syrup!`);
    } else {
        racingResult.textContent = `${winnerGrade} syrup won! Better luck next time!`;
        racingResult.className = "racing-result loser";
        showToast(`${winnerGrade} syrup took it!`);
    }
    
    raceButtons.forEach(btn => btn.disabled = false);
}

raceButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        startRace(btn.dataset.lane);
    });
});

if (resetRaceBtn) {
    resetRaceBtn.addEventListener("click", () => {
        racingResult.textContent = "";
        racingResult.className = "racing-result";
        const streams = document.querySelectorAll(".syrup-stream");
        streams.forEach(stream => {
            stream.style.width = "0%";
        });
    });
}

// Moose vs Deer Game Functions
function startAnimalGame() {
    animalGameActive = true;
    animalLivesRemaining = 3;
    animalCurrentScore = 0;
    animalCurrentStreak = 0;
    animalTimeRemaining = 60;
    
    animalScore.textContent = "0";
    animalLives.textContent = "3";
    animalStreak.textContent = "0";
    animalTimer.textContent = "60";
    
    startAnimalBtn.style.display = "none";
    resetAnimalBtn.style.display = "none";
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
    console.log("Showing animal:", currentAnimal);
    console.log("Image element:", animalImage);
    console.log("Setting src to:", currentAnimal.image);
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
    startAnimalBtn.style.display = "inline-block";
    resetAnimalBtn.style.display = "inline-block";
    
    // Clear the timer interval
    if (animalTimerInterval) {
        clearInterval(animalTimerInterval);
        animalTimerInterval = null;
    }
    
    showToast(`Game Over! Final Score: ${animalCurrentScore}`);
}

// Maple Math Challenge Functions
function startMathGame() {
    mathGameActive = true;
    mathCurrentScore = 0;
    mathCurrentStreak = 0;
    mathTimeRemaining = 45;
    usedProblems = [];
    
    mathScore.textContent = "0";
    mathStreak.textContent = "0";
    mathTimer.textContent = "45";
    
    startMathBtn.style.display = "none";
    resetMathBtn.style.display = "none";
    mathAnswer.disabled = false;
    submitMathBtn.disabled = false;
    mathAnswer.value = "";
    mathAnswer.focus();
    
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
    
    // Render LaTeX
    equationDisplay.innerHTML = `$$${currentProblem.latex}$$`;
    MathJax.typesetPromise([equationDisplay]).catch(err => console.log(err));
    
    mathAnswer.value = "";
    mathAnswer.focus();
}

function checkMathAnswer() {
    if (!mathGameActive || !currentProblem) return;
    
    const userAnswer = parseFloat(mathAnswer.value);
    
    if (isNaN(userAnswer)) {
        showToast("Please enter a number");
        return;
    }
    
    const difference = Math.abs(userAnswer - currentProblem.answer);
    
    if (difference <= currentProblem.tolerance) {
        // Correct!
        mathCurrentScore++;
        mathCurrentStreak++;
        mathScore.textContent = mathCurrentScore;
        mathStreak.textContent = mathCurrentStreak;
        
        showToast("✓ Correct!");
        setTimeout(() => showNextMathProblem(), 500);
    } else {
        // Wrong!
        mathCurrentStreak = 0;
        mathStreak.textContent = "0";
        
        showToast(`✗ Wrong! Answer: ${currentProblem.answer.toFixed(2)}`);
        setTimeout(() => showNextMathProblem(), 1000);
    }
}

function endMathGame() {
    mathGameActive = false;
    mathAnswer.disabled = true;
    submitMathBtn.disabled = true;
    startMathBtn.style.display = "inline-block";
    resetMathBtn.style.display = "inline-block";
    
    if (mathTimerInterval) {
        clearInterval(mathTimerInterval);
        mathTimerInterval = null;
    }
    
    showToast(`Challenge Over! Final Score: ${mathCurrentScore}`);
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

if (startMathBtn) {
    startMathBtn.addEventListener("click", startMathGame);
}

if (submitMathBtn) {
    submitMathBtn.addEventListener("click", checkMathAnswer);
}

if (mathAnswer) {
    mathAnswer.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            checkMathAnswer();
        }
    });
}

if (resetMathBtn) {
    resetMathBtn.addEventListener("click", () => {
        mathAnswer.value = "";
        startMathGame();
    });
}

if (resetAnimalBtn) {
    resetAnimalBtn.addEventListener("click", startAnimalGame);
}

const placeDetails = {
    burlington: {
        title: "Burlington",
        text: "A balanced mix of city energy, waterfront calm, and community feel. Church Street and the lakefront set the tone.",
    },
    montpelier: {
        title: "Montpelier",
        text: "The smallest U.S. state capital, with big character. Independent shops and civic history are packed into a walkable core.",
    },
    stowe: {
        title: "Stowe",
        text: "Mountain town charm with strong hiking and skiing culture. Classic alpine Vermont in one place.",
    },
    woodstock: {
        title: "Woodstock",
        text: "Known for covered bridges, village greens, and traditional New England architecture with careful preservation.",
    },
    champlain: {
        title: "Lake Champlain",
        text: "One of the region's defining landscapes: islands, sailing, and sunrise light that changes every season.",
    },
};

const rotatingFacts = [
    "Vermont's state motto is 'Freedom and Unity.'",
    "You can drive for long stretches in Vermont without billboard clutter because roadside billboards are banned.",
    "The Long Trail runs the length of Vermont for more than 270 miles.",
    "Maple sap generally runs best when nights are below freezing and days are above freezing.",
    "Montpelier is the only U.S. state capital without a McDonald's within city limits.",
    "Vermont was one of the first places in North America to formally abolish adult slavery in its constitution.",
];

if (yearTarget) {
    yearTarget.textContent = new Date().getFullYear();
}

if (menuToggle && navList) {
    menuToggle.addEventListener("click", () => {
        const expanded = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!expanded));
        navList.classList.toggle("open");
    });

    navList.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navList.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.2 }
    );

    revealItems.forEach((item) => observer.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add("visible"));
}

function showToast(message) {
    if (!toast) {
        return;
    }

    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("show");
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 1900);
}

function emitMotifs(mode) {
    if (!motifLayer) {
        return;
    }

    const modeClass = `motif-${mode}`;
    for (let i = 0; i < 10; i += 1) {
        const motif = document.createElement("span");
        const size = Math.floor(Math.random() * 14) + 8;
        motif.className = `motif ${modeClass}`;
        motif.style.left = `${Math.random() * 100}%`;
        motif.style.width = `${size}px`;
        motif.style.height = `${size}px`;
        motif.style.animationDuration = `${1200 + Math.random() * 1300}ms`;
        motif.style.animationDelay = `${Math.random() * 220}ms`;
        motif.style.opacity = `${0.25 + Math.random() * 0.35}`;
        motifLayer.appendChild(motif);

        setTimeout(() => {
            motif.remove();
        }, 2800);
    }
}

function applyMode(mode) {
    if (!mode) {
        return;
    }

    document.body.dataset.mode = mode;
    easterTargets.forEach((el) => {
        el.classList.toggle("active", el.dataset.mode === mode);
    });
}

function setMapDetailsByPin(pin) {
    if (!pin) {
        return;
    }

    const placeKey = pin.dataset.place;
    const details = placeDetails[placeKey];

    mapPins.forEach((item) => item.classList.remove("active"));
    pin.classList.add("active");

    if (details && mapDetailTitle && mapDetailText) {
        mapDetailTitle.textContent = details.title;
        mapDetailText.textContent = details.text;
    }
}

function syncMapToMode(mode) {
    const matches = Array.from(mapPins).filter((pin) => pin.dataset.mode === mode);
    if (matches.length === 0) {
        return;
    }

    const selected = matches[Math.floor(Math.random() * matches.length)];
    setMapDetailsByPin(selected);
}

function initializeRandomMode() {
    if (availableModes.length === 0) {
        return;
    }

    const randomMode = availableModes[Math.floor(Math.random() * availableModes.length)];
    applyMode(randomMode);
    syncMapToMode(randomMode);
}

mapPins.forEach((pin) => {
    pin.addEventListener("click", () => {
        setMapDetailsByPin(pin);

        if (pin.dataset.mode) {
            applyMode(pin.dataset.mode);
            emitMotifs(pin.dataset.mode);
        }
    });
});

initializeRandomMode();

if (factButton && factOutput) {
    factButton.addEventListener("click", () => {
        factOutput.textContent = rotatingFacts[factIndex];
        factIndex = (factIndex + 1) % rotatingFacts.length;
        showToast("New Vermont fact loaded");
    });
}

easterTargets.forEach((target) => {
    const activate = () => {
        applyMode(target.dataset.mode);
        emitMotifs(target.dataset.mode || "maple");
        const message = target.dataset.easter || "Vermont easter egg found.";
        showToast(message);
    };

    target.addEventListener("click", activate);

    target.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            activate();
        }
    });
});

// Initialize the memory game
initializeGame();
initializeFlavorGame();