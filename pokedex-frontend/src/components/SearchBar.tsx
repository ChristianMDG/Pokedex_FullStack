import React, { useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { pokemonAPI } from '../services/api';
import type { PokemonBasic } from '../types/pokemon.types';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  onSearch?: (results: PokemonBasic[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PokemonBasic[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debouncedQuery = useDebounce(query, 500);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (debouncedQuery.trim()) {
      searchPokemon();
    } else {
      setResults([]);
      if (onSearch) onSearch([]);
    }
  }, [debouncedQuery]);

  const searchPokemon = async () => {
    try {
      setLoading(true);
      const data = await pokemonAPI.searchPokemon(debouncedQuery);
      setResults(data);
      if (onSearch) onSearch(data);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPokemon = (name: string) => {
    setQuery('');
    setShowResults(false);
    navigate(`/pokemon/${name}`);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          placeholder="Rechercher un Pokémon..."
          className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-lg focus:outline-none focus:border-pokemon-red focus:ring-2 focus:ring-pokemon-red/20"
        />
        <svg
          className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {loading && (
          <div className="absolute right-3 top-2.5">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-pokemon-red"></div>
          </div>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border max-h-96 overflow-auto">
          {results.map((pokemon) => {
            const id = pokemon.url.split('/').filter(Boolean).pop();
            return (
              <button
                key={pokemon.name}
                onClick={() => handleSelectPokemon(pokemon.name)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3"
              >
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                  alt={pokemon.name}
                  className="w-8 h-8"
                />
                <span className="capitalize">{pokemon.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchBar;