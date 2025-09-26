// frontend/src/pages/Customizer.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const CustomizerContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  padding: clamp(140px, 15vh, 160px) 0 clamp(32px, 5vh, 48px);
  background: ${({ theme }) => theme.colors.background};
  box-sizing: border-box;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr clamp(350px, 25vw, 400px);
  gap: clamp(16px, 3vw, 24px);
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 clamp(16px, 3vw, 24px);
  min-height: calc(100vh - 200px);

  @media (max-width: ${({ theme }) => theme.breakpoints.laptop}) {
    grid-template-columns: 1fr;
    gap: clamp(20px, 4vh, 32px);
    padding: 0 clamp(16px, 4vw, 24px);
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0; /* Permite que flex funcione correctamente */
`;

const CarViewerSection = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 2px solid ${({ theme }) => theme.colors.card};
  padding: clamp(16px, 3vw, 24px);
  margin-bottom: clamp(16px, 3vh, 24px);
  height: clamp(400px, 50vh, 600px);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ theme }) => theme.colors.gradient.primary};
  }
`;

const CarDisplay = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.gradient.dark};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  position: relative;
  overflow: hidden;
  margin-bottom: clamp(12px, 2vh, 16px);
  min-height: 200px;

  &::before {
    content: '🚗';
    font-size: clamp(4rem, 8vw, 6rem);
    opacity: 0.3;
    animation: float 6s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(2deg); }
  }
`;

const CarInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: clamp(12px, 2.5vw, 16px);
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
    text-align: center;
  }
`;

const CarName = styled.h2`
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const CarSpecs = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: clamp(0.875rem, 2vw, 1rem);
`;

const HPDisplay = styled.div`
  text-align: right;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    text-align: center;
  }
`;

const CurrentHP = styled.div`
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const HPGain = styled.div`
  font-size: clamp(0.875rem, 2vw, 1rem);
  color: ${({ theme }) => theme.colors.success};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  justify-content: flex-end;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    justify-content: center;
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 3vh, 20px);
  min-width: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.laptop}) {
    order: -1; /* Mover sidebar arriba en móvil */
  }
`;

const SidebarSection = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.card};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const SectionHeader = styled.div`
  background: ${({ theme }) => theme.colors.gradient.primary};
  padding: clamp(12px, 2.5vw, 16px);
  color: white;
  font-family: ${({ theme }) => theme.typography.heading};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SectionContent = styled.div`
  padding: clamp(16px, 3vw, 20px);
`;

const CategoryTabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: clamp(6px, 1.5vw, 8px);
  margin-bottom: clamp(12px, 2.5vh, 16px);
`;

const CategoryTab = styled.button`
  background: ${({ $active, theme }) => 
    $active ? theme.colors.primary : theme.colors.card};
  color: ${({ $active, theme }) => 
    $active ? 'white' : theme.colors.textSecondary};
  padding: clamp(6px, 1.5vw, 8px) clamp(8px, 2vw, 12px);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: clamp(0.75rem, 2vw, 0.875rem);
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  text-transform: capitalize;
  transition: all ${({ theme }) => theme.transitions.fast};
  border: 1px solid ${({ $active, theme }) => 
    $active ? theme.colors.primary : 'transparent'};

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`;

const ModificationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(8px, 2vw, 12px);
  max-height: clamp(250px, 35vh, 350px);
  overflow-y: auto;
`;

const ModificationItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: clamp(10px, 2.5vw, 14px);
  background: ${({ $selected, theme }) => 
    $selected ? theme.colors.primary + '20' : theme.colors.card};
  border: 2px solid ${({ $selected, theme }) => 
    $selected ? theme.colors.primary : 'transparent'};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateX(2px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
    text-align: center;
  }
`;

const ModInfo = styled.div`
  flex: 1;
`;

const ModName = styled.div`
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ModDescription = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.4;
`;

const ModStats = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const HPGainBadge = styled.span`
  background: ${({ theme }) => theme.colors.success}20;
  color: ${({ theme }) => theme.colors.success};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
`;

const PriceBadge = styled.span`
  background: ${({ theme }) => theme.colors.accent}20;
  color: ${({ theme }) => theme.colors.accent};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
