import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Play, Pause, RotateCcw, TrendingUp, Users, Building, AlertCircle, Briefcase } from 'lucide-react';
import type { EconomyData } from '../lib/types';
import { EconomicCharts } from './EconomicCharts';
import { EquationsAccordion } from './EquationsAccordion';

interface EconomicDashboardProps {
  currentState: any;
  economyHistory: EconomyData[];
  isRunning: boolean;
  controlValues: {
    savingsRate: number;
    interestRate: number;
    govSpending: number;
    taxRate: number;
  };
  onToggleSimulation: () => void;
  onReset: () => void;
  onControlChange: (control: string, value: number) => void;
}

export function EconomicDashboard({
  currentState,
  economyHistory,
  isRunning,
  controlValues,
  onToggleSimulation,
  onReset,
  onControlChange
}: EconomicDashboardProps) {
  if (!currentState) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(Math.round(value));
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  MacroEconomic Simulator
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  <strong>How to Play:</strong> Click Start to begin the economic simulation. 
                  Random events will pause the game - adjust policy controls to respond - and then click "Resume".
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Year</p>
                  <p className="text-2xl font-bold text-blue-600">{currentState.year}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={onToggleSimulation}
                    variant={isRunning ? "secondary" : "default"}
                    className="flex items-center gap-2"
                  >
                    {isRunning ? (
                      <>
                        <Pause className="h-4 w-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        {currentState.year === 0 ? 'Start' : 'Resume'}
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={onReset} className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Economic Indicators */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Economic Indicators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="text-sm text-muted-foreground mb-1">GDP per Capita</div>
                  <div className="text-lg font-bold text-blue-600">
                    {formatCurrency(currentState.gdpPerCapita)}
                  </div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <div className="text-sm text-muted-foreground mb-1">Capital Stock</div>
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(currentState.capitalStock)}
                  </div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <div className="text-sm text-muted-foreground mb-1 flex items-center justify-center gap-1">
                    <Users className="h-3 w-3" />
                    Population
                  </div>
                  <div className="text-lg font-bold text-purple-600">
                    {formatNumber(currentState.population)}
                  </div>
                </div>
                
                <div className="text-center p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-500">
                  <div className="text-sm text-muted-foreground mb-1">Growth Rate</div>
                  <div className="text-lg font-bold text-emerald-600">
                    {currentState.growthRate.toFixed(2)}%
                  </div>
                </div>
                
                <div className="text-center p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                  <div className="text-sm text-muted-foreground mb-1">Inflation</div>
                  <div className="text-lg font-bold text-red-600">
                    {currentState.inflation.toFixed(2)}%
                  </div>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                  <div className="text-sm text-muted-foreground mb-1 flex items-center justify-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    Unemployment
                  </div>
                  <div className="text-lg font-bold text-orange-600">
                    {currentState.unemployment.toFixed(2)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Policy Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Policy Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="flex justify-between">
                  Savings Rate: <span className="font-bold">{controlValues.savingsRate}%</span>
                </Label>
                <Slider
                  value={[controlValues.savingsRate]}
                  onValueChange={([value]) => onControlChange('savingsRate', value)}
                  min={0}
                  max={50}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="flex justify-between">
                  Interest Rate: <span className="font-bold">{controlValues.interestRate}%</span>
                </Label>
                <Slider
                  value={[controlValues.interestRate]}
                  onValueChange={([value]) => onControlChange('interestRate', value)}
                  min={0}
                  max={15}
                  step={0.5}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="flex justify-between">
                  Gov Spending: <span className="font-bold">{controlValues.govSpending}%</span>
                </Label>
                <Slider
                  value={[controlValues.govSpending]}
                  onValueChange={([value]) => onControlChange('govSpending', value)}
                  min={0}
                  max={40}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="flex justify-between">
                  Tax Rate: <span className="font-bold">{controlValues.taxRate}%</span>
                </Label>
                <Slider
                  value={[controlValues.taxRate]}
                  onValueChange={([value]) => onControlChange('taxRate', value)}
                  min={0}
                  max={60}
                  step={1}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Current Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                {currentState.eventMessage || 'Economy is stable...'}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Charts */}
        <EconomicCharts economyHistory={economyHistory} />

        {/* Model Equations Reference */}
        <Card>
          <CardContent className="p-0">
            <div className="px-6 py-4">
              <EquationsAccordion 
                title="📊 Model Equations & Theory Reference" 
                className="border-none"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}