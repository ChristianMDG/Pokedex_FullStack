import React, { useState, useEffect, useCallback } from 'react';
import PokemonCard from '../components/PokemonCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import { usePokemonList } from '../hooks/usePokemon';
import type { PokemonBasic } from '../types/pokemon.types';

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header avec animation */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent mb-4">
            Pokédex
          </h1>
          <p className="text-gray-600 text-lg">
            Découvrez et explorez l'univers des Pokémon
          </p>
          {hasSearched && searchTerm && (
            <div className="mt-2 text-sm text-blue-600">
              {searchResults?.length || 0} résultat(s) trouvé(s) pour "{searchTerm}"
            </div>
          )}
        </div>

        {/* Barre de recherche améliorée */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-2xl">
            <SearchBar onSearch={handleSearch} />
          </div>
          {/* Le bouton Effacer s'affiche uniquement si une recherche a été effectuée */}
          {hasSearched && (
            <button
              onClick={clearSearch}
              className="ml-3 px-5 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              aria-label="Effacer la recherche"
            >
              ✕ Effacer
            </button>
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
            {currentItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Aucun Pokémon trouvé
                </h3>
                <p className="text-gray-500">
                  Essayez un autre nom ou numéro
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
                {currentItems.map((pokemon, index) => (
                  <div
                    key={pokemon.name}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <PokemonCard pokemon={pokemon} index={index} />
                  </div>
                ))}
              </div>
            )}

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
                <div className="flex justify-center items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Précédent
                  </button>
                  <span className="px-4 py-2 text-gray-700">
                    Page {currentPage} sur {Math.ceil(searchResults.length / itemsPerPage)}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(Math.ceil(searchResults.length / itemsPerPage), prev + 1))}
                    disabled={currentPage === Math.ceil(searchResults.length / itemsPerPage)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Suivant →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bouton retour en haut */}
      {!loading && displayPokemons.length > 0 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Retour en haut"
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default HomePage;