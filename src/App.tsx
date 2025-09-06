import { useState } from 'react';
import { useEconomicSimulation } from './lib/hooks/useEconomicSimulation';
import type { SolowParams } from './lib/types';
import { ConfigurationModal } from './components/ConfigurationModal';
import { EquilibrationModal } from './components/EquilibrationModal';
import { EconomicDashboard } from './components/EconomicDashboard';

function App() {
  const {
    isRunning,
    economyHistory,
    isConfigured,
    isEquilibrating,
    equilibrationProgress,
    initializeModels,
    equilibrateEconomy,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    updateSavingsRate,
    updateInterestRate,
    updateGovernmentSpending,
    updateTaxRate,
    getCurrentState,
  } = useEconomicSimulation();

  const [showConfigModal, setShowConfigModal] = useState(true);
  const [controlValues, setControlValues] = useState({
    savingsRate: 20,
    interestRate: 3,
    govSpending: 15,
    taxRate: 25
  });

  const handleConfigurationStart = async (params: Partial<SolowParams>) => {
    setShowConfigModal(false);
    initializeModels(params);
    await equilibrateEconomy();
  };

  const handleReset = () => {
    resetSimulation();
    setShowConfigModal(true);
    setControlValues({
      savingsRate: 20,
      interestRate: 3,
      govSpending: 15,
      taxRate: 25
    });
  };

  const handleControlChange = (control: string, value: number) => {
    setControlValues(prev => ({ ...prev, [control]: value }));
    
    switch (control) {
      case 'savingsRate':
        updateSavingsRate(value);
        break;
      case 'interestRate':
        updateInterestRate(value);
        break;
      case 'govSpending':
        updateGovernmentSpending(value);
        break;
      case 'taxRate':
        updateTaxRate(value);
        break;
    }
  };

  const currentState = getCurrentState();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-700">
      {/* Configuration Modal */}
      {showConfigModal && (
        <ConfigurationModal
          onStart={handleConfigurationStart}
          onUseDefaults={() => handleConfigurationStart({})}
        />
      )}

      {/* Equilibration Modal */}
      {isEquilibrating && (
        <EquilibrationModal
          progress={equilibrationProgress}
          currentState={getCurrentState()}
        />
      )}


      {/* Main Dashboard */}
      {isConfigured && !isEquilibrating && (
        <EconomicDashboard
          currentState={currentState}
          economyHistory={economyHistory}
          isRunning={isRunning}
          controlValues={controlValues}
          onToggleSimulation={isRunning ? pauseSimulation : startSimulation}
          onReset={handleReset}
          onControlChange={handleControlChange}
        />
      )}
    </div>
  );
}

export default App;
