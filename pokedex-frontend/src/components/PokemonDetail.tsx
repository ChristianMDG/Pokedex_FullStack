import React from 'react';
import { motion } from 'framer-motion';
import type { PokemonDetail as PokemonDetailType } from '../types/pokemon.types';

interface PokemonDetailProps {
  pokemon: PokemonDetailType;
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

const statNames: { [key: string]: string } = {
  hp: 'PV',
  attack: 'Attaque',
  defense: 'Défense',
  'special-attack': 'Attaque Spéciale',
  'special-defense': 'Défense Spéciale',
  speed: 'Vitesse',
};

const PokemonDetail: React.FC<PokemonDetailProps> = ({ pokemon }) => {
  const imageUrl = pokemon.sprites.other?.['official-artwork']?.front_default || 
                   pokemon.sprites.front_default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="bg-gradient-to-r from-pokemon-red to-pokemon-blue p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold capitalize">{pokemon.name}</h1>
            <p className="text-lg opacity-90">#{String(pokemon.id).padStart(3, '0')}</p>
          </div>
          <div className="flex gap-2">
            {pokemon.types.map((type) => (
              <span
                key={type.type.name}
                className={`${typeColors[type.type.name]} px-3 py-1 rounded-full text-sm font-semibold capitalize`}
              >
                {type.type.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <img
              src={imageUrl}
              alt={pokemon.name}
              className="w-full max-w-md mx-auto object-contain"
            />
          </div>

          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">Taille</p>
                <p className="text-xl font-bold">{pokemon.height / 10} m</p>
              </div>
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">Poids</p>
                <p className="text-xl font-bold">{pokemon.weight / 10} kg</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Talents</h3>
              <div className="flex flex-wrap gap-2">
                {pokemon.abilities.map((ability) => (
                  <span
                    key={ability.ability.name}
                    className="bg-gray-200 px-3 py-1 rounded-full text-sm capitalize"
                  >
                    {ability.ability.name.replace('-', ' ')}
                    {ability.is_hidden && ' (Caché)'}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Stats</h3>
              <div className="space-y-2">
                {pokemon.stats.map((stat) => (
                  <div key={stat.stat.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{statNames[stat.stat.name] || stat.stat.name}</span>
                      <span className="font-semibold">{stat.base_stat}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-pokemon-red rounded-full h-2 transition-all duration-500"
                        style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PokemonDetail;