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
const availableModes = [...new Set(Array.from(easterTargets, (el) => el.dataset.mode).filter(Boolean))];

let toastTimer;
let factIndex = 0;

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