const slotSymbols = ["🍁", "🐄", "🧀", "⛰️", "🚂", "🫐", "⛷️"];
const slotWeights = [24, 18, 16, 14, 10, 12, 6];
const slotPayoutTable = {
    "🍁": 8,
    "🐄": 10,
    "🧀": 12,
    "⛰️": 15,
    "🚂": 20,
    "🫐": 25,
    "⛷️": 40,
};

let slotCredits = 20;
let slotBetAmount = 1;
let slotBestSingleWin = 0;
let slotCurrentStreak = 0;
let slotSpinTotal = 0;
let slotSpinLocked = false;
let slotCrankPullTimer = null;

function getWeightedSlotSymbol() {
    const totalWeight = slotWeights.reduce((sum, weight) => sum + weight, 0);
    let roll = Math.random() * totalWeight;

    for (let i = 0; i < slotSymbols.length; i += 1) {
        roll -= slotWeights[i];
        if (roll <= 0) {
            return slotSymbols[i];
        }
    }

    return slotSymbols[0];
}

function updateSlotsUi() {
    if (!slotsPanel) {
        return;
    }

    if (slotsCredits) {
        slotsCredits.textContent = String(slotCredits);
    }

    if (slotsBet) {
        slotsBet.textContent = String(slotBetAmount);
    }

    if (slotsBestWin) {
        slotsBestWin.textContent = String(slotBestSingleWin);
    }

    if (slotsStreak) {
        slotsStreak.textContent = String(slotCurrentStreak);
    }

    if (slotsSpinCount) {
        slotsSpinCount.textContent = String(slotSpinTotal);
    }

    if (slotsBetDownBtn) {
        slotsBetDownBtn.disabled = slotSpinLocked || slotBetAmount <= 1;
    }

    if (slotsBetUpBtn) {
        slotsBetUpBtn.disabled = slotSpinLocked || slotBetAmount >= Math.min(5, slotCredits);
    }

    if (slotsSpinBtn) {
        slotsSpinBtn.disabled = slotSpinLocked || slotCredits < slotBetAmount;
    }

    if (slotsBankruptScreen) {
        const bankrupt = !slotSpinLocked && slotCredits === 0;
        slotsBankruptScreen.hidden = !bankrupt;
    }

    if (slotsMachine) {
        slotsMachine.classList.toggle("bankrupt", !slotSpinLocked && slotCredits === 0);
    }
}

function setSlotsStatus(message) {
    if (slotsStatus) {
        slotsStatus.textContent = message;
    }
}

function alignSlotsCrankToReels() {
    if (!slotsSpinBtn || !slotsReels || !slotsMachine || !slotsPanel || slotsPanel.hidden) {
        return;
    }

    const machineRect = slotsMachine.getBoundingClientRect();
    const reelsRect = slotsReels.getBoundingClientRect();
    const reelsCenterY = reelsRect.top - machineRect.top + (reelsRect.height / 2);
    const crankStyles = window.getComputedStyle(slotsSpinBtn);
    const leverOffsetY = parseFloat(crankStyles.getPropertyValue("--lever-offset-y")) || 10;
    slotsSpinBtn.style.top = `${reelsCenterY - leverOffsetY}px`;
}

function evaluateSlotResult(results) {
    const counts = results.reduce((acc, symbol) => {
        acc[symbol] = (acc[symbol] || 0) + 1;
        return acc;
    }, {});

    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const topSymbol = entries[0][0];
    const topCount = entries[0][1];

    if (topCount === 3) {
        const multiplier = slotPayoutTable[topSymbol] || 8;
        return {
            winAmount: slotBetAmount * multiplier,
            status: `Jackpot line! ${topSymbol}${topSymbol}${topSymbol} paid x${multiplier}.`,
            didWin: true,
        };
    }

    if (topCount === 2) {
        return {
            winAmount: slotBetAmount * 2,
            status: `Nice hit with a pair of ${topSymbol}.`,
            didWin: true,
        };
    }

    return {
        winAmount: 0,
        status: "No line this spin. Try another mountain run.",
        didWin: false,
    };
}

function setSlotReelVisual(reelEl, symbol) {
    if (!reelEl) {
        return;
    }

    reelEl.innerHTML = "";
    const track = document.createElement("div");
    track.className = "slot-track";

    const cell = document.createElement("div");
    cell.className = "slot-cell";
    cell.textContent = symbol;

    track.appendChild(cell);
    reelEl.appendChild(track);
}

