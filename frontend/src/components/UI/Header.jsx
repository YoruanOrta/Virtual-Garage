import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${({ theme }) => theme.zIndex.header};
  
  background: ${({ $isScrolled, theme }) => 
    $isScrolled 
      ? theme.colors.surface + '60'
      : theme.colors.surface + '30'
  };
  
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary + '20'};
  
  padding: ${({ theme }) => theme.spacing.md} 0;
  transition: all ${({ theme }) => theme.transitions.medium};
  height: 80px;
  display: flex;
  align-items: center;
  
  box-shadow: ${({ $isScrolled, theme }) => 
    $isScrolled 
      ? `0 2px 20px ${theme.colors.background}40`
      : 'none'
  };
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.xl};
`;

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  text-decoration: none;
  transition: transform ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: scale(1.05);
  }
`;

const LogoIcon = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
`;

const LogoText = styled.span`
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  background: ${({ theme }) => theme.colors.gradient.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 10px rgba(255, 107, 0, 0.3);
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.sizes.md};
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: ${({ $isOpen }) => $isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: ${({ theme }) => theme.colors.surface}F0;
    backdrop-filter: blur(15px);
    flex-direction: column;
    padding: ${({ theme }) => theme.spacing.lg};
    border-bottom: 1px solid ${({ theme }) => theme.colors.card};
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const NavLink = styled(Link)`
  color: ${({ theme, $isActive }) => 
    $isActive ? theme.colors.primary : theme.colors.text + 'E6'}; /* Más visible */
  text-decoration: none;
  font-weight: ${({ theme, $isActive }) => 
    $isActive ? theme.typography.weights.bold : theme.typography.weights.medium};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  position: relative;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  
  /* Efecto de hover más sutil */
  background: ${({ $isActive, theme }) => 
    $isActive ? theme.colors.primary + '20' : 'transparent'};

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    width: 0;
    height: 2px;
    background: ${({ theme }) => theme.colors.primary};
    transition: all ${({ theme }) => theme.transitions.fast};
    transform: translateX(-50%);
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primary + '15'};
    
    &::after {
      width: 80%;
    }
  }
  
  &.active {
    color: ${({ theme }) => theme.colors.primary};
    
    &::after {
      width: 80%;
    }
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  flex-direction: column;
  gap: 4px;
  padding: ${({ theme }) => theme.spacing.sm};
  background: none;
  border: none;
  cursor: pointer;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
  }
`;

const MenuLine = styled.span`
  width: 24px;
  height: 2px;
  background: ${({ theme }) => theme.colors.text};
  transition: all ${({ theme }) => theme.transitions.fast};
  transform-origin: center;

  &:nth-child(1) {
    transform: ${({ $isOpen }) => $isOpen ? 'rotate(45deg) translate(6px, 6px)' : 'none'};
  }

  &:nth-child(2) {
    opacity: ${({ $isOpen }) => $isOpen ? 0 : 1};
  }

  &:nth-child(3) {
    transform: ${({ $isOpen }) => $isOpen ? 'rotate(-45deg) translate(6px, -6px)' : 'none'};
  }
`;

const UserActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const GarageButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.gradient.secondary};
  color: white;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  transition: all ${({ theme }) => theme.transitions.fast};
  box-shadow: 0 2px 8px ${({ theme }) => theme.colors.accent + '30'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px ${({ theme }) => theme.colors.accent + '40'};
  }

  &:active {
    transform: translateY(0);
  }
`;

const SavedBuildsCount = styled.span`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Detectar scroll para cambiar transparencia
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get saved builds count from localStorage
  const getSavedBuildsCount = () => {
    try {
      const savedBuilds = JSON.parse(localStorage.getItem('virtualGarageBuilds') || '[]');
      return savedBuilds.length;
    } catch {
      return 0;
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <HeaderContainer $isScrolled={isScrolled}>
      <Nav>
        <LogoContainer to="/" onClick={closeMenu}>
          <LogoIcon>🚗</LogoIcon>
          <LogoText>VIRTUAL GARAGE</LogoText>
        </LogoContainer>

        <NavLinks $isOpen={isMenuOpen}>
          <NavLink 
            to="/" 
            onClick={closeMenu}
            $isActive={location.pathname === '/'}
          >
            Home
          </NavLink>
          <NavLink 
            to="/brands" 
            onClick={closeMenu}
            $isActive={isActive('/brands') || isActive('/customize')}
          >
            Build Car
          </NavLink>
          <NavLink 
            to="/garage" 
            onClick={closeMenu}
            $isActive={isActive('/garage')}
          >
            My Garage
          </NavLink>
        </NavLinks>

        <UserActions>
          <GarageButton to="/garage" onClick={closeMenu}>
            <span>🏠</span>
            <span>Garage</span>
            {getSavedBuildsCount() > 0 && (
              <SavedBuildsCount>{getSavedBuildsCount()}</SavedBuildsCount>
            )}
          </GarageButton>

          <MobileMenuButton onClick={toggleMenu} aria-label="Toggle menu">
            <MenuLine $isOpen={isMenuOpen} />
            <MenuLine $isOpen={isMenuOpen} />
            <MenuLine $isOpen={isMenuOpen} />
          </MobileMenuButton>
        </UserActions>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;