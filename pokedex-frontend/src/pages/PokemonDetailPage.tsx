import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PokemonDetailComponent from '../components/PokemonDetail';
import LoadingSpinner from '../components/LoadingSpinner';
import { usePokemonDetail } from '../hooks/usePokemon';

const PokemonDetailPage: React.FC = () => {
  const { nameOrId } = useParams<{ nameOrId: string }>();
  const navigate = useNavigate();
  const { pokemon, loading } = usePokemonDetail(nameOrId || '');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Pokémon non trouvé</h2>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-pokemon-red text-white rounded-lg hover:bg-red-700"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate('/')}
          className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          ← Retour
        </button>
        <PokemonDetailComponent pokemon={pokemon} />
      </div>
    </div>
  );
};

export default PokemonDetailPage;