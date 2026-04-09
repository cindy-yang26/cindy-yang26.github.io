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

