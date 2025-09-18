let pokemonList = [];  // global to hold loaded data

// Load JSON data for Pokémon
async function loadJsonData() {
  try {
    const response = await fetch('./pokemon_data.json');
    const jsonData = await response.json();
    pokemonList = jsonData;
  } catch (error) {
    console.error('Error loading JSON:', error);
  }
}

// Load data on page start
loadJsonData();

let balls = 5;
let money = 0;
let currentPokemon = null;

// Spawn a random Pokémon
function spawnPokemon() {
    if (!pokemonList.length) {
        alert("Pokémon data not loaded yet!");
        return;
    }

    // pick random Pokémon
    const idx = Math.floor(Math.random() * pokemonList.length);
    currentPokemon = pokemonList[idx];

    document.getElementById("pokemon").innerHTML = `
        <h3>${currentPokemon.name}</h3>
        <img src="${currentPokemon.sprite}" alt="${currentPokemon.name}">
        <p>Catch Rate: ${currentPokemon.captureRate}</p>
    `;

    // Enable catch button when Pokémon is present
    document.querySelector("button[onclick='catchPokemon()']").disabled = false;
}

// Try to catch the current Pokémon
function catchPokemon() {
    if (!currentPokemon) return;

    // attempt to catch
    const chance = Math.random() * 255;
    if (chance <= currentPokemon.captureRate) {
        money += 10;
        document.getElementById("collection").innerHTML += `<li>${currentPokemon.name}</li>`;
        alert(`You caught ${currentPokemon.name}!`);
    } else {
        alert(`${currentPokemon.name} escaped!`);
    }

    balls--;
    updateStats();

    // Reset encounter
    currentPokemon = null;
    document.getElementById("pokemon").innerHTML = "";
    document.querySelector("button[onclick='catchPokemon()']").disabled = true;
}

// Helper to update balls and money display
function updateStats() {
    document.getElementById("balls").textContent = balls;
    document.getElementById("money").textContent = money;
}
