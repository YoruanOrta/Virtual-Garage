import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODIFICATIONS_DB_PATH = path.join(__dirname, '../data/modifications.json');

let modificationsDatabase = null;

const loadModificationsDatabase = async () => {
  if (!modificationsDatabase) {
    try {
      const data = await fs.readFile(MODIFICATIONS_DB_PATH, 'utf8');
      modificationsDatabase = JSON.parse(data);
      console.log('✅ Modifications database loaded');
    } catch (error) {
      console.error('❌ Failed to load modifications database:', error.message);
      // Fallback data simple
      modificationsDatabase = {
        modifications: {
          engine: {
            turbo: {
              name: "Turbocharger",
              category: "Engine",
              hpGain: 45,
              price: 2500,
              description: "Increases engine power"
            },
            cold_air_intake: {
              name: "Cold Air Intake",
              category: "Engine", 
              hpGain: 8,
              price: 300,
              description: "Improves airflow"
            }
          }
        },
        colors: {
          solid: {
            white: { name: "Pearl White", hex: "#FFFFFF", price: 0 },
            black: { name: "Jet Black", hex: "#000000", price: 0 },
            red: { name: "Racing Red", hex: "#FF0000", price: 200 }
          }
        }
      };
    }
  }
  return modificationsDatabase;
};

export const getAllModifications = async () => {
  const db = await loadModificationsDatabase();
  return db;
};

export const getModificationsByCategory = async (categoryName) => {
  const db = await loadModificationsDatabase();
  const category = db.modifications[categoryName.toLowerCase()];
  return category || null;
};

export const getColors = async (type = null) => {
  const db = await loadModificationsDatabase();
  if (type) {
    return db.colors[type.toLowerCase()] || null;
  }
  return db.colors;
};

export const calculateHPGain = async (baseHP, modificationIds) => {
  const db = await loadModificationsDatabase();
  
  let totalHPGain = 0;
  let totalCost = 0;
  let appliedModifications = [];
  
  for (const modId of modificationIds) {
    for (const [categoryName, categoryMods] of Object.entries(db.modifications)) {
      if (categoryMods[modId]) {
        const mod = categoryMods[modId];
        totalHPGain += mod.hpGain;
        totalCost += mod.price;
        
        appliedModifications.push({
          id: modId,
          name: mod.name,
          category: categoryName,
          hpGain: mod.hpGain,
          price: mod.price
        });
        break;
      }
    }
  }
  
  const finalHP = baseHP + totalHPGain;
  const hpIncrease = totalHPGain > 0 ? ((totalHPGain / baseHP) * 100).toFixed(1) : 0;
  
  return {
    baseHP,
    totalHPGain,
    finalHP,
    hpIncreasePercentage: `${hpIncrease}%`,
    totalCost,
    appliedModifications
  };
};