// frontend/src/components/HPChart.jsx
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const ChartContainer = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: clamp(16px, 3vh, 24px);
  border: 2px solid ${({ theme }) => theme.colors.border};
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ChartTitle = styled.h3`
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: clamp(12px, 2vh, 16px);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ChartWrapper = styled.div`
  flex: 1;
  position: relative;
  min-height: 250px;
  max-height: 350px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(8px, 2vw, 12px);
  margin-top: clamp(12px, 2vh, 16px);
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: clamp(8px, 1.5vh, 12px);
  text-align: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const StatLabel = styled.div`
  font-size: clamp(0.7rem, 1.5vw, 0.75rem);
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatValue = styled.div`
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ $color }) => $color || '#FF6B35'};
`;

const HPChart = ({ baseHP, modifications, selectedMods }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const hpData = calculateHPBreakdown();

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: hpData.labels,
        datasets: [{
          label: 'HP Contribution',
          data: hpData.values,
          backgroundColor: hpData.colors,
          borderColor: hpData.borderColors,
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#FF6B35',
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {
              title: function(context) {
                return context[0].label;
              },
              label: function(context) {
                if (context.dataIndex === 0) {
                  return `Base HP: ${context.parsed.y} HP`;
                }
                return `+${context.parsed.y} HP`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false,
              drawBorder: false
            },
            ticks: {
              color: '#9ca3af',
              font: {
                size: 10,
                weight: '500'
              },
              maxRotation: 0,
              minRotation: 0,
              autoSkip: false
            }
          },
          y: {
            beginAtZero: true,
            max: Math.max(baseHP * 1.5, baseHP + 100),
            grid: {
              color: 'rgba(255, 255, 255, 0.05)',
              drawBorder: false
            },
            ticks: {
              color: '#9ca3af',
              font: {
                size: 11
              },
              stepSize: 50,
              callback: function(value) {
                return value + ' HP';
              }
            }
          }
        },
        animation: {
          duration: 600,
          easing: 'easeInOutQuart'
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [baseHP, selectedMods]);

  const calculateHPBreakdown = () => {
    const labels = ['Base'];
    const values = [baseHP];
    const colors = ['rgba(59, 130, 246, 0.7)'];
    const borderColors = ['rgba(59, 130, 246, 1)'];

    // Add each selected modification as individual bars
    selectedMods.forEach(modId => {
      Object.values(modifications).forEach(category => {
        const mod = category.find(m => m.id === modId);
        if (mod && mod.hp > 0) {
          // Shorten long names
          let displayName = mod.name;
          if (displayName.length > 12) {
            displayName = displayName.substring(0, 10) + '...';
          }
          
          labels.push(displayName);
          values.push(mod.hp); // Just the gain, not cumulative
          colors.push('rgba(255, 107, 53, 0.7)');
          borderColors.push('rgba(255, 107, 53, 1)');
        }
      });
    });

    return { labels, values, colors, borderColors };
  };

  const calculateStats = () => {
    let totalHP = baseHP;
    let totalGain = 0;

    selectedMods.forEach(modId => {
      Object.values(modifications).forEach(category => {
        const mod = category.find(m => m.id === modId);
        if (mod) {
          totalGain += mod.hp;
          totalHP += mod.hp;
        }
      });
    });

    const percentGain = baseHP > 0 ? ((totalGain / baseHP) * 100).toFixed(1) : 0;

    return { totalHP, totalGain, percentGain };
  };

  const stats = calculateStats();

  return (
    <ChartContainer>
      <ChartTitle>
        📊 Power Output Analysis
      </ChartTitle>
      
      <ChartWrapper>
        <canvas ref={chartRef}></canvas>
      </ChartWrapper>

      <StatsGrid>
        <StatCard>
          <StatLabel>Base HP</StatLabel>
          <StatValue $color="#3b82f6">{baseHP}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>+ Gain</StatLabel>
          <StatValue $color="#FF6B35">{stats.totalGain > 0 ? `+${stats.totalGain}` : '0'}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Total HP</StatLabel>
          <StatValue $color="#22c55e">{stats.totalHP}</StatValue>
        </StatCard>
      </StatsGrid>
    </ChartContainer>
  );
};

export default HPChart;