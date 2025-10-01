// Professional Redesign - Single Screen Layout

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ColorPicker from '../components/UI/ColorPicker';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

useGLTF.preload('/models/toyota/toyota_corolla_2020.glb');

function Car3DModel({ modelPath, color }) {
  const { scene } = useGLTF(modelPath);
  const bodyObjects = ['Object_14'];
  const shouldChangeColor = (name) => bodyObjects.includes(name);
  
  const optimizedScene = React.useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone();
        child.material.needsUpdate = false;
        child.material.transparent = false;
        child.material.alphaTest = 0;
        
        if (child.material.color) {
          if (shouldChangeColor(child.name)) {
            const hexColor = parseInt(color.replace('#', ''), 16);
            child.material.color.setHex(hexColor);
            child.material.metalness = 0.4;
            child.material.roughness = 0.3;
          } else {
            child.material.metalness = 0.9;
            child.material.roughness = 0.1;
            child.material.envMapIntensity = 1.0;
          }
        }
        
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
    if (this.props.onError) this.props.onError(error);
  }
  render() {
    if (this.state.hasError) return <CarFallback color={this.props.color} />;
    return this.props.children;
  }
}

const Loading3D = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b' }}>
    Loading...
  </div>
);

const CarFallback = ({ color }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '4rem', color: color }}>
    🚗
  </div>
);

// ============ STYLED COMPONENTS ============

const PageContainer = styled.div`
  height: 100vh;
  background: #0a0e1a;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TopBar = styled.div`
  height: 80px;
  flex-shrink: 0;
`;

const MainContent = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 0;
  overflow: hidden;
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 16px;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: #94a3b8;
  border: 1px solid #1e293b;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #1e293b;
    color: white;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: white;
  margin: 0;
`;

const PowerBadge = styled.div`
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
`;

const ContentGrid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  overflow: hidden;
`;

const ViewerCard = styled.div`
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
`;

const Canvas3D = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
`;

const StatsOverlay = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid #1e293b;
  border-radius: 12px;
  padding: 16px;
  min-width: 150px;
  z-index: 10;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const StatLabel = styled.span`
  color: #64748b;
  font-size: 12px;
  font-weight: 500;
`;

const StatValue = styled.span`
  color: ${({ $primary }) => $primary ? '#f97316' : 'white'};
  font-size: 14px;
  font-weight: 600;
`;

const ChartCard = styled.div`
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const ChartTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: white;
  margin-bottom: 16px;
`;

const MiniChart = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 12px 0;
`;

const Bar = styled.div`
  flex: 1;
  height: ${({ $height }) => $height}%;
  background: ${({ $primary }) => $primary ? 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)' : 'linear-gradient(180deg, #f97316 0%, #ea580c 100%)'};
  border-radius: 4px 4px 0 0;
  position: relative;
  transition: height 0.3s;
`;

const ChartStats = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #1e293b;
`;

const ChartStat = styled.div`
  text-align: center;
`;

const ChartStatLabel = styled.div`
  font-size: 10px;
  color: #64748b;
  text-transform: uppercase;
  margin-bottom: 4px;
`;

const ChartStatValue = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${({ $color }) => $color || 'white'};
`;

const RightSidebar = styled.div`
  background: #0f172a;
  border-left: 1px solid #1e293b;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #0a0e1a;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #1e293b;
    border-radius: 3px;
  }
`;

const SidebarSection = styled.div`
  padding: 20px;
  border-bottom: 1px solid #1e293b;
  
  &:last-child {
    border-bottom: none;
  }
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: white;
  margin: 0 0 4px 0;
`;

const SectionSubtitle = styled.p`
  font-size: 12px;
  color: #64748b;
  margin: 0 0 16px 0;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 6px;
  padding: 4px;
  background: #1e293b;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const Tab = styled.button`
  flex: 1;
  padding: 8px 12px;
  background: ${({ $active }) => $active ? '#0f172a' : 'transparent'};
  color: ${({ $active }) => $active ? 'white' : '#94a3b8'};
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: white;
  }
`;

const ModsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #1e293b;
    border-radius: 2px;
  }
`;

const ModItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: ${({ $selected }) => $selected ? '#1e293b' : '#0a0e1a'};
  border: 1px solid ${({ $selected }) => $selected ? '#f97316' : 'transparent'};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #1e293b;
  }
`;

const ModInfo = styled.div`
  flex: 1;
`;

const ModName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: white;
  margin-bottom: 2px;
`;

const ModDescription = styled.div`
  font-size: 11px;
  color: #64748b;
`;

const ModDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin: 0 8px;
`;

const ModHP = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #f97316;
`;

const ModPrice = styled.div`
  font-size: 11px;
  color: #64748b;
`;

const Checkbox = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid ${({ $checked }) => $checked ? '#f97316' : '#334155'};
  background: ${({ $checked }) => $checked ? '#f97316' : 'transparent'};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  &::after {
    content: '✓';
    color: white;
    font-size: 11px;
    font-weight: bold;
    opacity: ${({ $checked }) => $checked ? 1 : 0};
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 16px;
`;

const SummaryItem = styled.div`
  background: #0a0e1a;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
`;

const SummaryLabel = styled.div`
  font-size: 10px;
  color: #64748b;
  text-transform: uppercase;
  margin-bottom: 4px;
  font-weight: 600;
`;

const SummaryValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${({ $primary }) => $primary ? '#f97316' : 'white'};
`;

const SaveButton = styled.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(249, 115, 22, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

// ============ COMPONENT ============

const Customizer = () => {
  const { brandId, modelId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [carData, setCarData] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#f97316');
  const [selectedMods, setSelectedMods] = useState([]);
  const [activeTab, setActiveTab] = useState('engine');
  const [use3D, setUse3D] = useState(false);
  const [modelPath, setModelPath] = useState('');
  const [webglLost, setWebglLost] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const canvasRef = useRef();

  const modifications = {
    engine: [
      { id: 'turbo', name: 'Turbocharger', hp: 45, price: 2500, description: 'Forced induction' },
      { id: 'supercharger', name: 'Supercharger', hp: 60, price: 3500, description: 'Belt-driven boost' },
      { id: 'intake', name: 'Cold Air Intake', hp: 8, price: 350, description: 'Better airflow' },
      { id: 'intercooler', name: 'Intercooler', hp: 15, price: 800, description: 'Cooler air' },
      { id: 'tune', name: 'ECU Tune', hp: 25, price: 600, description: 'Engine remap' }
    ],
    exhaust: [
      { id: 'catback', name: 'Cat-Back System', hp: 12, price: 800, description: 'Rear exhaust' },
      { id: 'headers', name: 'Performance Headers', hp: 18, price: 1200, description: 'Better flow' },
      { id: 'fullexhaust', name: 'Full Exhaust', hp: 28, price: 2000, description: 'Complete system' }
    ],
    suspension: [
      { id: 'coilovers', name: 'Coilovers', hp: 0, price: 1500, description: 'Adjustable' },
      { id: 'sway', name: 'Sway Bars', hp: 0, price: 400, description: 'Less roll' },
      { id: 'struts', name: 'Performance Struts', hp: 0, price: 900, description: 'Better handling' }
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
          name: data.data?.name || 'Corolla 2024',
          baseHP: data.data?.baseSpecs?.horsePower || 169,
          type: data.data?.type || 'Sedan',
          drivetrain: data.data?.drivetrain || 'FWD',
          engine: data.data?.baseSpecs?.engine || '2.0L'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setCarData({ name: 'Corolla 2024', baseHP: 169, type: 'Sedan', drivetrain: 'FWD', engine: '2.0L' });
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
    if (path) {
      setModelPath(path);
      setUse3D(true);
    }
  };

  const handleWebGLContextLost = () => {
    setWebglLost(true);
    if (retryCount < 3) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setWebglLost(false);
        setUse3D(true);
      }, Math.pow(2, retryCount) * 2000);
    }
  };

  const calculateFinalHP = () => {
    let total = carData?.baseHP || 169;
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
      prev.includes(modId) ? prev.filter(id => id !== modId) : [...prev, modId]
    );
  };

  const saveBuild = () => {
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
      alert('Build saved!');
      navigate('/garage');
    } catch (error) {
      alert('Error saving');
    }
  };

  const getChartHeight = (hp, max) => Math.min((hp / max) * 100, 100);
  const maxHP = Math.max(carData?.baseHP || 169, calculateFinalHP());

  if (loading) {
    return <PageContainer><Loading3D /></PageContainer>;
  }

  return (
    <PageContainer>
      <TopBar />
      <MainContent>
        <LeftSection>
          <Header>
            <BackButton onClick={() => navigate(`/brands/${brandId}`)}>
              ← Back
            </BackButton>
            <Title>{carData?.name}</Title>
            <PowerBadge>{calculateFinalHP()} HP</PowerBadge>
          </Header>

          <ContentGrid>
            <ViewerCard>
              <StatsOverlay>
                <StatRow>
                  <StatLabel>Engine</StatLabel>
                  <StatValue>{carData?.engine}</StatValue>
                </StatRow>
                <StatRow>
                  <StatLabel>Power</StatLabel>
                  <StatValue $primary>{calculateFinalHP()} HP</StatValue>
                </StatRow>
                <StatRow>
                  <StatLabel>Drive</StatLabel>
                  <StatValue>{carData?.drivetrain}</StatValue>
                </StatRow>
              </StatsOverlay>

              <Canvas3D>
                {use3D && modelPath && !webglLost ? (
                  <Canvas3DErrorBoundary color={selectedColor} onError={handleWebGLContextLost}>
                    <Suspense fallback={<Loading3D />}>
                      <Canvas 
                        ref={canvasRef}
                        camera={{ position: [3, 1.5, 3], fov: 45 }}
                        gl={{ antialias: false, alpha: false }}
                        onCreated={({ gl }) => {
                          gl.setClearColor('#1e293b');
                        }}
                      >
                        <ambientLight intensity={0.8} />
                        <directionalLight position={[2, 2, 2]} intensity={0.3} />
                        <Car3DModel modelPath={modelPath} color={selectedColor} />
                        <OrbitControls 
                          enableZoom={true}
                          enablePan={false}
                          autoRotate={true}
                          autoRotateSpeed={0.3}
                        />
                      </Canvas>
                    </Suspense>
                  </Canvas3DErrorBoundary>
                ) : (
                  <CarFallback color={selectedColor} />
                )}
              </Canvas3D>
            </ViewerCard>

            <ChartCard>
              <ChartTitle>Power Analysis</ChartTitle>
              <MiniChart>
                <Bar $height={getChartHeight(carData?.baseHP || 169, maxHP)} $primary />
                <Bar $height={getChartHeight(calculateFinalHP(), maxHP)} />
              </MiniChart>
              <ChartStats>
                <ChartStat>
                  <ChartStatLabel>Base</ChartStatLabel>
                  <ChartStatValue $color="#3b82f6">{carData?.baseHP}</ChartStatValue>
                </ChartStat>
                <ChartStat>
                  <ChartStatLabel>Gain</ChartStatLabel>
                  <ChartStatValue $color="#f97316">+{calculateTotalHPGain()}</ChartStatValue>
                </ChartStat>
                <ChartStat>
                  <ChartStatLabel>Total</ChartStatLabel>
                  <ChartStatValue>{calculateFinalHP()}</ChartStatValue>
                </ChartStat>
              </ChartStats>
            </ChartCard>
          </ContentGrid>
        </LeftSection>

        <RightSidebar>
          <SidebarSection>
            <SectionTitle>Paint Color</SectionTitle>
            <SectionSubtitle>Select vehicle color</SectionSubtitle>
            <ColorPicker color={selectedColor} onChange={setSelectedColor} />
          </SidebarSection>

          <SidebarSection>
            <SectionTitle>Performance Upgrades</SectionTitle>
            <SectionSubtitle>Select modifications</SectionSubtitle>

            <TabsContainer>
              {Object.keys(modifications).map(cat => (
                <Tab key={cat} $active={activeTab === cat} onClick={() => setActiveTab(cat)}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Tab>
              ))}
            </TabsContainer>

            <ModsList>
              {modifications[activeTab]?.map(mod => (
                <ModItem
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
                    <ModPrice>${(mod.price/1000).toFixed(1)}k</ModPrice>
                  </ModDetails>
                  <Checkbox $checked={selectedMods.includes(mod.id)} />
                </ModItem>
              ))}
            </ModsList>
          </SidebarSection>

          <SidebarSection>
            <SectionTitle>Build Summary</SectionTitle>
            <SummaryGrid>
              <SummaryItem>
                <SummaryLabel>Base HP</SummaryLabel>
                <SummaryValue>{carData?.baseHP}</SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <SummaryLabel>Added</SummaryLabel>
                <SummaryValue $primary>+{calculateTotalHPGain()}</SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <SummaryLabel>Cost</SummaryLabel>
                <SummaryValue>${(calculateTotalCost() / 1000).toFixed(1)}k</SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <SummaryLabel>Final HP</SummaryLabel>
                <SummaryValue $primary>{calculateFinalHP()}</SummaryValue>
              </SummaryItem>
            </SummaryGrid>
            <SaveButton onClick={saveBuild}>Save Build</SaveButton>
          </SidebarSection>
        </RightSidebar>
      </MainContent>
    </PageContainer>
  );
};

export default Customizer;