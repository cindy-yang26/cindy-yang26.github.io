const pongPanel = document.getElementById("gamePanelPong");
const pongCanvas = document.getElementById("pongCanvas");
const pongResetBtn = document.getElementById("pongResetBtn");
const pongStatus = document.getElementById("pongStatus");
const pongPlayerScore = document.getElementById("pongPlayerScore");
const pongCpuScore = document.getElementById("pongCpuScore");
const pongBestRally = document.getElementById("pongBestRally");

const pongContext = pongCanvas ? pongCanvas.getContext("2d") : null;
const bernieFaceImage = new Image();
bernieFaceImage.src = "images/bernie-sanders-face.png";

const berniePong = {
  width: 0,
  height: 0,
  playerPaddleX: 0,
  playerTargetX: 0,
  cpuPaddleX: 0,
  ballX: 0,
  ballY: 0,
  ballVX: 0,
  ballVY: 0,
  playerScore: 0,
  cpuScore: 0,
  bestRally: 0,
  rallyCount: 0,
  active: false,
  finished: false,
  lastTimestamp: 0,
  animationFrameId: 0,
  dragging: false,
};

const berniePongConfig = {
  winningScore: 7,
  paddleWidth: 120,
  paddleHeight: 16,
  paddleInset: 24,
  ballSize: 46,
  paddleSpeed: 1000,
  cpuSpeed: 810,
  serveSpeed: 315,
  maxBallSpeed: 560,
};

function clampValue(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}

function numberOrFallback(value, fallback) {
  return Number.isFinite(value) ? value : fallback;
}

function updateBerniePongStatus(message) {
  if (pongStatus) {
    pongStatus.textContent = message;
  }
}

function updateBerniePongScores() {
  if (pongPlayerScore) {
    pongPlayerScore.textContent = String(berniePong.playerScore);
  }

  if (pongCpuScore) {
    pongCpuScore.textContent = String(berniePong.cpuScore);
  }

  if (pongBestRally) {
    pongBestRally.textContent = String(berniePong.bestRally);
  }
}

function resizeBerniePongCanvas() {
  if (!pongCanvas || !pongContext || !pongPanel || pongPanel.hidden) {
    return false;
  }

  const rect = pongCanvas.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) {
    return false;
  }

  const deviceScale = window.devicePixelRatio || 1;
  const nextWidth = Math.round(rect.width * deviceScale);
  const nextHeight = Math.round(rect.height * deviceScale);

  if (pongCanvas.width === nextWidth && pongCanvas.height === nextHeight) {
    berniePong.width = rect.width;
    berniePong.height = rect.height;
    return true;
  }

  pongCanvas.width = nextWidth;
  pongCanvas.height = nextHeight;
  berniePong.width = rect.width;
  berniePong.height = rect.height;
  pongContext.setTransform(deviceScale, 0, 0, deviceScale, 0, 0);

  const paddleY =
    berniePong.height -
    berniePongConfig.paddleInset -
    berniePongConfig.paddleHeight;
  berniePong.playerPaddleX = clampValue(
    numberOrFallback(
      berniePong.playerPaddleX,
      (berniePong.width - berniePongConfig.paddleWidth) / 2,
    ),
    0,
    berniePong.width - berniePongConfig.paddleWidth,
  );
  berniePong.playerTargetX = berniePong.playerPaddleX;
  berniePong.cpuPaddleX = clampValue(
    numberOrFallback(
      berniePong.cpuPaddleX,
      (berniePong.width - berniePongConfig.paddleWidth) / 2,
    ),
    0,
    berniePong.width - berniePongConfig.paddleWidth,
  );
  berniePong.ballX = clampValue(
    numberOrFallback(berniePong.ballX, berniePong.width / 2),
    0,
    berniePong.width,
  );
  berniePong.ballY = clampValue(
    numberOrFallback(berniePong.ballY, berniePong.height / 2),
    0,
    berniePong.height,
  );

  if (!berniePong.active) {
    berniePong.ballX = berniePong.width / 2;
    berniePong.ballY = berniePong.height / 2;
    berniePong.ballVX = 0;
    berniePong.ballVY = 0;
  } else if (berniePong.ballY > paddleY) {
    berniePong.ballY = paddleY - berniePongConfig.ballSize;
  }

  return true;
}

function resetBerniePongBall(serveTowardPlayer = false) {
  berniePong.ballX = berniePong.width / 2;
  berniePong.ballY = berniePong.height / 2;

  const horizontalDirection = Math.random() < 0.5 ? -1 : 1;
  const verticalDirection = serveTowardPlayer ? 1 : -1;
  berniePong.ballVX =
    horizontalDirection *
    berniePongConfig.serveSpeed *
    (0.75 + Math.random() * 0.2);
  berniePong.ballVY = verticalDirection * berniePongConfig.serveSpeed * 0.72;
}

