async function getRandomPokemon() {
    try {
        // Get the total count of Pokémon
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon/');
        const count = response.data.count;

        // Pick a random Pokémon ID (1 to count)
        const randomId = Math.floor(Math.random() * count) + 1;

        // Get Pokémon details (sprite, name)
        const pokemonRes = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}/`);
        const name = pokemonRes.data.name;
        const sprite = pokemonRes.data.sprites.front_default;

        // Get species info (capture rate)
        const speciesRes = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${randomId}/`);
        const captureRate = speciesRes.data.capture_rate;

        // Display in the DOM
        const infoEl = document.getElementById('pokemon-info');
        infoEl.innerHTML = `
            <h2>${name.toUpperCase()}</h2>
            <img src="${sprite}" alt="${name}">
            <p>Capture Rate: ${captureRate}</p>
        `;
    } catch (err) {
        console.error('Error fetching Pokémon:', err);
    }
}

getRandomPokemon();
