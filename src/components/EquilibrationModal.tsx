import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface EquilibrationModalProps {
  progress: number;
  currentState: any;
}

export function EquilibrationModal({ progress, currentState }: EquilibrationModalProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <Dialog open={true}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center flex items-center justify-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            Equilibrating Economy
          </DialogTitle>
          <p className="text-center text-muted-foreground">
            Finding steady-state equilibrium for your configured parameters...
          </p>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          <div className="space-y-4">
            <Progress value={progress} className="w-full" />
            <p className="text-center text-sm text-muted-foreground">
              {progress < 100 ? `Equilibrating... ${progress.toFixed(1)}% complete` : 'Equilibration complete!'}
            </p>
          </div>
          
          {currentState && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Capital per Worker</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {currentState.capitalStock && currentState.population 
                        ? formatCurrency(currentState.capitalStock / currentState.population)
                        : '-'}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">GDP per Capita</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(currentState.gdpPerCapita || 0)}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Population</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.round(currentState.population || 0).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}