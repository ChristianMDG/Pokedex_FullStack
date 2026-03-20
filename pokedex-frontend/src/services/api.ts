import axios from 'axios';
import toast from 'react-hot-toast';
import type { PokemonBasic, PokemonDetail, CustomPokemon, PokemonListResponse } from '../types/pokemon.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const message = error.response.data?.error || 'Une erreur est survenue';
      toast.error(message);
    } else if (error.request) {
      toast.error('Impossible de contacter le serveur');
    } else {
      toast.error('Erreur de connexion');
    }
    return Promise.reject(error);
  }
);

export const pokemonAPI = {
  // Pokemon officiels
  getPokemonList: async (limit: number = 20, offset: number = 0): Promise<PokemonListResponse> => {
    const response = await api.get('/pokemon', { params: { limit, offset } });
    return response.data;
  },

  getPokemonDetail: async (nameOrId: string | number): Promise<PokemonDetail> => {
    const response = await api.get(`/pokemon/${nameOrId}`);
    return response.data;
  },

  searchPokemon: async (query: string): Promise<PokemonBasic[]> => {
    const response = await api.get('/pokemon/search', { params: { q: query } });
    return response.data;
  },

  // Custom pokemons
  getCustomPokemons: async (): Promise<CustomPokemon[]> => {
    const response = await api.get('/custom-pokemons');
    return response.data;
  },

  getCustomPokemonById: async (id: string): Promise<CustomPokemon> => {
    const response = await api.get(`/custom-pokemons/${id}`);
    return response.data;
  },

  createCustomPokemon: async (pokemon: Omit<CustomPokemon, 'id' | 'isCustom' | 'createdAt'>): Promise<CustomPokemon> => {
    const response = await api.post('/custom-pokemons', pokemon);
    return response.data;
  },

  updateCustomPokemon: async (id: string, pokemon: Partial<CustomPokemon>): Promise<CustomPokemon> => {
    const response = await api.put(`/custom-pokemons/${id}`, pokemon);
    return response.data;
  },

  deleteCustomPokemon: async (id: string): Promise<void> => {
    await api.delete(`/custom-pokemons/${id}`);
  },
};