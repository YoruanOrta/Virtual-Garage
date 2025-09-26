// backend/src/utils/calculations.js
/**
 * Utilities for automotive calculations and performance metrics
 */

// HP calculation utilities
export const HPCalculations = {
    // Convert between different HP measurements
    convertHP: {
      // Brake Horsepower to Wheel Horsepower (typical 15% drivetrain loss)
      bhpToWhp: (bhp) => Math.round(bhp * 0.85),
      
      // Kilowatts to Horsepower
      kwToHP: (kw) => Math.round(kw * 1.34102),
      
      // Metric HP to SAE HP
      metricToSAE: (metricHP) => Math.round(metricHP * 0.9863)
    },
  
    // Calculate realistic HP gains based on engine type
    calculateModificationGain: (baseHP, modification, engineType) => {
      let gain = modification.hpGain;
      
      // Apply engine-specific multipliers
      switch (engineType.toLowerCase()) {
        case 'naturally_aspirated':
          // NA engines get full benefit from air mods, less from forced induction
          if (modification.category === 'engine' && modification.name.includes('Turbo')) {
            gain *= 1.2; // Turbo adds more to NA
          }
          break;
          
        case 'turbocharged':
          // Turbo engines benefit more from supporting mods
          if (modification.name.includes('Intercooler')) {
            gain *= 1.3;
          }
          if (modification.name.includes('Exhaust')) {
            gain *= 1.1;
          }
          break;
          
        case 'supercharged':
          // Similar to turbo but different characteristics
          if (modification.name.includes('Intake')) {
            gain *= 1.2;
          }
          break;
      }
      
      // Diminishing returns for high HP builds
      const hpRatio = baseHP / 300; // 300hp as baseline
      if (hpRatio > 1.5) {
        gain *= 0.85; // Reduce gains for very high HP builds
      }
      
      return Math.round(gain);
    },
  
    // Calculate total build HP with synergy bonuses
    calculateTotalBuildHP: (baseHP, modifications, engineType) => {
      let totalGain = 0;
      let synergyBonus = 0;
      
      // Track modification categories for synergy calculation
      const categories = {};
      
      modifications.forEach(mod => {
        // Calculate individual gain
        const individualGain = HPCalculations.calculateModificationGain(baseHP, mod, engineType);
        totalGain += individualGain;
        
        // Track categories
        categories[mod.category] = (categories[mod.category] || 0) + 1;
      });
      
      // Apply synergy bonuses
      if (categories.engine >= 2 && categories.exhaust >= 1) {
        synergyBonus += Math.round(baseHP * 0.05); // 5% bonus for engine+exhaust combo
      }
      
      if (categories.aerodynamics >= 3) {
        synergyBonus += Math.round(baseHP * 0.02); // 2% for full aero package
      }
      
      return {
        baseHP,
        modificationGain: totalGain,
        synergyBonus,
        finalHP: baseHP + totalGain + synergyBonus
      };
    }
  };
  
  // Performance metrics calculations
  export const PerformanceMetrics = {
    // Estimate 0-60 time based on HP and weight
    estimate0to60: (hp, weightLbs, drivetrain = 'FWD') => {
      const powerToWeight = hp / (weightLbs / 1000);
      
      let baseTime;
      if (powerToWeight > 300) baseTime = 4.5;
      else if (powerToWeight > 250) baseTime = 5.5;
      else if (powerToWeight > 200) baseTime = 6.5;
      else if (powerToWeight > 150) baseTime = 8.0;
      else baseTime = 10.0;
      
      // Drivetrain modifiers
      const modifiers = {
        'AWD': 0.9,    // AWD is faster
        'RWD': 1.0,    // Baseline
        'FWD': 1.1     // FWD slightly slower due to traction
      };
      
      return (baseTime * (modifiers[drivetrain] || 1.0)).toFixed(1);
    },
  
    // Estimate quarter mile time
    estimateQuarterMile: (hp, weightLbs) => {
      const powerToWeight = hp / (weightLbs / 1000);
      let time;
      
      if (powerToWeight > 400) time = 12.5;
      else if (powerToWeight > 300) time = 13.5;
      else if (powerToWeight > 250) time = 14.5;
      else if (powerToWeight > 200) time = 15.5;
      else time = 17.0;
      
      return time.toFixed(1);
    },
  
    // Estimate top speed (very rough)
    estimateTopSpeed: (hp, dragCoefficient = 0.35) => {
      // Very simplified calculation - real world has many more factors
      const estimatedSpeed = Math.sqrt(hp / dragCoefficient) * 1.3;
      return Math.round(estimatedSpeed);
    }
  };
  
  // Cost analysis utilities
  export const CostAnalysis = {
    // Calculate cost per HP gained
    costPerHP: (totalCost, hpGained) => {
      if (hpGained === 0) return 0;
      return (totalCost / hpGained).toFixed(2);
    },
  
    // Price categories for modifications
    categorizePriceLevel: (price) => {
      if (price < 500) return 'budget';
      if (price < 1500) return 'moderate';
      if (price < 3000) return 'premium';
      return 'high-end';
    },
  
    // Calculate total build cost with labor estimates
    calculateBuildCost: (modifications, includeLabor = true) => {
      let partsCost = 0;
      let laborCost = 0;
      
      modifications.forEach(mod => {
        partsCost += mod.price;
        
        if (includeLabor) {
          // Labor cost estimation based on complexity
          if (mod.category === 'engine') {
            laborCost += mod.price * 0.3; // 30% of parts cost for engine work
          } else if (mod.category === 'exhaust') {
            laborCost += mod.price * 0.2; // 20% for exhaust
          } else {
            laborCost += mod.price * 0.15; // 15% for other mods
          }
        }
      });
      
      return {
        partsCost: Math.round(partsCost),
        laborCost: Math.round(laborCost),
        totalCost: Math.round(partsCost + laborCost)
      };
    }
  };
  
  // Data validation utilities
  export const ValidationUtils = {
    // Validate HP values are realistic
    isValidHP: (hp, vehicleType) => {
      const ranges = {
        'sedan': { min: 100, max: 800 },
        'sports_car': { min: 200, max: 1500 },
        'suv': { min: 150, max: 1000 },
        'truck': { min: 200, max: 1200 }
      };
      
      const range = ranges[vehicleType] || ranges['sedan'];
      return hp >= range.min && hp <= range.max;
    },
  
    // Validate modification compatibility
    isCompatibleModification: (modification, currentMods, engineType) => {
      // Check if turbo and supercharger are both selected (not compatible)
      if (modification.name.includes('Turbo')) {
        return !currentMods.some(mod => mod.name.includes('Supercharger'));
      }
      
      if (modification.name.includes('Supercharger')) {
        return !currentMods.some(mod => mod.name.includes('Turbo'));
      }
      
      // Check engine type compatibility
      return modification.compatibility.includes('all') || 
             modification.compatibility.includes(engineType);
    }
  };