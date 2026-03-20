import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { pokemonAPI } from '../services/api';
import { 
  Sparkles, 
  Image, 
  Type, 
  Ruler, 
  Weight, 
  BarChart3, 
  X, 
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import type { PokemonStats } from '../types/pokemon.types';

interface CustomPokemonFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const typeOptions = [
  { value: 'normal', color: 'bg-gray-400', icon: '⚪', name: 'Normal' },
  { value: 'fire', color: 'bg-orange-500', icon: '🔥', name: 'Feu' },
  { value: 'water', color: 'bg-blue-500', icon: '💧', name: 'Eau' },
  { value: 'electric', color: 'bg-yellow-400', icon: '⚡', name: 'Électrik' },
  { value: 'grass', color: 'bg-green-500', icon: '🌿', name: 'Plante' },
  { value: 'ice', color: 'bg-cyan-300', icon: '❄️', name: 'Glace' },
  { value: 'fighting', color: 'bg-red-700', icon: '🥊', name: 'Combat' },
  { value: 'poison', color: 'bg-purple-600', icon: '☠️', name: 'Poison' },
  { value: 'ground', color: 'bg-amber-700', icon: '🌍', name: 'Sol' },
  { value: 'flying', color: 'bg-indigo-300', icon: '🕊️', name: 'Vol' },
  { value: 'psychic', color: 'bg-pink-500', icon: '🔮', name: 'Psy' },
  { value: 'bug', color: 'bg-lime-600', icon: '🐛', name: 'Insecte' },
  { value: 'rock', color: 'bg-stone-600', icon: '🪨', name: 'Roche' },
  { value: 'ghost', color: 'bg-purple-800', icon: '👻', name: 'Spectre' },
  { value: 'dragon', color: 'bg-indigo-700', icon: '🐉', name: 'Dragon' },
  { value: 'dark', color: 'bg-gray-800', icon: '🌑', name: 'Ténèbres' },
  { value: 'steel', color: 'bg-slate-500', icon: '⚙️', name: 'Acier' },
  { value: 'fairy', color: 'bg-pink-300', icon: '✨', name: 'Fée' },
];

const statLabels: Record<string, string> = {
  hp: 'PV',
  attack: 'Attaque',
  defense: 'Défense',
  specialAttack: 'Att. Spé',
  specialDefense: 'Déf. Spé',
  speed: 'Vitesse',
};

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string>('');
  const [focusedField, setFocusedField] = useState<string>('');

  const handleTypeChange = (type: string) => {
    setFormData(prev => {
      if (prev.types.includes(type)) {
        return { ...prev, types: prev.types.filter(t => t !== type) };
      }
      if (prev.types.length < 2) {
        return { ...prev, types: [...prev.types, type] };
      }
      toast.error('Un Pokémon ne peut avoir que 2 types maximum', {
        icon: '⚠️',
        style: { background: '#fef2f2', color: '#991b1b' }
      });
      return prev;
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Le nom doit contenir au moins 3 caractères';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Le nom ne doit pas dépasser 50 caractères';
    }
    
    if (formData.types.length === 0) {
      newErrors.types = 'Au moins un type est requis';
    }
    
    if (!formData.sprite.trim()) {
      newErrors.sprite = 'L\'URL du sprite est requise';
    } else if (!/^https?:\/\/.+/.test(formData.sprite)) {
      newErrors.sprite = 'URL invalide (doit commencer par http:// ou https://)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    try {
      setLoading(true);
      await pokemonAPI.createCustomPokemon({
        name: formData.name.trim(),
        types: formData.types,
        sprite: formData.sprite.trim(),
        height: formData.height ? Number(formData.height) : undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
        stats: formData.stats,
      });
      
      toast.success('Pokémon créé avec succès ! 🎉', {
        duration: 3000,
        icon: '✨',
        style: { background: '#10b981', color: 'white' }
      });
      
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error creating pokemon:', error);
      toast.error(error.message || 'Erreur lors de la création du Pokémon', {
        icon: '❌',
        duration: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageLoad = (url: string) => {
    const img = new Image();
    img.onload = () => setImagePreview(url);
    img.onerror = () => setImagePreview('');
    img.src = url;
  };

  const handleStatChange = (stat: string, value: number) => {
    setFormData({
      ...formData,
      stats: { ...formData.stats, [stat]: Math.min(255, Math.max(1, value)) }
    });
  };

  const getStatColor = (value: number) => {
    if (value < 50) return 'bg-red-400';
    if (value < 100) return 'bg-yellow-400';
    if (value < 150) return 'bg-green-400';
    return 'bg-blue-400';
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl mx-auto"
    >
      {/* Header avec dégradé */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-white animate-pulse" />
            <div>
              <h2 className="text-2xl font-bold text-white">Créer un Pokémon</h2>
              <p className="text-red-100 text-sm mt-1">Donnez vie à votre création unique</p>
            </div>
          </div>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Nom du Pokémon */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Sparkles className="w-4 h-4 text-red-500" />
            Nom du Pokémon
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField('')}
            className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none ${
              errors.name 
                ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-500' 
                : focusedField === 'name'
                ? 'border-red-500 ring-2 ring-red-200'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            placeholder="ex: Pikachu, Dracaufeu, MonstreLégendaire..."
          />
          {errors.name && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm text-red-500 flex items-center gap-1"
            >
              <AlertCircle className="w-3 h-3" />
              {errors.name}
            </motion.p>
          )}
        </div>

        {/* Types */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Type className="w-4 h-4 text-red-500" />
            Types (max 2)
            <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {typeOptions.map(type => (
              <motion.button
                key={type.value}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTypeChange(type.value)}
                className={`px-3 py-2 rounded-xl text-sm font-semibold capitalize transition-all flex items-center gap-2 ${
                  formData.types.includes(type.value)
                    ? `${type.color} text-white shadow-md`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{type.icon}</span>
                <span>{type.name}</span>
                {formData.types.includes(type.value) && (
                  <CheckCircle2 className="w-3 h-3" />
                )}
              </motion.button>
            ))}
          </div>
          {errors.types && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm text-red-500 flex items-center gap-1"
            >
              <AlertCircle className="w-3 h-3" />
              {errors.types}
            </motion.p>
          )}
        </div>

        {/* Sprite URL et Preview */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Image className="w-4 h-4 text-red-500" />
            Image du Pokémon
            <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <input
                type="url"
                value={formData.sprite}
                onChange={(e) => {
                  setFormData({ ...formData, sprite: e.target.value });
                  if (e.target.value) handleImageLoad(e.target.value);
                }}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${
                  errors.sprite 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                }`}
                placeholder="https://exemple.com/sprite.png"
              />
              {errors.sprite && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.sprite}
                </motion.p>
              )}
            </div>
            <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-3 flex items-center justify-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-24 w-24 object-contain" />
              ) : (
                <div className="text-center">
                  <Image className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Aperçu</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Taille et Poids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Ruler className="w-4 h-4 text-red-500" />
              Taille (dm)
            </label>
            <input
              type="number"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
              placeholder="ex: 6"
              step="0.1"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Weight className="w-4 h-4 text-red-500" />
              Poids (hg)
            </label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
              placeholder="ex: 85"
              step="0.1"
            />
          </div>
        </div>

        {/* Statistiques */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <BarChart3 className="w-4 h-4 text-red-500" />
            Statistiques
          </label>
          <div className="space-y-3">
            {Object.entries(formData.stats).map(([stat, value]) => (
              <motion.div
                key={stat}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-2"
              >
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-600 capitalize">
                    {statLabels[stat]}
                  </label>
                  <span className="text-sm font-bold text-gray-700">{value}</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="255"
                    value={value}
                    onChange={(e) => handleStatChange(stat, Number(e.target.value))}
                    className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${getStatColor(value)} 0%, ${getStatColor(value)} ${(value / 255) * 100}%, #e5e7eb ${(value / 255) * 100}%)`
                    }}
                  />
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => handleStatChange(stat, Number(e.target.value))}
                    className="w-20 px-2 py-1 border border-gray-200 rounded-lg text-center text-sm"
                    min="1"
                    max="255"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-3 pt-4">
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Création en cours...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                <span>Créer mon Pokémon</span>
              </div>
            )}
          </motion.button>
          
          {onCancel && (
            <motion.button
              type="button"
              onClick={onCancel}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Annuler
            </motion.button>
          )}
        </div>
      </div>
    </motion.form>
  );
};

export default CustomPokemonForm;