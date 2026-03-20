import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomPokemons } from '../hooks/usePokemon';
import LoadingSpinner from '../components/LoadingSpinner';

interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
}

const CustomPokemonsPage: React.FC = () => {
  const { pokemons, loading, deletePokemon } = useCustomPokemons();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'hp' | 'attack'>('name');

  // Extraire tous les types uniques
  const allTypes = useMemo(() => {
    const types = new Set<string>();
    pokemons.forEach(pokemon => {
      pokemon.types.forEach(type => types.add(type));
    });
    return ['all', ...Array.from(types)];
  }, [pokemons]);

  // Filtrer et trier les Pokémon
  const filteredPokemons = useMemo(() => {
    let filtered = pokemons.filter(pokemon => 
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedType !== 'all') {
      filtered = filtered.filter(pokemon =>
        pokemon.types.includes(selectedType)
      );
    }

    return filtered.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'hp') return (b.stats?.hp || 0) - (a.stats?.hp || 0);
      if (sortBy === 'attack') return (b.stats?.attack || 0) - (a.stats?.attack || 0);
      return 0;
    });
  }, [pokemons, searchTerm, selectedType, sortBy]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this Pokémon? This action cannot be undone.')) {
      setDeletingId(id);
      await deletePokemon(id);
      setDeletingId(null);
    }
  };

  // Type color mapping
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      normal: 'bg-gray-400',
      fire: 'bg-orange-500',
      water: 'bg-blue-500',
      electric: 'bg-yellow-400',
      grass: 'bg-green-500',
      ice: 'bg-cyan-400',
      fighting: 'bg-red-700',
      poison: 'bg-purple-600',
      ground: 'bg-amber-600',
      flying: 'bg-indigo-400',
      psychic: 'bg-pink-500',
      bug: 'bg-lime-500',
      rock: 'bg-stone-500',
      ghost: 'bg-purple-800',
      dragon: 'bg-indigo-700',
      dark: 'bg-gray-800',
      steel: 'bg-slate-400',
      fairy: 'bg-pink-300',
    };
    return colors[type.toLowerCase()] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header moderne */}
      <div className="bg-gradient-to-br from-red-600 via-red-700 to-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                    <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Custom Pokédex</h1>
                  <p className="text-red-200 mt-1">Your unique Pokémon collection</p>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Link
                to="/create"
                className="group relative inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-red-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Pokémon
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search your Pokémon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
            />
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {allTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedType === type
                      ? `bg-red-600 text-white shadow-lg shadow-red-600/25`
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
            >
              <option value="name">Sort by Name</option>
              <option value="hp">Sort by HP</option>
              <option value="attack">Sort by Attack</option>
            </select>
          </div>

          {/* Results count */}
          <div className="text-sm text-gray-400">
            {filteredPokemons.length} Pokémon{filteredPokemons.length !== 1 ? 's' : ''} found
          </div>
        </div>

        {/* Pokémon Grid */}
        <AnimatePresence mode="wait">
          {filteredPokemons.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="text-8xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2">No Pokémon Found</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || selectedType !== 'all' 
                  ? "Try adjusting your search or filters"
                  : "Create your first custom Pokémon to get started!"}
              </p>
              {(searchTerm || selectedType !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedType('all');
                  }}
                  className="px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredPokemons.map((pokemon) => (
                  <motion.div
                    key={pokemon.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ y: -8 }}
                    className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700 hover:border-red-500/50 transition-all duration-300"
                  >
                    {/* Card Content */}
                    <div className="p-6">
                      {/* Custom Badge */}
                      <div className="absolute top-3 right-3">
                        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                          ✨ Custom
                        </div>
                      </div>

                      {/* Pokémon Image */}
                      <div className="relative mb-4">
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                        <motion.img
                          whileHover={{ scale: 1.1 }}
                          src={pokemon.sprite}
                          alt={pokemon.name}
                          className="w-32 h-32 mx-auto object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png';
                          }}
                        />
                      </div>

                      {/* Pokémon Name */}
                      <h3 className="text-xl font-bold text-white text-center mb-3 capitalize">
                        {pokemon.name}
                      </h3>

                      {/* Types */}
                      <div className="flex flex-wrap gap-2 justify-center mb-4">
                        {pokemon.types.map((type) => (
                          <span
                            key={type}
                            className={`px-3 py-1 ${getTypeColor(type)} rounded-full text-xs font-medium text-white shadow-sm`}
                          >
                            {type}
                          </span>
                        ))}
                      </div>

                      {/* Stats Preview */}
                      {pokemon.stats && (
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <div className="bg-gray-700/50 rounded-lg p-2 text-center">
                            <div className="text-xs text-gray-400">HP</div>
                            <div className="text-lg font-bold text-white">{pokemon.stats.hp || 0}</div>
                          </div>
                          <div className="bg-gray-700/50 rounded-lg p-2 text-center">
                            <div className="text-xs text-gray-400">ATK</div>
                            <div className="text-lg font-bold text-white">{pokemon.stats.attack || 0}</div>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link
                          to={`/custom/${pokemon.id}`}
                          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-all text-center"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => handleDelete(pokemon.id)}
                          disabled={deletingId === pokemon.id}
                          className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === pokemon.id ? (
                            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-red-700/10 rounded-2xl" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CustomPokemonsPage;