import axios from 'axios';
import { PokemonDetail, PokemonListResponse, PokemonBasic, CustomPokemon } from '../types/pokemon.types';
import { cacheService } from '../utils/cache';

const POKEAPI_URL = process.env.POKEAPI_URL || 'https://pokeapi.co/api/v2';

export class PokemonService {
  private customPokemons: Map<string, CustomPokemon> = new Map();

  constructor() {
    this.loadCustomPokemonsFromCache();
  }

  private loadCustomPokemonsFromCache() {
    const cached = cacheService.get<CustomPokemon[]>('custom_pokemons_list');
    if (cached && Array.isArray(cached)) {
      this.customPokemons.clear();
      cached.forEach(pokemon => {
        this.customPokemons.set(pokemon.id, pokemon);
      });
    }
  }

  private saveCustomPokemonsToCache() {
    const pokemonsArray = Array.from(this.customPokemons.values());
    cacheService.set('custom_pokemons_list', pokemonsArray);
  }

  async getPokemonList(limit: number = 20, offset: number = 0): Promise<{ pokemons: PokemonBasic[]; total: number }> {
    try {
      const cacheKey = `pokemon_list_${limit}_${offset}`;
      const cached = cacheService.get<{ pokemons: PokemonBasic[]; total: number }>(cacheKey);
      
      if (cached) {
        return cached;
      }

      const response = await axios.get<PokemonListResponse>(
        `${POKEAPI_URL}/pokemon`,
        {
          params: { limit, offset },
          timeout: 5000 // Timeout de 5 secondes
        }
      );

      const result = {
        pokemons: response.data.results,
        total: response.data.count,
      };

      cacheService.set(cacheKey, result);
      return result;
    } catch (error: any) {
      console.error('FULL ERROR:', error);
    
      if (axios.isAxiosError(error)) {
        console.error('STATUS:', error.response?.status);
        console.error('DATA:', error.response?.data);
        console.error('HEADERS:', error.response?.headers);
    
        throw new Error(
          `Failed to fetch pokemon list: ${error.message}`
        );
      }
    
      throw error;
    }
  }

  async getPokemonDetail(nameOrId: string | number): Promise<PokemonDetail> {
    try {
      const cacheKey = `pokemon_detail_${nameOrId}`;
      const cached = cacheService.get<PokemonDetail>(cacheKey);
      
      if (cached) {
        return cached;
      }

      const response = await axios.get<PokemonDetail>(`${POKEAPI_URL}/pokemon/${nameOrId}`, {
        timeout: 5000
      });
      
      cacheService.set(cacheKey, response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error(`Pokemon ${nameOrId} not found`);
        }
        throw new Error(`Failed to fetch pokemon ${nameOrId}: ${error.message}`);
      }
      throw new Error(`Failed to fetch pokemon ${nameOrId}`);
    }
  }

  async searchPokemon(query: string): Promise<PokemonBasic[]> {
    try {
      const { pokemons } = await this.getPokemonList(1000, 0);
      const filtered = pokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(query.toLowerCase())
      );
      return filtered.slice(0, 20);
    } catch (error) {
      console.error('Search error:', error);
      throw new Error('Failed to search pokemon');
    }
  }

  getCustomPokemons(): CustomPokemon[] {
    return Array.from(this.customPokemons.values());
  }

  getCustomPokemonById(id: string): CustomPokemon | undefined {
    return this.customPokemons.get(id);
  }

  createCustomPokemon(pokemon: Omit<CustomPokemon, 'id' | 'isCustom'>): CustomPokemon {
    const id = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newPokemon: CustomPokemon = {
      ...pokemon,
      id,
      isCustom: true,
      createdAt: new Date().toISOString(),
    };
    
    this.customPokemons.set(id, newPokemon);
    this.saveCustomPokemonsToCache();
    return newPokemon;
  }

  updateCustomPokemon(id: string, pokemon: Partial<CustomPokemon>): CustomPokemon | undefined {
    const existing = this.customPokemons.get(id);
    if (!existing) return undefined;
    
    // Ne pas permettre la modification de l'ID et isCustom
    const { id: _, isCustom: __, ...updateData } = pokemon;
    const updated = { ...existing, ...updateData };
    this.customPokemons.set(id, updated);
    this.saveCustomPokemonsToCache();
    return updated;
  }

  deleteCustomPokemon(id: string): boolean {
    const deleted = this.customPokemons.delete(id);
    if (deleted) {
      this.saveCustomPokemonsToCache();
    }
    return deleted;
  }
}

export const pokemonService = new PokemonService();