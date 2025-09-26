import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  // Import Google Fonts
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    font-family: ${({ theme }) => theme.typography.body};
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    overflow-x: hidden;
    scroll-behavior: smooth;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  main {
    flex: 1;
    width: 100%;
  }

  // Scrollbar styling
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.surface};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #ff8533;
  }

  // Selection styling
  ::selection {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }

  // Focus outline
  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }

  // Button reset
  button {
    background: none;
    border: none;
    cursor: pointer;
    font-family: inherit;
  }

  // Link reset
  a {
    text-decoration: none;
    color: inherit;
  }

  // Input reset
  input, textarea, select {
    font-family: inherit;
    background: none;
    border: none;
    outline: none;
  }

  // Image optimization
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  // Utility classes
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${({ theme }) => theme.spacing.md};
  }

  .text-center {
    text-align: center;
  }

  .flex {
    display: flex;
  }

  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .grid {
    display: grid;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  // Animation keyframes
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes glow {
    0% { box-shadow: 0 0 5px ${({ theme }) => theme.colors.primary}; }
    50% { box-shadow: 0 0 20px ${({ theme }) => theme.colors.primary}; }
    100% { box-shadow: 0 0 5px ${({ theme }) => theme.colors.primary}; }
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  // Animation classes
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-in-out;
  }

  .animate-slideUp {
    animation: slideUp 0.6s ease-out;
  }

  .animate-glow {
    animation: glow 2s infinite;
  }

  .animate-pulse {
    animation: pulse 2s infinite;
  }

  // Responsive header spacing
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    main {
      padding-top: 90px; /* Un poco más en móvil */
    }
  }
`;

export default GlobalStyles;