// src/api/api.js
import axios from "axios";

// Fungsi untuk fetch daftar Pokémon
export const fetchAllPokemon = async () => {
  const URL = `https://pokeapi.co/api/v2/pokemon?limit=150`; // Limit dapat disesuaikan sesuai kebutuhan
  try {
    const response = await axios.get(URL);
    return response.data.results;
  } catch (error) {
    throw new Error("Failed to fetch Pokémon list");
  }
};

// Fungsi untuk fetch detail Pokémon berdasarkan URL
export const fetchPokemonByUrl = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch Pokémon details");
  }
};