`;

const ColorPalette = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(35px, 1fr));
  gap: clamp(6px, 1.5vw, 8px);
  max-width: 300px;
`;

const ColorSwatch = styled.button`
  width: clamp(35px, 8vw, 45px);
  height: clamp(35px, 8vw, 45px);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ $color }) => $color};
  border: 3px solid ${({ $selected, theme }) => 
    $selected ? theme.colors.primary : theme.colors.card};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  position: relative;

  &:hover {
    transform: scale(1.1);
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::after {
    content: ${({ $selected }) => $selected ? "'✓'" : "''"};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-weight: bold;
    text-shadow: 0 0 3px rgba(0,0,0,0.8);
    font-size: clamp(0.75rem, 2vw, 1rem);
  }
`;

const BuildSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.card};

  &:last-child {
    border-bottom: none;
    font-weight: ${({ theme }) => theme.typography.weights.bold};
    font-size: ${({ theme }) => theme.typography.sizes.lg};
  }
`;

const SaveButton = styled.button`
  width: 100%;
  background: ${({ theme }) => theme.colors.gradient.secondary};
  color: white;
  padding: clamp(14px, 3vh, 18px);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-family: ${({ theme }) => theme.typography.heading};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all ${({ theme }) => theme.transitions.medium};
  box-shadow: ${({ theme }) => theme.shadows.glowBlue};
  margin-top: clamp(16px, 3vh, 20px);

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }

  &:active {
    transform: translateY(0);
  }
