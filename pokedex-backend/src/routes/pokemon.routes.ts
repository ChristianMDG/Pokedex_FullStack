import { Router } from 'express';
import { pokemonController } from '../controllers/pokemon.controller';

const router = Router();

// IMPORTANT: Les routes spécifiques doivent être avant les routes avec paramètres
// Pokemon API routes
router.get('/pokemon/search', pokemonController.searchPokemon.bind(pokemonController));
router.get('/pokemon', pokemonController.getPokemonList.bind(pokemonController));
router.get('/pokemon/:nameOrId', pokemonController.getPokemonDetail.bind(pokemonController));

// Custom Pokemon routes
router.get('/custom-pokemons', pokemonController.getCustomPokemons.bind(pokemonController));
router.post('/custom-pokemons', pokemonController.createCustomPokemon.bind(pokemonController));
router.get('/custom-pokemons/:id', pokemonController.getCustomPokemonById.bind(pokemonController));
router.put('/custom-pokemons/:id', pokemonController.updateCustomPokemon.bind(pokemonController));
router.delete('/custom-pokemons/:id', pokemonController.deleteCustomPokemon.bind(pokemonController));

export default router;