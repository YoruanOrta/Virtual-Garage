// backend/src/controllers/nhtsaController.js
import axios from 'axios';

const NHTSA_BASE_URL = 'https://vpic.nhtsa.dot.gov/api';

// Search for vehicle in NHTSA database
export const searchVehicle = async (make, model, year) => {
  try {
    // NHTSA API endpoint for vehicle models
    const url = `${NHTSA_BASE_URL}/vehicles/GetModelsForMakeYear/make/${make}/modelyear/${year}?format=json`;
    
    const response = await axios.get(url);
    const data = response.data;
    
    if (!data.Results || data.Results.length === 0) {
      return [];
    }
    
    // Filter results by model name if provided
    let results = data.Results;
    if (model && model.toLowerCase() !== 'all') {
      results = results.filter(vehicle => 
        vehicle.Model_Name.toLowerCase().includes(model.toLowerCase())
      );
    }
    
    // Transform data to our format
    return results.map(vehicle => ({
      make: vehicle.Make_Name,
      model: vehicle.Model_Name,
      year: year,
      vehicleId: vehicle.Model_ID,
      makeId: vehicle.Make_ID
    }));
    
  } catch (error) {
    console.error('NHTSA API Error:', error.message);
    
    // Return mock data if API fails
    return getMockVehicleData(make, model, year);
  }
};

// Get detailed specifications for a vehicle
export const getVehicleSpecs = async (vehicleId) => {
  try {
    // NHTSA endpoint for vehicle specifications
    const url = `${NHTSA_BASE_URL}/vehicles/GetVehicleVariableValuesList/${vehicleId}?format=json`;
    
    const response = await axios.get(url);
    const data = response.data;
    
    if (!data.Results || data.Results.length === 0) {
      return null;
    }
    
    // Extract relevant specifications
    const specs = {};
    data.Results.forEach(item => {
      switch (item.Variable) {
        case 'Engine Power (kW)':
          specs.enginePowerKW = item.Value;
          specs.horsePower = Math.round(parseFloat(item.Value) * 1.34102); // Convert kW to HP
          break;
        case 'Engine Configuration':
          specs.engineConfiguration = item.Value;
          break;
        case 'Fuel Type - Primary':
          specs.fuelType = item.Value;
          break;
        case 'Displacement (L)':
          specs.displacement = item.Value;
          break;
        case 'Drive Type':
          specs.drivetrain = item.Value;
          break;
        case 'Transmission Style':
          specs.transmission = item.Value;
          break;
      }
    });
    
    return {
      vehicleId,
      specifications: specs,
      dataSource: 'NHTSA',
      lastUpdated: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('NHTSA Specs API Error:', error.message);
    return null;
  }
};

// Validate our vehicle data against NHTSA
export const validateVehicleData = async (make, model, year, ourSpecs) => {
  try {
    const nhtsaData = await searchVehicle(make, model, year);
    
    if (nhtsaData.length === 0) {
      return {
        isValid: false,
        reason: 'Vehicle not found in NHTSA database',
        confidence: 0
      };
    }
    
    // Get detailed specs for first match
    const vehicleSpecs = await getVehicleSpecs(nhtsaData[0].vehicleId);
    
    if (!vehicleSpecs) {
      return {
        isValid: true,
        reason: 'Vehicle exists but detailed specs not available',
        confidence: 0.5
      };
    }
    
    // Compare specifications
    let matches = 0;
    let total = 0;
    const differences = [];
    
    if (ourSpecs.horsePower && vehicleSpecs.specifications.horsePower) {
      total++;
      const hpDiff = Math.abs(ourSpecs.horsePower - vehicleSpecs.specifications.horsePower);
      const hpTolerance = ourSpecs.horsePower * 0.1; // 10% tolerance
      
      if (hpDiff <= hpTolerance) {
        matches++;
      } else {
        differences.push({
          field: 'horsePower',
          our: ourSpecs.horsePower,
          nhtsa: vehicleSpecs.specifications.horsePower,
          difference: hpDiff
        });
      }
    }
    
    const confidence = total > 0 ? matches / total : 0.5;
    
    return {
      isValid: confidence >= 0.7,
      confidence,
      nhtsaData: vehicleSpecs.specifications,
      differences,
      matches,
      total
    };
    
  } catch (error) {
    console.error('Validation Error:', error.message);
    return {
      isValid: false,
      reason: 'Validation failed due to API error',
      confidence: 0
    };
  }
};

// Mock data fallback when NHTSA API is unavailable
const getMockVehicleData = (make, model, year) => {
  const mockData = {
    'toyota': {
      'corolla': { horsePower: 169, engine: '2.0L 4-Cylinder' },
      'supra': { horsePower: 382, engine: '3.0L Twin-Turbo I6' },
      'rav4': { horsePower: 203, engine: '2.5L 4-Cylinder' }
    },
    'honda': {
      'civic': { horsePower: 180, engine: '1.5L Turbo 4-Cylinder' },
      'accord': { horsePower: 192, engine: '1.5L Turbo 4-Cylinder' },
      'nsx': { horsePower: 573, engine: '3.5L Twin-Turbo V6 Hybrid' }
    },
    'ford': {
      'mustang': { horsePower: 486, engine: '5.0L V8' },
      'f-150': { horsePower: 450, engine: '3.5L Twin-Turbo V6' },
      'focus': { horsePower: 350, engine: '2.3L Turbo 4-Cylinder' }
    }
  };
  
  const makeData = mockData[make.toLowerCase()];
  const modelData = makeData?.[model.toLowerCase()];
  
  if (modelData) {
    return [{
      make: make,
      model: model,
      year: year,
      vehicleId: `mock_${make}_${model}_${year}`,
      specifications: {
        horsePower: modelData.horsePower,
        engine: modelData.engine,
        dataSource: 'Mock Data'
      }
    }];
  }
  
  return [];
};