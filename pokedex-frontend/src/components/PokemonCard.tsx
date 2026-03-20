import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { PokemonBasic } from '../types/pokemon.types';

interface PokemonCardProps {
  pokemon: PokemonBasic;
  index: number;
}

const typeColors: { [key: string]: string } = {
  normal: 'bg-gray-500',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-500',
  grass: 'bg-green-500',
  ice: 'bg-cyan-500',
  fighting: 'bg-orange-700',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-700',
  flying: 'bg-indigo-400',
  psychic: 'bg-pink-500',
  bug: 'bg-lime-500',
  rock: 'bg-stone-500',
  ghost: 'bg-purple-700',
  dragon: 'bg-indigo-700',
  dark: 'bg-gray-700',
  steel: 'bg-gray-400',
  fairy: 'bg-pink-300',
};

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, index }) => {
  const navigate = useNavigate();
  const pokemonId = pokemon.url.split('/').filter(Boolean).pop();
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="pokemon-card cursor-pointer"
      onClick={() => navigate(`/pokemon/${pokemonId}`)}
    >
      <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 p-6">
        <div className="absolute top-2 right-2 text-sm font-bold text-gray-400">
          #{pokemonId?.padStart(3, '0')}
        </div>
        <img
          src={imageUrl}
          alt={pokemon.name}
          className="w-32 h-32 mx-auto object-contain"
          loading="lazy"
        />
        <h3 className="text-center text-lg font-semibold capitalize mt-4">
          {pokemon.name}
        </h3>
      </div>
    </motion.div>
  );
};

export default PokemonCard;