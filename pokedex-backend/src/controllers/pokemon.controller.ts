import { Request, Response } from 'express';
import { pokemonService } from '../services/pokemon.service';

export class PokemonController {
  async getPokemonList(req: Request, res: Response): Promise<void> {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100); // Limite max de sécurité
      const offset = parseInt(req.query.offset as string) || 0;
      
      const result = await pokemonService.getPokemonList(limit, offset);
      res.json(result);
    } catch (error) {
      console.error('Error in getPokemonList:', error);
      res.status(500).json({ error: 'Failed to fetch pokemon list' });
    }
  }

  async getPokemonDetail(req: Request, res: Response): Promise<void> {
    try {
      const { nameOrId } = req.params;
      const pokemon = await pokemonService.getPokemonDetail(nameOrId);
      res.json(pokemon);
    } catch (error) {
      console.error('Error in getPokemonDetail:', error);
      if (error instanceof Error && error.message.includes('404')) {
        res.status(404).json({ error: 'Pokemon not found' });
      } else {
        res.status(500).json({ error: 'Failed to fetch pokemon details' });
      }
    }
  }

  async searchPokemon(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string' || q.trim().length === 0) {
        res.status(400).json({ error: 'Search query required' });
        return;
      }
      
      const results = await pokemonService.searchPokemon(q);
      res.json(results);
    } catch (error) {
      console.error('Error in searchPokemon:', error);
      res.status(500).json({ error: 'Failed to search pokemon' });
    }
  }

  // Custom Pokemon CRUD operations
  getCustomPokemons(req: Request, res: Response): void {
    try {
      const pokemons = pokemonService.getCustomPokemons();
      res.json(pokemons);
    } catch (error) {
      console.error('Error in getCustomPokemons:', error);
      res.status(500).json({ error: 'Failed to fetch custom pokemons' });
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
      console.error('Error in getCustomPokemonById:', error);
      res.status(500).json({ error: 'Failed to fetch custom pokemon' });
    }
  }

  createCustomPokemon(req: Request, res: Response): void {
    try {
      const { name, types, sprite, height, weight, stats } = req.body;
      
      // Validation améliorée
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        res.status(400).json({ error: 'Valid name is required' });
        return;
      }
      
      if (!types || !Array.isArray(types) || types.length === 0) {
        res.status(400).json({ error: 'Types array is required' });
        return;
      }
      
      if (!sprite || typeof sprite !== 'string') {
        res.status(400).json({ error: 'Valid sprite URL is required' });
        return;
      }
      
      const newPokemon = pokemonService.createCustomPokemon({
        name: name.trim(),
        types,
        sprite,
        height: height ? Number(height) : undefined,
        weight: weight ? Number(weight) : undefined,
        stats: stats ? {
          hp: Number(stats.hp) || 0,
          attack: Number(stats.attack) || 0,
          defense: Number(stats.defense) || 0,
          specialAttack: Number(stats.specialAttack) || 0,
          specialDefense: Number(stats.specialDefense) || 0,
          speed: Number(stats.speed) || 0,
        } : undefined,
      });
      
      res.status(201).json(newPokemon);
    } catch (error) {
      console.error('Error in createCustomPokemon:', error);
      res.status(500).json({ error: 'Failed to create custom pokemon' });
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
      console.error('Error in updateCustomPokemon:', error);
      res.status(500).json({ error: 'Failed to update custom pokemon' });
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
      console.error('Error in deleteCustomPokemon:', error);
      res.status(500).json({ error: 'Failed to delete custom pokemon' });
    }
  }
}

export const pokemonController = new PokemonController();