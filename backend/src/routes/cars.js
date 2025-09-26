import express from 'express';
import { 
  getAllBrands, 
  getBrandModels, 
  getCarDetails
} from '../controllers/carController.js';

const router = express.Router();

// GET /api/cars/brands - Get all available brands
router.get('/brands', async (req, res) => {
  try {
    const brands = await getAllBrands();
    res.json({
      success: true,
      count: Object.keys(brands).length,
      data: brands
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch brands',
      message: error.message
    });
  }
});

// GET /api/cars/brands/:brandId - Get models for specific brand
router.get('/brands/:brandId', async (req, res) => {
  try {
    const { brandId } = req.params;
    const models = await getBrandModels(brandId);
    
    if (!models) {
      return res.status(404).json({
        error: 'Brand not found',
        message: `Brand '${brandId}' does not exist`
      });
    }
    
    res.json({
      success: true,
      brand: brandId,
      count: Object.keys(models.models).length,
      data: models
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch brand models',
      message: error.message
    });
  }
});

// GET /api/cars/brands/:brandId/models/:modelId - Get specific car details
router.get('/brands/:brandId/models/:modelId', async (req, res) => {
  try {
    const { brandId, modelId } = req.params;
    const carDetails = await getCarDetails(brandId, modelId);
    
    if (!carDetails) {
      return res.status(404).json({
        error: 'Car not found',
        message: `Car '${brandId}/${modelId}' does not exist`
      });
    }
    
    res.json({
      success: true,
      brand: brandId,
      model: modelId,
      data: carDetails
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch car details',
      message: error.message
    });
  }
});

export default router;