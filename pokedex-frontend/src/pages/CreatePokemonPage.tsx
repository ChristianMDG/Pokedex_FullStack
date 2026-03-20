import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Github } from 'lucide-react';
import CustomPokemonForm from '../components/CustomPokemonForm';

const CreatePokemonPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header avec effet glassmorphisme */}
      <div className="sticky top-0 z-10 backdrop-blur-lg bg-white/80 border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/custom')}
              className="group flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-indigo-600 transition-all duration-300 rounded-xl hover:bg-indigo-50"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Retour</span>
            </button>
            
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <span className="text-sm font-medium text-gray-600">Créateur Pokémon</span>
            </div>
            
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center p-2 bg-indigo-100 rounded-full mb-4">
            <Sparkles className="w-6 h-6 text-indigo-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Créer votre Pokémon
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Donnez vie à votre créature unique en personnalisant chaque détail. 
            Laissez libre cours à votre imagination !
          </p>
        </div>

        {/* Carte du formulaire */}
        <div className="transform transition-all duration-500 hover:shadow-2xl">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Bandeau décoratif */}
            <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            
            {/* Formulaire */}
            <div className="p-6 md:p-8">
              <CustomPokemonForm onSuccess={() => navigate('/custom')} />
            </div>
          </div>
        </div>

        {/* Conseils pour la création */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">💡</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Inspirez-vous</h3>
            <p className="text-sm text-gray-600">Mélangez les types et créez des combinaisons uniques</p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Équilibrez les stats</h3>
            <p className="text-sm text-gray-600">Un Pokémon équilibré est souvent plus fort</p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Personnalisez</h3>
            <p className="text-sm text-gray-600">Ajoutez une image unique pour votre création</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CreatePokemonPage;