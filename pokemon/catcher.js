let pokemonList = [];
let currentPokemon = null;
let balls = { pokeball: 5, greatball: 0, ultraball: 0, masterball: 0 };
let money = 0;
let ballData = {};

let player = {
    level: 1,
    xp: 0,
    xpNeeded: 100
};

// Load Pokémon data
async function loadJsonData() {
    try {
        const response = await fetch('./pokemon_data.json');
        pokemonList = await response.json();
        spawnPokemon(); // auto spawn first Pokémon
    } catch (error) {
        console.error('Error loading JSON:', error);
    }
}

// Load Poké Ball info from API
async function loadBallData() {
    const ballTypes = [
        { id: 1, key: "masterball", multiplier: 100.0 },
        { id: 2, key: "ultraball", multiplier: 2.0 },
        { id: 3, key: "greatball", multiplier: 1.5 },
        { id: 4, key: "pokeball", multiplier: 1.0 },
    ];

    for (let ball of ballTypes) {
        const res = await axios.get(`https://pokeapi.co/api/v2/item/${ball.id}`);
        ballData[ball.key] = {
            name: res.data.name,
            sprite: res.data.sprites.default,
            multiplier: ball.multiplier,
        };
    }

    renderBallButtons();
}

// Render ball buttons dynamically
function renderBallButtons() {
    const container = document.getElementById("ball-buttons");
    container.innerHTML = "";

    for (let key in ballData) {
        if (balls[key] > 0) {
            const btn = document.createElement("button");
            btn.innerHTML = `
            <img src="${ballData[key].sprite}" alt="${ballData[key].name}">
            <br>${ballData[key].name} (${balls[key]})
            `;
            btn.onclick = () => throwBall(key);
            container.appendChild(btn);
        }
    }
}

// Spawn a random Pokémon
function spawnPokemon() {
    if (!pokemonList.length) return;

    const idx = Math.floor(Math.random() * pokemonList.length);
    currentPokemon = pokemonList[idx];

    document.getElementById("pokemon").innerHTML = `
        <h3>${currentPokemon.name}</h3>
        <img src="${currentPokemon.sprite}" alt="${currentPokemon.name}">
        <p>Catch Rate: ${currentPokemon.captureRate}</p>
    `;
}

// Try to catch with chosen ball
function throwBall(ballKey) {
    if (!currentPokemon) return;
    if (balls[ballKey] <= 0) {
        alert(`No ${ballKey} left!`);
        return;
    }

    balls[ballKey]--;

    let caught = false;
    if (ballKey === "masterball") {
        caught = true; // Master Ball = guaranteed
    } else {
        const chance = Math.random() * 255;
        const effectiveRate = currentPokemon.captureRate * ballData[ballKey].multiplier;
        caught = chance <= effectiveRate;
    }

    if (caught) {
        // reward scaling with rarity
        const moneyEarned = Math.round((255 - currentPokemon.captureRate) / 10) + 1;
        const xpEarned = Math.round((255 - currentPokemon.captureRate) / 5) + 5;

        money += moneyEarned;
        gainXP(xpEarned);

        document.getElementById("collection").innerHTML += `<li>${currentPokemon.name}</li>`;
        alert(`You caught ${currentPokemon.name}! +$${moneyEarned}, +${xpEarned} XP`);
        spawnPokemon();
    } else {
        alert(`${currentPokemon.name} broke free!`);
    }

    updateStats();
    renderBallButtons(); // update ball counts
}

// --- XP & Level ---
function gainXP(amount) {
    player.xp += amount;
    while (player.xp >= player.xpNeeded) {
        player.xp -= player.xpNeeded;
        player.level++;
        player.xpNeeded = player.xpNeeded + Math.floor(player.xpNeeded * 0.7); // increase needed XP by 70%
        alert(`🎉 You leveled up! Now level ${player.level}`);
    }
}

// Update UI stats
function updateStats() {
    document.getElementById("balls").textContent = balls.pokeball;
    document.getElementById("money").textContent = money;
    document.getElementById("level").textContent = player.level;
    document.getElementById("xp").textContent = `${player.xp} / ${player.xpNeeded}`;
}

// Init
loadJsonData();
loadBallData();
updateStats();
