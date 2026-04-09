// Maple Syrup Racing Game Functions
let raceInProgress = false;
let playerChoice = null;
let raceAnimationFrameId = null;
let raceLaneStates = [];

function buildLaneState() {
    return {
        progress: 0,
        velocity: 16 + Math.random() * 5, // % per second
        acceleration: (Math.random() - 0.5) * 2,
        phaseMsLeft: 350 + Math.random() * 700
    };
}

function setRacingResult(message = "", statusClass = "") {
    if (!racingResult) {
        return;
    }

    racingResult.textContent = message;
    racingResult.className = `racing-result${statusClass ? ` ${statusClass}` : ""}`;
    racingResult.hidden = message.trim().length === 0;
}

function startRace(chosenLane) {
    if (raceInProgress) return;
    
    raceInProgress = true;
    playerChoice = chosenLane;
    setRacingResult();
    raceButtons.forEach(btn => btn.disabled = true);
    
    // Reset all syrup streams to starting position
    const streams = document.querySelectorAll(".syrup-stream");
    streams.forEach(stream => {
        stream.style.width = "0%";
    });

    raceLaneStates = Array.from(streams, () => buildLaneState());
    let lastTimestamp = null;
    let raceAgeSeconds = 0;

    const animateRace = (timestamp) => {
        if (!raceInProgress) {
            return;
        }

        if (lastTimestamp === null) {
            lastTimestamp = timestamp;
        }

        const deltaSeconds = Math.min((timestamp - lastTimestamp) / 1000, 0.05);
        lastTimestamp = timestamp;
        raceAgeSeconds += deltaSeconds;
        const avgProgress = raceLaneStates.reduce((sum, state) => sum + state.progress, 0) / raceLaneStates.length;
        const avgVelocity = raceLaneStates.reduce((sum, state) => sum + state.velocity, 0) / raceLaneStates.length;
        const leaderProgress = Math.max(...raceLaneStates.map((state) => state.progress));
        let winnerIndex = -1;

        streams.forEach((stream, index) => {
            const laneState = raceLaneStates[index];
            laneState.phaseMsLeft -= deltaSeconds * 1000;

            if (laneState.phaseMsLeft <= 0) {
                const trailingFactor = Math.max(0, (avgProgress - laneState.progress) / 100);
                const leaderGapFactor = Math.max(0, (leaderProgress - laneState.progress) / 100);
                const racePhaseBoost = laneState.progress > 45 ? 0.12 : 0;
                const burstChance = 0.2 + trailingFactor * 0.45 + leaderGapFactor * 0.4 + racePhaseBoost;
                const clampedBurstChance = Math.max(0.12, Math.min(0.9, burstChance));

                if (Math.random() < clampedBurstChance) {
                    laneState.acceleration = 1.8 + Math.random() * 5.2;
                    laneState.phaseMsLeft = 280 + Math.random() * 560;
                } else {
                    laneState.acceleration = -2.8 + Math.random() * 2.2;
                    laneState.phaseMsLeft = 420 + Math.random() * 900;
                }
            }

            const finishFatigue = Math.max(0, laneState.progress - 75) * 0.08;
            const randomDrift = (Math.random() - 0.5) * 2.4;
            const isLeader = laneState.progress >= leaderProgress - 0.001;
            const leaderPenalty = isLeader && raceAgeSeconds > 1 ? (0.4 + Math.random() * 0.9) : 0;
            const comebackBoost = Math.max(0, (leaderProgress - laneState.progress - 8) * 0.06);

            laneState.velocity += (laneState.acceleration + comebackBoost - leaderPenalty - finishFatigue + randomDrift) * deltaSeconds;

            // Keep the opening pack tighter so early leads don't lock in outcomes.
            if (raceAgeSeconds < 1.6) {
                laneState.velocity += (avgVelocity - laneState.velocity) * 0.3 * deltaSeconds;
            }

            laneState.velocity = Math.max(8, Math.min(34, laneState.velocity));
            laneState.progress = Math.min(100, laneState.progress + laneState.velocity * deltaSeconds);

            stream.style.width = `${laneState.progress}%`;

            if (laneState.progress >= 100 && winnerIndex === -1) {
                winnerIndex = index;
            }
        });

        if (winnerIndex !== -1) {
            finishRace(winnerIndex + 1);
            return;
        }

        raceAnimationFrameId = requestAnimationFrame(animateRace);
    };

    raceAnimationFrameId = requestAnimationFrame(animateRace);
}

function finishRace(winner) {
    raceInProgress = false;
    if (raceAnimationFrameId !== null) {
        cancelAnimationFrame(raceAnimationFrameId);
        raceAnimationFrameId = null;
    }
    const grades = ["Golden", "Amber", "Dark", "Very Dark"];
    const winnerGrade = grades[winner - 1];
    
    if (winner === parseInt(playerChoice)) {
        setRacingResult(`🎉 You won! ${winnerGrade} syrup finished first!`, "winner");
        showToast(`You picked the winner! ${winnerGrade} syrup!`);
    } else {
        setRacingResult(`${winnerGrade} syrup won! Better luck next time!`, "loser");
        showToast(`${winnerGrade} syrup took it!`);
    }
    
    raceButtons.forEach(btn => btn.disabled = false);
}

setRacingResult();

raceButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        startRace(btn.dataset.lane);
    });
});

if (resetRaceBtn) {
    resetRaceBtn.addEventListener("click", () => {
        raceInProgress = false;
        if (raceAnimationFrameId !== null) {
            cancelAnimationFrame(raceAnimationFrameId);
            raceAnimationFrameId = null;
        }
        setRacingResult();
        raceLaneStates = [];
        const streams = document.querySelectorAll(".syrup-stream");
        streams.forEach(stream => {
            stream.style.width = "0%";
        });
        raceButtons.forEach(btn => btn.disabled = false);
    });
}

