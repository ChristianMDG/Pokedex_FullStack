import { useState, useEffect } from 'react';
import { pokemonAPI } from '../services/api';
import  type { PokemonBasic, PokemonDetail, CustomPokemon } from '../types/pokemon.types';
import toast from 'react-hot-toast';

export const usePokemonList = (limit: number = 20, offset: number = 0) => {
  const [pokemons, setPokemons] = useState<PokemonBasic[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchPokemons();
  }, [limit, offset]);

  const fetchPokemons = async () => {
    try {
      setLoading(true);
      const data = await pokemonAPI.getPokemonList(limit, offset);
      setPokemons(data.pokemons);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching pokemons:', error);
    } finally {
      setLoading(false);
    }
  };

  return { pokemons, loading, total, refetch: fetchPokemons };
};

export const usePokemonDetail = (nameOrId: string | number) => {
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (nameOrId) {
      fetchPokemon();
    }
  }, [nameOrId]);

  const fetchPokemon = async () => {
    try {
      setLoading(true);
      const data = await pokemonAPI.getPokemonDetail(nameOrId);
      setPokemon(data);
    } catch (error) {
      console.error('Error fetching pokemon detail:', error);
    } finally {
      setLoading(false);
    }
  };

  return { pokemon, loading };
};

export const useCustomPokemons = () => {
  const [pokemons, setPokemons] = useState<CustomPokemon[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPokemons = async () => {
    try {
      setLoading(true);
      const data = await pokemonAPI.getCustomPokemons();
      setPokemons(data);
    } catch (error) {
      console.error('Error fetching custom pokemons:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemons();
  }, []);

  const deletePokemon = async (id: string) => {
    try {
      await pokemonAPI.deleteCustomPokemon(id);
      toast.success('Pokémon supprimé avec succès');
      await fetchPokemons();
    } catch (error) {
      console.error('Error deleting pokemon:', error);
    }
  };

  return { pokemons, loading, deletePokemon, refetch: fetchPokemons };
};