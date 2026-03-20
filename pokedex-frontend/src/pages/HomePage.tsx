import React, { useState } from 'react';
import PokemonCard from '../components/PokemonCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import { usePokemonList } from '../hooks/usePokemon';
import type { PokemonBasic } from '../types/pokemon.types';

const HomePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState<PokemonBasic[] | null>(null);
  const itemsPerPage = 20;
  
  const { pokemons, loading, total } = usePokemonList(itemsPerPage, (currentPage - 1) * itemsPerPage);

  const displayPokemons = searchResults || pokemons;
  const displayTotal = searchResults ? searchResults.length : total;

  const handleSearch = (results: PokemonBasic[]) => {
    setSearchResults(results);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchResults(null);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Pokédex</h1>
          <p className="text-gray-600">Découvrez tous les Pokémon</p>
        </div>

        <div className="flex justify-center mb-8">
          <SearchBar onSearch={handleSearch} />
          {searchResults && (
            <button
              onClick={clearSearch}
              className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Effacer
            </button>
          )}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {displayPokemons.map((pokemon, index) => (
                <PokemonCard key={pokemon.name} pokemon={pokemon} index={index} />
              ))}
            </div>

            {!searchResults && (
              <Pagination
                currentPage={currentPage}
                totalItems={total}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;