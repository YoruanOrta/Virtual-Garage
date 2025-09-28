// frontend/src/pages/Garage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const GarageContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  padding: clamp(160px, 18vh, 180px) clamp(16px, 4vw, 24px) clamp(32px, 5vh, 48px);
  background: ${({ theme }) => theme.colors.gradient.dark};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 25% 25%, ${({ theme }) => theme.colors.primary}08 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, ${({ theme }) => theme.colors.secondary}05 0%, transparent 50%);
    pointer-events: none;
  }
`;

const Content = styled.div`
  width: 100%;
  max-width: clamp(1200px, 95vw, 1600px);
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: clamp(32px, 6vh, 48px);
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  background: ${({ theme }) => theme.colors.gradient.gaming};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: clamp(12px, 2vh, 16px);
  text-shadow: 0 0 30px rgba(255, 107, 0, 0.3);
`;

const Subtitle = styled.p`
  font-size: clamp(0.9rem, 2.5vw, 1.1rem);
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const GarageStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(clamp(200px, 20vw, 250px), 1fr));
  gap: clamp(16px, 3vw, 24px);
  margin-bottom: clamp(32px, 6vh, 48px);
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: clamp(20px, 4vw, 24px);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 2px solid ${({ theme }) => theme.colors.border};
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ $color, theme }) => $color || theme.colors.primary};
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const StatValue = styled.div`
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: clamp(1.8rem, 5vw, 3rem);
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ $color, theme }) => $color || theme.colors.primary};
  margin-bottom: clamp(8px, 1vh, 12px);
  line-height: 1;
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: clamp(0.75rem, 2vw, 0.9rem);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: ${({ theme }) => theme.typography.weights.medium};
`;

const ActionsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: clamp(24px, 4vh, 32px);
  flex-wrap: wrap;
  gap: clamp(12px, 2vw, 16px);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterOptions = styled.div`
  display: flex;
  gap: clamp(8px, 1.5vw, 12px);
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const FilterButton = styled.button`
  background: ${({ $active, theme }) => 
    $active ? theme.colors.primary : theme.colors.surface};
  color: ${({ $active, theme }) => 
    $active ? 'white' : theme.colors.textSecondary};
  padding: clamp(8px, 1.5vh, 12px) clamp(12px, 2.5vw, 16px);
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: clamp(0.8rem, 2vw, 0.9rem);
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  transition: all 0.3s ease;
  border: 2px solid ${({ $active, theme }) => 
    $active ? theme.colors.primary : theme.colors.border};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const BuildButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: clamp(12px, 2vh, 16px) clamp(20px, 4vw, 32px);
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-family: ${({ theme }) => theme.typography.heading};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  font-size: clamp(0.9rem, 2.2vw, 1.1rem);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: clamp(6px, 1vw, 8px);
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border: none;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const BuildsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(clamp(300px, 30vw, 380px), 1fr));
  gap: clamp(20px, 4vw, 32px);
`;

const BuildCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 2px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: ${({ theme }) => theme.shadows.md};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ theme }) => theme.colors.primary};
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.xl};

    &::before {
      transform: scaleX(1);
    }
  }
`;

const BuildHeader = styled.div`
  padding: clamp(20px, 4vw, 24px);
  background: ${({ theme }) => theme.colors.background};
  position: relative;
`;

const CarDisplay = styled.div`
  width: clamp(60px, 12vw, 80px);
  height: clamp(60px, 12vw, 80px);
  background: ${({ $color, theme }) => $color || theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(1.5rem, 4vw, 2rem);
  margin: 0 auto clamp(12px, 2vh, 16px);
  border: 3px solid ${({ theme }) => theme.colors.primary};
  box-shadow: ${({ theme }) => theme.shadows.glow};
`;

const BuildName = styled.h3`
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-bottom: clamp(6px, 1vh, 8px);
`;

const BuildDate = styled.div`
  text-align: center;
  font-size: clamp(0.7rem, 1.8vw, 0.8rem);
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const BuildStats = styled.div`
  padding: clamp(16px, 3vw, 20px);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(12px, 2vw, 16px);
