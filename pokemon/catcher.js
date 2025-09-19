let pokemonList = [];
let currentPokemon = null;
let balls = { pokeball: 5, greatball: 0, ultraball: 0, masterball: 0 };
let money = 0;
let ballData = {};

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
        money += 10;
        document.getElementById("collection").innerHTML += `<li>${currentPokemon.name}</li>`;
        alert(`You caught ${currentPokemon.name}!`);
        spawnPokemon(); // move to next Pokémon
    } else {
        alert(`${currentPokemon.name} broke free!`);
    }

    updateStats();
    renderBallButtons(); // update ball counts
}

// Update UI stats
function updateStats() {
    document.getElementById("balls").textContent = balls.pokeball;
    document.getElementById("money").textContent = money;
}

// Init
loadJsonData();
loadBallData();
updateStats();