function animateSlotReel(reelEl, durationMs) {
    return new Promise((resolve) => {
        if (!reelEl) {
            resolve(getWeightedSlotSymbol());
            return;
        }

        const finalSymbol = getWeightedSlotSymbol();
        const spinCount = 12 + Math.floor(Math.random() * 4);
        const spinSequence = [];

        for (let i = 0; i < spinCount; i += 1) {
            spinSequence.push(slotSymbols[Math.floor(Math.random() * slotSymbols.length)]);
        }
        spinSequence.push(finalSymbol);

        reelEl.innerHTML = "";
        const track = document.createElement("div");
        track.className = "slot-track";
        spinSequence.forEach((symbol) => {
            const cell = document.createElement("div");
            cell.className = "slot-cell";
            cell.textContent = symbol;
            track.appendChild(cell);
        });

        reelEl.appendChild(track);
        reelEl.classList.add("spinning");
        reelEl.classList.remove("settling");

        const firstCell = track.querySelector(".slot-cell");
        const cellHeight = firstCell ? firstCell.getBoundingClientRect().height : 76;
        const travelPx = cellHeight * (spinSequence.length - 1);
        let completed = false;
        let fallbackTimer = null;

        track.style.transition = "none";
        track.style.transform = "translateY(0)";
        void track.offsetHeight;

        const finishSpin = () => {
            if (completed) {
                return;
            }

            completed = true;
            if (fallbackTimer) {
                clearTimeout(fallbackTimer);
                fallbackTimer = null;
            }

            setSlotReelVisual(reelEl, finalSymbol);
            reelEl.classList.remove("spinning");
            reelEl.classList.add("settling");
            setTimeout(() => {
                reelEl.classList.remove("settling");
            }, 180);
            resolve(finalSymbol);
        };

        const onTrackEnd = (event) => {
            if (event.target !== track || event.propertyName !== "transform") {
                return;
            }

            track.removeEventListener("transitionend", onTrackEnd);
            finishSpin();
        };

        track.addEventListener("transitionend", onTrackEnd);
        fallbackTimer = setTimeout(() => {
            track.removeEventListener("transitionend", onTrackEnd);
            finishSpin();
        }, durationMs + 140);

        requestAnimationFrame(() => {
            track.style.transition = `transform ${durationMs}ms cubic-bezier(0.12, 0.78, 0.2, 1)`;
            track.style.transform = `translateY(-${travelPx}px)`;
        });
    });
}

async function spinSlots() {
    if (slotSpinLocked || slotCredits < slotBetAmount) {
        return;
    }

    slotSpinLocked = true;
    slotCredits -= slotBetAmount;
    slotSpinTotal += 1;
    setSlotsStatus("Spinning through the Green Mountains...");
    updateSlotsUi();

    if (slotsMachine) {
        slotsMachine.classList.add("spinning-lights");
    }

    try {
        const results = await Promise.all([
            animateSlotReel(slotReel1, 1120),
            animateSlotReel(slotReel2, 1380),
            animateSlotReel(slotReel3, 1640),
        ]);

        const outcome = evaluateSlotResult(results);
        slotCredits += outcome.winAmount;

        if (outcome.didWin) {
            slotCurrentStreak += 1;
            slotBestSingleWin = Math.max(slotBestSingleWin, outcome.winAmount);
            showToast(`Win +${outcome.winAmount}`);
        } else {
            slotCurrentStreak = 0;
        }

        setSlotsStatus(outcome.status);

        if (slotCredits === 0) {
            setSlotsStatus("Out of credits. Hit reset for a fresh bankroll.");
        }
    } finally {
        if (slotsMachine) {
            slotsMachine.classList.remove("spinning-lights");
        }

        slotSpinLocked = false;
        updateSlotsUi();
    }
}

function resetSlotsGame() {
    slotCredits = 20;
    slotBetAmount = 1;
    slotBestSingleWin = 0;
    slotCurrentStreak = 0;
    slotSpinTotal = 0;
    slotSpinLocked = false;

    setSlotReelVisual(slotReel1, "🍁");
    setSlotReelVisual(slotReel2, "🍁");
    setSlotReelVisual(slotReel3, "🍁");
    setSlotsStatus("Land 3 of a kind for a big Vermont payout.");
    updateSlotsUi();
}

function initializeSlotsGame() {
    if (!slotsPanel) {
        return;
    }

    alignSlotsCrankToReels();
    window.addEventListener("resize", () => {
        alignSlotsCrankToReels();
    });

    if (slotsBetDownBtn) {
        slotsBetDownBtn.addEventListener("click", () => {
            if (slotSpinLocked || slotBetAmount <= 1) {
                return;
            }

            slotBetAmount -= 1;
            updateSlotsUi();
        });
    }

    if (slotsBetUpBtn) {
        slotsBetUpBtn.addEventListener("click", () => {
            const maxBet = Math.min(5, slotCredits);
            if (slotSpinLocked || slotBetAmount >= maxBet) {
                return;
            }

            slotBetAmount += 1;
            updateSlotsUi();
        });
    }

    if (slotsSpinBtn) {
        slotsSpinBtn.addEventListener("click", () => {
            if (slotSpinLocked || slotCredits < slotBetAmount) {
                return;
            }

            slotsSpinBtn.classList.remove("is-pulling");
            void slotsSpinBtn.offsetWidth;
            slotsSpinBtn.classList.add("is-pulling");

            if (slotCrankPullTimer) {
                clearTimeout(slotCrankPullTimer);
                slotCrankPullTimer = null;
            }

            slotCrankPullTimer = setTimeout(() => {
                if (slotsSpinBtn) {
                    slotsSpinBtn.classList.remove("is-pulling");
                }
                slotCrankPullTimer = null;
            }, 500);

            spinSlots();
        });
    }

    if (slotsResetBtn) {
        slotsResetBtn.addEventListener("click", () => {
            resetSlotsGame();
        });
    }

    resetSlotsGame();
    alignSlotsCrankToReels();
}