`;

const BuildStatItem = styled.div`
  text-align: center;
  padding: clamp(12px, 2vw, 16px);
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const BuildStatValue = styled.div`
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: clamp(1.1rem, 3vw, 1.3rem);
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: clamp(4px, 0.5vh, 6px);
  line-height: 1;
`;

const BuildStatLabel = styled.div`
  font-size: clamp(0.7rem, 1.6vw, 0.75rem);
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: ${({ theme }) => theme.typography.weights.medium};
`;

const BuildActions = styled.div`
  padding: clamp(16px, 3vw, 20px);
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  gap: clamp(8px, 1.5vw, 12px);
`;

const ActionButton = styled.button`
  flex: 1;
  padding: clamp(10px, 2vh, 14px) clamp(12px, 2.5vw, 16px);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: clamp(0.8rem, 2vw, 0.9rem);
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  
  &.edit {
    background: ${({ theme }) => theme.colors.secondary};
    color: white;
    
    &:hover {
      background: ${({ theme }) => theme.colors.secondaryDark};
      transform: translateY(-1px);
      box-shadow: ${({ theme }) => theme.shadows.md};
    }
  }
  
  &.delete {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    border: 1px solid #ef4444;
    
    &:hover {
      background: #ef4444;
      color: white;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: clamp(48px, 10vh, 80px) clamp(20px, 4vw, 32px);
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 2px dashed ${({ theme }) => theme.colors.border};
`;

const EmptyIcon = styled.div`
  font-size: clamp(3rem, 8vw, 5rem);
  margin-bottom: clamp(20px, 4vh, 32px);
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: clamp(1.5rem, 4vw, 2rem);
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: clamp(12px, 2vh, 16px);
`;

const EmptyDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: clamp(24px, 4vh, 32px);
  line-height: 1.6;
  font-size: clamp(0.9rem, 2.2vw, 1rem);