function resetBerniePongMatch() {
  berniePong.playerScore = 0;
  berniePong.cpuScore = 0;
  berniePong.bestRally = 0;
  berniePong.rallyCount = 0;
  berniePong.active = false;
  berniePong.finished = false;
  berniePong.playerPaddleX = 0;
  berniePong.playerTargetX = 0;
  berniePong.cpuPaddleX = 0;

  if (resizeBerniePongCanvas()) {
    berniePong.playerPaddleX =
      (berniePong.width - berniePongConfig.paddleWidth) / 2;
    berniePong.playerTargetX = berniePong.playerPaddleX;
    berniePong.cpuPaddleX = berniePong.playerPaddleX;
    resetBerniePongBall(false);
    drawBerniePongFrame();
  }

  updateBerniePongScores();
  updateBerniePongStatus("Click the game window to start.");
}

function beginBerniePongMatch() {
  if (!resizeBerniePongCanvas()) {
    return;
  }

  berniePong.playerScore = 0;
  berniePong.cpuScore = 0;
  berniePong.bestRally = 0;
  berniePong.rallyCount = 0;
  berniePong.active = true;
  berniePong.finished = false;
  berniePong.playerPaddleX =
    (berniePong.width - berniePongConfig.paddleWidth) / 2;
  berniePong.playerTargetX = berniePong.playerPaddleX;
  berniePong.cpuPaddleX = berniePong.playerPaddleX;
  resetBerniePongBall(false);
  updateBerniePongScores();
  updateBerniePongStatus("Bernie serves first. Keep the rally alive.");
}

function finishBerniePongMatch(playerWon) {
  berniePong.active = false;
  berniePong.finished = true;
  berniePong.ballVX = 0;
  berniePong.ballVY = 0;
  updateBerniePongStatus(
    playerWon ? "Bernie wins the rally." : "Wall Street takes the match.",
  );

  showToast(
    playerWon ? "Bernie wins the rally!" : "Wall Street wins this one.",
  );
  drawBerniePongFrame();
}

function serveBerniePongBall(towardPlayer = false) {
  resetBerniePongBall(towardPlayer);
  berniePong.rallyCount = 0;
}

function drawBernieFace(ballCenterX, ballCenterY, ballDiameter) {
  if (!pongContext) {
    return;
  }

  const drawSize = ballDiameter * 1.15;
  const drawX = ballCenterX - drawSize / 2;
  const drawY = ballCenterY - drawSize / 2;

  pongContext.save();
  pongContext.beginPath();
  pongContext.arc(ballCenterX, ballCenterY, ballDiameter / 2, 0, Math.PI * 2);
  pongContext.clip();
  pongContext.fillStyle = "#f7f1e7";
  pongContext.fillRect(drawX, drawY, drawSize, drawSize);

  if (bernieFaceImage.complete && bernieFaceImage.naturalWidth > 0) {
    pongContext.drawImage(bernieFaceImage, drawX, drawY, drawSize, drawSize);
  } else {
    pongContext.fillStyle = "#c93d2d";
    pongContext.beginPath();
    pongContext.arc(
      ballCenterX,
      ballCenterY,
      ballDiameter * 0.42,
      0,
      Math.PI * 2,
    );
    pongContext.fill();
    pongContext.fillStyle = "#fff";
    pongContext.font = "700 14px Manrope, sans-serif";
    pongContext.textAlign = "center";
    pongContext.textBaseline = "middle";
    pongContext.fillText("B", ballCenterX, ballCenterY + 1);
  }

  pongContext.restore();
}

