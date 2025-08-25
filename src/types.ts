export interface SolowParams {
    alpha: number;
    delta: number;
    n: number;
    g: number;
    s: number;
    A0: number;
    K0: number;
    L0: number;
}

export interface SolowState {
    year: number;
    technology: number;
    capital: number;
    labor: number;
    output: number;
    consumption: number;
    investment: number;
    gdpPerCapita: number;
    capitalPerWorker: number;
    outputPerWorker: number;
}

export interface MonetaryParams {
    interestRate: number;
    inflationTarget: number;
    moneySupplyGrowth: number;
}

export interface MonetaryState {
    inflation: number;
    unemployment: number;
    moneySupply: number;
    priceLevel: number;
}

export interface FiscalParams {
    taxRate: number;
    governmentSpending: number;
    debtToGDP: number;
}

export interface FiscalState {
    governmentDebt: number;
    deficit: number;
    taxRevenue: number;
    governmentExpenditure: number;
}

export interface EventEffects {
    technology?: number;
    productivity?: number;
    population?: number;
    depreciation?: number;
    capital_destruction?: number;
    inflation_shock?: number;
    unemployment_shock?: number;
    money_supply_shock?: number;
}

export interface RandomEvent {
    name: string;
    description: string;
    probability: number;
    effects: EventEffects;
    type: 'positive' | 'negative' | 'mixed';
    duration: number;
}

export interface ActiveEvent extends RandomEvent {
    startYear: number;
    remainingDuration: number;
    id: number;
}

export interface HistoricalEvent {
    name: string;
    year: number;
    description: string;
}

export interface EconomyData {
    year: number;
    gdpPerCapita: number;
    capital: number;
    population: number;
    growthRate: number;
    inflation: number;
    unemployment: number;
}