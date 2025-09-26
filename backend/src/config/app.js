// backend/src/config/app.js
/**
 * Application configuration and settings
 */

import dotenv from 'dotenv';

dotenv.config();

export const AppConfig = {
  // Server settings
  server: {
    port: process.env.PORT || 3001,
    host: process.env.HOST || '127.0.0.1',
    env: process.env.NODE_ENV || 'development'
  },

  // API settings
  api: {
    version: '1.0.0',
    prefix: '/api',
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per windowMs
      message: 'Too many requests, please try again later'
    },
    timeout: 30000 // 30 seconds
  },

  // CORS settings
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:5173', // Vite dev server
      'http://127.0.0.1:5173',
      'https://virtual-garage.vercel.app' // Production domain
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  },

  // NHTSA API settings
  nhtsa: {
    baseUrl: process.env.NHTSA_API_URL || 'https://vpic.nhtsa.dot.gov/api',
    timeout: 15000, // 15 seconds
    retries: 3,
    rateLimit: 60, // requests per minute
    cache: {
      enabled: true,
      ttl: 24 * 60 * 60 * 1000 // 24 hours
    }
  },

  // Cache settings
  cache: {
    enabled: process.env.CACHE_ENABLED !== 'false',
    ttl: parseInt(process.env.CACHE_TTL) || 24 * 60 * 60 * 1000, // 24 hours
    maxSize: parseInt(process.env.CACHE_MAX_SIZE) || 1000,
    cleanupInterval: 60 * 60 * 1000 // 1 hour
  },

  // File upload settings (for future 3D model uploads)
  upload: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['.glb', '.gltf', '.fbx', '.obj'],
    destination: './public/models/',
    tempDir: './temp/'
  },

  // Performance calculation settings
  performance: {
    // Default vehicle weights by type (lbs)
    defaultWeights: {
      'sedan': 3200,
      'sports_car': 3000,
      'suv': 4200,
      'pickup_truck': 4800,
      'hatchback': 2800,
      'coupe': 3100
    },
    
    // HP calculation modifiers
    modifiers: {
      // Drivetrain loss percentages
      drivetrain: {
        'FWD': 0.15,  // 15% loss
        'RWD': 0.12,  // 12% loss  
        'AWD': 0.20,  // 20% loss
        '4WD': 0.22   // 22% loss
      },
      
      // Engine type multipliers for modifications
      engine: {
        'naturally_aspirated': {
          'turbo': 1.3,
          'supercharger': 1.2,
          'intake': 1.1,
          'exhaust': 1.0
        },
        'turbocharged': {
          'intercooler': 1.3,
          'exhaust': 1.2,
          'intake': 1.1,
          'tune': 1.4
        },
        'supercharged': {
          'intake': 1.2,
          'exhaust': 1.1,
          'pulley': 1.3,
          'tune': 1.3
        }
      }
    }
  },

  // Logging settings
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || './logs/app.log',
    maxSize: '10m',
    maxFiles: '5d'
  },

  // Security settings
  security: {
    jwt: {
      secret: process.env.JWT_SECRET || 'virtual-garage-secret-key',
      expiresIn: '7d'
    },
    encryption: {
      algorithm: 'aes-256-cbc',
      key: process.env.ENCRYPTION_KEY || 'default-encryption-key-32-chars'
    },
    helmet: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:']
        }
      }
    }
  },

  // Database settings  
  database: {
    backup: {
      enabled: true,
      interval: 24 * 60 * 60 * 1000, // 24 hours
      maxBackups: 7, // Keep 7 days of backups
      location: './backups/'
    },
    validation: {
      enabled: true,
      strictMode: false,
      autoFix: true
    }
  },

  // Feature flags
  features: {
    userAccounts: process.env.ENABLE_USER_ACCOUNTS === 'true',
    socialSharing: process.env.ENABLE_SOCIAL_SHARING === 'true',
    nhtsaValidation: process.env.ENABLE_NHTSA_VALIDATION !== 'false',
    performanceCalcs: true,
    realTimeSync: false,
    analytics: process.env.ENABLE_ANALYTICS === 'true'
  },

  // Development settings
  development: {
    enableCors: true,
    logRequests: true,
    prettyJson: true,
    showErrors: true,
    hotReload: true,
    mockData: process.env.USE_MOCK_DATA === 'true'
  },

  // Production settings
  production: {
    compression: true,
    minifyJson: true,
    hideErrors: true,
    httpsOnly: true,
    trustProxy: true
  }
};

// Environment-specific overrides
if (AppConfig.server.env === 'production') {
  // Override development settings for production
  AppConfig.logging.level = 'warn';
  AppConfig.development.showErrors = false;
  AppConfig.development.prettyJson = false;
}

if (AppConfig.server.env === 'test') {
  // Test-specific settings
  AppConfig.cache.enabled = false;
  AppConfig.logging.level = 'error';
  AppConfig.database.backup.enabled = false;
}

// Validation function
export const validateConfig = () => {
  const required = [
    'server.port',
    'api.version',
    'nhtsa.baseUrl'
  ];

  const missing = required.filter(key => {
    const keys = key.split('.');
    let value = AppConfig;
    for (const k of keys) {
      value = value?.[k];
    }
    return value === undefined;
  });

  if (missing.length > 0) {
    throw new Error(`Missing required configuration: ${missing.join(', ')}`);
  }

  console.log('✅ Configuration validated successfully');
  return true;
};

// Get configuration for specific environment
export const getEnvConfig = (env = AppConfig.server.env) => {
  const base = { ...AppConfig };
  
  if (env === 'production') {
    return { ...base, ...base.production };
  } else if (env === 'development') {
    return { ...base, ...base.development };
  }
  
  return base;
};