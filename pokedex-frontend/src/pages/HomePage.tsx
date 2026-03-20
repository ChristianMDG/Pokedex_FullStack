import React, { useState, useEffect, useCallback } from 'react';
import PokemonCard from '../components/PokemonCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import { usePokemonList } from '../hooks/usePokemon';
import type { PokemonBasic } from '../types/pokemon.types';
import { motion, AnimatePresence } from 'framer-motion';

const HomePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState<PokemonBasic[] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const itemsPerPage = 20;
  
  const { pokemons, loading, total, error, refetch } = usePokemonList(
    itemsPerPage, 
    (currentPage - 1) * itemsPerPage
  );

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const displayPokemons = searchResults || pokemons;
  const displayTotal = searchResults ? searchResults.length : total;
  const totalPages = Math.ceil(displayTotal / itemsPerPage);

  const handleSearch = useCallback((results: PokemonBasic[], term: string) => {
    setSearchResults(results);
    setSearchTerm(term);
    setCurrentPage(1);
    setHasSearched(true);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchResults(null);
    setSearchTerm('');
    setCurrentPage(1);
    setHasSearched(false);
    refetch();
  }, [refetch]);

  // Get current items for pagination when searching
  const getCurrentItems = () => {
    if (!searchResults) return displayPokemons;
    const startIndex = (currentPage - 1) * itemsPerPage;
    return searchResults.slice(startIndex, startIndex + itemsPerPage);
  };

  const currentItems = getCurrentItems();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-gray-800 rounded-xl shadow-lg max-w-md border border-gray-700"
        >
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Error</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header moderne avec gradient */}
      <div className="bg-gradient-to-br from-red-600 via-red-700 to-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-block">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                    <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/>
                  </svg>
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                Pokédex
              </h1>
              <p className="text-red-200 text-lg">
                Discover and explore the world of Pokémon
              </p>
              {hasSearched && searchTerm && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 inline-block px-4 py-2 bg-red-500/20 backdrop-blur-sm rounded-lg"
                >
                  <span className="text-red-200 text-sm">
                    {searchResults?.length || 0} result(s) found for "{searchTerm}"
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barre de recherche */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-2xl">
            <SearchBar onSearch={handleSearch} />
          </div>
          {hasSearched && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              onClick={clearSearch}
              className="ml-3 px-5 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 hover:text-white transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label="Clear search"
            >
              ✕ Clear
            </motion.button>
          )}
        </div>

        {/* Loading state */}
        {loading && !searchResults ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {/* Grille des Pokémon */}
            <AnimatePresence mode="wait">
              {currentItems.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-20"
                >
                  <div className="text-8xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    No Pokémon Found
                  </h3>
                  <p className="text-gray-400">
                    Try a different name or number
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
                    {currentItems.map((pokemon, index) => (
                      <div
                        key={pokemon.name || pokemon.id || index}
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <PokemonCard pokemon={pokemon} index={index} />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination pour la liste principale */}
            {!searchResults && totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalItems={total}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}

            {/* Pagination pour les résultats de recherche */}
            {searchResults && searchResults.length > itemsPerPage && (
              <div className="mt-8">
                <div className="flex justify-center items-center gap-3">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-5 py-2.5 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border border-gray-700"
                  >
                    ← Previous
                  </button>
                  <span className="px-4 py-2 text-gray-300">
                    Page {currentPage} of {Math.ceil(searchResults.length / itemsPerPage)}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(Math.ceil(searchResults.length / itemsPerPage), prev + 1))}
                    disabled={currentPage === Math.ceil(searchResults.length / itemsPerPage)}
                    className="px-5 py-2.5 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border border-gray-700"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bouton retour en haut */}
      {!loading && displayPokemons.length > 0 && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          aria-label="Back to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      )}
    </div>
  );
};

export default HomePage;