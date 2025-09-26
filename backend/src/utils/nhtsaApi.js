// backend/src/utils/nhtsaApi.js
/**
 * NHTSA API utilities for fetching real vehicle data
 */

import axios from 'axios';

const NHTSA_BASE_URL = 'https://vpic.nhtsa.dot.gov/api';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// In-memory cache for NHTSA responses
const cache = new Map();

export const NHTSAApi = {
  // Get all makes for a specific year
  async getMakesForYear(year = new Date().getFullYear()) {
    const cacheKey = `makes_${year}`;
    
    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
      }
    }
    
    try {
      const url = `${NHTSA_BASE_URL}/vehicles/GetMakesForVehicleType/car?format=json`;
      const response = await axios.get(url, { timeout: 10000 });
      
      const makes = response.data.Results.map(make => ({
        id: make.MakeId,
        name: make.MakeName
      }));
      
      // Cache the result
      cache.set(cacheKey, {
        data: makes,
        timestamp: Date.now()
      });
      
      return makes;
    } catch (error) {
      console.error('NHTSA getMakesForYear error:', error.message);
      return this.getFallbackMakes();
    }
  },

  // Get models for a specific make and year
  async getModelsForMakeYear(make, year) {
    const cacheKey = `models_${make}_${year}`;
    
    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
      }
    }
    
    try {
      const url = `${NHTSA_BASE_URL}/vehicles/GetModelsForMakeYear/make/${encodeURIComponent(make)}/modelyear/${year}?format=json`;
      const response = await axios.get(url, { timeout: 10000 });
      
      const models = response.data.Results.map(model => ({
        id: model.Model_ID,
        name: model.Model_Name,
        makeId: model.Make_ID,
        makeName: model.Make_Name
      }));
      
      cache.set(cacheKey, {
        data: models,
        timestamp: Date.now()
      });
      
      return models;
    } catch (error) {
      console.error('NHTSA getModelsForMakeYear error:', error.message);
      return this.getFallbackModels(make);
    }
  },

  // Get detailed vehicle specifications
  async getVehicleSpecs(make, model, year) {
    const cacheKey = `specs_${make}_${model}_${year}`;
    
    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
      }
    }
    
    try {
      // First get the vehicle ID
      const models = await this.getModelsForMakeYear(make, year);
      const targetModel = models.find(m => 
        m.name.toLowerCase().includes(model.toLowerCase())
      );
      
      if (!targetModel) {
        throw new Error(`Model ${model} not found for ${make} ${year}`);
      }
      
      // Then get detailed specs using the model ID
      const specsUrl = `${NHTSA_BASE_URL}/vehicles/GetVehicleVariableValuesList/${targetModel.id}?format=json`;
      const specsResponse = await axios.get(specsUrl, { timeout: 15000 });
      
      const specs = this.parseNHTSASpecs(specsResponse.data.Results);
      
      cache.set(cacheKey, {
        data: specs,
        timestamp: Date.now()
      });
      
      return specs;
    } catch (error) {
      console.error('NHTSA getVehicleSpecs error:', error.message);
      return this.getFallbackSpecs(make, model, year);
    }
  },

  // Parse NHTSA specifications into our format
  parseNHTSASpecs(nhtsaResults) {
    const specs = {
      engine: {},
      performance: {},
      dimensions: {},
      features: {}
    };
    
    nhtsaResults.forEach(item => {
      const variable = item.Variable;
      const value = item.Value;
      
      if (!value || value === 'Not Applicable' || value === '') return;
      
      switch (variable) {
        case 'Engine Power (kW)':
          specs.engine.powerKW = parseFloat(value);
          specs.engine.horsePower = Math.round(parseFloat(value) * 1.34102);
          break;
        case 'Engine Configuration':
          specs.engine.configuration = value;
          break;
        case 'Displacement (L)':
          specs.engine.displacement = value;
          break;
        case 'Engine Cylinders':
          specs.engine.cylinders = parseInt(value);
          break;
        case 'Fuel Type - Primary':
          specs.engine.fuelType = value;
          break;
        case 'Transmission Style':
          specs.performance.transmission = value;
          break;
        case 'Drive Type':
          specs.performance.drivetrain = value;
          break;
        case 'Curb Weight (pounds)':
          specs.dimensions.weight = parseInt(value);
          break;
        case 'Wheelbase (inches)':
          specs.dimensions.wheelbase = parseFloat(value);
          break;
        case 'Overall Length (inches)':
          specs.dimensions.length = parseFloat(value);
          break;
        case 'Overall Width (inches)':
          specs.dimensions.width = parseFloat(value);
          break;
      }
    });
    
    return specs;
  },

  // Validate our database against NHTSA data
  async validateVehicleData(make, model, year, ourData) {
    try {
      const nhtsaSpecs = await this.getVehicleSpecs(make, model, year);
      
      const validation = {
        isValid: true,
        confidence: 0,
        differences: [],
        nhtsaData: nhtsaSpecs
      };
      
      // Compare horsepower
      if (nhtsaSpecs.engine.horsePower && ourData.horsePower) {
        const hpDiff = Math.abs(nhtsaSpecs.engine.horsePower - ourData.horsePower);
        const tolerance = ourData.horsePower * 0.1; // 10% tolerance
        
        if (hpDiff <= tolerance) {
          validation.confidence += 0.4;
        } else {
          validation.differences.push({
            field: 'horsePower',
            our: ourData.horsePower,
            nhtsa: nhtsaSpecs.engine.horsePower,
            difference: hpDiff
          });
        }
      }
      
      // Compare engine displacement
      if (nhtsaSpecs.engine.displacement && ourData.engine) {
        const ourDisplacement = parseFloat(ourData.engine.match(/(\d+\.\d+)L/)?.[1]);
        const nhtsaDisplacement = parseFloat(nhtsaSpecs.engine.displacement);
        
        if (Math.abs(ourDisplacement - nhtsaDisplacement) < 0.2) {
          validation.confidence += 0.3;
        }
      }
      
      // Compare drivetrain
      if (nhtsaSpecs.performance.drivetrain && ourData.drivetrain) {
        const drivetrainMap = {
          'Front-Wheel Drive': 'FWD',
          'Rear-Wheel Drive': 'RWD', 
          'All-Wheel Drive': 'AWD',
          '4WD': '4WD'
        };
        
        const nhtsaDrivetrain = drivetrainMap[nhtsaSpecs.performance.drivetrain];
        if (nhtsaDrivetrain === ourData.drivetrain) {
          validation.confidence += 0.3;
        }
      }
      
      validation.isValid = validation.confidence >= 0.7;
      return validation;
      
    } catch (error) {
      return {
        isValid: false,
        confidence: 0,
        error: error.message
      };
    }
  },

  // Fallback data when NHTSA API is unavailable
  getFallbackMakes() {
    return [
      { id: 1, name: 'Toyota' },
      { id: 2, name: 'Honda' },
      { id: 3, name: 'Ford' },
      { id: 4, name: 'BMW' },
      { id: 5, name: 'Mercedes-Benz' }
    ];
  },

  getFallbackModels(make) {
    const fallbackModels = {
      'Toyota': ['Corolla', 'Camry', 'Supra', 'RAV4'],
      'Honda': ['Civic', 'Accord', 'NSX', 'CR-V'],
      'Ford': ['Mustang', 'F-150', 'Focus', 'Explorer']
    };
    
    return (fallbackModels[make] || []).map((model, index) => ({
      id: `fallback_${index}`,
      name: model,
      makeId: 'fallback',
      makeName: make
    }));
  },

  getFallbackSpecs(make, model, year) {
    return {
      engine: {
        horsePower: 200,
        displacement: '2.0L',
        configuration: 'I4',
        cylinders: 4,
        fuelType: 'Gasoline'
      },
      performance: {
        drivetrain: 'FWD',
        transmission: 'CVT'
      },
      dimensions: {
        weight: 3200
      },
      dataSource: 'Fallback'
    };
  },

  // Clear cache (useful for testing)
  clearCache() {
    cache.clear();
  }
};