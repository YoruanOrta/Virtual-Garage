// frontend/src/pages/ModelSelection.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ModelContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  padding: clamp(160px, 15vh, 180px) clamp(16px, 4vw, 24px) clamp(32px, 5vh, 48px);
  background: ${({ theme }) => theme.colors.background};
  position: relative;
  box-sizing: border-box;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 80%, ${({ theme }) => theme.colors.primary}10 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, ${({ theme }) => theme.colors.accent}08 0%, transparent 50%);
    pointer-events: none;
  }
`;

const Content = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  width: 100%;
  padding: 0 clamp(16px, 3vw, 24px);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: clamp(32px, 6vh, 48px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(16px, 3vh, 24px);
`;

const BrandLogo = styled.div`
  width: clamp(80px, 12vw, 120px);
  height: clamp(80px, 12vw, 120px);
  background: ${({ theme }) => theme.colors.gradient.primary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(1.5rem, 4vw, 3rem);
  font-weight: ${({ theme }) => theme.typography.weights.black};
  color: white;
  box-shadow: ${({ theme }) => theme.shadows.glow};
  animation: float 6s ease-in-out infinite;

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  line-height: 1.2;
`;

const Subtitle = styled.p`
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
  text-align: center;
`;

const ModelsGrid = styled.div`
  display: grid;
  gap: clamp(20px, 3vw, 32px);
  margin-bottom: clamp(48px, 8vh, 64px);
  
  grid-template-columns: repeat(
    auto-fit, 
    minmax(
      clamp(280px, 25vw, 380px), 
      1fr
    )
  );
  
  @media (max-width: 900px) {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }
  
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin: 0 auto clamp(48px, 8vh, 64px);
  }
  
  @media (min-width: 1400px) {
    grid-template-columns: repeat(3, 1fr);
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: clamp(48px, 8vh, 64px);
  }
`;

const ModelCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 2px solid transparent;
  overflow: hidden;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.medium};
  position: relative;
  box-shadow: ${({ theme }) => theme.shadows.md};
  width: 100%;
  
  height: clamp(480px, 58vh, 550px);
  max-height: 550px;
  min-height: 460px;
  
  display: flex;
  flex-direction: column;

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
    transform: translateY(-8px);
    box-shadow: ${({ theme }) => theme.shadows.xl};

    &::before {
      transform: scaleX(1);
    }
  }

  &:active {
    transform: translateY(-4px);
  }
`;

const ModelImage = styled.div`
  height: 180px;
  background: ${({ theme }) => theme.colors.gradient.dark};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(3rem, 6vw, 4rem);
  color: ${({ theme }) => theme.colors.textMuted};
  position: relative;
  overflow: hidden;
  flex-shrink: 0;

  &::after {
    content: '🚗';
    font-size: inherit;
    opacity: 0.3;
  }

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: clamp(80px, 10vw, 100px);
    height: clamp(80px, 10vw, 100px);
    background: ${({ theme }) => theme.colors.primary}20;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: pulse 2s infinite;
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 180px);
  padding: clamp(16px, 3vw, 20px);
`;

const ModelName = styled.h3`
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: clamp(1.125rem, 3vw, 1.25rem);
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  line-height: 1.3;
  flex-shrink: 0;
`;

const ModelType = styled.span`
  background: ${({ theme }) => theme.colors.accent}20;
  color: ${({ theme }) => theme.colors.accent};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: clamp(0.75rem, 2vw, 0.875rem);
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  display: inline-block;
  width: fit-content;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  flex-shrink: 0;
`;

const SpecsSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const SpecsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(8px, 1.5vw, 12px);
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SpecItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: clamp(10px, 2vw, 14px);
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  height: 65px;
  justify-content: center;

  &:hover {
    background: ${({ theme }) => theme.colors.primary}10;
  }
`;

const SpecValue = styled.span`
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 4px;
`;

const SpecLabel = styled.span`
  font-size: clamp(0.625rem, 1.5vw, 0.75rem);
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 1px;
  line-height: 1.2;
`;

