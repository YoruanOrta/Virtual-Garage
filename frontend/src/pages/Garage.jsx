// frontend/src/pages/Garage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const GarageContainer = styled.div`
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md}; // Reducir padding top
  background: ${({ theme }) => theme.colors.background};
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
      radial-gradient(circle at 75% 75%, ${({ theme }) => theme.colors.accent}05 0%, transparent 50%);
    pointer-events: none;
  }
`;

const Content = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing['4xl']};
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: ${({ theme }) => theme.typography.sizes['4xl']};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  background: ${({ theme }) => theme.colors.gradient.gaming};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  text-shadow: 0 0 30px rgba(255, 107, 0, 0.3);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.sizes['3xl']};
  }
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const GarageStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing['3xl']};
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.card};
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ $color, theme }) => $color || theme.colors.primary};
  }
`;

const StatValue = styled.div`
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: ${({ theme }) => theme.typography.sizes['3xl']};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ $color, theme }) => $color || theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ActionsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterOptions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  background: ${({ $active, theme }) => 
    $active ? theme.colors.primary : theme.colors.card};
  color: ${({ $active, theme }) => 
    $active ? 'white' : theme.colors.textSecondary};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  transition: all ${({ theme }) => theme.transitions.fast};
  border: 1px solid ${({ $active, theme }) => 
    $active ? theme.colors.primary : 'transparent'};

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`;

const BuildButton = styled.button`
  background: ${({ theme }) => theme.colors.gradient.primary};
  color: white;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-family: ${({ theme }) => theme.typography.heading};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  transition: all ${({ theme }) => theme.transitions.medium};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  box-shadow: ${({ theme }) => theme.shadows.glow};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }
`;

const BuildsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
`;

const BuildCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 2px solid ${({ theme }) => theme.colors.card};
  overflow: hidden;
  transition: all ${({ theme }) => theme.transitions.medium};
  position: relative;
  box-shadow: ${({ theme }) => theme.shadows.md};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ theme }) => theme.colors.gradient.primary};
    transform: scaleX(0);
    transition: transform ${({ theme }) => theme.transitions.medium};
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
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.card};
  position: relative;
`;

const CarDisplay = styled.div`
  width: 80px;
  height: 80px;
  background: ${({ $color, theme }) => $color || theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.sizes['2xl']};
  margin: 0 auto ${({ theme }) => theme.spacing.md};
  border: 3px solid ${({ theme }) => theme.colors.primary};
  box-shadow: ${({ theme }) => theme.shadows.glow};
`;

const BuildName = styled.h3`
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const BuildDate = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const BuildStats = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const BuildStatItem = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.card};
`;

const BuildStatValue = styled.div`
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const BuildStatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const BuildActions = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ActionButton = styled.button`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &.edit {
    background: ${({ theme }) => theme.colors.gradient.secondary};
    color: white;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: ${({ theme }) => theme.shadows.md};
    }
  }
  
  &.delete {
    background: ${({ theme }) => theme.colors.error}20;
    color: ${({ theme }) => theme.colors.error};
    border: 1px solid ${({ theme }) => theme.colors.error};
    
    &:hover {
      background: ${({ theme }) => theme.colors.error};
      color: white;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['5xl']};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 2px dashed ${({ theme }) => theme.colors.card};
`;

const EmptyIcon = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes['6xl']};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: ${({ theme }) => theme.typography.sizes['2xl']};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const EmptyDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  line-height: 1.6;
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
          <Title className="animate-slideUp">🏠 My Garage</Title>
          <Subtitle className="animate-slideUp">
            Your collection of custom car builds and modifications
          </Subtitle>
        </Header>

        <GarageStats>
          <StatCard className="animate-slideUp" $color="#FF6B00">
            <StatValue $color="#FF6B00">{stats.totalBuilds}</StatValue>
            <StatLabel>Total Builds</StatLabel>
          </StatCard>
          <StatCard className="animate-slideUp" $color="#00D4FF">
            <StatValue $color="#00D4FF">{stats.avgHP}</StatValue>
            <StatLabel>Avg Horsepower</StatLabel>
          </StatCard>
          <StatCard className="animate-slideUp" $color="#00FF88">
            <StatValue $color="#00FF88">{formatPrice(stats.totalCost)}</StatValue>
            <StatLabel>Total Investment</StatLabel>
          </StatCard>
          <StatCard className="animate-slideUp" $color="#FFD700">
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
          <EmptyState className="animate-slideUp">
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
              <BuildCard 
                key={build.id}
                className="animate-slideUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
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