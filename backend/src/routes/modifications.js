import express from 'express';
import { 
  getAllModifications, 
  getModificationsByCategory,
  calculateHPGain,
  getColors
} from '../controllers/modificationController.js';

const router = express.Router();

// GET /api/modifications
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    
    if (category) {
      const modifications = await getModificationsByCategory(category);
      return res.json({
        success: true,
        category,
        data: modifications
      });
    }
    
    const allModifications = await getAllModifications();
    res.json({
      success: true,
      data: allModifications
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch modifications',
      message: error.message
    });
  }
});

// GET /api/modifications/categories
router.get('/categories', async (req, res) => {
  try {
    const modifications = await getAllModifications();
    const categories = Object.keys(modifications.modifications || {});
    
    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch categories',
      message: error.message
    });
  }
});

// GET /api/modifications/colors
router.get('/colors', async (req, res) => {
  try {
    const { type } = req.query;
    const colors = await getColors(type);
    
    res.json({
      success: true,
      type: type || 'all',
      data: colors
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch colors',
      message: error.message
    });
  }
});

// POST /api/modifications/calculate
router.post('/calculate', async (req, res) => {
  try {
    const { baseHP, modifications } = req.body;
    
    if (!baseHP || !Array.isArray(modifications)) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'baseHP (number) and modifications (array) are required',
        example: {
          baseHP: 200,
          modifications: ['turbo', 'cold_air_intake']
        }
      });
    }
    
    const result = await calculateHPGain(baseHP, modifications);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      error: 'Calculation failed',
      message: error.message
    });
  }
});

export default router;