`;

const Garage = () => {
  const navigate = useNavigate();
  const [builds, setBuilds] = useState([]);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    totalBuilds: 0,
    avgHP: 0,
    totalCost: 0,
    topHP: 0
  });

  useEffect(() => {
    loadBuilds();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [builds]);

  const loadBuilds = () => {
    try {
      const savedBuilds = JSON.parse(localStorage.getItem('virtualGarageBuilds') || '[]');
      setBuilds(savedBuilds.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error('Error loading builds:', error);
      setBuilds([]);
    }
  };

  const calculateStats = () => {
    if (builds.length === 0) {
      setStats({ totalBuilds: 0, avgHP: 0, totalCost: 0, topHP: 0 });
      return;
    }

    const totalHP = builds.reduce((sum, build) => sum + build.finalHP, 0);
    const totalCost = builds.reduce((sum, build) => sum + build.totalCost, 0);
    const maxHP = Math.max(...builds.map(build => build.finalHP));

    setStats({
      totalBuilds: builds.length,
      avgHP: Math.round(totalHP / builds.length),
      totalCost: totalCost,
      topHP: maxHP
    });
  };

  const deleteBuild = (buildId) => {
    if (window.confirm('Are you sure you want to delete this build?')) {
      const updatedBuilds = builds.filter(build => build.id !== buildId);
      setBuilds(updatedBuilds);
      localStorage.setItem('virtualGarageBuilds', JSON.stringify(updatedBuilds));
    }
  };

  const editBuild = (build) => {
    navigate(`/customize/${build.brandId}/${build.modelId}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredBuilds = builds.filter(build => {
    if (filter === 'all') return true;
    if (filter === 'high-hp') return build.finalHP > 400;
    if (filter === 'recent') return new Date(build.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return true;
  });

  return (
    <GarageContainer>
      <Content>
        <Header>
          <Title>🏠 My Garage</Title>
          <Subtitle>
            Your collection of custom car builds and modifications
          </Subtitle>
        </Header>

        <GarageStats>
          <StatCard $color="#FF6B00">
            <StatValue $color="#FF6B00">{stats.totalBuilds}</StatValue>
            <StatLabel>Total Builds</StatLabel>
          </StatCard>
          <StatCard $color="#00D4FF">
            <StatValue $color="#00D4FF">{stats.avgHP}</StatValue>
            <StatLabel>Avg Horsepower</StatLabel>
          </StatCard>
          <StatCard $color="#00FF88">
            <StatValue $color="#00FF88">{formatPrice(stats.totalCost)}</StatValue>
            <StatLabel>Total Investment</StatLabel>
          </StatCard>
          <StatCard $color="#FFD700">
            <StatValue $color="#FFD700">{stats.topHP}</StatValue>
            <StatLabel>Highest HP</StatLabel>
          </StatCard>
        </GarageStats>

        <ActionsBar>
          <FilterOptions>
            <FilterButton 
              $active={filter === 'all'} 
              onClick={() => setFilter('all')}
            >
              All Builds
            </FilterButton>
            <FilterButton 
              $active={filter === 'high-hp'} 
              onClick={() => setFilter('high-hp')}
            >
              High HP (400+)
            </FilterButton>
            <FilterButton 
              $active={filter === 'recent'} 
              onClick={() => setFilter('recent')}
            >
              Recent
            </FilterButton>
          </FilterOptions>
          
          <BuildButton onClick={() => navigate('/brands')}>
            <span>🔧</span>
            Build New Car
          </BuildButton>
        </ActionsBar>

        {filteredBuilds.length === 0 ? (
          <EmptyState>
            <EmptyIcon>🚗</EmptyIcon>
            <EmptyTitle>
              {builds.length === 0 ? 'Your garage is empty!' : 'No builds match your filter'}
            </EmptyTitle>
            <EmptyDescription>
              {builds.length === 0 
                ? 'Start building your dream car collection by creating your first custom build.'
                : 'Try adjusting your filter to see more builds.'
              }
            </EmptyDescription>
            {builds.length === 0 && (
              <BuildButton onClick={() => navigate('/brands')}>
                <span>🏁</span>
                Start Building
              </BuildButton>
            )}
          </EmptyState>
        ) : (
          <BuildsGrid>
            {filteredBuilds.map((build, index) => (
              <BuildCard key={build.id}>
                <BuildHeader>
                  <CarDisplay $color={build.color}>
                    🚗
                  </CarDisplay>
                  <BuildName>{build.carName}</BuildName>
                  <BuildDate>{formatDate(build.createdAt)}</BuildDate>
                </BuildHeader>
                
                <BuildStats>
                  <BuildStatItem>
                    <BuildStatValue>{build.finalHP}</BuildStatValue>
                    <BuildStatLabel>Total HP</BuildStatLabel>
                  </BuildStatItem>
                  <BuildStatItem>
                    <BuildStatValue>+{build.finalHP - build.baseHP}</BuildStatValue>
                    <BuildStatLabel>HP Gain</BuildStatLabel>
                  </BuildStatItem>
                  <BuildStatItem>
                    <BuildStatValue>{build.modifications.length}</BuildStatValue>
                    <BuildStatLabel>Mods</BuildStatLabel>
                  </BuildStatItem>
                  <BuildStatItem>
                    <BuildStatValue>{formatPrice(build.totalCost)}</BuildStatValue>
                    <BuildStatLabel>Cost</BuildStatLabel>
                  </BuildStatItem>
                </BuildStats>
                
                <BuildActions>
                  <ActionButton 
                    className="edit" 
                    onClick={() => editBuild(build)}
                  >
                    ✏️ Edit
                  </ActionButton>
                  <ActionButton 
                    className="delete" 
                    onClick={() => deleteBuild(build.id)}
                  >
                    🗑️ Delete
                  </ActionButton>
                </BuildActions>
              </BuildCard>
            ))}
          </BuildsGrid>
        )}
      </Content>
    </GarageContainer>
  );
};

export default Garage;