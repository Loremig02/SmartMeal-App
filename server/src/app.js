import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Import routes
import authRoutes from './routes/auth.routes.js';
import alimentiRoutes from './routes/alimenti.routes.js';
import ricetteRoutes from './routes/ricette.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

// Import middlewares
import { authMiddleware } from './middlewares/auth.middleware.js';

// Import jobs
import { initExpiryNotificationJob, runNotificationNow } from './jobs/expiry-notification.job.js';

// Carica variabili d'ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware di sicurezza
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuti
  max: 100, // limite di 100 richieste per IP
  message: 'Troppe richieste da questo IP, riprova più tardi.'
});
app.use('/api/', limiter);

// Parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging (solo in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'SmartMeal API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/alimenti', authMiddleware, alimentiRoutes);
app.use('/api/ricette', authMiddleware, ricetteRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);

// Test route per notifiche (solo in development)
if (process.env.NODE_ENV !== 'production') {
  app.get('/api/test/notify', authMiddleware, async (req, res) => {
    try {
      await runNotificationNow();
      res.json({
        success: true,
        message: 'Job notifiche eseguito con successo. Controlla il log del server per i dettagli.'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint non trovato' });
});

// Error handler globale
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Errore interno del server',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Avvio server
app.listen(PORT, () => {
  console.log(`🚀 Server SmartMeal avviato su http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);

  // Inizializza job notifiche email
  if (process.env.NODE_ENV !== 'test') {
    initExpiryNotificationJob();
    console.log('📧 Job notifiche email inizializzato');
  }
});

export default app;
