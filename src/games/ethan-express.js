const trainBoardWidth = 14;
const trainBoardHeight = 14;
const trainStartSpeedMs = 240;
const trainMinSpeedMs = 95;
const trainSpeedStepMs = 4;
const trainSpeedRampTicks = 10;
const trainProducts = [
    { name: "Syrup", className: "product-syrup" },
    { name: "Cheese", className: "product-cheese" },
    { name: "Apple", className: "product-apple" },
    { name: "Flannel", className: "product-flannel" },
    { name: "Ski", className: "product-ski" },
    { name: "Berries", className: "product-berries" },
];

let trainCells = [];
let trainRoute = [];
let trainDirection = { x: 1, y: 0 };
let trainNextDirection = { x: 1, y: 0 };
let activeTrainProduct = null;
let activeTrainProductIndex = -1;
let trainGameTimer = null;
let trainGameActive = false;
let trainCurrentScore = 0;
let lastTrainProductClass = "";
let trainCurrentSpeedMs = trainStartSpeedMs;
let trainTickCount = 0;
let trainCrashTimer = null;
let trainTouchStartX = 0;
let trainTouchStartY = 0;

function isMobileControlMode() {
    return window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(hover: none)").matches;
}

function updateTrainControlHintText() {
    if (!trainControlHint) {
        return;
    }

    trainControlHint.textContent = isMobileControlMode()
        ? "Controls: Swipe"
        : "Controls: Arrow keys or WASD";
}

function getTrainHeadingClass(direction) {
    if (direction.x === 1) {
        return "train-heading-right";
    }

    if (direction.x === -1) {
        return "train-heading-left";
    }

    if (direction.y === 1) {
        return "train-heading-down";
    }

    return "train-heading-up";
}

function getTrainIndex(x, y) {
    return y * trainBoardWidth + x;
}

function setTrainOverlayVisible(isVisible) {
    if (!trainBoard) {
        return;
    }

    trainBoard.classList.toggle("overlay-active", isVisible);
}

function triggerTrainCrashEffect() {
    if (!trainBoard) {
        return;
    }

    if (trainCrashTimer) {
        clearTimeout(trainCrashTimer);
        trainCrashTimer = null;
    }

    trainBoard.classList.remove("crash-state");
    // Force reflow so the animation always restarts on repeated crashes.
    void trainBoard.offsetWidth;
    trainBoard.classList.add("crash-state");

    trainCrashTimer = setTimeout(() => {
        if (trainBoard) {
            trainBoard.classList.remove("crash-state");
        }
        trainCrashTimer = null;
    }, 760);
}

function buildTrainBoard() {
    if (!trainBoard) {
        return;
    }

    const existingGrid = trainBoard.querySelector(".train-grid");
    if (existingGrid) {
        existingGrid.remove();
    }

    const grid = document.createElement("div");
    grid.className = "train-grid";
    const totalCells = trainBoardWidth * trainBoardHeight;
    trainCells = [];

    for (let index = 0; index < totalCells; index += 1) {
        const cell = document.createElement("div");
        cell.className = "train-cell";
        trainCells.push(cell);
        grid.appendChild(cell);
    }

    trainBoard.prepend(grid);
}

function clearTrainTimer() {
    if (trainGameTimer) {
        clearInterval(trainGameTimer);
        trainGameTimer = null;
    }
}

function restartTrainTimer() {
    if (!trainGameActive) {
        return;
    }

    clearTrainTimer();
    trainGameTimer = setInterval(stepTrainGame, trainCurrentSpeedMs);
}

function getRandomTrainProduct() {
    const productPool = trainProducts.filter((item) => item.className !== lastTrainProductClass);
    const pool = productPool.length > 0 ? productPool : trainProducts;
    return pool[Math.floor(Math.random() * pool.length)];
}

