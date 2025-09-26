import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import carRoutes from './routes/cars.js';
import modificationRoutes from './routes/modifications.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/cars', carRoutes);
app.use('/api/modifications', modificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Virtual Garage API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Root endpoint with full documentation
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Virtual Garage API 🚗',
    version: '1.0.0',
    endpoints: {
      // Cars
      brands: '/api/cars/brands',
      toyotaModels: '/api/cars/brands/toyota',
      carDetails: '/api/cars/brands/toyota/models/corolla_2024',
      
      // Modifications
      allModifications: '/api/modifications',
      engineMods: '/api/modifications?category=engine',
      categories: '/api/modifications/categories',
      colors: '/api/modifications/colors',
      calculateHP: 'POST /api/modifications/calculate',
      
      // Health
      health: '/api/health'
    },
    exampleRequests: {
      calculateHP: {
        method: 'POST',
        url: '/api/modifications/calculate',
        body: {
          baseHP: 200,
          modifications: ['turbo', 'cold_air_intake']
        }
      }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `${req.method} ${req.originalUrl} does not exist`,
    availableEndpoints: ['/', '/api/health', '/api/cars/brands', '/api/modifications']
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

// Start server
app.listen(PORT, '127.0.0.1', () => {
  console.log(`🚗 Virtual Garage API running on http://127.0.0.1:${PORT}`);
  console.log(`📚 API Documentation: http://127.0.0.1:${PORT}`);
  console.log(`🏥 Health Check: http://127.0.0.1:${PORT}/api/health`);
  console.log(`🚙 Brands: http://127.0.0.1:${PORT}/api/cars/brands`);
  console.log(`🔧 Modifications: http://127.0.0.1:${PORT}/api/modifications`);
  console.log(`🎨 Colors: http://127.0.0.1:${PORT}/api/modifications/colors`);
});

export default app;