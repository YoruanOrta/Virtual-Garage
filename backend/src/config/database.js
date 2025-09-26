// backend/src/config/database.js
/**
 * Database configuration and connection management
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DatabaseConfig = {
  // Paths to data files
  paths: {
    cars: path.join(__dirname, '../data/cars.json'),
    modifications: path.join(__dirname, '../data/modifications.json'),
    cache: path.join(__dirname, '../data/nhtsa_cache.json'),
    userConfigs: path.join(__dirname, '../data/user_configs.json')
  },

  // Cache settings
  cache: {
    enabled: true,
    ttl: 24 * 60 * 60 * 1000, // 24 hours
    maxSize: 1000 // Max cached items
  },

  // Data validation settings
  validation: {
    enabled: true,
    strictMode: false, // If true, rejects invalid data
    autoFix: true // Attempts to fix minor data issues
  }
};

export class DatabaseManager {
  constructor() {
    this.cache = new Map();
    this.loadedDatabases = new Map();
  }

  // Load and cache database files
  async loadDatabase(type) {
    if (this.loadedDatabases.has(type)) {
      return this.loadedDatabases.get(type);
    }

    const filePath = DatabaseConfig.paths[type];
    if (!filePath) {
      throw new Error(`Unknown database type: ${type}`);
    }

    try {
      const data = await fs.readFile(filePath, 'utf8');
      const parsed = JSON.parse(data);
      
      // Validate data structure
      if (DatabaseConfig.validation.enabled) {
        const validation = await this.validateDatabaseStructure(type, parsed);
        if (!validation.isValid && DatabaseConfig.validation.strictMode) {
          throw new Error(`Invalid database structure: ${validation.errors.join(', ')}`);
        }
        
        // Auto-fix if enabled
        if (DatabaseConfig.validation.autoFix && !validation.isValid) {
          const fixed = await this.fixDatabaseStructure(type, parsed, validation.errors);
          this.loadedDatabases.set(type, fixed);
          console.log(`📊 Database '${type}' loaded with auto-fixes applied`);
          return fixed;
        }
      }
      
      this.loadedDatabases.set(type, parsed);
      console.log(`📊 Database '${type}' loaded successfully`);
      return parsed;
      
    } catch (error) {
      console.error(`❌ Failed to load database '${type}':`, error.message);
      
      // Return fallback data
      const fallback = await this.getFallbackData(type);
      this.loadedDatabases.set(type, fallback);
      return fallback;
    }
  }

  // Save database to file
  async saveDatabase(type, data) {
    const filePath = DatabaseConfig.paths[type];
    if (!filePath) {
      throw new Error(`Unknown database type: ${type}`);
    }

    try {
      const jsonData = JSON.stringify(data, null, 2);
      await fs.writeFile(filePath, jsonData, 'utf8');
      
      // Update cached version
      this.loadedDatabases.set(type, data);
      
      console.log(`💾 Database '${type}' saved successfully`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to save database '${type}':`, error.message);
      return false;
    }
  }

  // Validate database structure
  async validateDatabaseStructure(type, data) {
    const validation = { isValid: true, errors: [] };

    switch (type) {
      case 'cars':
        if (!data.brands || typeof data.brands !== 'object') {
          validation.isValid = false;
          validation.errors.push('Missing or invalid brands object');
        }

        for (const [brandId, brandData] of Object.entries(data.brands || {})) {
          if (!brandData.name || !brandData.models) {
            validation.errors.push(`Brand ${brandId} missing name or models`);
            validation.isValid = false;
          }

          for (const [modelId, modelData] of Object.entries(brandData.models || {})) {
            if (!modelData.baseSpecs?.horsePower || typeof modelData.baseSpecs.horsePower !== 'number') {
              validation.errors.push(`Model ${brandId}/${modelId} missing or invalid horsePower`);
              validation.isValid = false;
            }
          }
        }
        break;

      case 'modifications':
        if (!data.modifications || !data.colors) {
          validation.isValid = false;
          validation.errors.push('Missing modifications or colors object');
        }

        for (const [category, mods] of Object.entries(data.modifications || {})) {
          for (const [modId, modData] of Object.entries(mods)) {
            if (typeof modData.hpGain !== 'number' || typeof modData.price !== 'number') {
              validation.errors.push(`Modification ${category}/${modId} has invalid hpGain or price`);
              validation.isValid = false;
            }
          }
        }
        break;
    }

    return validation;
  }

  // Fix common database structure issues
  async fixDatabaseStructure(type, data, errors) {
    const fixed = JSON.parse(JSON.stringify(data)); // Deep clone

    switch (type) {
      case 'cars':
        // Fix missing brand names
        for (const [brandId, brandData] of Object.entries(fixed.brands || {})) {
          if (!brandData.name) {
            brandData.name = brandId.charAt(0).toUpperCase() + brandId.slice(1);
          }
          
          // Fix missing HP values
          for (const [modelId, modelData] of Object.entries(brandData.models || {})) {
            if (!modelData.baseSpecs) {
              modelData.baseSpecs = {};
            }
            if (!modelData.baseSpecs.horsePower) {
              modelData.baseSpecs.horsePower = 200; // Default reasonable HP
            }
          }
        }
        break;

      case 'modifications':
        // Fix missing numerical values
        for (const [category, mods] of Object.entries(fixed.modifications || {})) {
          for (const [modId, modData] of Object.entries(mods)) {
            if (typeof modData.hpGain !== 'number') {
              modData.hpGain = 0;
            }
            if (typeof modData.price !== 'number') {
              modData.price = 500; // Default price
            }
          }
        }
        break;
    }

    return fixed;
  }

  // Get fallback data when database fails to load
  async getFallbackData(type) {
    const fallbackData = {
      cars: {
        brands: {
          toyota: {
            name: "Toyota",
            logo: "/brands/toyota.png",
            models: {
              corolla_2024: {
                name: "Corolla 2024",
                year: 2024,
                type: "Sedan",
                baseSpecs: {
                  engine: "2.0L 4-Cylinder",
                  horsePower: 169,
                  torque: "151 lb-ft",
                  transmission: "CVT",
                  drivetrain: "FWD"
                },
                model3D: "/models/toyota/corolla_2024.glb",
                defaultColor: "#FFFFFF"
              }
            }
          }
        }
      },
      modifications: {
        modifications: {
          engine: {
            turbo: {
              name: "Turbocharger",
              category: "Engine",
              hpGain: 45,
              price: 2500,
              description: "Increases engine power",
              compatibility: ["naturally_aspirated"]
            }
          }
        },
        colors: {
          solid: {
            white: { name: "Pearl White", hex: "#FFFFFF", price: 0 },
            black: { name: "Jet Black", hex: "#000000", price: 0 }
          }
        }
      },
      cache: {},
      userConfigs: {}
    };

    return fallbackData[type] || {};
  }

  // Backup database
  async backupDatabase(type) {
    const data = await this.loadDatabase(type);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = DatabaseConfig.paths[type].replace('.json', `_backup_${timestamp}.json`);
    
    try {
      await fs.writeFile(backupPath, JSON.stringify(data, null, 2));
      console.log(`💾 Backup created: ${backupPath}`);
      return backupPath;
    } catch (error) {
      console.error('❌ Backup failed:', error.message);
      return null;
    }
  }

  // Get database statistics
  async getDatabaseStats() {
    const stats = {};
    
    try {
      const carsData = await this.loadDatabase('cars');
      const modsData = await this.loadDatabase('modifications');
      
      stats.cars = {
        totalBrands: Object.keys(carsData.brands || {}).length,
        totalModels: Object.values(carsData.brands || {})
          .reduce((sum, brand) => sum + Object.keys(brand.models || {}).length, 0)
      };
      
      stats.modifications = {
        totalCategories: Object.keys(modsData.modifications || {}).length,
        totalModifications: Object.values(modsData.modifications || {})
          .reduce((sum, category) => sum + Object.keys(category).length, 0),
        totalColors: Object.values(modsData.colors || {})
          .reduce((sum, colorType) => sum + Object.keys(colorType).length, 0)
      };
      
      return stats;
    } catch (error) {
      console.error('❌ Failed to get database stats:', error.message);
      return {};
    }
  }

  // Clear all cached data
  clearCache() {
    this.cache.clear();
    this.loadedDatabases.clear();
    console.log('🧹 Database cache cleared');
  }
}

// Export singleton instance
export const dbManager = new DatabaseManager();