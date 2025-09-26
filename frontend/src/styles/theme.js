// frontend/src/styles/theme.js
export const theme = {
    colors: {
      // Primary colors - Garage/automotive theme
      primary: '#FF6B00',    // Vibrant orange
      secondary: '#1A1A1A',  // Deep black
      accent: '#00D4FF',     // Electric blue
      
      // UI colors
      background: '#0A0A0A',  // Almost black
      surface: '#1E1E1E',     // Dark gray
      card: '#2A2A2A',        // Card background
      
      // Text colors
      text: '#FFFFFF',        // White
      textSecondary: '#B0B0B0', // Light gray
      textMuted: '#666666',   // Muted gray
      
      // Status colors
      success: '#00FF88',     // Neon green
      warning: '#FFD700',     // Gold
      error: '#FF4444',       // Red
      
      // Gradients
      gradient: {
        primary: 'linear-gradient(135deg, #FF6B00 0%, #FF8E53 100%)',
        secondary: 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
        dark: 'linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)',
        gaming: 'linear-gradient(135deg, #FF6B00 0%, #00D4FF 50%, #FF6B00 100%)'
      }
    },
    
    typography: {
      // Font families
      heading: "'Orbitron', 'Arial', sans-serif", // Futuristic font
      body: "'Inter', 'Arial', sans-serif",       // Clean modern font
      mono: "'JetBrains Mono', monospace",        // Code font
      
      // Font sizes
      sizes: {
        xs: '0.75rem',   // 12px
        sm: '0.875rem',  // 14px  
        md: '1rem',      // 16px
        lg: '1.125rem',  // 18px
        xl: '1.25rem',   // 20px
        '2xl': '1.5rem', // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem',  // 36px
        '5xl': '3rem',     // 48px
        '6xl': '4rem'      // 64px
      },
      
      // Font weights
      weights: {
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        black: 900
      }
    },
    
    spacing: {
      xs: '0.25rem',  // 4px
      sm: '0.5rem',   // 8px
      md: '1rem',     // 16px
      lg: '1.5rem',   // 24px
      xl: '2rem',     // 32px
      '2xl': '3rem',  // 48px
      '3xl': '4rem',  // 64px
      '4xl': '6rem',  // 96px
      '5xl': '8rem'   // 128px
    },
    
    breakpoints: {
      mobile: '480px',
      tablet: '768px',
      laptop: '1024px',
      desktop: '1200px',
      wide: '1600px'
    },
    
    borderRadius: {
      sm: '0.25rem',  // 4px
      md: '0.5rem',   // 8px
      lg: '0.75rem',  // 12px
      xl: '1rem',     // 16px
      '2xl': '1.5rem', // 24px
      full: '50%'
    },
    
    shadows: {
      sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
      md: '0 4px 12px rgba(0, 0, 0, 0.15)',
      lg: '0 8px 24px rgba(0, 0, 0, 0.2)',
      xl: '0 16px 48px rgba(0, 0, 0, 0.3)',
      glow: '0 0 20px rgba(255, 107, 0, 0.3)',
      glowBlue: '0 0 20px rgba(0, 212, 255, 0.3)'
    },
    
    transitions: {
      fast: '0.15s ease-in-out',
      medium: '0.3s ease-in-out',
      slow: '0.6s ease-in-out'
    },
    
    zIndex: {
      modal: 1000,
      dropdown: 100,
      header: 50,
      overlay: 40,
      default: 1
    }
  };