import React, { useState, useRef, useEffect } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { pokemonAPI } from '../services/api';
import type { PokemonBasic } from '../types/pokemon.types';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  onSearch?: (results: PokemonBasic[], term: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search Pokémon...",
  className = "" 
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PokemonBasic[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fermer les résultats quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Recherche avec debounce
  useEffect(() => {
    if (debouncedQuery.trim()) {
      searchPokemon();
    } else {
      setResults([]);
      if (onSearch) onSearch([], '');
    }
  }, [debouncedQuery]);

  const searchPokemon = async () => {
    try {
      setLoading(true);
      const data = await pokemonAPI.searchPokemon(debouncedQuery);
      setResults(data);
      if (onSearch) onSearch(data, debouncedQuery);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Error searching:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPokemon = (name: string, id?: number) => {
    setQuery('');
    setShowResults(false);
    if (id) {
      navigate(`/pokemon/${id}`);
    } else {
      navigate(`/pokemon/${name}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % results.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          const pokemon = results[selectedIndex];
          const id = pokemon.url?.split('/').filter(Boolean).pop();
          handleSelectPokemon(pokemon.name, id ? parseInt(id) : undefined);
        } else if (query.trim()) {
          // Recherche directe si entrée
          navigate(`/pokemon/${query.toLowerCase()}`);
          setShowResults(false);
        }
        break;
      case 'Escape':
        setShowResults(false);
        inputRef.current?.blur();
        break;
    }
  };

  // Extraire l'ID du Pokémon depuis l'URL
  const getPokemonId = (url: string): number => {
    const matches = url.match(/\/pokemon\/(\d+)/);
    return matches ? parseInt(matches[1]) : 0;
  };

  return (
    <div ref={searchRef} className={`relative w-full ${className}`}>
      <div className="relative">
        {/* Input avec effet de glow */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setShowResults(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-5 py-3 pl-12 pr-12 bg-gray-800 border-2 border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
        />
        
        {/* Icône de recherche */}
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
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

        {/* Indicateur de chargement */}
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Bouton pour effacer */}
        {query && !loading && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setShowResults(false);
              if (onSearch) onSearch([], '');
              inputRef.current?.focus();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Résultats de recherche avec animation */}
      <AnimatePresence>
        {showResults && (results.length > 0 || (query && !loading)) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden"
          >
            {results.length > 0 ? (
              <div className="max-h-96 overflow-y-auto custom-scrollbar">
                {results.map((pokemon, index) => {
                  const id = pokemon.url ? getPokemonId(pokemon.url) : 0;
                  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
                  
                  return (
                    <motion.button
                      key={pokemon.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => handleSelectPokemon(pokemon.name, id)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-700/50 transition-all duration-200 flex items-center gap-3 ${
                        selectedIndex === index ? 'bg-gray-700/50' : ''
                      }`}
                    >
                      {/* Image du Pokémon */}
                      <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={pokemon.name}
                          className="w-10 h-10 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png';
                          }}
                        />
                      </div>
                      
                      {/* Infos Pokémon */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400">#{String(id).padStart(3, '0')}</span>
                          <span className="font-semibold text-white capitalize">
                            {pokemon.name}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          Click to view details
                        </div>
                      </div>

                      {/* Icône de flèche */}
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.button>
                  );
                })}
              </div>
            ) : (
              // État "Aucun résultat"
              <div className="px-4 py-8 text-center">
                <div className="text-4xl mb-2">🔍</div>
                <p className="text-gray-400 font-medium">No Pokémon found</p>
                <p className="text-gray-500 text-sm mt-1">
                  Try searching by name or number
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicateur de frappe */}
      {query && !loading && results.length === 0 && showResults && (
        <div className="absolute z-50 w-full mt-2 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 px-4 py-8 text-center">
          <div className="text-4xl mb-2">⚡</div>
          <p className="text-gray-400">Press Enter to search "{query}"</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;