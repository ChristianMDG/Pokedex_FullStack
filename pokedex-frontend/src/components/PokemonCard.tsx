import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { PokemonBasic } from '../types/pokemon.types';

interface PokemonCardProps {
  pokemon: PokemonBasic;
  index?: number;
}

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    normal: 'bg-gray-500',
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

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, index = 0 }) => {
  // Fonction pour extraire l'ID du Pokémon de différentes sources possibles
  const getPokemonId = (): number => {
    // Si l'ID est directement disponible
    if ('id' in pokemon && pokemon.id) {
      return typeof pokemon.id === 'number' ? pokemon.id : parseInt(pokemon.id);
    }
    
    // Si l'URL est disponible (format API standard)
    if (pokemon.url) {
      const matches = pokemon.url.match(/\/pokemon\/(\d+)/);
      if (matches) return parseInt(matches[1]);
    }
    
    // Si le nom contient un numéro (format custom)
    if (pokemon.name) {
      const nameMatch = pokemon.name.match(/\d+/);
      if (nameMatch) return parseInt(nameMatch[0]);
    }
    
    // Fallback: utiliser l'index
    return index + 1;
  };

  const pokemonId = getPokemonId();
  
  // Construction de l'URL de l'image
  const getImageUrl = (): string => {
    // Si le sprite est directement disponible (Pokémon custom)
    if ('sprite' in pokemon && pokemon.sprite) {
      return pokemon.sprite;
    }
    
    // Sinon, utiliser l'image officielle
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
  };

  const imageUrl = getImageUrl();
  
  // Récupération du nom formaté
  const displayName = pokemon.name || `Pokémon #${pokemonId}`;
  
  // Récupération des types (pour les Pokémon custom)
  const types = 'types' in pokemon && pokemon.types ? pokemon.types : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="group relative"
    >
      <Link to={`/pokemon/${pokemonId}`}>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700 hover:border-red-500/50 transition-all duration-300 h-full">
          <div className="p-6">
            {/* Badge pour Pokémon custom */}
            {'sprite' in pokemon && pokemon.sprite && (
              <div className="absolute top-3 right-3 z-10">
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                  ✨ Custom
                </div>
              </div>
            )}

            {/* Pokémon Number */}
            <div className="text-right text-sm text-gray-500 mb-2">
              #{String(pokemonId).padStart(3, '0')}
            </div>

            {/* Pokémon Image */}
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
              <motion.img
                whileHover={{ scale: 1.1 }}
                src={imageUrl}
                alt={displayName}
                className="w-32 h-32 mx-auto object-contain"
                onError={(e) => {
                  // Fallback image en cas d'erreur
                  (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png';
                }}
              />
            </div>

            {/* Pokémon Name */}
            <h3 className="text-lg font-bold text-white text-center mb-3 capitalize">
              {displayName}
            </h3>

            {/* Types */}
            {types.length > 0 ? (
              <div className="flex flex-wrap gap-2 justify-center">
                {types.map((type) => (
                  <span
                    key={type}
                    className={`px-3 py-1 ${getTypeColor(type)} rounded-full text-xs font-medium text-white shadow-sm`}
                  >
                    {type}
                  </span>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-gray-700 rounded-full text-xs font-medium text-gray-300">
                  Pokémon
                </span>
              </div>
            )}
          </div>

          {/* Hover Glow Effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-red-700/10 rounded-2xl" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PokemonCard;