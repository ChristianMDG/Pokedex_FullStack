// import axios, { AxiosError } from 'axios';
// import { PokemonDetail, PokemonListResponse, PokemonBasic, CustomPokemon } from '../types/pokemon.types';
// import { cacheService } from '../utils/cache';

// const POKEAPI_URL = process.env.POKEAPI_URL || 'https://pokeapi.co/api/v2';
// const DEFAULT_TIMEOUT = 5000;
// const MAX_SEARCH_RESULTS = 20;
// const MAX_LIST_LIMIT = 100;

// export class PokemonService {
//   private customPokemons: Map<string, CustomPokemon> = new Map();

//   constructor() {
//     this.loadCustomPokemonsFromCache();
//   }

//   // ========== Private Helper Methods ==========
  
//   private loadCustomPokemonsFromCache(): void {
//     const cached = cacheService.get<CustomPokemon[]>('custom_pokemons_list');
    
//     if (cached && Array.isArray(cached)) {
//       this.customPokemons.clear();
//       cached.forEach(pokemon => {
//         this.customPokemons.set(pokemon.id, pokemon);
//       });
//     }
//   }

//   private saveCustomPokemonsToCache(): void {
//     const pokemonsArray = Array.from(this.customPokemons.values());
//     cacheService.set('custom_pokemons_list', pokemonsArray);
//   }

//   private async fetchFromAPI<T>(endpoint: string, cacheKey?: string): Promise<T> {
//     try {
//       // Check cache if cacheKey provided
//       if (cacheKey) {
//         const cached = cacheService.get<T>(cacheKey);
//         if (cached) return cached;
//       }

//       const response = await axios.get<T>(`${POKEAPI_URL}/${endpoint}`, {
//         timeout: DEFAULT_TIMEOUT
//       });

//       // Store in cache if cacheKey provided
//       if (cacheKey) {
//         cacheService.set(cacheKey, response.data);
//       }

//       return response.data;
//     } catch (error) {
//       this.handleApiError(error, endpoint);
//       throw error; // TypeScript needs this, but handleApiError will throw
//     }
//   }

//   private handleApiError(error: unknown, context: string): never {
//     if (axios.isAxiosError(error)) {
//       const axiosError = error as AxiosError;
      
//       if (axiosError.response?.status === 404) {
//         throw new Error(`${context} not found`);
//       }
      
//       throw new Error(`API request failed: ${axiosError.message}`);
//     }
    
//     throw new Error(`Unexpected error in ${context}`);
//   }

//   private generateCustomId(): string {
//     return `custom_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
//   }

//   private sanitizeSearchQuery(query: string): string {
//     return query.toLowerCase().trim();
//   }

//   // ========== Public API Methods ==========

//   async getPokemonList(limit: number = 30, offset: number = 0): Promise<{
//     pokemons: PokemonBasic[];
//     total: number;
//   }> {
//     const safeLimit = Math.min(limit, MAX_LIST_LIMIT);
//     const cacheKey = `pokemon_list_${safeLimit}_${offset}`;
    
//     try {
//       const data = await this.fetchFromAPI<PokemonListResponse>(
//         `pokemon?limit=${safeLimit}&offset=${offset}`,
//         cacheKey
//       );
      
//       return {
//         pokemons: data.results,
//         total: data.count,
//       };
//     } catch (error) {
//       console.error(`Failed to fetch pokemon list (limit: ${safeLimit}, offset: ${offset}):`, error);
//       throw error;
//     }
//   }

//   async getPokemonDetail(nameOrId: string | number): Promise<PokemonDetail> {
//     const cacheKey = `pokemon_detail_${nameOrId}`;
    
//     try {
//       return await this.fetchFromAPI<PokemonDetail>(
//         `pokemon/${nameOrId}`,
//         cacheKey
//       );
//     } catch (error) {
//       console.error(`Failed to fetch pokemon detail for ${nameOrId}:`, error);
//       throw error;
//     }
//   }

