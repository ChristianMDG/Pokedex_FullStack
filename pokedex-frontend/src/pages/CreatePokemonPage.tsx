import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomPokemonForm from '../components/CustomPokemonForm';

const CreatePokemonPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate('/custom')}
          className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          ← Retour
        </button>
        <CustomPokemonForm onSuccess={() => navigate('/custom')} />
      </div>
    </div>
  );
};

export default CreatePokemonPage;