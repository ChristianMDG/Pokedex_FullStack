import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCustomPokemons } from '../hooks/usePokemon';
import LoadingSpinner from '../components/LoadingSpinner';

const CustomPokemonsPage: React.FC = () => {
  const { pokemons, loading, deletePokemon } = useCustomPokemons();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Pokémons Personnalisés</h1>
          <Link
            to="/create"
            className="px-4 py-2 bg-pokemon-red text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            + Créer un Pokémon
          </Link>
        </div>

        {pokemons.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Aucun Pokémon personnalisé pour le moment</p>
            <Link
              to="/create"
              className="inline-block mt-4 px-6 py-2 bg-pokemon-blue text-white rounded-lg hover:bg-blue-700"
            >
              Créer votre premier Pokémon
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {pokemons.map((pokemon, index) => (
              <motion.div
                key={pokemon.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="relative p-4">
                  <img
                    src={pokemon.sprite}
                    alt={pokemon.name}
                    className="w-32 h-32 mx-auto object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128?text=No+Image';
                    }}
                  />
                  <h3 className="text-center text-lg font-semibold capitalize mt-2">
                    {pokemon.name}
                  </h3>
                  <div className="flex justify-center gap-2 mt-2">
                    {pokemon.types.map((type) => (
                      <span
                        key={type}
                        className="px-2 py-1 bg-gray-200 rounded-full text-xs capitalize"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-center gap-2 mt-4">
                    <Link
                      to={`/custom/${pokemon.id}`}
                      className="px-3 py-1 bg-pokemon-blue text-white rounded-lg text-sm hover:bg-blue-700"
                    >
                      Voir
                    </Link>
                    <button
                      onClick={() => deletePokemon(pokemon.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-700"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomPokemonsPage;