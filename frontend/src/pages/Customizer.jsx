// frontend/src/pages/Customizer.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ColorPicker from '../components/UI/ColorPicker';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, PerspectiveCamera, Environment } from '@react-three/drei';
import { Suspense } from 'react';

const Car3DModel = ({ modelPath, color, ...props }) => {
  const { scene } = useGLTF(modelPath);
  
  const clonedScene = scene.clone();
  
  clonedScene.traverse((child) => {
    if (child.isMesh && child.material) {
      child.material = child.material.clone();
      
      if (child.material.color) {
        child.material.color.setHex(color.replace('#', '0x'));
      }
      
      child.material.metalness = 0.1;
      child.material.roughness = 0.8;
    }
  });
  
  return <primitive object={clonedScene} {...props} />;
};

const Loading3D = () => (
  <div style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'white',
    fontSize: '1.2rem'
  }}>
    Loading 3D Model...
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

const CarViewer = styled.div`
  background: linear-gradient(135deg, #2a2d3a 0%, #1e1f2e 100%);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 2px solid ${({ theme }) => theme.colors.border};
  padding: 0;
  height: clamp(400px, 80vh, 650px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 30%, rgba(255,107,53,0.1) 0%, transparent 70%);
    pointer-events: none;
    z-index: 1;
  }
`;

const Canvas3D = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 2;
`;

const VehicleSpecs = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(10px);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 16px 20px;
  border: 1px solid rgba(255,255,255,0.1);
`;

const SpecItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SpecLabel = styled.span`
  color: rgba(255,255,255,0.8);
  font-size: 0.9rem;
  margin-right: 20px;
`;

const SpecValue = styled.span`
  color: ${({ $highlight, theme }) => $highlight ? theme.colors.primary : 'white'};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  font-size: 0.9rem;
`;

const CarPlaceholder = styled.div`
  font-size: clamp(4rem, 10vw, 8rem);
  margin-bottom: clamp(16px, 2vh, 24px);
  animation: float 3s ease-in-out infinite;
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(2deg); }
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 2vh, 24px);
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 3px;
  }
  
  @media (max-width: 1024px) {
    order: -1;
    max-height: none;
  }
`;

const Section = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 2px solid ${({ theme }) => theme.colors.border};
  padding: clamp(20px, 3vw, 24px);
`;

const SectionTitle = styled.h3`
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: clamp(1.1rem, 2.5vw, 1.3rem);
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: clamp(12px, 2vh, 16px);
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CategorySection = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 2px solid ${({ theme }) => theme.colors.border};
  padding: clamp(20px, 3vw, 24px);
  margin-bottom: clamp(16px, 2vh, 20px);
`;

const CategoryTitle = styled.h3`
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: clamp(1.2rem, 2.8vw, 1.4rem);
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: clamp(16px, 2.5vh, 20px);
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ModificationItem = styled.div`
  background: ${({ $selected, theme }) => 
    $selected ? 'rgba(255,107,53,0.15)' : 'rgba(255,255,255,0.05)'
  };
  border: 1px solid ${({ $selected, theme }) => 
    $selected ? theme.colors.primary : 'rgba(255,255,255,0.1)'
  };
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: clamp(16px, 2.5vw, 20px);
  margin-bottom: 12px;
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: rgba(255,107,53,0.1);
  }
`;

const ModificationInfo = styled.div`
  flex: 1;
`;

const ModName = styled.div`
  font-size: clamp(1rem, 2.2vw, 1.1rem);
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
`;

const ModDescription = styled.div`
  font-size: clamp(0.85rem, 1.8vw, 0.9rem);
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 6px;
`;

const ModStats = styled.div`
  display: flex;
  gap: 16px;
  font-size: clamp(0.8rem, 1.6vw, 0.85rem);
`;

const ModStat = styled.span`
  color: ${({ $isHP, theme }) => $isHP ? theme.colors.primary : theme.colors.textSecondary};
  font-weight: ${({ $isHP, theme }) => $isHP ? theme.typography.weights.bold : 'normal'};
`;

const ToggleSwitch = styled.div`
  position: relative;
  width: 50px;
  height: 26px;
  background: ${({ $active, theme }) => 
    $active ? theme.colors.primary : 'rgba(255,255,255,0.2)'
  };
  border-radius: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${({ $active }) => $active ? '27px' : '3px'};
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
`;

const HPGainIndicator = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.secondary} 100%);
  color: white;
  padding: 12px 20px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  text-align: center;
  margin-bottom: 20px;
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const BuildSummary = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: clamp(16px, 3vw, 20px);
  margin-top: clamp(16px, 2vh, 20px);
`;

const SummaryTitle = styled.h4`
  font-size: clamp(1rem, 2.2vw, 1.1rem);
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: clamp(12px, 2vh, 16px);
  font-weight: ${({ theme }) => theme.typography.weights.bold};
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: clamp(8px, 1vh, 12px);
  font-size: clamp(0.85rem, 2vw, 0.9rem);
  
  span:first-child {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
  
  span:last-child {
    color: ${({ theme }) => theme.colors.text};
    font-weight: ${({ theme }) => theme.typography.weights.medium};
  }
`;

const SaveButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  padding: clamp(14px, 2.5vh, 18px) clamp(24px, 4vw, 32px);
  font-size: clamp(1rem, 2.2vw, 1.1rem);
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  cursor: pointer;
  width: 100%;
  margin-top: clamp(16px, 2vh, 24px);
  transition: all 0.3s ease;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const BackButton = styled.button`
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  padding: clamp(8px, 1.5vh, 12px) clamp(16px, 2.5vw, 20px);
  font-size: clamp(0.85rem, 1.8vw, 0.95rem);
  cursor: pointer;
  transition: all 0.3s ease;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 20;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const CarTitle = styled.h1`
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: clamp(2rem, 5vw, 3rem);
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin: clamp(40px, 6vh, 60px) 0 clamp(16px, 2vh, 24px) 0;
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
`;

const Customizer = () => {
  const { brandId, modelId } = useParams();
  const navigate = useNavigate();
  
  const [carData, setCarData] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#ff6b35');
  const [selectedMods, setSelectedMods] = useState([]);
  const [modifications, setModifications] = useState({});
  const [loading, setLoading] = useState(true);

  const modCategories = {
    engine: [
      { id: 'turbo', name: 'Turbocharger', hp: 45, price: 2500 },
      { id: 'intake', name: 'Cold Air Intake', hp: 8, price: 350 },
      { id: 'intercooler', name: 'Intercooler', hp: 15, price: 800 }
    ],
    exhaust: [
      { id: 'catback', name: 'Cat-Back Exhaust', hp: 12, price: 1200 },
      { id: 'headers', name: 'Performance Headers', hp: 18, price: 900 }
    ],
    suspension: [
      { id: 'coilovers', name: 'Coilovers', hp: 0, price: 1500 },
      { id: 'sway_bars', name: 'Sway Bars', hp: 0, price: 400 }
    ]
  };

  useEffect(() => {
    loadCarData();
    loadModifications();
  }, [brandId, modelId]);

  const loadCarData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3001/api/cars/brands/${brandId}/models/${modelId}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setCarData({
            name: data.data.name,
            baseHP: data.data.baseSpecs.horsePower,
            type: data.data.type,
            drivetrain: data.data.baseSpecs.drivetrain,
            engine: data.data.baseSpecs.engine,
            torque: data.data.baseSpecs.torque
          });
        } else {
          console.warn('No car data found, using fallback');
          setCarData({
            name: `${brandId.charAt(0).toUpperCase() + brandId.slice(1)} Model`,
            baseHP: 200,
            type: 'Unknown',
            drivetrain: 'FWD'
          });
        }
      } else {
        console.warn('API call failed, using fallback data');
        setCarData({
          name: `${brandId.charAt(0).toUpperCase() + brandId.slice(1)} Model`,
          baseHP: 200,
          type: 'Unknown', 
          drivetrain: 'FWD'
        });
      }
    } catch (error) {
      console.error('Error loading car data:', error);
      setCarData({
        name: `${brandId.charAt(0).toUpperCase() + brandId.slice(1)} Model`,
        baseHP: 200,
        type: 'Unknown',
        drivetrain: 'FWD'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadModifications = async () => {
    try {
      // Mock data - replace with API call
      setModifications(modCategories);
    } catch (error) {
      console.error('Error loading modifications:', error);
    }
  };

  const toggleModification = (modId) => {
    setSelectedMods(prev => 
      prev.includes(modId) 
        ? prev.filter(id => id !== modId)
        : [...prev, modId]
    );
  };

  const calculateFinalHP = () => {
    if (!carData) return 0;
    
    let totalHPGain = 0;
    selectedMods.forEach(modId => {
      Object.values(modifications).forEach(category => {
        const mod = category.find(m => m.id === modId);
        if (mod) totalHPGain += mod.hp;
      });
    });
    
    return carData.baseHP + totalHPGain;
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
    let totalCost = 0;
    selectedMods.forEach(modId => {
      Object.values(modifications).forEach(category => {
        const mod = category.find(m => m.id === modId);
        if (mod) totalCost += mod.price;
      });
    });
    return totalCost;
  };

  const getCategoryIcon = (category) => {
    const icons = { engine: '⚡', exhaust: '🚀', suspension: '🔧' };
    return icons[category] || '🔧';
  };

  const getCategoryTitle = (category) => {
    const titles = { 
      engine: 'Performance Modifications', 
      exhaust: 'Exhaust System', 
      suspension: 'Suspension & Chassis' 
    };
    return titles[category] || category;
  };

  const getModDescription = (modId) => {
    const descriptions = {
      turbo: 'Improves aerodynamics',
      intake: 'Optimizes air flow',
      intercooler: 'Improves air flow',
      catback: 'Improves rear exhaust',
      headers: 'Optimizes front exhaust',
      coilovers: 'Sports aesthetics',
      sway_bars: 'Improved stability'
    };
    return descriptions[modId] || 'Improves performance';
  };

  const saveBuild = () => {
    const build = {
      id: Date.now(),
      carName: carData?.name || 'Unknown Car',
      brandId,
      modelId,
      color: selectedColor,
      modifications: selectedMods,
      baseHP: carData?.baseHP || 0,
      finalHP: calculateFinalHP(),
      totalCost: calculateTotalCost(),
      createdAt: new Date().toISOString()
    };

    try {
      const existingBuilds = JSON.parse(localStorage.getItem('virtualGarageBuilds') || '[]');
      existingBuilds.push(build);
      localStorage.setItem('virtualGarageBuilds', JSON.stringify(existingBuilds));
      
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
              <Canvas>
                <PerspectiveCamera makeDefault position={[5, 2, 5]} />
                <OrbitControls 
                  enableZoom={true}
                  enablePan={false}
                  enableRotate={true}
                  autoRotate={false}
                  maxPolarAngle={Math.PI / 2}
                  minPolarAngle={Math.PI / 4}
                />
                
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <pointLight position={[-10, 0, -20]} intensity={0.5} />
                
                <Environment preset="city" />
                
                <Suspense fallback={<Loading3D />}>
                  <Car3DModel 
                    modelPath="/models/toyota/toyota_corolla_2020.glb"
                    color={selectedColor}
                    scale={[1, 1, 1]}
                    position={[0, -1, 0]}
                  />
                </Suspense>
              </Canvas>
            </Canvas3D>
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
          
          {calculateTotalHPGain() > 0 && (
            <HPGainIndicator>
              +{calculateTotalHPGain()} HP Total Gain
            </HPGainIndicator>
          )}

          {Object.entries(modifications).map(([category, mods]) => (
            <CategorySection key={category}>
              <CategoryTitle>
                {getCategoryIcon(category)} {getCategoryTitle(category)}
              </CategoryTitle>
              
              {mods.map((mod) => (
                <ModificationItem
                  key={mod.id}
                  $selected={selectedMods.includes(mod.id)}
                >
                  <ModificationInfo>
                    <ModName>{mod.name}</ModName>
                    <ModDescription>{getModDescription(mod.id)}</ModDescription>
                    <ModStats>
                      <ModStat $isHP>+{mod.hp} HP</ModStat>
                      <ModStat>${mod.price.toLocaleString()}</ModStat>
                    </ModStats>
                  </ModificationInfo>
                  
                  <ToggleSwitch
                    $active={selectedMods.includes(mod.id)}
                    onClick={() => toggleModification(mod.id)}
                  />
                </ModificationItem>
              ))}
            </CategorySection>
          ))}

          <Section>
            <SummaryTitle>Build Summary</SummaryTitle>
            <BuildSummary>
              <SummaryItem>
                <span>Base HP:</span>
                <span>{carData?.baseHP || 0}</span>
              </SummaryItem>
              <SummaryItem>
                <span>Modifications:</span>
                <span>{selectedMods.length}</span>
              </SummaryItem>
              <SummaryItem>
                <span>Final HP:</span>
                <span>{calculateFinalHP()}</span>
              </SummaryItem>
              <SummaryItem>
                <span>Total Cost:</span>
                <span>${calculateTotalCost().toLocaleString()}</span>
              </SummaryItem>
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