//   async searchPokemon(query: string): Promise<PokemonBasic[]> {
//     if (!query?.trim()) {
//       return [];
//     }

//     try {
//       const sanitizedQuery = this.sanitizeSearchQuery(query);
//       const { pokemons } = await this.getPokemonList(102, 0);
      
//       const filteredPokemons = pokemons.filter(pokemon =>
//         pokemon.name.toLowerCase().includes(sanitizedQuery)
//       );
      
//       return filteredPokemons.slice(0, MAX_SEARCH_RESULTS);
//     } catch (error) {
//       console.error('Search error:', error);
//       throw new Error('Failed to search pokemon');
//     }
//   }

//   // ========== Custom Pokemon CRUD Operations ==========

//   getCustomPokemons(): CustomPokemon[] {
//     return Array.from(this.customPokemons.values());
//   }

//   getCustomPokemonById(id: string): CustomPokemon | undefined {
//     return this.customPokemons.get(id);
//   }

//   createCustomPokemon(pokemonData: Omit<CustomPokemon, 'id' | 'isCustom' | 'createdAt'>): CustomPokemon {
//     const newPokemon: CustomPokemon = {
//       ...pokemonData,
//       id: this.generateCustomId(),
//       isCustom: true,
//       createdAt: new Date().toISOString(),
//     };
    
//     this.customPokemons.set(newPokemon.id, newPokemon);
//     this.saveCustomPokemonsToCache();
    
//     return newPokemon;
//   }

//   updateCustomPokemon(id: string, updates: Partial<CustomPokemon>): CustomPokemon | undefined {
//     const existingPokemon = this.customPokemons.get(id);
    
//     if (!existingPokemon) {
//       return undefined;
//     }
    
//     // Prevent modification of protected fields
//     const { id: _, isCustom: __, createdAt: ___, ...safeUpdates } = updates;
    
//     const updatedPokemon: CustomPokemon = {
//       ...existingPokemon,
//       ...safeUpdates,
  
//     };
    
//     this.customPokemons.set(id, updatedPokemon);
//     this.saveCustomPokemonsToCache();
    
//     return updatedPokemon;
//   }

//   deleteCustomPokemon(id: string): boolean {
//     const exists = this.customPokemons.has(id);
    
//     if (exists) {
//       this.customPokemons.delete(id);
//       this.saveCustomPokemonsToCache();
//     }
    
//     return exists;
//   }

//   // ========== Utility Methods ==========

//   async checkPokemonExists(nameOrId: string | number): Promise<boolean> {
//     try {
//       await this.getPokemonDetail(nameOrId);
//       return true;
//     } catch {
//       return false;
//     }
//   }

// }

// export const pokemonService = new PokemonService();



import axios from 'axios';
import { PokemonDetail, PokemonListResponse, PokemonBasic, CustomPokemon } from '../types/pokemon.types';
import { cacheService } from '../utils/cache';

const POKEAPI_URL = process.env.POKEAPI_URL || 'https://pokeapi.co/api/v2';

export class PokemonService {
  private customPokemons: Map<string, CustomPokemon> = new Map();

  constructor() {
    this.loadCustomPokemonsFromCache();
  }

  // ========== MÉTHODES PRIVÉES SIMPLES ==========
  
  private loadCustomPokemonsFromCache(): void {
    const cached = cacheService.get<CustomPokemon[]>('custom_pokemons_list');
    
    if (cached && Array.isArray(cached)) {
      this.customPokemons.clear();
      for (const pokemon of cached) {
        this.customPokemons.set(pokemon.id, pokemon);
      }
    }
  }

  private saveCustomPokemonsToCache(): void {
    const pokemonsArray = Array.from(this.customPokemons.values());
    cacheService.set('custom_pokemons_list', pokemonsArray);
  }

  // ========== MÉTHODES API POKÉMON ==========

