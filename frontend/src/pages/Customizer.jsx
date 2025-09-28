// frontend/src/pages/Customizer.jsx - OPTIMIZADO PARA GPU
import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ColorPicker from '../components/UI/ColorPicker';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

// Preload with aggressive caching
useGLTF.preload('/models/toyota/toyota_corolla_2020.glb');

// Ultra-lightweight 3D Model Component
function Car3DModel({ modelPath, color }) {
  const { scene } = useGLTF(modelPath);
  
  // Optimize model on first load
  const optimizedScene = React.useMemo(() => {
    const clone = scene.clone();
    
    // Traverse and optimize
    clone.traverse((child) => {
      if (child.isMesh) {
        // Simplify materials
        if (child.material) {
          child.material = child.material.clone();
          
          // Disable expensive features
          child.material.needsUpdate = false;
          child.material.transparent = false;
          child.material.alphaTest = 0;
          
          // Simple color application
          if (child.material.color) {
            const hexColor = parseInt(color.replace('#', ''), 16);
            child.material.color.setHex(hexColor);
          }
          
          // Optimize material properties
          child.material.metalness = 0;
          child.material.roughness = 1;
          child.material.envMapIntensity = 0;
        }
        
        // Optimize geometry
        if (child.geometry) {
          child.geometry.computeBoundingSphere();
          child.castShadow = false;
          child.receiveShadow = false;
        }
      }
    });
    
    return clone;
  }, [scene, color]);
  
  return (
    <primitive 
      object={optimizedScene} 
      scale={[1.2, 1.2, 1.2]} 
      position={[0, -0.3, 0]}
      rotation={[0, Math.PI / 8, 0]}
    />
  );
}

// Error Boundary Component
class Canvas3DErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('3D Canvas Error:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return <CarFallback color={this.props.color} />;
    }
    return this.props.children;
  }
}

const Loading3D = () => (
  <div style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'white',
    fontSize: '1.2rem',
    textAlign: 'center'
  }}>
    <div>Loading 3D Model...</div>
    <div style={{ fontSize: '0.8rem', marginTop: '8px', opacity: 0.7 }}>
      Optimizing for performance...
    </div>
  </div>
);

// Fallback Component
const CarFallback = ({ color }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    fontSize: '6rem',
    color: color,
    transition: 'color 0.3s ease'
  }}>
    🚗
  </div>
);

const CustomizerContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  padding: clamp(160px, 18vh, 180px) 0 clamp(32px, 5vh, 48px);
  background: ${({ theme }) => theme.colors.gradient.dark};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Content = styled.div`
  width: 100%;
  max-width: clamp(1200px, 95vw, 1600px);
  padding: 0 clamp(16px, 4vw, 24px);
  display: grid;
  grid-template-columns: 1fr 500px;
  gap: clamp(24px, 4vw, 48px);
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: clamp(16px, 3vw, 24px);
  }
`;

const MainArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 2vh, 24px);
  position: relative;
`;

const BackButton = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border: 2px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  font-size: clamp(0.875rem, 2vw, 1rem);
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  &:hover {
    background: ${({ theme }) => theme.colors.accent};
    color: white;
    transform: translateY(-2px);
  }
`;

