import { Request, Response } from 'express';
import { pokemonService } from '../services/pokemon.service';

export class PokemonController {
  private handleError(error: unknown, res: Response, notFoundMessage?: string): void {
    console.error('Error:', error);
    
    if (notFoundMessage && error instanceof Error && error.message.includes('404')) {
      res.status(404).json({ error: notFoundMessage });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  private extractPaginationParams(req: Request): { limit: number; offset: number } {
    const limit = Math.min(parseInt(req.query.limit as string) || 30, 100);
    const offset = parseInt(req.query.offset as string) || 0;
    return { limit, offset };
  }

  async getPokemonList(req: Request, res: Response): Promise<void> {
    try {
      const { limit, offset } = this.extractPaginationParams(req);
      const result = await pokemonService.getPokemonList(limit, offset);
      res.json(result);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getPokemonDetail(req: Request, res: Response): Promise<void> {
    try {
      const { nameOrId } = req.params;
      const pokemon = await pokemonService.getPokemonDetail(nameOrId);
      res.json(pokemon);
    } catch (error) {
      this.handleError(error, res, 'Pokemon not found');
    }
  }

  async searchPokemon(req: Request, res: Response): Promise<void> {
    try {
      const searchQuery = req.query.q as string;
      
      if (!searchQuery?.trim()) {
        res.status(400).json({ error: 'Search query is required' });
        return;
      }
      
      const results = await pokemonService.searchPokemon(searchQuery);
      res.json(results);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  getCustomPokemons(_req: Request, res: Response): void {
    try {
      const pokemons = pokemonService.getCustomPokemons();
      res.json(pokemons);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  getCustomPokemonById(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const pokemon = pokemonService.getCustomPokemonById(id);
      
      if (!pokemon) {
        res.status(404).json({ error: 'Custom pokemon not found' });
        return;
      }
      
      res.json(pokemon);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  createCustomPokemon(req: Request, res: Response): void {
    try {
      const { name, types, sprite, height, weight, stats } = req.body;
      
      // Validation
      if (!this.isValidPokemonData({ name, types, sprite })) {
        res.status(400).json({ error: 'Invalid pokemon data' });
        return;
      }
      
      const newPokemon = pokemonService.createCustomPokemon({
        name: name.trim(),
        types,
        sprite,
        height: height ? Number(height) : undefined,
        weight: weight ? Number(weight) : undefined,
        stats: stats ? this.normalizeStats(stats) : undefined,
      });
      
      res.status(201).json(newPokemon);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  updateCustomPokemon(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const updated = pokemonService.updateCustomPokemon(id, req.body);
      
      if (!updated) {
        res.status(404).json({ error: 'Custom pokemon not found' });
        return;
      }
      
      res.json(updated);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  deleteCustomPokemon(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const deleted = pokemonService.deleteCustomPokemon(id);
      
      if (!deleted) {
        res.status(404).json({ error: 'Custom pokemon not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private isValidPokemonData(data: { name: any; types: any; sprite: any }): boolean {
    return (
      data.name && typeof data.name === 'string' && data.name.trim().length > 0 &&
      data.types && Array.isArray(data.types) && data.types.length > 0 &&
      data.sprite && typeof data.sprite === 'string'
    );
  }

  private normalizeStats(stats: any) {
    return {
      hp: Number(stats.hp) || 0,
      attack: Number(stats.attack) || 0,
      defense: Number(stats.defense) || 0,
      specialAttack: Number(stats.specialAttack) || 0,
      specialDefense: Number(stats.specialDefense) || 0,
      speed: Number(stats.speed) || 0,
    };
  }
}

export const pokemonController = new PokemonController();