  async getPokemonList(limit: number = 30, offset: number = 0): Promise<{ pokemons: PokemonBasic[]; total: number }> {
    try {
      // Limiter le nombre maximum
      const safeLimit = Math.min(limit, 100);
      const cacheKey = `pokemon_list_${safeLimit}_${offset}`;
      
      // Vérifier le cache
      const cached = cacheService.get<{ pokemons: PokemonBasic[]; total: number }>(cacheKey);
      if (cached) {
        return cached;
      }

      // Appel API
      const response = await axios.get(`${POKEAPI_URL}/pokemon`, {
        params: { limit: safeLimit, offset },
        timeout: 5000
      });

      const result = {
        pokemons: response.data.results,
        total: response.data.count,
      };

      // Sauvegarder dans le cache
      cacheService.set(cacheKey, result);
      return result;

    } catch (error) {
      console.error('Erreur lors de la récupération des pokémons:', error);
      throw new Error('Impossible de récupérer la liste des pokémons');
    }
  }

  async getPokemonDetail(nameOrId: string | number): Promise<PokemonDetail> {
    try {
      const cacheKey = `pokemon_detail_${nameOrId}`;
      
      // Vérifier le cache
      const cached = cacheService.get<PokemonDetail>(cacheKey);
      if (cached) {
        return cached;
      }

      // Appel API
      const response = await axios.get(`${POKEAPI_URL}/pokemon/${nameOrId}`, {
        timeout: 5000
      });

      // Sauvegarder dans le cache
      cacheService.set(cacheKey, response.data);
      return response.data;

    } catch (error: any) {
      console.error(`Erreur pour le pokémon ${nameOrId}:`, error);
      
      if (error.response?.status === 404) {
        throw new Error(`Pokémon ${nameOrId} non trouvé`);
      }
      
      throw new Error(`Impossible de récupérer les détails du pokémon`);
    }
  }

  async searchPokemon(query: string): Promise<PokemonBasic[]> {
    try {
      if (!query || query.trim() === '') {
        return [];
      }

      // Récupérer une grande liste de pokémons
      const { pokemons } = await this.getPokemonList(1000, 0);
      
      // Filtrer par nom
      const searchTerm = query.toLowerCase().trim();
      const filtered = pokemons.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchTerm)
      );
      
      // Limiter les résultats
      return filtered.slice(0, 20);

    } catch (error) {
      console.error('Erreur de recherche:', error);
      throw new Error('Impossible de rechercher des pokémons');
    }
  }

  // ========== MÉTHODES POKÉMON PERSONNALISÉS ==========

  getCustomPokemons(): CustomPokemon[] {
    return Array.from(this.customPokemons.values());
  }

  getCustomPokemonById(id: string): CustomPokemon | undefined {
    return this.customPokemons.get(id);
  }

  createCustomPokemon(pokemonData: any): CustomPokemon {
    // Créer un ID unique
    const id = `custom_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Créer le nouveau pokémon
    const newPokemon: CustomPokemon = {
      ...pokemonData,
      id: id,
      isCustom: true,
      createdAt: new Date().toISOString(),
    };
    
    // Sauvegarder
    this.customPokemons.set(id, newPokemon);
    this.saveCustomPokemonsToCache();
    
    return newPokemon;
  }

  updateCustomPokemon(id: string, updates: any): CustomPokemon | undefined {
    const existingPokemon = this.customPokemons.get(id);
    
    if (!existingPokemon) {
      return undefined;
    }
    
    // Mettre à jour sans modifier l'id et isCustom
    const updatedPokemon = {
      ...existingPokemon,
      ...updates,
      id: existingPokemon.id, // Garder l'ID original
      isCustom: true, // Garder le flag
    };
    
    this.customPokemons.set(id, updatedPokemon);
    this.saveCustomPokemonsToCache();
    
    return updatedPokemon;
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