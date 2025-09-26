// backend/src/routes/nhtsa.js
import express from 'express';
import { 
  searchVehicle, 
  getVehicleSpecs,
  validateVehicleData 
} from '../controllers/nhtsaController.js';

const router = express.Router();

// GET /api/nhtsa/search - Search NHTSA database
router.get('/search', async (req, res) => {
  try {
    const { make, model, year } = req.query;
    
    if (!make || !model || !year) {
      return res.status(400).json({
        error: 'Missing parameters',
        message: 'make, model, and year are required'
      });
    }
    
    const results = await searchVehicle(make, model, year);
    
    res.json({
      success: true,
      query: { make, model, year },
      count: results.length,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      error: 'NHTSA search failed',
      message: error.message
    });
  }
});

// GET /api/nhtsa/specs/:vehicleId - Get detailed specs for vehicle
router.get('/specs/:vehicleId', async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const specs = await getVehicleSpecs(vehicleId);
    
    if (!specs) {
      return res.status(404).json({
        error: 'Vehicle not found',
        message: `Vehicle ID ${vehicleId} not found in NHTSA database`
      });
    }
    
    res.json({
      success: true,
      vehicleId,
      data: specs
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch vehicle specs',
      message: error.message
    });
  }
});

// POST /api/nhtsa/validate - Validate vehicle data against NHTSA
router.post('/validate', async (req, res) => {
  try {
    const { make, model, year, specs } = req.body;
    
    if (!make || !model || !year) {
      return res.status(400).json({
        error: 'Missing parameters',
        message: 'make, model, and year are required'
      });
    }
    
    const validation = await validateVehicleData(make, model, year, specs);
    
    res.json({
      success: true,
      vehicle: { make, model, year },
      validation
    });
  } catch (error) {
    res.status(500).json({
      error: 'Validation failed',
      message: error.message
    });
  }
});

// GET /api/nhtsa/makes - Get all available makes
router.get('/makes', async (req, res) => {
  try {
    // This would fetch from NHTSA API in production
    const makes = [
      'Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes-Benz', 
      'Audi', 'Volkswagen', 'Chevrolet', 'Nissan', 'Mazda',
      'Subaru', 'Hyundai', 'Kia', 'Lexus', 'Infiniti',
      'Acura', 'Cadillac', 'Buick', 'GMC', 'Dodge'
    ];
    
    res.json({
      success: true,
      count: makes.length,
      data: makes
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch makes',
      message: error.message
    });
  }
});

// GET /api/nhtsa/models/:make/:year - Get models for make/year
router.get('/models/:make/:year', async (req, res) => {
  try {
    const { make, year } = req.params;
    
    // This would fetch from NHTSA API in production
    const models = {
      'toyota': ['Corolla', 'Camry', 'RAV4', 'Supra', 'Prius'],
      'honda': ['Civic', 'Accord', 'CR-V', 'NSX', 'Pilot'],
      'ford': ['Mustang', 'F-150', 'Focus', 'Explorer', 'Escape']
    };
    
    const makeModels = models[make.toLowerCase()] || [];
    
    res.json({
      success: true,
      make,
      year,
      count: makeModels.length,
      data: makeModels
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch models',
      message: error.message
    });
  }
});

export default router;