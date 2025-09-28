// frontend/src/pages/BrandSelection.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const BrandContainer = styled.div`
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background};
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing['4xl']};
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: ${({ theme }) => theme.typography.sizes['4xl']};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};

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

const BrandGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing['4xl']};
`;

const BrandCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 2px solid transparent;
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.medium};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 2px;
    background: ${({ theme }) => theme.colors.gradient.primary};
    transition: left ${({ theme }) => theme.transitions.medium};
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.lg};

    &::before {
      left: 0;
    }
  }

  &:active {
    transform: translateY(-2px);
  }
`;

const BrandLogo = styled.div`
  width: clamp(80px, 15vw, 120px);
  height: clamp(80px, 15vw, 120px);
  border-radius: 50%;
  background: white; // Cambiado a blanco
  border: 3px solid ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto clamp(16px, 3vh, 24px);
  transition: all 0.4s ease;
  box-shadow: ${({ theme }) => theme.shadows.glow};
  position: relative;
  overflow: hidden;
  
  img {
    width: 60%;
    height: 60%;
    object-fit: contain;
    filter: brightness(1);
    transition: all 0.3s ease;
  }
  
  &::after {
    content: '${({ $fallbackLetter }) => $fallbackLetter || '?'}';
    position: absolute;
    font-size: clamp(2rem, 8vw, 3rem);
    font-weight: ${({ theme }) => theme.typography.weights.bold};
    color: ${({ theme }) => theme.colors.primary};
    display: ${({ $hasLogo }) => $hasLogo ? 'none' : 'flex'};
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
`;

const BrandName = styled.h3`
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const BrandInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.card};
`;

const ModelCount = styled.span`
  background: ${({ theme }) => theme.colors.accent}20;
  color: ${({ theme }) => theme.colors.accent};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
`;

const BrandType = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid ${({ theme }) => theme.colors.card};
  border-top: 3px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['3xl']};
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.sizes.lg};
`;

const RetryButton = styled.button`
  background: ${({ theme }) => theme.colors.gradient.primary};
  color: white;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const BrandSelection = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://127.0.0.1:3001/api/cars/brands');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        setBrands(Object.entries(data.data).map(([id, brand]) => ({
          id,
          ...brand
        })));
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
      setError('Failed to load car brands. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBrandClick = (brandId) => {
    navigate(`/brands/${brandId}`);
  };

  const getBrandInitials = (brandName) => {
    return brandName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getBrandType = (brandName) => {
    const types = {
      'Toyota': 'Reliability',
      'Honda': 'Performance',
      'Ford': 'American',
      'BMW': 'Luxury',
      'Mercedes': 'Premium',
      'Audi': 'Technology'
    };
    return types[brandName] || 'Automotive';
  };

  if (loading) {
    return (
      <BrandContainer>
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      </BrandContainer>
    );
  }

  if (error) {
    return (
      <BrandContainer>
        <Content>
          <ErrorMessage>
            {error}
            <br />
            <RetryButton onClick={fetchBrands}>
              🔄 Try Again
            </RetryButton>
          </ErrorMessage>
        </Content>
      </BrandContainer>
    );
  }

  return (
    <BrandContainer>
      <Content>
        <Header>
          <Title className="animate-slideUp">Choose Your Brand</Title>
          <Subtitle className="animate-slideUp">
            Select a car manufacturer to explore their models and start building your dream car
          </Subtitle>
        </Header>

        <BrandGrid>
          {brands.map((brand, index) => (
            <BrandCard
              key={brand.id}
              onClick={() => handleBrandClick(brand.id)}
              className="animate-slideUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <BrandLogo 
                $hasLogo={brand.logo}
                $fallbackLetter={brand.name.charAt(0)}
              >
                {brand.logo && (
                  <img 
                    src={brand.logo} 
                    alt={`${brand.name} logo`}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.setAttribute('data-has-logo', 'false');
                    }}
                  />
                )}
              </BrandLogo>
              <BrandName>{brand.name}</BrandName>
              <BrandInfo>
                <ModelCount>
                  {brand.modelCount} Model{brand.modelCount !== 1 ? 's' : ''}
                </ModelCount>
                <BrandType>{getBrandType(brand.name)}</BrandType>
              </BrandInfo>
            </BrandCard>
          ))}
        </BrandGrid>
      </Content>
    </BrandContainer>
  );
};

export default BrandSelection;