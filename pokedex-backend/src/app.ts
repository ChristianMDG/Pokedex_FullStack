import express from 'express';
import cors from 'cors';
import pokemonRoutes from './routes/pokemon.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', pokemonRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Pokedex API is running' });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;