function placeTrainProduct() {
    const occupied = new Set(trainRoute.map((segment) => getTrainIndex(segment.x, segment.y)));
    const openIndexes = [];

    for (let y = 0; y < trainBoardHeight; y += 1) {
        for (let x = 0; x < trainBoardWidth; x += 1) {
            const index = getTrainIndex(x, y);
            if (!occupied.has(index)) {
                openIndexes.push(index);
            }
        }
    }

    if (openIndexes.length === 0) {
        activeTrainProductIndex = -1;
        activeTrainProduct = null;
        return;
    }

    activeTrainProductIndex = openIndexes[Math.floor(Math.random() * openIndexes.length)];
    activeTrainProduct = getRandomTrainProduct();
    lastTrainProductClass = activeTrainProduct.className;

    if (trainProduct && activeTrainProduct) {
        trainProduct.textContent = activeTrainProduct.name;
    }
}

function renderTrainBoard() {
    if (!trainCells.length) {
        return;
    }

    trainCells.forEach((cell) => {
        cell.className = "train-cell";
    });

    trainRoute.forEach((segment, index) => {
        const segmentIndex = getTrainIndex(segment.x, segment.y);
        const cell = trainCells[segmentIndex];
        if (!cell) {
            return;
        }

        if (index === 0) {
            cell.classList.add("train-locomotive", getTrainHeadingClass(trainDirection));
        } else {
            const previousSegment = trainRoute[index - 1];
            const segmentDirection = {
                x: Math.sign(previousSegment.x - segment.x),
                y: Math.sign(previousSegment.y - segment.y),
            };
            cell.classList.add("train-track", getTrainHeadingClass(segmentDirection));
        }
    });

    if (activeTrainProductIndex >= 0 && activeTrainProduct) {
        const pickupCell = trainCells[activeTrainProductIndex];
        if (pickupCell) {
            pickupCell.classList.add("train-product", activeTrainProduct.className);
        }
    }

    if (trainScore) {
        trainScore.textContent = String(trainCurrentScore);
    }

    if (trainLength) {
        trainLength.textContent = String(trainRoute.length);
    }
}

function setupTrainRoute() {
    trainRoute = [
        { x: 7, y: 6 },
        { x: 6, y: 6 },
        { x: 5, y: 6 },
    ];
    trainDirection = { x: 1, y: 0 };
    trainNextDirection = { x: 1, y: 0 };
    trainCurrentScore = 0;
    trainGameActive = false;
    lastTrainProductClass = "";
    trainCurrentSpeedMs = trainStartSpeedMs;
    trainTickCount = 0;

    clearTrainTimer();

    if (trainCrashTimer) {
        clearTimeout(trainCrashTimer);
        trainCrashTimer = null;
    }

    if (trainBoard) {
        trainBoard.classList.remove("crash-state");
    }

    if (startTrainBtn) {
        startTrainBtn.textContent = "Start Run";
        startTrainBtn.style.display = "inline-block";
    }
    setTrainOverlayVisible(true);

    placeTrainProduct();
    renderTrainBoard();
}

function endTrainGame(reasonMessage = "Route ended.", isCrash = false) {
    trainGameActive = false;
    clearTrainTimer();

    if (isCrash) {
        triggerTrainCrashEffect();
    }

    if (startTrainBtn) {
        startTrainBtn.textContent = "Play Again";
        startTrainBtn.style.display = "inline-block";
    }
    setTrainOverlayVisible(true);

    showToast(`${reasonMessage} Stops made: ${trainCurrentScore}`);
}

function stepTrainGame() {
    if (!trainGameActive || trainRoute.length === 0) {
        return;
    }

    trainDirection = { ...trainNextDirection };
    trainTickCount += 1;

    if (trainTickCount % trainSpeedRampTicks === 0 && trainCurrentSpeedMs > trainMinSpeedMs) {
        const nextSpeed = Math.max(trainMinSpeedMs, trainCurrentSpeedMs - trainSpeedStepMs);
        if (nextSpeed !== trainCurrentSpeedMs) {
            trainCurrentSpeedMs = nextSpeed;
            restartTrainTimer();
        }
    }

    const head = trainRoute[0];
    const nextHead = {
        x: head.x + trainDirection.x,
        y: head.y + trainDirection.y,
    };

    const outOfBounds =
        nextHead.x < 0 ||
        nextHead.x >= trainBoardWidth ||
        nextHead.y < 0 ||
        nextHead.y >= trainBoardHeight;

    if (outOfBounds) {
        endTrainGame("The Ethan Allen Express hit the Vermont border.", true);
        return;
    }

    const hitsBody = trainRoute.some((segment) => segment.x === nextHead.x && segment.y === nextHead.y);
    if (hitsBody) {
        endTrainGame("The Ethan Allen Express crashed into itself.", true);
        return;
    }

    trainRoute.unshift(nextHead);
    const nextHeadIndex = getTrainIndex(nextHead.x, nextHead.y);

    if (nextHeadIndex === activeTrainProductIndex) {
        trainCurrentScore += 1;
        if (activeTrainProduct) {
            showToast(`Picked up ${activeTrainProduct.name}. Keep rolling.`);
        }
        placeTrainProduct();
    } else {
        trainRoute.pop();
    }

    renderTrainBoard();
}

