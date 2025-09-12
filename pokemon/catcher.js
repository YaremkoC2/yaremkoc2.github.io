async function getAllPokemon() {
    let url = 'https://pokeapi.co/api/v2/pokemon/';
    const allPokemon = [];

    while (url) {
        const response = await axios.get(url);
        allPokemon.push(...response.data.results);
        url = response.data.next; // next page, or null if done
    }

    console.log('Total Pokémon:', allPokemon.length);
    console.log(allPokemon);
}

getAllPokemon();
