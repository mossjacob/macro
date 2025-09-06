import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp } from 'lucide-react';
import type { EconomyData } from '../lib/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface EconomicChartsProps {
  economyHistory: EconomyData[];
}

export function EconomicCharts({ economyHistory }: EconomicChartsProps) {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 6,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    elements: {
      point: {
        radius: 3,
        hoverRadius: 6,
      },
      line: {
        tension: 0.2,
        borderWidth: 2,
      },
    },
  };

  if (economyHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Economic Charts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Start the simulation to see economic data over time
          </div>
        </CardContent>
      </Card>
    );
  }

  const labels = economyHistory.map(data => `Year ${data.year}`);

  const gdpData = {
    labels,
    datasets: [
      {
        label: 'GDP per Capita',
        data: economyHistory.map(data => data.gdpPerCapita),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
      },
    ],
  };

  const indicatorsData = {
    labels,
    datasets: [
      {
        label: 'Inflation (%)',
        data: economyHistory.map(data => data.inflation),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
      },
      {
        label: 'Unemployment (%)',
        data: economyHistory.map(data => data.unemployment),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
      },
      {
        label: 'Growth Rate (%)',
        data: economyHistory.map(data => data.growthRate),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
      },
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Economic Charts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              GDP per Capita Over Time
            </h3>
            <div className="h-64">
              <Line data={gdpData} options={chartOptions} />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Economic Indicators</h3>
            <div className="h-64">
              <Line data={indicatorsData} options={chartOptions} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}