function updateTrainDirection(directionKey) {
    const nextDirections = {
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 },
    };

    const candidate = nextDirections[directionKey];
    if (!candidate) {
        return;
    }

    const reversingX = candidate.x !== 0 && candidate.x === -trainDirection.x;
    const reversingY = candidate.y !== 0 && candidate.y === -trainDirection.y;
    if (reversingX || reversingY) {
        return;
    }

    trainNextDirection = candidate;
}

function startTrainGame() {
    if (!trainCells.length) {
        return;
    }

    trainGameActive = true;
    clearTrainTimer();
    trainGameTimer = setInterval(stepTrainGame, trainCurrentSpeedMs);

    if (startTrainBtn) {
        startTrainBtn.style.display = "none";
    }
    setTrainOverlayVisible(false);
}

function initializeTrainGame() {
    if (!trainBoard || !startTrainBtn) {
        return;
    }

    buildTrainBoard();
    setupTrainRoute();
    updateTrainControlHintText();

    startTrainBtn.addEventListener("click", () => {
        if (trainGameActive) {
            return;
        }

        // A completed run starts fresh when clicking Play Again.
        if (startTrainBtn.textContent === "Play Again") {
            setupTrainRoute();
        }

        startTrainGame();
    });

    window.addEventListener("resize", updateTrainControlHintText);

    trainBoard.addEventListener("touchstart", (event) => {
        if (!isMobileControlMode() || !ethanPanel || ethanPanel.hidden || event.touches.length === 0) {
            return;
        }

        const touch = event.touches[0];
        trainTouchStartX = touch.clientX;
        trainTouchStartY = touch.clientY;
    }, { passive: true });

    trainBoard.addEventListener("touchend", (event) => {
        if (!isMobileControlMode() || !ethanPanel || ethanPanel.hidden || event.changedTouches.length === 0) {
            return;
        }

        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - trainTouchStartX;
        const deltaY = touch.clientY - trainTouchStartY;
        const movement = Math.max(Math.abs(deltaX), Math.abs(deltaY));

        if (movement < 18) {
            return;
        }

        const directionKey = Math.abs(deltaX) > Math.abs(deltaY)
            ? (deltaX > 0 ? "right" : "left")
            : (deltaY > 0 ? "down" : "up");

        if (!trainGameActive) {
            if (startTrainBtn && startTrainBtn.textContent === "Resume Run") {
                startTrainGame();
            } else {
                return;
            }
        }

        updateTrainDirection(directionKey);
    }, { passive: true });

    document.addEventListener("keydown", (event) => {
        if (isMobileControlMode()) {
            return;
        }

        const keyToDirection = {
            ArrowUp: "up",
            ArrowDown: "down",
            ArrowLeft: "left",
            ArrowRight: "right",
            w: "up",
            W: "up",
            s: "down",
            S: "down",
            a: "left",
            A: "left",
            d: "right",
            D: "right",
        };

        if (!ethanPanel || ethanPanel.hidden) {
            return;
        }

        const target = event.target;
        if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
            return;
        }

        const directionKey = keyToDirection[event.key];
        if (!directionKey) {
            return;
        }

        event.preventDefault();

        if (!trainGameActive) {
            if (startTrainBtn && startTrainBtn.textContent === "Resume Run") {
                startTrainGame();
            } else {
                return;
            }
        }

        updateTrainDirection(directionKey);
    });
}

