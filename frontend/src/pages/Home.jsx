import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const HomeContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: ${({ theme }) => theme.colors.gradient.dark};
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: clamp(100px, 12vh, 140px);
  padding-bottom: ${({ theme }) => theme.spacing.xl};
  box-sizing: border-box;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 25% 25%, ${({ theme }) => theme.colors.primary}20 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, ${({ theme }) => theme.colors.accent}15 0%, transparent 50%);
  background-size: 400px 400px;
  animation: float 20s infinite linear;

  @keyframes float {
    0% { transform: translate(0, 0) rotate(0deg); }
    33% { transform: translate(30px, -30px) rotate(120deg); }
    66% { transform: translate(-20px, 20px) rotate(240deg); }
    100% { transform: translate(0, 0) rotate(360deg); }
  }
`;

const ContentWrapper = styled.div`
  text-align: center;
  z-index: 2;
  width: 100%;
  max-width: 1400px;
  padding: 0 clamp(16px, 4vw, 48px);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: clamp(24px, 4vh, 48px);
`;

const Logo = styled.h1`
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: clamp(2.5rem, 8vw, 4rem); /* Tamaño responsivo */
  font-weight: ${({ theme }) => theme.typography.weights.black};
  background: ${({ theme }) => theme.colors.gradient.gaming};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  animation: glow 3s infinite;
  text-shadow: 0 0 30px rgba(255, 107, 0, 0.5);
  line-height: 1.1;
`;

const Tagline = styled.h2`
  font-size: clamp(1rem, 3vw, 1.5rem); /* Tamaño responsivo */
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: clamp(32px, 5vh, 48px);
  font-weight: ${({ theme }) => theme.typography.weights.light};
  line-height: 1.4;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const StartButton = styled.button`
  background: ${({ theme }) => theme.colors.gradient.primary};
  color: white;
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: clamp(1rem, 2.5vw, 1.25rem); /* Tamaño responsivo */
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  padding: clamp(16px, 2vh, 20px) clamp(32px, 6vw, 48px); /* Padding responsivo */
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 2px solid transparent;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all ${({ theme }) => theme.transitions.medium};
  text-transform: uppercase;
  letter-spacing: 2px;
  box-shadow: ${({ theme }) => theme.shadows.glow};
  
  /* Centrar en móvil */
  align-self: center;
  min-width: fit-content;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
    border-color: ${({ theme }) => theme.colors.accent};

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
  gap: clamp(16px, 3vw, 24px);
  width: 100%;
  margin-top: clamp(32px, 6vh, 64px);
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
  }
  
  @media (min-width: 641px) and (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: clamp(20px, 4vw, 24px);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.card};
  text-align: center;
  transition: all ${({ theme }) => theme.transitions.medium};
  position: relative;
  overflow: hidden;
  width: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${({ theme }) => theme.colors.gradient.primary};
    transform: scaleX(0);
    transition: transform ${({ theme }) => theme.transitions.medium};
  }

  &:hover {
    transform: translateY(-5px);
    border-color: ${({ theme }) => theme.colors.primary};
    
    &::before {
      transform: scaleX(1);
    }
  }
`;

const FeatureIcon = styled.div`
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.primary};
`;

const FeatureTitle = styled.h3`
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: clamp(0.875rem, 2vw, 0.875rem);
  line-height: 1.6;
  text-align: center;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: clamp(16px, 4vw, 32px);
  margin-top: clamp(32px, 5vh, 40px);
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  text-align: center;
  min-width: clamp(100px, 15vw, 120px);
  padding: ${({ theme }) => theme.spacing.md};
`;

const StatNumber = styled.div`
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: clamp(0.75rem, 2vw, 0.875rem);
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ brands: 0, models: 0, modifications: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Fetch stats from API
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const brandsResponse = await fetch('http://127.0.0.1:3001/api/cars/brands');
      const brandsData = await brandsResponse.json();
      
      const modsResponse = await fetch('http://127.0.0.1:3001/api/modifications');
      const modsData = await modsResponse.json();
      
      setStats({
        brands: brandsData.count || 0,
        models: Object.values(brandsData.data || {})
          .reduce((sum, brand) => sum + (brand.modelCount || 0), 0),
        modifications: Object.values(modsData.data?.modifications || {})
          .reduce((sum, category) => sum + Object.keys(category).length, 0)
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Set fallback numbers
      setStats({ brands: 20, models: 60, modifications: 50 });
    }
  };

  const handleStartClick = () => {
    navigate('/brands');
  };

  const features = [
    {
      icon: '🚗',
      title: 'Real Vehicles',
      description: 'Customize authentic car models with accurate specifications and real-world modifications.'
    },
    {
      icon: '⚡',
      title: 'Live HP Calculation',
      description: 'See real-time horsepower gains with dynamic performance charts and metrics.'
    },
    {
      icon: '🎨',
      title: '3D Visualization',
      description: 'Watch your modifications come to life with interactive 3D rendering.'
    },
    {
      icon: '💾',
      title: 'Save Your Builds',
      description: 'Create and store unlimited custom builds in your personal garage.'
    }
  ];

  return (
    <HomeContainer>
      <BackgroundPattern />
      <ContentWrapper className={isVisible ? 'animate-fadeIn' : ''}>
        <Logo className={isVisible ? 'animate-slideUp' : ''}>
          VIRTUAL GARAGE
        </Logo>
        
        <Tagline className={isVisible ? 'animate-slideUp' : ''}>
          Build Your Dream Car with Real Modifications & Performance Data
        </Tagline>

        <StartButton 
          onClick={handleStartClick}
          className={isVisible ? 'animate-slideUp animate-glow' : ''}
        >
          🏁 Start Building
        </StartButton>

        <FeatureGrid>
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              className={isVisible ? 'animate-slideUp' : ''}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeatureGrid>

        <StatsContainer>
          <StatItem className={isVisible ? 'animate-slideUp' : ''}>
            <StatNumber>{stats.brands}+</StatNumber>
            <StatLabel>Brands</StatLabel>
          </StatItem>
          <StatItem className={isVisible ? 'animate-slideUp' : ''}>
            <StatNumber>{stats.models}+</StatNumber>
            <StatLabel>Models</StatLabel>
          </StatItem>
          <StatItem className={isVisible ? 'animate-slideUp' : ''}>
            <StatNumber>{stats.modifications}+</StatNumber>
            <StatLabel>Modifications</StatLabel>
          </StatItem>
        </StatsContainer>
      </ContentWrapper>
    </HomeContainer>
  );
};

export default Home;