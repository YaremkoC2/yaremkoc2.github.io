let pokemonList = [];
let currentPokemon = null;
let balls = { pokeball: 5, greatball: 0, ultraball: 0, masterball: 0 };
let money = 0;
let ballData = {};
const collection = {};

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

// Load Poké Ball info from API using fetch
async function loadBallData() {
    const ballTypes = [
        { id: 1, key: "masterball", multiplier: 100.0 },
        { id: 2, key: "ultraball", multiplier: 2.0 },
        { id: 3, key: "greatball", multiplier: 1.5 },
        { id: 4, key: "pokeball", multiplier: 1.0 },
    ];

    for (let ball of ballTypes) {
        const res = await fetch(`https://pokeapi.co/api/v2/item/${ball.id}`);
        if (!res.ok) {
            throw new Error(`Failed to fetch ${ball.key}: ${res.status}`);
        }
        const data = await res.json();

        ballData[ball.key] = {
            name: data.name,
            sprite: data.sprites.default,
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

    const maxRate = 255 - (player.level - 1) * 10;
    const filteredList = pokemonList.filter(p => p.captureRate >= maxRate);

    const idx = Math.floor(Math.random() * filteredList.length);
    currentPokemon = filteredList[idx];

    // 1 in 8192 chance to be shiny
    currentPokemon.isShiny = Math.floor(Math.random() * 8192) === 0;

    document.getElementById("pokemon").innerHTML = `
        <h3>${currentPokemon.isShiny ? "✨ " + currentPokemon.name + " ✨" : currentPokemon.name}</h3>
        <img src="${currentPokemon.isShiny ? currentPokemon.shiny : currentPokemon.sprite}" alt="${currentPokemon.name}">
        <div>
            <label for="catchDifficulty">Catch Difficulty:</label>
            <progress id="catchDifficulty" value="0" max="100"></progress>
        </div>
    `;

    updateCatchDifficulty(currentPokemon.captureRate);
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
        const chance = Math.random();
        const maxSuccessRate = 0.98; // 98% maximum chance

        // Normalize effective rate into 0–1 range
        let successRate = (currentPokemon.captureRate * ballData[ballKey].multiplier) / 255;
        successRate = Math.min(successRate, maxSuccessRate);
        caught = chance <= successRate;
    }

    if (caught) {
        // update collection
        addToCollection(currentPokemon);

        // reward scaling with rarity
        const moneyEarned = Math.round((255 - currentPokemon.captureRate) / 10) + 1;
        const xpEarned = Math.round((255 - currentPokemon.captureRate) / 5) + 5;

        money += moneyEarned;
        gainXP(xpEarned);

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
        player.xpNeeded = player.xpNeeded + Math.floor(player.xpNeeded * 0.3); // increase needed XP by 30%
        alert(`🎉 You leveled up! Now level ${player.level}`);
    }
}

// Update UI stats
function updateStats() {
    document.getElementById("money").textContent = money;
    document.getElementById("level").textContent = player.level;
    updateXP(player.xp, player.xpNeeded);
}

// update collection with caught pokemon
function addToCollection(pokemon) {
    const name = pokemon.name;

    if (!collection[name]) {
        // First time catching this Pokémon
        collection[name] = {
            count: 1,
            isShiny: pokemon.isShiny,
            sprite: pokemon.sprite,
            shiny: pokemon.shiny
        };
    } else {
        // Already caught before
        collection[name].count++;
        // Upgrade to shiny if current catch is shiny
        if (pokemon.isShiny) {
            collection[name].isShiny = true;
        }
    }

    renderCollection();
}

// render collection UI
function renderCollection() {
    const collectionEl = document.getElementById("collection");
    collectionEl.innerHTML = '';

    for (const key in collection) {
        const p = collection[key];
        collectionEl.innerHTML += `
            <li>
                <img src="${p.isShiny ? p.shiny : p.sprite}" alt="${key}" width="40">
                ${key} x${p.count} ${p.isShiny ? "✨" : ""}
            </li>
        `;
    }
}

// Update XP bar UI
function updateXP(currentXP, maxXP) {
    const xpBar = document.getElementById('xpBar');
    const xpText = document.getElementById('xpText');
    xpBar.max = maxXP;
    xpBar.value = currentXP;
    xpText.textContent = `${currentXP} / ${maxXP}`;
}

// Update catch difficulty bar
function updateCatchDifficulty(captureRate) {
    const bar = document.getElementById('catchDifficulty');
    let difficulty = 100 - Math.round((captureRate / 255) * 100);
    difficulty = Math.max(5, difficulty); // minimum 5% difficulty
    bar.value = difficulty;
}


// Init
loadJsonData();
loadBallData();
updateStats();
