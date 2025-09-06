import { useState, useEffect, useRef, useCallback } from 'react';
import { SolowGrowthModel, MonetaryModel, FiscalModel } from '../economic-models';
import { RandomEventSystem } from '../events';
import type { EconomyData, SolowParams, ActiveEvent } from '../types';

export interface SimulationState {
  solow: SolowGrowthModel;
  monetary: MonetaryModel;
  fiscal: FiscalModel;
  eventSystem: RandomEventSystem;
  isRunning: boolean;
  economyHistory: EconomyData[];
  currentEvent: ActiveEvent | null;
}

export function useEconomicSimulation() {
  const [isRunning, setIsRunning] = useState(false);
  const [economyHistory, setEconomyHistory] = useState<EconomyData[]>([]);
  const [currentEvent, setCurrentEvent] = useState<ActiveEvent | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isEquilibrating, setIsEquilibrating] = useState(false);
  const [equilibrationProgress, setEquilibrationProgress] = useState(0);
  
  const modelsRef = useRef<{
    solow: SolowGrowthModel;
    monetary: MonetaryModel;
    fiscal: FiscalModel;
    eventSystem: RandomEventSystem;
  } | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const initializeModels = useCallback((params?: Partial<SolowParams>) => {
    const solow = new SolowGrowthModel(params);
    const monetary = new MonetaryModel();
    const fiscal = new FiscalModel();
    const eventSystem = new RandomEventSystem();

    modelsRef.current = { solow, monetary, fiscal, eventSystem };
    setEconomyHistory([]);
    setCurrentEvent(null);
  }, []);

  const equilibrateEconomy = useCallback(async (): Promise<void> => {
    if (!modelsRef.current) return;

    setIsEquilibrating(true);
    const maxIterations = 200;
    let iteration = 0;

    return new Promise((resolve) => {
      const equilibrationInterval = setInterval(() => {
        if (!modelsRef.current) return;

        const stepsPerUpdate = 5;
        for (let i = 0; i < stepsPerUpdate && iteration < maxIterations; i++) {
          const prevCapital = modelsRef.current.solow.state.capitalPerWorker;
          const prevGDP = modelsRef.current.solow.state.gdpPerCapita;
          
          const originalYear = modelsRef.current.solow.state.year;
          modelsRef.current.solow.step();
          modelsRef.current.solow.state.year = originalYear; // Keep year at 0
          
          const capitalChange = Math.abs((modelsRef.current.solow.state.capitalPerWorker - prevCapital) / prevCapital);
          const gdpChange = Math.abs((modelsRef.current.solow.state.gdpPerCapita - prevGDP) / prevGDP);
          
          iteration++;
          
          if (capitalChange < 0.001 && gdpChange < 0.001) {
            iteration = maxIterations; // Force completion
            break;
          }
        }

        const progress = (iteration / maxIterations) * 100;
        setEquilibrationProgress(progress);

        if (iteration >= maxIterations) {
          clearInterval(equilibrationInterval);
          modelsRef.current.solow.currentGrowthRate = 0;
          setIsEquilibrating(false);
          setIsConfigured(true);
          resolve();
        }
      }, 50);
    });
  }, []);


  const startSimulation = useCallback(() => {
    if (!isConfigured || !modelsRef.current) return;
    
    setIsRunning(true);
    setCurrentEvent(null);
    
    intervalRef.current = setInterval(() => {
      if (!modelsRef.current) return;

      const { solow, monetary, fiscal, eventSystem } = modelsRef.current;
      
      // Check for new events
      const newEvent = eventSystem.checkForEvents(solow.state.year);
      
      // Apply event effects
      eventSystem.applyEventEffects({ solow, monetary, fiscal });
      
      // Run simulation step
      solow.step();
      const growthRate = solow.getGrowthRate();
      monetary.step(growthRate / 100);
      fiscal.step(solow.state.output);
      
      // Update active events
      eventSystem.updateActiveEvents();
      
      // Record data
      const data: EconomyData = {
        year: solow.state.year,
        gdpPerCapita: solow.state.gdpPerCapita,
        capital: solow.state.capital,
        population: solow.state.labor,
        growthRate: growthRate,
        inflation: monetary.state.inflation * 100,
        unemployment: monetary.state.unemployment * 100
      };
      
      setEconomyHistory(prev => {
        const newHistory = [...prev, data];
        return newHistory.length > 100 ? newHistory.slice(-100) : newHistory;
      });
      
      if (newEvent) {
        setCurrentEvent(newEvent);
        setIsRunning(false); // Pause simulation for event
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, 500);
  }, [isConfigured]);

  const pauseSimulation = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetSimulation = useCallback(() => {
    pauseSimulation();
    setIsConfigured(false);
    setEconomyHistory([]);
    setCurrentEvent(null);
    modelsRef.current = null;
  }, [pauseSimulation]);

  const updateSavingsRate = useCallback((rate: number) => {
    modelsRef.current?.solow.setSavingsRate(rate);
  }, []);

  const updateInterestRate = useCallback((rate: number) => {
    modelsRef.current?.monetary.setInterestRate(rate);
  }, []);

  const updateGovernmentSpending = useCallback((rate: number) => {
    modelsRef.current?.fiscal.setGovernmentSpending(rate);
  }, []);

  const updateTaxRate = useCallback((rate: number) => {
    modelsRef.current?.fiscal.setTaxRate(rate);
  }, []);

  const getCurrentState = useCallback(() => {
    if (!modelsRef.current) return null;
    
    const { solow, monetary } = modelsRef.current;
    return {
      year: solow.state.year,
      gdpPerCapita: solow.state.gdpPerCapita,
      capitalStock: solow.state.capital,
      population: solow.state.labor,
      growthRate: solow.getGrowthRate(),
      inflation: monetary.state.inflation * 100,
      unemployment: monetary.state.unemployment * 100,
      eventMessage: modelsRef.current.eventSystem.getEventMessage()
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    // State
    isRunning,
    economyHistory,
    currentEvent,
    isConfigured,
    isEquilibrating,
    equilibrationProgress,
    
    // Actions
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
    
    // Event handling
    clearCurrentEvent: () => setCurrentEvent(null),
    
    // Models access (for advanced usage)
    getModels: () => modelsRef.current
  };
}