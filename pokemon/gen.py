import requests
import time
import json

BASE_URL = "https://pokeapi.co/api/v2"
OUTPUT_FILE = "pokemon_data.json"

def get_all_pokemon():
    """Fetch all Pokémon entries (id + name)."""
    url = f"{BASE_URL}/pokemon?limit=2000"
    response = requests.get(url)
    response.raise_for_status()
    data = response.json()
    return data["results"]

def fetch_pokemon_data(name, idx):
    """Fetch sprite + capture rate for one Pokémon."""
    try:
        # Get species info (capture rate)
        species_url = f"{BASE_URL}/pokemon-species/{name}"
        species_res = requests.get(species_url)
        species_res.raise_for_status()
        species_data = species_res.json()
        capture_rate = species_data.get("capture_rate", None)

        # Get Pokémon info (sprite)
        poke_url = f"{BASE_URL}/pokemon/{name}"
        poke_res = requests.get(poke_url)
        poke_res.raise_for_status()
        poke_data = poke_res.json()
        sprite = poke_data["sprites"]["front_default"]
        shiny = poke_data["sprites"]["front_shiny"]

        return {
            "id": idx,
            "name": name,
            "captureRate": capture_rate,
            "sprite": sprite,
            "shiny": shiny
        }
    except Exception as e:
        print(f"Error fetching {name}: {e}")
        return None


if __name__ == "__main__":
    all_pokemon = get_all_pokemon()
    result = []

    print(f"Total Pokémon found: {len(all_pokemon)}")
    
    for idx, p in enumerate(all_pokemon, start=1):
        name = p["name"]
        print(f"[{idx}/{len(all_pokemon)}] Fetching {name}...")

        data = fetch_pokemon_data(name, idx)
        if data:
            result.append(data)

        # Sleep to avoid rate limits (adjust if needed)
        time.sleep(0.5)

    # Save to JSON file
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2)

    print(f"Saved {len(result)} Pokémon entries to {OUTPUT_FILE}")
