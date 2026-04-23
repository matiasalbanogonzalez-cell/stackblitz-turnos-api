import express from 'express';
import authRoutes from './src/routes/auth.routes.js';
import turnoRoutes from './src/routes/turno.routes.js';

const app = express();

app.use(express.json());

// rutas
app.use('/api/auth', authRoutes);
app.use('/api/turnos', turnoRoutes);

export default app;
