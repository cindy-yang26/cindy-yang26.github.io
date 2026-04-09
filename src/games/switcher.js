let currentGameIndex = 0;

function setGamePickerOpenState(isOpen) {
    if (!gamePickerMenu || !gamePickerToggle) {
        return;
    }

    gamePickerMenu.hidden = !isOpen;
    gamePickerMenu.classList.toggle("open", isOpen);
    gamePickerToggle.setAttribute("aria-expanded", String(isOpen));

    if (gamePickerAction) {
        gamePickerAction.textContent = isOpen ? "Hide list" : "Show all";
    }
}

function closeGamePicker() {
    setGamePickerOpenState(false);
}

function updateGamePickerMeta(index) {
    if (!gamePickerCurrent || !gamePickerCount || gameTabs.length === 0) {
        return;
    }

    const safeIndex = (index + gameTabs.length) % gameTabs.length;
    gamePickerCurrent.textContent = gameTabs[safeIndex].textContent.trim();
    gamePickerCount.textContent = `${safeIndex + 1} / ${gameTabs.length}`;
}

function showGamePanelByIndex(index, moveFocus = false) {
    if (gameTabs.length === 0 || gamePanels.length === 0) {
        return;
    }

    const safeIndex = (index + gameTabs.length) % gameTabs.length;
    currentGameIndex = safeIndex;
    const targetKey = gameTabs[safeIndex].dataset.gameTarget;

    gameTabs.forEach((tab, tabIndex) => {
        const isActive = tabIndex === safeIndex;
        tab.classList.toggle("active", isActive);
        tab.setAttribute("aria-selected", String(isActive));
        tab.tabIndex = isActive ? 0 : -1;

        if (moveFocus && isActive) {
            tab.focus();
        }
    });

    gamePanels.forEach((panel) => {
        const isActive = panel.dataset.gamePanel === targetKey;
        panel.classList.toggle("active", isActive);
        panel.hidden = !isActive;
    });

    if (targetKey === "slots") {
        requestAnimationFrame(() => {
            alignSlotsCrankToReels();
        });
    }

    if (targetKey !== "ethan" && trainGameActive) {
        trainGameActive = false;
        clearTrainTimer();

        if (startTrainBtn) {
            startTrainBtn.textContent = "Resume Run";
            startTrainBtn.style.display = "inline-block";
        }
        setTrainOverlayVisible(true);
    }

    updateGamePickerMeta(safeIndex);
}

function initializeGameSwitcher() {
    if (gameTabs.length === 0 || gamePanels.length === 0) {
        return;
    }

    gameTabs.forEach((tab, tabIndex) => {
        tab.addEventListener("click", () => {
            showGamePanelByIndex(tabIndex);
            closeGamePicker();
        });

        tab.addEventListener("keydown", (event) => {
            if (event.key === "ArrowRight") {
                event.preventDefault();
                showGamePanelByIndex(tabIndex + 1, true);
            }

            if (event.key === "ArrowLeft") {
                event.preventDefault();
                showGamePanelByIndex(tabIndex - 1, true);
            }
        });
    });

    if (gamePickerToggle && gamePickerMenu) {
        gamePickerToggle.addEventListener("click", () => {
            const isOpen = gamePickerToggle.getAttribute("aria-expanded") === "true";
            setGamePickerOpenState(!isOpen);
        });
    }

    if (gamePrevBtn) {
        gamePrevBtn.addEventListener("click", () => {
            showGamePanelByIndex(currentGameIndex - 1);
        });
    }

    if (gameNextBtn) {
        gameNextBtn.addEventListener("click", () => {
            showGamePanelByIndex(currentGameIndex + 1);
        });
    }

    document.addEventListener("click", (event) => {
        if (!gamePickerMenu || !gamePickerToggle || gamePickerMenu.hidden) {
            return;
        }

        const target = event.target;
        if (target instanceof Node && (gamePickerMenu.contains(target) || gamePickerToggle.contains(target))) {
            return;
        }

        closeGamePicker();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeGamePicker();
        }
    });

    showGamePanelByIndex(0);
    closeGamePicker();
}