const CustomizeButton = styled.button`
  width: 100%;
  background: ${({ theme }) => theme.colors.gradient.primary};
  color: white;
  padding: 16px ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-family: ${({ theme }) => theme.typography.heading};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  font-size: clamp(0.875rem, 1.8vw, 1rem);
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all ${({ theme }) => theme.transitions.fast};
  position: relative;
  overflow: hidden;
  height: 50px;
  flex-shrink: 0;
  margin-top: auto;

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
    box-shadow: ${({ theme }) => theme.shadows.lg};

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const LoadingSpinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid ${({ theme }) => theme.colors.card};
  border-top: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.sizes.lg};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['4xl']};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 2px solid ${({ theme }) => theme.colors.error};
  margin: ${({ theme }) => theme.spacing.xl} 0;
`;

const ErrorTitle = styled.h3`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const RetryButton = styled.button`
  background: ${({ theme }) => theme.colors.gradient.primary};
  color: white;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const ModelSelection = () => {
  const { brandId } = useParams();
  const navigate = useNavigate();
  const [brandData, setBrandData] = useState(null);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (brandId) {
      fetchBrandModels();
    }
  }, [brandId]);

  const fetchBrandModels = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://127.0.0.1:3001/api/cars/brands/${brandId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        setBrandData(data.data);
        setModels(Object.entries(data.data.models).map(([id, model]) => ({
          id,
          ...model
        })));
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching models:', error);
      setError('Failed to load car models. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleModelClick = (modelId) => {
    navigate(`/customize/${brandId}/${modelId}`);
  };

  const handleBackToBrands = () => {
    navigate('/brands');
  };

  const getBrandInitials = (brandName) => {
    return brandName
      ?.split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2) || '??';
  };

  if (loading) {
    return (
      <ModelContainer>
        <Content>
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>Loading {brandId} models...</LoadingText>
          </LoadingContainer>
        </Content>
      </ModelContainer>
    );
  }

  if (error) {
    return (
      <ModelContainer>
        <Content>
          <ErrorMessage>
            <ErrorTitle>⚠️ Error Loading Models</ErrorTitle>
            <ErrorText>{error}</ErrorText>
            <RetryButton onClick={fetchBrandModels}>
              🔄 Try Again
            </RetryButton>
          </ErrorMessage>
        </Content>
      </ModelContainer>
    );
  }

  return (
    <ModelContainer>
      <Content>
        <Header>
          <BrandLogo className="animate-slideUp">
            {getBrandInitials(brandData?.brandName)}
          </BrandLogo>
          <Title className="animate-slideUp">
            {brandData?.brandName || brandId} Models
          </Title>
          <Subtitle className="animate-slideUp">
            Choose your perfect {brandData?.brandName} model and start customizing your dream build
          </Subtitle>
        </Header>

        <ModelsGrid>
          {models.map((model, index) => (
            <ModelCard
              key={model.id}
              onClick={() => handleModelClick(model.id)}
              className="animate-slideUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ModelImage />
              <CardContent>
                <ModelName>{model.name}</ModelName>
                <ModelType>{model.type} • {model.year}</ModelType>
                
                <SpecsSection>
                  <SpecsGrid>
                    <SpecItem>
                      <SpecValue>{model.baseSpecs?.horsePower || 0}</SpecValue>
                      <SpecLabel>Horsepower</SpecLabel>
                    </SpecItem>
                    <SpecItem>
                      <SpecValue>{model.baseSpecs?.drivetrain || 'N/A'}</SpecValue>
                      <SpecLabel>Drivetrain</SpecLabel>
                    </SpecItem>
                    <SpecItem>
                      <SpecValue>{model.baseSpecs?.engine?.split(' ')[0] || 'N/A'}</SpecValue>
                      <SpecLabel>Engine</SpecLabel>
                    </SpecItem>
                    <SpecItem>
                      <SpecValue>{model.baseSpecs?.transmission?.split(' ')[0] || 'N/A'}</SpecValue>
                      <SpecLabel>Trans</SpecLabel>
                    </SpecItem>
                  </SpecsGrid>
                </SpecsSection>

                <CustomizeButton>
                  🔧 Customize This Car
                </CustomizeButton>
              </CardContent>
            </ModelCard>
          ))}
        </ModelsGrid>
      </Content>
    </ModelContainer>
  );
};

export default ModelSelection;