`;

const Customizer = () => {
  const { brandId, modelId } = useParams();
  const navigate = useNavigate();
  
  // States
  const [carData, setCarData] = useState(null);
  const [modifications, setModifications] = useState({});
  const [colors, setColors] = useState({});
  const [selectedModifications, setSelectedModifications] = useState([]);
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [activeCategory, setActiveCategory] = useState('engine');
  const [loading, setLoading] = useState(true);
  const [totalHP, setTotalHP] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    if (brandId && modelId) {
      loadCarData();
      loadModifications();
    }
  }, [brandId, modelId]);

  useEffect(() => {
    calculateTotals();
  }, [selectedModifications, carData]);

  const loadCarData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3001/api/cars/brands/${brandId}/models/${modelId}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setCarData(data.data);
        setSelectedColor(data.data.defaultColor || '#FFFFFF');
        setTotalHP(data.data.baseSpecs?.horsePower || 0);
      }
    } catch (error) {
      console.error('Error loading car data:', error);
    }
  };

  const loadModifications = async () => {
    try {
      const [modsResponse, colorsResponse] = await Promise.all([
        fetch('http://127.0.0.1:3001/api/modifications'),
        fetch('http://127.0.0.1:3001/api/modifications/colors')
      ]);
      
      const modsData = await modsResponse.json();
      const colorsData = await colorsResponse.json();
      
      if (modsData.success) {
        setModifications(modsData.data.modifications || {});
      }
      
      if (colorsData.success) {
        setColors(colorsData.data || {});
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading modifications:', error);
      setLoading(false);
    }
  };

  const calculateTotals = async () => {
    if (!carData || selectedModifications.length === 0) {
      setTotalHP(carData?.baseSpecs?.horsePower || 0);
      setTotalCost(0);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:3001/api/modifications/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseHP: carData.baseSpecs.horsePower,
          modifications: selectedModifications
        })
      });

      const data = await response.json();
      if (data.success) {
        setTotalHP(data.data.finalHP);
        setTotalCost(data.data.totalCost);
      }
    } catch (error) {
      console.error('Error calculating totals:', error);
    }
  };

  const toggleModification = (category, modId) => {
    const isSelected = selectedModifications.includes(modId);
    
    if (isSelected) {
      setSelectedModifications(prev => prev.filter(id => id !== modId));
    } else {
      setSelectedModifications(prev => [...prev, modId]);
    }
  };

  const saveBuild = () => {
    const build = {
      id: Date.now(),
      brandId,
      modelId,
      carName: `${carData.brandName} ${carData.name}`,
      baseHP: carData.baseSpecs.horsePower,
      finalHP: totalHP,
      modifications: selectedModifications,
      color: selectedColor,
      totalCost,
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    const savedBuilds = JSON.parse(localStorage.getItem('virtualGarageBuilds') || '[]');
    savedBuilds.push(build);
    localStorage.setItem('virtualGarageBuilds', JSON.stringify(savedBuilds));

    // Navigate to garage
    navigate('/garage');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <CustomizerContainer>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <div style={{ color: 'white', fontSize: '1.2rem' }}>Loading customizer...</div>
        </div>
      </CustomizerContainer>
    );
  }

  if (!carData) {
    return (
      <CustomizerContainer>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <div style={{ color: 'red', fontSize: '1.2rem' }}>Car not found!</div>
        </div>
      </CustomizerContainer>
    );
  }

  const categories = Object.keys(modifications);
  const currentModifications = modifications[activeCategory] || {};

  return (
    <CustomizerContainer>
      <Layout>
        <MainContent>
          <CarViewerSection className="animate-slideUp">
            <CarDisplay style={{ backgroundColor: selectedColor + '20' }} />
            <CarInfo>
              <div>
                <CarName>{carData.brandName} {carData.name}</CarName>
                <CarSpecs>{carData.year} • {carData.type}</CarSpecs>
              </div>
              <HPDisplay>
                <CurrentHP>{totalHP}</CurrentHP>
                <HPGain>
                  ⚡ +{totalHP - carData.baseSpecs.horsePower} HP
                </HPGain>
              </HPDisplay>
            </CarInfo>
          </CarViewerSection>
        </MainContent>

        <Sidebar>
          {/* Modifications Section */}
          <SidebarSection className="animate-slideUp">
            <SectionHeader>
              🔧 Modifications
            </SectionHeader>
            <SectionContent>
              <CategoryTabs>
                {categories.map(category => (
                  <CategoryTab
                    key={category}
                    $active={activeCategory === category}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </CategoryTab>
                ))}
              </CategoryTabs>
              
              <ModificationsList>
                {Object.entries(currentModifications).map(([modId, mod]) => (
                  <ModificationItem
                    key={modId}
                    $selected={selectedModifications.includes(modId)}
                    onClick={() => toggleModification(activeCategory, modId)}
                  >
                    <ModInfo>
                      <ModName>{mod.name}</ModName>
                      <ModDescription>{mod.description}</ModDescription>
                    </ModInfo>
                    <ModStats>
                      <HPGainBadge>+{mod.hpGain} HP</HPGainBadge>
                      <PriceBadge>{formatPrice(mod.price)}</PriceBadge>
                    </ModStats>
                  </ModificationItem>
                ))}
              </ModificationsList>
            </SectionContent>
          </SidebarSection>

          {/* Colors Section */}
          <SidebarSection className="animate-slideUp">
            <SectionHeader>
              🎨 Colors
            </SectionHeader>
            <SectionContent>
              <ColorPalette>
                {Object.entries(colors.solid || {}).map(([colorId, color]) => (
                  <ColorSwatch
                    key={colorId}
                    $color={color.hex}
                    $selected={selectedColor === color.hex}
                    onClick={() => setSelectedColor(color.hex)}
                    title={color.name}
                  />
                ))}
              </ColorPalette>
            </SectionContent>
          </SidebarSection>

          {/* Build Summary */}
          <SidebarSection className="animate-slideUp">
            <SectionHeader>
              📊 Build Summary
            </SectionHeader>
            <SectionContent>
              <BuildSummary>
                <SummaryRow>
                  <span>Base HP</span>
                  <span>{carData.baseSpecs.horsePower}</span>
                </SummaryRow>
                <SummaryRow>
                  <span>HP Gain</span>
                  <span style={{ color: '#00FF88' }}>+{totalHP - carData.baseSpecs.horsePower}</span>
                </SummaryRow>
                <SummaryRow>
                  <span>Total Cost</span>
                  <span>{formatPrice(totalCost)}</span>
                </SummaryRow>
                <SummaryRow>
                  <span>Final HP</span>
                  <span style={{ color: '#FF6B00' }}>{totalHP}</span>
                </SummaryRow>
              </BuildSummary>
              
              <SaveButton onClick={saveBuild}>
                💾 Save Build
              </SaveButton>
            </SectionContent>
          </SidebarSection>
        </Sidebar>
      </Layout>
    </CustomizerContainer>
  );
};

export default Customizer;