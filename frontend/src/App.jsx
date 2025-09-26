import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import { theme } from './styles/theme';

// Pages
import Home from './pages/Home';
import BrandSelection from './pages/BrandSelection';
import ModelSelection from './pages/ModelSelection';
import Customizer from './pages/Customizer';
import Garage from './pages/Garage';

// Components
import Header from './components/UI/Header';
import ErrorBoundary from './components/UI/ErrorBoundary';

// Styled Components
import styled from 'styled-components';

const AppContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <ErrorBoundary>
        <Router>
          <AppContainer>
            <Header />
            <MainContent>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/brands" element={<BrandSelection />} />
                <Route path="/brands/:brandId" element={<ModelSelection />} />
                <Route path="/customize/:brandId/:modelId" element={<Customizer />} />
                <Route path="/garage" element={<Garage />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </MainContent>
          </AppContainer>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;