function drawBerniePongFrame() {
  if (
    !pongCanvas ||
    !pongContext ||
    berniePong.width === 0 ||
    berniePong.height === 0
  ) {
    return;
  }

  const courtWidth = berniePong.width;
  const courtHeight = berniePong.height;
  const paddleWidth = berniePongConfig.paddleWidth;
  const paddleHeight = berniePongConfig.paddleHeight;
  const paddleInset = berniePongConfig.paddleInset;
  const playerY = courtHeight - paddleInset - paddleHeight;
  const cpuY = paddleInset;

  pongContext.clearRect(0, 0, courtWidth, courtHeight);

  pongContext.save();
  pongContext.strokeStyle = "rgba(255, 255, 255, 0.14)";
  pongContext.lineWidth = 4;
  pongContext.setLineDash([10, 12]);
  pongContext.beginPath();
  pongContext.moveTo(20, courtHeight / 2);
  pongContext.lineTo(courtWidth - 20, courtHeight / 2);
  pongContext.stroke();
  pongContext.restore();

  pongContext.fillStyle = "rgba(255, 255, 255, 0.15)";
  pongContext.fillRect(0, 0, courtWidth, 5);
  pongContext.fillRect(0, courtHeight - 5, courtWidth, 5);

  pongContext.fillStyle = "rgba(203, 61, 45, 0.95)";
  pongContext.fillRect(berniePong.cpuPaddleX, cpuY, paddleWidth, paddleHeight);
  pongContext.fillStyle = "rgba(82, 118, 94, 0.95)";
  pongContext.fillRect(
    berniePong.playerPaddleX,
    playerY,
    paddleWidth,
    paddleHeight,
  );

  if (
    berniePong.active ||
    berniePong.finished ||
    berniePong.ballVX !== 0 ||
    berniePong.ballVY !== 0
  ) {
    drawBernieFace(
      berniePong.ballX,
      berniePong.ballY,
      berniePongConfig.ballSize,
    );
  }

  if (!berniePong.active) {
    pongContext.save();
    pongContext.fillStyle = "rgba(255, 248, 240, 0.92)";
    pongContext.font = "700 18px Fraunces, serif";
    pongContext.textAlign = "center";
    pongContext.fillText(
      berniePong.finished ? "Match point reached" : "Click the game window",
      courtWidth / 2,
      courtHeight / 2 - 2,
    );
    pongContext.font = "600 12px Manrope, sans-serif";
    pongContext.fillText(
      "Move with mouse, touch, or arrow keys.",
      courtWidth / 2,
      courtHeight / 2 + 20,
    );
    pongContext.restore();
  }
}

function handleBerniePongPoint(playerScored) {
  if (playerScored) {
    berniePong.playerScore += 1;
    updateBerniePongStatus("Bernie takes the point.");
    showToast("Bernie scores!");
  } else {
    berniePong.cpuScore += 1;
    updateBerniePongStatus("Wall Street takes the point.");
    showToast("Wall Street scores.");
  }

  berniePong.rallyCount = 0;
  updateBerniePongScores();

  if (berniePong.playerScore >= berniePongConfig.winningScore) {
    finishBerniePongMatch(true);
    return;
  }

  if (berniePong.cpuScore >= berniePongConfig.winningScore) {
    finishBerniePongMatch(false);
    return;
  }

  serveBerniePongBall(playerScored);
}

function updateBerniePongGame(deltaSeconds) {
  if (!berniePong.active) {
    drawBerniePongFrame();
    return;
  }

  const paddleWidth = berniePongConfig.paddleWidth;
  const paddleHeight = berniePongConfig.paddleHeight;
  const paddleInset = berniePongConfig.paddleInset;
  const playerY = berniePong.height - paddleInset - paddleHeight;
  const cpuY = paddleInset;

  const playerTarget = clampValue(
    berniePong.playerTargetX,
    0,
    berniePong.width - paddleWidth,
  );
  const playerEase = Math.min(1, deltaSeconds * 12);
  berniePong.playerPaddleX +=
    (playerTarget - berniePong.playerPaddleX) * playerEase;

  const cpuTarget = clampValue(
    berniePong.ballX - paddleWidth / 2,
    0,
    berniePong.width - paddleWidth,
  );
  const cpuDelta = cpuTarget - berniePong.cpuPaddleX;
  const cpuStep = berniePongConfig.cpuSpeed * deltaSeconds;
  berniePong.cpuPaddleX += clampValue(cpuDelta, -cpuStep, cpuStep);

  berniePong.ballX += berniePong.ballVX * deltaSeconds;
  berniePong.ballY += berniePong.ballVY * deltaSeconds;

  if (berniePong.ballX <= berniePongConfig.ballSize / 2) {
    berniePong.ballX = berniePongConfig.ballSize / 2;
    berniePong.ballVX = Math.abs(berniePong.ballVX);
  }

  if (berniePong.ballX >= berniePong.width - berniePongConfig.ballSize / 2) {
    berniePong.ballX = berniePong.width - berniePongConfig.ballSize / 2;
    berniePong.ballVX = -Math.abs(berniePong.ballVX);
  }

  const ballRadius = berniePongConfig.ballSize / 2;
  const playerTop = playerY;
  const cpuBottom = cpuY + paddleHeight;

  if (
    berniePong.ballVY > 0 &&
    berniePong.ballY + ballRadius >= playerTop &&
    berniePong.ballY + ballRadius <= playerTop + paddleHeight &&
    berniePong.ballX >= berniePong.playerPaddleX - ballRadius &&
    berniePong.ballX <= berniePong.playerPaddleX + paddleWidth + ballRadius
  ) {
    const hitOffset =
      (berniePong.ballX - (berniePong.playerPaddleX + paddleWidth / 2)) /
      (paddleWidth / 2);
    berniePong.ballY = playerTop - ballRadius;
    berniePong.ballVY = -Math.abs(berniePong.ballVY) * 1.04;
    berniePong.ballVX += hitOffset * 160;
    berniePong.ballVX = clampValue(
      berniePong.ballVX,
      -berniePongConfig.maxBallSpeed,
      berniePongConfig.maxBallSpeed,
    );
    berniePong.rallyCount += 1;
    berniePong.bestRally = Math.max(
      berniePong.bestRally,
      berniePong.rallyCount,
    );
    updateBerniePongScores();
    updateBerniePongStatus("Bernie returns the volley.");
  }

  if (
    berniePong.ballVY < 0 &&
    berniePong.ballY - ballRadius <= cpuBottom &&
    berniePong.ballY - ballRadius >= cpuY &&
    berniePong.ballX >= berniePong.cpuPaddleX - ballRadius &&
    berniePong.ballX <= berniePong.cpuPaddleX + paddleWidth + ballRadius
  ) {
    const hitOffset =
      (berniePong.ballX - (berniePong.cpuPaddleX + paddleWidth / 2)) /
      (paddleWidth / 2);
    berniePong.ballY = cpuBottom + ballRadius;
    berniePong.ballVY = Math.abs(berniePong.ballVY) * 1.04;
    berniePong.ballVX += hitOffset * 160;
    berniePong.ballVX = clampValue(
      berniePong.ballVX,
      -berniePongConfig.maxBallSpeed,
      berniePongConfig.maxBallSpeed,
    );
  }

  if (berniePong.ballY - ballRadius > berniePong.height) {
    handleBerniePongPoint(false);
  } else if (berniePong.ballY + ballRadius < 0) {
    handleBerniePongPoint(true);
  }

  drawBerniePongFrame();
}

