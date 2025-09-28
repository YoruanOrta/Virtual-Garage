// frontend/src/components/UI/ColorPicker.jsx
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const ColorPickerContainer = styled.div`
  position: relative;
  width: 100%;
`;

const ColorDisplay = styled.div`
  width: 100%;
  height: 50px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 2px solid ${({ theme }) => theme.colors.border};
  background: ${({ color }) => color};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $isDark }) => $isDark ? 'white' : 'black'};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: scale(1.02);
  }
`;

const PickerPanel = styled.div`
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: 20px;
  z-index: 1000;
  box-shadow: ${({ theme }) => theme.shadows.xl};
  backdrop-filter: blur(10px);
`;

const PresetColors = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
  margin-bottom: 16px;
`;

const PresetColor = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid ${({ $selected, theme }) => 
    $selected ? theme.colors.primary : theme.colors.border
  };
  background: ${({ color }) => color};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: scale(1.1);
  }
`;

const ColorCanvas = styled.div`
  width: 100%;
  height: 150px;
  background: linear-gradient(to right, white, hsl(${({ hue }) => hue}, 100%, 50%));
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  position: relative;
  cursor: crosshair;
  margin-bottom: 16px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, transparent, black);
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    pointer-events: none;
  }
`;

const ColorIndicator = styled.div`
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 0 4px rgba(0,0,0,0.5);
  transform: translate(-50%, -50%);
  pointer-events: none;
  left: ${({ x }) => x}%;
  top: ${({ y }) => y}%;
`;

const HueSlider = styled.div`
  width: 100%;
  height: 20px;
  background: linear-gradient(to right,
    hsl(0, 100%, 50%) 0%,
    hsl(60, 100%, 50%) 16.66%,
    hsl(120, 100%, 50%) 33.33%,
    hsl(180, 100%, 50%) 50%,
    hsl(240, 100%, 50%) 66.66%,
    hsl(300, 100%, 50%) 83.33%,
    hsl(360, 100%, 50%) 100%
  );
  border-radius: ${({ theme }) => theme.borderRadius.full};
  position: relative;
  cursor: pointer;
`;

const HueIndicator = styled.div`
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 0 4px rgba(0,0,0,0.5);
  transform: translate(-50%, -50%);
  top: 50%;
  left: ${({ position }) => position}%;
  pointer-events: none;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  
  &:hover {
    background: ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const ColorPicker = ({ color, onChange, label = "Select Color" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const [canvasPosition, setCanvasPosition] = useState({ x: 100, y: 50 });
  
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const presetColors = [
    '#ff6b35', '#4dabf7', '#2d2d2d', '#f8f9fa',
    '#51cf66', '#ff8787', '#9775fa', '#adb5bd',
    '#fd7e14', '#20c997', '#6f42c1', '#e83e8c',
    '#ffd43b', '#74c0fc', '#8ce99a', '#ffa8a8'
  ];

  useEffect(() => {
    // Convert current color to HSL when component mounts
    const rgb = hexToRgb(color);
    if (rgb) {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setHue(hsl.h);
      setSaturation(hsl.s);
      setLightness(hsl.l);
      setCanvasPosition({ 
        x: hsl.s, 
        y: 100 - hsl.l
      });
    }
  }, [color]);

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHsl = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  const hslToHex = (h, s, l) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setCanvasPosition({ x, y });
    const newSaturation = x;
    const newLightness = 100 - y;
    setSaturation(newSaturation);
    setLightness(newLightness);
    
    const newColor = hslToHex(hue, newSaturation, newLightness);
    onChange(newColor);
  };

  const handleHueChange = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const newHue = (x / 100) * 360;
    setHue(newHue);
    
    const newColor = hslToHex(newHue, saturation, lightness);
    onChange(newColor);
  };

  const isDarkColor = (color) => {
    const rgb = hexToRgb(color);
    if (!rgb) return false;
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness < 128;
  };

  const handleClickOutside = (e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <ColorPickerContainer ref={containerRef}>
      <ColorDisplay
        color={color}
        $isDark={isDarkColor(color)}
        onClick={() => setIsOpen(!isOpen)}
      >
        Click to choose color
      </ColorDisplay>

      {isOpen && (
        <PickerPanel>
          <CloseButton onClick={() => setIsOpen(false)}>×</CloseButton>
          
          <PresetColors>
            {presetColors.map((presetColor) => (
              <PresetColor
                key={presetColor}
                color={presetColor}
                $selected={color === presetColor}
                onClick={() => onChange(presetColor)}
              />
            ))}
          </PresetColors>

          <ColorCanvas
            ref={canvasRef}
            hue={hue}
            onClick={handleCanvasClick}
          >
            <ColorIndicator x={canvasPosition.x} y={canvasPosition.y} />
          </ColorCanvas>

          <HueSlider onClick={handleHueChange}>
            <HueIndicator position={(hue / 360) * 100} />
          </HueSlider>
        </PickerPanel>
      )}
    </ColorPickerContainer>
  );
};

export default ColorPicker;