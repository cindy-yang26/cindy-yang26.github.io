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

