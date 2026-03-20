import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { pokemonAPI } from '../services/api';
import type { PokemonStats } from '../types/pokemon.types';

interface CustomPokemonFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const typeOptions = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic',
  'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

const CustomPokemonForm: React.FC<CustomPokemonFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    types: ['normal'] as string[],
    sprite: '',
    height: '',
    weight: '',
    stats: {
      hp: 50,
      attack: 50,
      defense: 50,
      specialAttack: 50,
      specialDefense: 50,
      speed: 50,
    },
  });
  const [loading, setLoading] = useState(false);

  const handleTypeChange = (type: string) => {
    setFormData(prev => {
      if (prev.types.includes(type)) {
        return { ...prev, types: prev.types.filter(t => t !== type) };
      }
      if (prev.types.length < 2) {
        return { ...prev, types: [...prev.types, type] };
      }
      toast.error('Un Pokémon ne peut avoir que 2 types maximum');
      return prev;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Le nom est requis');
      return;
    }
    
    if (formData.types.length === 0) {
      toast.error('Au moins un type est requis');
      return;
    }
    
    if (!formData.sprite.trim()) {
      toast.error('L\'URL du sprite est requise');
      return;
    }

    try {
      setLoading(true);
      await pokemonAPI.createCustomPokemon({
        name: formData.name,
        types: formData.types,
        sprite: formData.sprite,
        height: formData.height ? Number(formData.height) : undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
        stats: formData.stats,
      });
      toast.success('Pokémon créé avec succès !');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating pokemon:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Créer un Pokémon personnalisé</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pokemon-red"
            placeholder="Nom du Pokémon"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Types * (max 2)</label>
          <div className="flex flex-wrap gap-2">
            {typeOptions.map(type => (
              <button
                key={type}
                type="button"
                onClick={() => handleTypeChange(type)}
                className={`px-3 py-1 rounded-full text-sm font-semibold capitalize transition-all ${
                  formData.types.includes(type)
                    ? 'bg-pokemon-red text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sprite URL *</label>
          <input
            type="url"
            value={formData.sprite}
            onChange={(e) => setFormData({ ...formData, sprite: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pokemon-red"
            placeholder="https://exemple.com/sprite.png"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Taille (dm)</label>
            <input
              type="number"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pokemon-red"
              placeholder="Taille"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Poids (hg)</label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pokemon-red"
              placeholder="Poids"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Stats de base</label>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(formData.stats).map(([stat, value]) => (
              <div key={stat}>
                <label className="block text-xs text-gray-600 capitalize mb-1">{stat}</label>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={value}
                  onChange={(e) => setFormData({
                    ...formData,
                    stats: { ...formData.stats, [stat]: Number(e.target.value) }
                  })}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-pokemon-red text-white py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Création...' : 'Créer le Pokémon'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Annuler
          </button>
        )}
      </div>
    </motion.form>
  );
};

export default CustomPokemonForm;