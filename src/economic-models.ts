import { SolowParams, SolowState, MonetaryParams, MonetaryState, FiscalParams, FiscalState } from './types.js';

export class SolowGrowthModel {
    public params: SolowParams;
    public state: SolowState;
    private previousGDPPerCapita?: number;

    constructor(initialParams: Partial<SolowParams> = {}) {
        this.params = {
            alpha: 0.3,
            delta: 0.05,
            n: 0.02,
            g: 0.01,
            s: 0.2,
            A0: 1.0,
            K0: 100,
            L0: 1000,
            ...initialParams
        };
        
        this.state = {
            year: 0,
            technology: this.params.A0,
            capital: this.params.K0,
            labor: this.params.L0,
            output: 0,
            consumption: 0,
            investment: 0,
            gdpPerCapita: 0,
            capitalPerWorker: 0,
            outputPerWorker: 0
        };
        
        this.updateDerivedVariables();
    }
    
    private updateDerivedVariables(): void {
        const { technology, capital, labor } = this.state;
        const { alpha } = this.params;
        
        this.state.output = technology * Math.pow(capital, alpha) * Math.pow(labor, 1 - alpha);
        this.state.gdpPerCapita = this.state.output / labor;
        this.state.capitalPerWorker = capital / labor;
        this.state.outputPerWorker = this.state.output / labor;
        this.state.consumption = (1 - this.params.s) * this.state.output;
        this.state.investment = this.params.s * this.state.output;
    }
    
    public step(): void {
        const { capital, labor, technology } = this.state;
        const { alpha, delta, n, g, s } = this.params;
        
        const newTechnology = technology * (1 + g);
        const newLabor = labor * (1 + n);
        
        const output = technology * Math.pow(capital, alpha) * Math.pow(labor, 1 - alpha);
        const investment = s * output;
        const depreciation = delta * capital;
        const newCapital = capital + investment - depreciation;
        
        this.state.year += 1;
        this.state.technology = newTechnology;
        this.state.labor = newLabor;
        this.state.capital = Math.max(newCapital, 0);
        
        this.updateDerivedVariables();
    }
    
    public setSavingsRate(rate: number): void {
        this.params.s = rate / 100;
    }
    
    public applyShock(type: string, magnitude: number): void {
        switch(type) {
            case 'technology':
                this.state.technology *= (1 + magnitude);
                break;
            case 'productivity':
                this.params.g += magnitude;
                break;
            case 'population':
                this.state.labor *= (1 + magnitude);
                break;
            case 'depreciation':
                this.params.delta += magnitude;
                break;
            case 'capital_destruction':
                this.state.capital *= (1 - Math.abs(magnitude));
                break;
        }
        this.updateDerivedVariables();
    }
    
    public getGrowthRate(): number {
        if (this.state.year < 2) return 0;
        const currentGDP = this.state.gdpPerCapita;
        const previousGDP = this.previousGDPPerCapita || currentGDP;
        this.previousGDPPerCapita = currentGDP;
        return ((currentGDP - previousGDP) / previousGDP) * 100;
    }
}

export class MonetaryModel {
    public params: MonetaryParams;
    public state: MonetaryState;

    constructor(initialParams: Partial<MonetaryParams> = {}) {
        this.params = {
            interestRate: 0.03,
            inflationTarget: 0.02,
            moneySupplyGrowth: 0.03,
            ...initialParams
        };
        
        this.state = {
            inflation: 0.02,
            unemployment: 0.05,
            moneySupply: 1000,
            priceLevel: 1.0
        };
    }
    
    public step(gdpGrowth: number): void {
        const { moneySupplyGrowth } = this.params;
        
        this.state.moneySupply *= (1 + moneySupplyGrowth);
        
        const expectedInflation = this.state.inflation;
        const outputGap = gdpGrowth - 0.02;
        
        this.state.inflation = expectedInflation + 0.5 * outputGap + (Math.random() - 0.5) * 0.01;
        this.state.inflation = Math.max(this.state.inflation, -0.05);
        
        this.state.unemployment = Math.max(0.02, 
            this.state.unemployment - 0.5 * outputGap + (Math.random() - 0.5) * 0.005);
        
        this.state.priceLevel *= (1 + this.state.inflation);
        
        if (this.state.inflation > this.params.inflationTarget + 0.01) {
            this.params.interestRate = Math.min(0.15, this.params.interestRate + 0.0025);
        } else if (this.state.inflation < this.params.inflationTarget - 0.01) {
            this.params.interestRate = Math.max(0, this.params.interestRate - 0.0025);
        }
    }
    
    public setInterestRate(rate: number): void {
        this.params.interestRate = rate / 100;
    }
    
    public applyMonetaryShock(type: string, magnitude: number): void {
        switch(type) {
            case 'inflation_shock':
                this.state.inflation += magnitude;
                break;
            case 'unemployment_shock':
                this.state.unemployment += magnitude;
                break;
            case 'money_supply_shock':
                this.state.moneySupply *= (1 + magnitude);
                break;
        }
    }
}

export class FiscalModel {
    public params: FiscalParams;
    public state: FiscalState;

    constructor(initialParams: Partial<FiscalParams> = {}) {
        this.params = {
            taxRate: 0.25,
            governmentSpending: 0.15,
            debtToGDP: 0.6,
            ...initialParams
        };
        
        this.state = {
            governmentDebt: 0,
            deficit: 0,
            taxRevenue: 0,
            governmentExpenditure: 0
        };
    }
    
    public step(gdp: number): void {
        const { taxRate, governmentSpending } = this.params;
        
        this.state.taxRevenue = taxRate * gdp;
        this.state.governmentExpenditure = governmentSpending * gdp;
        this.state.deficit = this.state.governmentExpenditure - this.state.taxRevenue;
        
        this.state.governmentDebt += this.state.deficit;
        this.params.debtToGDP = this.state.governmentDebt / gdp;
        
        if (this.params.debtToGDP > 1.0) {
            this.params.taxRate = Math.min(0.6, this.params.taxRate + 0.01);
        }
    }
    
    public setTaxRate(rate: number): void {
        this.params.taxRate = rate / 100;
    }
    
    public setGovernmentSpending(rate: number): void {
        this.params.governmentSpending = rate / 100;
    }
    
    public getFiscalMultiplier(gdpGrowth: number): number {
        return Math.max(0.5, Math.min(1.5, 1.0 + (0.05 - gdpGrowth) * 2));
    }
}