import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CARS_DB_PATH = path.join(__dirname, '../data/cars.json');

let carsDatabase = null;

const loadCarsDatabase = async () => {
  if (!carsDatabase) {
    try {
      const data = await fs.readFile(CARS_DB_PATH, 'utf8');
      carsDatabase = JSON.parse(data);
      console.log('✅ Cars database loaded');
    } catch (error) {
      console.error('❌ Failed to load cars database:', error.message);
      carsDatabase = { brands: {} };
    }
  }
  return carsDatabase;
};

// Get all brands
export const getAllBrands = async () => {
  const db = await loadCarsDatabase();
  
  const brands = {};
  for (const [brandId, brandData] of Object.entries(db.brands)) {
    brands[brandId] = {
      name: brandData.name,
      logo: brandData.logo,
      modelCount: Object.keys(brandData.models || {}).length,
      models: Object.keys(brandData.models || {})
    };
  }
  
  return brands;
};

// Get models for a specific brand
export const getBrandModels = async (brandId) => {
  const db = await loadCarsDatabase();
  
  const brand = db.brands[brandId.toLowerCase()];
  if (!brand) {
    return null;
  }
  
  return {
    brandName: brand.name,
    logo: brand.logo,
    models: brand.models
  };
};

// Get specific car details
export const getCarDetails = async (brandId, modelId) => {
  const db = await loadCarsDatabase();
  
  const brand = db.brands[brandId.toLowerCase()];
  if (!brand) return null;
  
  const model = brand.models[modelId.toLowerCase()];
  if (!model) return null;
  
  return {
    ...model,
    brandName: brand.name,
    brandLogo: brand.logo,
    id: `${brandId}_${modelId}`
  };
};