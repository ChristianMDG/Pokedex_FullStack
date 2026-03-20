import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import PokemonDetailPage from './pages/PokemonDetailPage';
import CustomPokemonsPage from './pages/CustomPokemonsPage';
import CreatePokemonPage from './pages/CreatePokemonPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <nav className="bg-white shadow-lg sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="text-2xl font-bold text-pokemon-red">
                Pokédex
              </Link>
              <div className="flex gap-4">
                <Link
                  to="/"
                  className="text-gray-700 hover:text-pokemon-red transition-colors"
                >
                  Accueil
                </Link>
                <Link
                  to="/custom"
                  className="text-gray-700 hover:text-pokemon-red transition-colors"
                >
                  Mes Pokémon
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pokemon/:nameOrId" element={<PokemonDetailPage />} />
          <Route path="/custom" element={<CustomPokemonsPage />} />
          <Route path="/create" element={<CreatePokemonPage />} />
        </Routes>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10B981',
              },
            },
            error: {
              style: {
                background: '#EF4444',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;