const CarTitle = styled.h1`
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text};
  margin: clamp(32px, 6vh, 48px) 0 0 0;
  text-align: center;
  background: ${({ theme }) => theme.colors.gradient.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const CarViewer = styled.div`
  background: linear-gradient(135deg, #2a2d3a 0%, #1e1f2e 100%);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 2px solid ${({ theme }) => theme.colors.border};
  padding: 0;
  height: clamp(400px, 80vh, 650px);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const VehicleSpecs = styled.div`
  position: absolute;
  top: clamp(16px, 3vh, 24px);
  right: clamp(16px, 3vh, 24px);
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: clamp(12px, 2vh, 16px);
  z-index: 5;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SpecItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: clamp(8px, 2vw, 12px);
  margin-bottom: clamp(4px, 1vh, 8px);

  &:last-child {
    margin-bottom: 0;
  }
`;

const SpecLabel = styled.span`
  color: rgba(255, 255, 255, 0.7);
  font-size: clamp(0.75rem, 1.5vw, 0.875rem);
  font-weight: ${({ theme }) => theme.typography.weights.medium};
`;

const SpecValue = styled.span`
  color: ${({ $highlight, theme }) => $highlight ? theme.colors.accent : 'white'};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  font-size: clamp(0.75rem, 1.5vw, 0.875rem);
`;

const Canvas3D = styled.div`
  flex: 1;
  position: relative;
  width: 100%;
  height: 100%;
`;

const HPGainBanner = styled.div`
  position: absolute;
  bottom: clamp(16px, 3vh, 24px);
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.colors.gradient.accent};
  color: white;
  padding: clamp(8px, 1.5vh, 12px) clamp(16px, 3vw, 24px);
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  font-size: clamp(0.875rem, 2vw, 1rem);
  box-shadow: 0 4px 16px rgba(255, 107, 53, 0.4);
  z-index: 5;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%, 100% { transform: translateX(-50%) scale(1); }
    50% { transform: translateX(-50%) scale(1.05); }
  }
`;

const Sidebar = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 2px solid ${({ theme }) => theme.colors.border};
  padding: clamp(16px, 3vh, 24px);
  height: fit-content;
  max-height: 80vh;
  overflow-y: auto;
  
  @media (max-width: 1024px) {
    order: -1;
    max-height: none;
  }
`;

const Section = styled.div`
  margin-bottom: clamp(24px, 4vh, 32px);
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: clamp(1.125rem, 3vw, 1.25rem);
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: clamp(12px, 2vh, 16px);
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TabContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: clamp(16px, 3vh, 20px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Tab = styled.button`
  padding: clamp(8px, 1.5vh, 12px) clamp(12px, 2vw, 16px);
  background: ${({ $active, theme }) => $active ? theme.colors.accent : 'transparent'};
  color: ${({ $active, theme }) => $active ? 'white' : theme.colors.textMuted};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md} ${({ theme }) => theme.borderRadius.md} 0 0;
  font-size: clamp(0.75rem, 1.5vw, 0.875rem);
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ $active, theme }) => $active ? theme.colors.accent : theme.colors.border};
    color: ${({ $active, theme }) => $active ? 'white' : theme.colors.text};
  }
`;

const ModificationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(8px, 1.5vh, 12px);
`;

const ModificationItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: clamp(12px, 2vh, 16px);
  background: ${({ $selected, theme }) => $selected ? theme.colors.accentLight : theme.colors.cardBg};
  border: 2px solid ${({ $selected, theme }) => $selected ? theme.colors.accent : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    background: ${({ $selected, theme }) => $selected ? theme.colors.accentLight : theme.colors.surface};
  }
`;

const ModInfo = styled.div`
  flex: 1;
`;

const ModName = styled.div`
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text};
  font-size: clamp(0.875rem, 2vw, 1rem);
  margin-bottom: clamp(2px, 0.5vh, 4px);
`;

const ModDescription = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: clamp(0.75rem, 1.5vw, 0.875rem);
`;

const ModDetails = styled.div`
  text-align: right;
  margin-left: clamp(8px, 2vw, 12px);
`;

const ModHP = styled.div`
  color: ${({ theme }) => theme.colors.accent};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  font-size: clamp(0.875rem, 2vw, 1rem);
`;

const ModPrice = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: clamp(0.75rem, 1.5vw, 0.875rem);
`;

const ToggleSwitch = styled.div`
  width: clamp(40px, 8vw, 48px);
  height: clamp(20px, 4vh, 24px);
  background: ${({ $active, theme }) => $active ? theme.colors.accent : theme.colors.border};
  border-radius: clamp(10px, 2vh, 12px);
  position: relative;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  margin-left: clamp(8px, 2vw, 12px);

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${({ $active }) => $active ? 'calc(100% - 22px)' : '2px'};
    width: clamp(16px, 3.5vw, 20px);
    height: clamp(16px, 3.5vh, 20px);
    background: white;
    border-radius: 50%;
    transition: all ${({ theme }) => theme.transitions.fast};
  }
`;

const BuildSummary = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: clamp(16px, 3vh, 20px);
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const SummaryTitle = styled.h4`
  font-family: ${({ theme }) => theme.typography.heading};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: clamp(12px, 2vh, 16px);
  font-size: clamp(1rem, 2.5vw, 1.125rem);
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: clamp(8px, 1.5vh, 10px);
  
  &:last-child {
    margin-bottom: 0;
    padding-top: clamp(8px, 1.5vh, 10px);
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    font-weight: ${({ theme }) => theme.typography.weights.semibold};
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const SaveButton = styled.button`
  width: 100%;
  background: ${({ theme }) => theme.colors.gradient.primary};
  color: white;
  border: none;
  padding: clamp(12px, 2.5vh, 16px);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  margin-top: clamp(16px, 3vh, 20px);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(255, 107, 53, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Customizer = () => {
  const { brandId, modelId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [carData, setCarData] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#FF6B35');
  const [selectedMods, setSelectedMods] = useState([]);
  const [activeTab, setActiveTab] = useState('engine');
  const [use3D, setUse3D] = useState(false);
  const [modelPath, setModelPath] = useState('');
  const [webglLost, setWebglLost] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const canvasRef = useRef();

  const modifications = {
    engine: [
      { id: 'turbo', name: 'Turbocharger', hp: 45, price: 2500, description: 'Improves aerodynamics' },
      { id: 'supercharger', name: 'Supercharger', hp: 60, price: 3500, description: 'Optimizes air flow' },
      { id: 'intake', name: 'Cold Air Intake', hp: 8, price: 350, description: 'Optimizes air flow' },
      { id: 'intercooler', name: 'Intercooler', hp: 15, price: 800, description: 'Improved stability' },
      { id: 'tune', name: 'ECU Tune', hp: 25, price: 600, description: 'Improves aerodynamics' }
    ],
    exhaust: [
      { id: 'catback', name: 'Cat-Back System', hp: 12, price: 800, description: 'Optimizes air flow' },
      { id: 'headers', name: 'Performance Headers', hp: 18, price: 1200, description: 'Improves aerodynamics' },
      { id: 'fullexhaust', name: 'Full Exhaust', hp: 28, price: 2000, description: 'Improved stability' }
    ],
    suspension: [
      { id: 'coilovers', name: 'Coilovers', hp: 0, price: 1500, description: 'Improved stability' },
      { id: 'sway', name: 'Sway Bars', hp: 0, price: 400, description: 'Improves aerodynamics' },
      { id: 'struts', name: 'Performance Struts', hp: 0, price: 900, description: 'Improved stability' }
    ]
  };

  useEffect(() => {
    loadCarData();
    checkFor3DModel();
  }, [brandId, modelId]);

  const loadCarData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3001/api/cars/brands/${brandId}/models/${modelId}`);
      
      if (response.ok) {
        const data = await response.json();
        setCarData({
          name: data.data?.name || `${brandId.charAt(0).toUpperCase() + brandId.slice(1)} Model`,
          baseHP: data.data?.baseSpecs?.horsePower || 200,
          type: data.data?.type || 'Sedan',
          drivetrain: data.data?.drivetrain || 'FWD',
          engine: data.data?.baseSpecs?.engine || 'Unknown Engine'
        });
      } else {
        throw new Error('Car not found');
      }
    } catch (error) {
      console.error('Error loading car data:', error);
      setCarData({
        name: `${brandId.charAt(0).toUpperCase() + brandId.slice(1)} Model`,
        baseHP: 200,
        type: 'Sedan',
        drivetrain: 'FWD',
        engine: 'Unknown Engine'
      });
    } finally {
      setLoading(false);
    }
  };

  const checkFor3DModel = () => {
    const modelPaths = {
      'toyota-corolla_2024': '/models/toyota/toyota_corolla_2020.glb',
      'toyota-supra_mk5_2020': '/models/toyota/toyota_corolla_2020.glb',
    };
    
    const key = `${brandId}-${modelId}`;
    const path = modelPaths[key];
    
    console.log('Checking for model:', key, 'Path:', path, 'Retry:', retryCount);
    
    if (path) {
      setModelPath(path);
      setUse3D(true);
      setWebglLost(false);
      console.log('3D Model enabled for:', key);
    } else {
      setUse3D(false);
      console.log('Using fallback for:', key);
    }
  };

  const handleWebGLContextLost = () => {
    console.log('WebGL context lost, retry count:', retryCount);
    setWebglLost(true);
    
    // Auto-retry mechanism with exponential backoff
    if (retryCount < 3) {
      const timeout = Math.pow(2, retryCount) * 2000; // 2s, 4s, 8s
      console.log(`Retrying in ${timeout}ms...`);
      
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setWebglLost(false);
        setUse3D(true);
        console.log('Attempting 3D recovery...');
      }, timeout);
    } else {
      console.log('Max retries reached, staying in fallback mode');
      setUse3D(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = { engine: '⚡', exhaust: '🚀', suspension: '🔧' };
    return icons[category] || '🔧';
  };

  const calculateFinalHP = () => {
    let total = carData?.baseHP || 200;
    selectedMods.forEach(modId => {
      Object.values(modifications).forEach(category => {
        const mod = category.find(m => m.id === modId);
        if (mod) total += mod.hp;
      });
    });
    return total;
  };

  const calculateTotalHPGain = () => {
    let total = 0;
    selectedMods.forEach(modId => {
      Object.values(modifications).forEach(category => {
        const mod = category.find(m => m.id === modId);
        if (mod) total += mod.hp;
      });
    });
    return total;
  };

  const calculateTotalCost = () => {
    let total = 0;
    selectedMods.forEach(modId => {
      Object.values(modifications).forEach(category => {
        const mod = category.find(m => m.id === modId);
        if (mod) total += mod.price;
      });
    });
    return total;
  };

  const toggleModification = (modId) => {
    setSelectedMods(prev => 
      prev.includes(modId) 
        ? prev.filter(id => id !== modId)
        : [...prev, modId]
    );
  };

  const saveBuild = async () => {
    try {
      const build = {
        id: Date.now(),
        carName: carData?.name,
        brandId,
        modelId,
        color: selectedColor,
        modifications: selectedMods,
        finalHP: calculateFinalHP(),
        totalCost: calculateTotalCost(),
        createdAt: new Date().toISOString()
      };

      const savedBuilds = JSON.parse(localStorage.getItem('virtualGarageBuilds') || '[]');
      savedBuilds.push(build);
      localStorage.setItem('virtualGarageBuilds', JSON.stringify(savedBuilds));
      
      alert('Build saved successfully!');
      navigate('/garage');
    } catch (error) {
      console.error('Error saving build:', error);
      alert('Error saving build. Please try again.');
    }
  };

  const handleBack = () => {
    navigate(`/brands/${brandId}`);
  };

  if (loading) {
    return (
      <CustomizerContainer>
        <div style={{ color: 'white', fontSize: '1.5rem' }}>Loading customizer...</div>
      </CustomizerContainer>
    );
  }

  return (
    <CustomizerContainer>
      <Content>
        <MainArea>
          <BackButton onClick={handleBack}>
            ← Back to Models
          </BackButton>
          
          <CarTitle>{carData?.name}</CarTitle>
          
          <CarViewer>
            <VehicleSpecs>
              <SpecItem>
                <SpecLabel>Power:</SpecLabel>
                <SpecValue $highlight>{calculateFinalHP()} HP</SpecValue>
              </SpecItem>
              <SpecItem>
                <SpecLabel>Torque:</SpecLabel>
                <SpecValue>280 Nm</SpecValue>
              </SpecItem>
              <SpecItem>
                <SpecLabel>0-60 mph:</SpecLabel>
                <SpecValue>5.3s</SpecValue>
              </SpecItem>
            </VehicleSpecs>

            <Canvas3D>
              {use3D && modelPath && !webglLost ? (
                <Canvas3DErrorBoundary color={selectedColor} onError={handleWebGLContextLost}>
                  <Suspense fallback={<Loading3D />}>
                    <Canvas 
                      ref={canvasRef}
                      camera={{ position: [3, 1.5, 3], fov: 45 }}
                      gl={{ 
                        antialias: false,
                        alpha: false,
                        powerPreference: "low-power",
                        stencil: false,
                        depth: true,
                        failIfMajorPerformanceCaveat: false
                      }}
                      onCreated={({ gl, scene, camera }) => {
                        // Ultra-conservative WebGL settings
                        gl.setClearColor('#2a2d3a');
                        gl.shadowMap.enabled = false;
                        gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
                        
                        // Context lost/restored handlers
                        gl.domElement.addEventListener('webglcontextlost', (event) => {
                          event.preventDefault();
                          console.log('WebGL context lost detected');
                          handleWebGLContextLost();
                        });
                        
                        gl.domElement.addEventListener('webglcontextrestored', () => {
                          console.log('WebGL context restored');
                        });
                        
                        // Force garbage collection
                        gl.info.autoReset = true;
                      }}
                    >
                      {/* Minimal lighting */}
                      <ambientLight intensity={0.8} />
                      <directionalLight position={[2, 2, 2]} intensity={0.3} />
                      
                      <Car3DModel 
                        modelPath={modelPath}
                        color={selectedColor}
                      />
                      
                      <OrbitControls 
                        enableZoom={true}
                        enablePan={false}
                        autoRotate={true}
                        autoRotateSpeed={0.2}
                        maxPolarAngle={Math.PI / 2.2}
                        minPolarAngle={Math.PI / 6}
                        maxDistance={6}
                        minDistance={2}
                        enableDamping={false}
                      />
                    </Canvas>
                  </Suspense>
                </Canvas3DErrorBoundary>
              ) : (
                <CarFallback color={selectedColor} />
              )}
            </Canvas3D>

            {calculateTotalHPGain() > 0 && (
              <HPGainBanner>
                +{calculateTotalHPGain()} HP Added!
              </HPGainBanner>
            )}
          </CarViewer>
        </MainArea>

        <Sidebar>
          <Section>
            <SectionTitle>🎨 Color</SectionTitle>
            <ColorPicker 
              color={selectedColor}
              onChange={setSelectedColor}
              label="Vehicle Color"
            />
          </Section>

          <Section>
            <SectionTitle>🔧 Modifications</SectionTitle>
            
            <TabContainer>
              {Object.keys(modifications).map(category => (
                <Tab
                  key={category}
                  $active={activeTab === category}
                  onClick={() => setActiveTab(category)}
                >
                  {getCategoryIcon(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
                </Tab>
              ))}
            </TabContainer>

            <ModificationList>
              {modifications[activeTab]?.map(mod => (
                <ModificationItem
                  key={mod.id}
                  $selected={selectedMods.includes(mod.id)}
                  onClick={() => toggleModification(mod.id)}
                >
                  <ModInfo>
                    <ModName>{mod.name}</ModName>
                    <ModDescription>{mod.description}</ModDescription>
                  </ModInfo>
                  <ModDetails>
                    <ModHP>+{mod.hp} HP</ModHP>
                    <ModPrice>${mod.price.toLocaleString()}</ModPrice>
                  </ModDetails>
                  <ToggleSwitch $active={selectedMods.includes(mod.id)} />
                </ModificationItem>
              ))}
            </ModificationList>
          </Section>

          <Section>
            <BuildSummary>
              <SummaryTitle>Build Summary</SummaryTitle>
              <SummaryRow>
                <span>Base HP:</span>
                <span>{carData?.baseHP || 200} HP</span>
              </SummaryRow>
              <SummaryRow>
                <span>Added HP:</span>
                <span>+{calculateTotalHPGain()} HP</span>
              </SummaryRow>
              <SummaryRow>
                <span>Total Cost:</span>
                <span>${calculateTotalCost().toLocaleString()}</span>
              </SummaryRow>
              <SummaryRow>
                <span>Final Power:</span>
                <span>{calculateFinalHP()} HP</span>
              </SummaryRow>
            </BuildSummary>

            <SaveButton onClick={saveBuild}>
              💾 Save Build
            </SaveButton>
          </Section>
        </Sidebar>
      </Content>
    </CustomizerContainer>
  );
};

export default Customizer;