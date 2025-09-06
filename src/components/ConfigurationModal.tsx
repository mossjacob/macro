import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SolowParams, TechnologyPlacement } from '../lib/types';
import { EquationsAccordion } from './EquationsAccordion';

interface ConfigurationModalProps {
  onStart: (params: Partial<SolowParams>) => void;
  onUseDefaults: () => void;
}

export function ConfigurationModal({ onStart, onUseDefaults }: ConfigurationModalProps) {
  const [params, setParams] = useState<Partial<SolowParams>>({
    alpha: 0.30,
    delta: 0.05,
    n: 0.02,
    g: 0.01,
    A0: 1.0,
    K0: 100,
    L0: 1000,
    technologyPlacement: 'neutral' as TechnologyPlacement
  });

  const handleParamChange = (key: keyof SolowParams, value: number | TechnologyPlacement) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const resetToDefaults = () => {
    setParams({
      alpha: 0.30,
      delta: 0.05,
      n: 0.02,
      g: 0.01,
      A0: 1.0,
      K0: 100,
      L0: 1000,
      technologyPlacement: 'neutral'
    });
  };

  return (
    <Dialog open={true}>
      <DialogContent className="!max-w-[95vw] !w-[95vw] max-h-[90vh] overflow-y-auto p-4 sm:p-6 lg:p-8" style={{maxWidth: '95vw', width: '95vw'}}>
        <div className="w-full max-w-full">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-3xl text-center mb-4">Configure Economic Model</DialogTitle>
            <p className="text-center text-muted-foreground text-lg">
              Set initial parameters for the Solow Growth Model. These cannot be changed once simulation starts.
            </p>
          </DialogHeader>
          
          {/* Model Equations Section */}
          <EquationsAccordion className="mb-8" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mt-8 w-full">
          {/* Production Function */}
          <Card className="h-full min-w-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-blue-600 text-xl">Production Function</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 overflow-hidden">
              <div>
                <Label className="flex justify-between">
                  Capital Share (α): <span className="font-bold">{params.alpha?.toFixed(2)}</span>
                </Label>
                <Slider
                  value={[params.alpha || 0.3]}
                  onValueChange={([value]) => handleParamChange('alpha', value)}
                  min={0.1}
                  max={0.9}
                  step={0.05}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Share of output attributed to capital vs labor
                </p>
              </div>
              
              <div>
                <Label>Technology Placement:</Label>
                <Select 
                  value={params.technologyPlacement || 'neutral'} 
                  onValueChange={(value) => handleParamChange('technologyPlacement', value as TechnologyPlacement)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="labor_augmenting">Labor-Augmenting</SelectItem>
                    <SelectItem value="capital_augmenting">Capital-Augmenting</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  How technology affects production
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Economic Dynamics */}
          <Card className="h-full min-w-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-blue-600 text-xl">Economic Dynamics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 overflow-hidden">
              <div>
                <Label className="flex justify-between">
                  Depreciation Rate (δ): <span className="font-bold">{((params.delta || 0.05) * 100).toFixed(1)}%</span>
                </Label>
                <Slider
                  value={[params.delta || 0.05]}
                  onValueChange={([value]) => handleParamChange('delta', value)}
                  min={0.01}
                  max={0.15}
                  step={0.005}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Annual rate at which capital deteriorates
                </p>
              </div>
              
              <div>
                <Label className="flex justify-between">
                  Population Growth (n): <span className="font-bold">{((params.n || 0.02) * 100).toFixed(1)}%</span>
                </Label>
                <Slider
                  value={[params.n || 0.02]}
                  onValueChange={([value]) => handleParamChange('n', value)}
                  min={0}
                  max={0.06}
                  step={0.002}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Annual population/labor force growth rate
                </p>
              </div>
              
              <div>
                <Label className="flex justify-between">
                  Technology Growth (g): <span className="font-bold">{((params.g || 0.01) * 100).toFixed(1)}%</span>
                </Label>
                <Slider
                  value={[params.g || 0.01]}
                  onValueChange={([value]) => handleParamChange('g', value)}
                  min={0}
                  max={0.05}
                  step={0.002}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Annual technological progress rate
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Initial Conditions */}
          <Card className="h-full min-w-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-blue-600 text-xl">Initial Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 overflow-hidden">
              <div>
                <Label className="flex justify-between">
                  Initial Technology (A₀): <span className="font-bold">{params.A0?.toFixed(2)}</span>
                </Label>
                <Slider
                  value={[params.A0 || 1.0]}
                  onValueChange={([value]) => handleParamChange('A0', value)}
                  min={0.5}
                  max={2.0}
                  step={0.05}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Starting level of technology/productivity
                </p>
              </div>
              
              <div>
                <Label className="flex justify-between">
                  Initial Capital (K₀): <span className="font-bold">{params.K0}</span>
                </Label>
                <Slider
                  value={[params.K0 || 100]}
                  onValueChange={([value]) => handleParamChange('K0', value)}
                  min={50}
                  max={500}
                  step={10}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Starting capital stock
                </p>
              </div>
              
              <div>
                <Label className="flex justify-between">
                  Initial Population (L₀): <span className="font-bold">{params.L0}</span>
                </Label>
                <Slider
                  value={[params.L0 || 1000]}
                  onValueChange={([value]) => handleParamChange('L0', value)}
                  min={500}
                  max={2000}
                  step={50}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Starting population/labor force
                </p>
              </div>
            </CardContent>
          </Card>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10 w-full">
            <Button variant="outline" onClick={resetToDefaults} className="py-3 px-6 text-base">
              Reset to Defaults
            </Button>
            <Button onClick={onUseDefaults} className="py-3 px-6 text-base">
              Use Defaults
            </Button>
            <Button onClick={() => onStart(params)} className="bg-blue-600 hover:bg-blue-700 py-3 px-6 text-base font-semibold">
              Start Simulation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}