function berniePongLoop(timestamp) {
  if (!pongCanvas || !pongContext || !pongPanel) {
    return;
  }

  if (!pongPanel.hidden) {
    if (resizeBerniePongCanvas()) {
      if (!berniePong.active && !berniePong.finished) {
        drawBerniePongFrame();
      }
    }

    if (!berniePong.lastTimestamp) {
      berniePong.lastTimestamp = timestamp;
    }

    const deltaSeconds = Math.min(
      0.032,
      (timestamp - berniePong.lastTimestamp) / 1000,
    );
    berniePong.lastTimestamp = timestamp;
    updateBerniePongGame(deltaSeconds);
  } else {
    berniePong.lastTimestamp = timestamp;
  }

  berniePong.animationFrameId = requestAnimationFrame(berniePongLoop);
}

function moveBerniePongPaddleFromPoint(clientX) {
  if (!pongCanvas || berniePong.width === 0) {
    return;
  }

  const rect = pongCanvas.getBoundingClientRect();
  const pointerX = clientX - rect.left;
  berniePong.playerTargetX = clampValue(
    pointerX - berniePongConfig.paddleWidth / 2,
    0,
    berniePong.width - berniePongConfig.paddleWidth,
  );
}

function initializePongGame() {
  if (!pongPanel || !pongCanvas || !pongContext) {
    return;
  }

  resetBerniePongMatch();

  if (pongResetBtn) {
    pongResetBtn.addEventListener("click", () => {
      resetBerniePongMatch();
    });
  }

  pongCanvas.addEventListener("pointerdown", (event) => {
    if (!berniePong.active) {
      beginBerniePongMatch();
    }

    berniePong.dragging = true;
    pongCanvas.setPointerCapture(event.pointerId);
    moveBerniePongPaddleFromPoint(event.clientX);
  });

  pongCanvas.addEventListener("pointermove", (event) => {
    if (!berniePong.dragging && event.pointerType === "mouse") {
      moveBerniePongPaddleFromPoint(event.clientX);
      return;
    }

    if (berniePong.dragging) {
      moveBerniePongPaddleFromPoint(event.clientX);
    }
  });

  const stopDragging = () => {
    berniePong.dragging = false;
  };

  pongCanvas.addEventListener("pointerup", stopDragging);
  pongCanvas.addEventListener("pointercancel", stopDragging);
  pongCanvas.addEventListener("pointerleave", stopDragging);

  document.addEventListener("keydown", (event) => {
    if (!berniePong.active) {
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
      event.preventDefault();
      berniePong.playerTargetX = clampValue(
        berniePong.playerTargetX - 48,
        0,
        berniePong.width - berniePongConfig.paddleWidth,
      );
    }

    if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
      event.preventDefault();
      berniePong.playerTargetX = clampValue(
        berniePong.playerTargetX + 48,
        0,
        berniePong.width - berniePongConfig.paddleWidth,
      );
    }
  });

  window.addEventListener("resize", () => {
    resizeBerniePongCanvas();
    drawBerniePongFrame();
  });

  berniePong.animationFrameId = requestAnimationFrame(berniePongLoop);

  bernieFaceImage.addEventListener("load", () => {
    drawBerniePongFrame();
  });

  drawBerniePongFrame();
}
