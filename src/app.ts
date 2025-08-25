import { SolowGrowthModel, MonetaryModel, FiscalModel } from './economic-models.js';
import { RandomEventSystem } from './events.js';
import { EconomyData } from './types.js';

class MacroEconSimulator {
    private solow: SolowGrowthModel;
    private monetary: MonetaryModel;
    private fiscal: FiscalModel;
    private eventSystem: RandomEventSystem;
    private isRunning: boolean = false;
    private intervalId: number | null = null;
    private economyHistory: EconomyData[] = [];
    private gdpChart: any;
    private indicatorsChart: any;

    constructor() {
        this.solow = new SolowGrowthModel();
        this.monetary = new MonetaryModel();
        this.fiscal = new FiscalModel();
        this.eventSystem = new RandomEventSystem();
        
        this.initializeUI();
        this.initializeCharts();
        this.updateDisplay();
    }

    private initializeUI(): void {
        const playPauseBtn = document.getElementById('play-pause-btn') as HTMLButtonElement;
        const resetBtn = document.getElementById('reset-btn') as HTMLButtonElement;
        
        playPauseBtn.addEventListener('click', () => this.toggleSimulation());
        resetBtn.addEventListener('click', () => this.resetSimulation());

        const savingsRate = document.getElementById('savings-rate') as HTMLInputElement;
        const interestRate = document.getElementById('interest-rate') as HTMLInputElement;
        const govSpending = document.getElementById('gov-spending') as HTMLInputElement;
        const taxRate = document.getElementById('tax-rate') as HTMLInputElement;

        savingsRate.addEventListener('input', (e) => {
            const value = parseInt((e.target as HTMLInputElement).value);
            this.solow.setSavingsRate(value);
            this.updateControlDisplay('savings-rate-value', `${value}%`);
        });

        interestRate.addEventListener('input', (e) => {
            const value = parseFloat((e.target as HTMLInputElement).value);
            this.monetary.setInterestRate(value);
            this.updateControlDisplay('interest-rate-value', `${value}%`);
        });

        govSpending.addEventListener('input', (e) => {
            const value = parseInt((e.target as HTMLInputElement).value);
            this.fiscal.setGovernmentSpending(value);
            this.updateControlDisplay('gov-spending-value', `${value}%`);
        });

        taxRate.addEventListener('input', (e) => {
            const value = parseInt((e.target as HTMLInputElement).value);
            this.fiscal.setTaxRate(value);
            this.updateControlDisplay('tax-rate-value', `${value}%`);
        });
    }

    private initializeCharts(): void {
        const gdpCanvas = document.getElementById('gdp-chart') as HTMLCanvasElement;
        const indicatorsCanvas = document.getElementById('indicators-chart') as HTMLCanvasElement;
        
        // @ts-ignore - Set Chart.js default font options
        if (window.Chart && window.Chart.defaults) {
            window.Chart.defaults.font = {
                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                size: 12,
                weight: 'normal'
            };
        }
        
        // @ts-ignore - Chart.js global
        this.gdpChart = new Chart(gdpCanvas, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'GDP per Capita',
                    data: [],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)'
                } as any]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                devicePixelRatio: 1,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: false
                        }
                    }]
                } as any,
                plugins: {
                    title: {
                        display: true,
                        text: 'GDP per Capita Over Time',
                        font: {
                            size: 14,
                            weight: 'normal'
                        }
                    }
                },
                elements: {
                    point: {
                        radius: 3
                    }
                }
            }
        });

        // @ts-ignore - Chart.js global
        this.indicatorsChart = new Chart(indicatorsCanvas, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Inflation (%)',
                        data: [],
                        borderColor: '#e74c3c',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)'
                    } as any,
                    {
                        label: 'Unemployment (%)',
                        data: [],
                        borderColor: '#f39c12',
                        backgroundColor: 'rgba(243, 156, 18, 0.1)'
                    } as any,
                    {
                        label: 'Growth Rate (%)',
                        data: [],
                        borderColor: '#27ae60',
                        backgroundColor: 'rgba(39, 174, 96, 0.1)'
                    } as any
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                devicePixelRatio: 1,
                plugins: {
                    title: {
                        display: true,
                        text: 'Economic Indicators',
                        font: {
                            size: 14,
                            weight: 'normal'
                        }
                    }
                },
                elements: {
                    point: {
                        radius: 3
                    }
                }
            }
        });
    }

    private toggleSimulation(): void {
        if (this.isRunning) {
            this.pauseSimulation();
        } else {
            this.startSimulation();
        }
    }

    private startSimulation(): void {
        this.isRunning = true;
        const playPauseBtn = document.getElementById('play-pause-btn') as HTMLButtonElement;
        playPauseBtn.textContent = '⏸ Pause';
        
        // Clear any existing impact indicators when resuming
        this.clearIndicatorImpacts();
        
        this.intervalId = window.setInterval(() => {
            this.step();
        }, 500);
    }

    private pauseSimulation(): void {
        this.isRunning = false;
        const playPauseBtn = document.getElementById('play-pause-btn') as HTMLButtonElement;
        playPauseBtn.textContent = '▶ Play';
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    private resetSimulation(): void {
        this.pauseSimulation();
        
        this.solow = new SolowGrowthModel();
        this.monetary = new MonetaryModel();
        this.fiscal = new FiscalModel();
        this.eventSystem = new RandomEventSystem();
        this.economyHistory = [];
        
        this.resetControlsToDefault();
        this.updateDisplay();
        this.updateCharts();
    }

    private resetControlsToDefault(): void {
        (document.getElementById('savings-rate') as HTMLInputElement).value = '20';
        (document.getElementById('interest-rate') as HTMLInputElement).value = '3';
        (document.getElementById('gov-spending') as HTMLInputElement).value = '15';
        (document.getElementById('tax-rate') as HTMLInputElement).value = '25';
        
        this.updateControlDisplay('savings-rate-value', '20%');
        this.updateControlDisplay('interest-rate-value', '3%');
        this.updateControlDisplay('gov-spending-value', '15%');
        this.updateControlDisplay('tax-rate-value', '25%');
    }

    private step(): void {
        const newEvent = this.eventSystem.checkForEvents(this.solow.state.year);
        
        // Store pre-event state for impact calculation
        let preEventState = null;
        if (newEvent) {
            preEventState = {
                gdpPerCapita: this.solow.state.gdpPerCapita,
                capital: this.solow.state.capital,
                population: this.solow.state.labor,
                inflation: this.monetary.state.inflation * 100,
                unemployment: this.monetary.state.unemployment * 100
            };
        }
        
        this.eventSystem.applyEventEffects({
            solow: this.solow,
            monetary: this.monetary,
            fiscal: this.fiscal
        });
        
        // Capture post-event state immediately after applying event effects (before normal step)
        let postEventState = null;
        if (newEvent && preEventState) {
            postEventState = {
                gdpPerCapita: this.solow.state.gdpPerCapita,
                capital: this.solow.state.capital,
                population: this.solow.state.labor,
                inflation: this.monetary.state.inflation * 100,
                unemployment: this.monetary.state.unemployment * 100
            };
        }
        
        this.solow.step();
        const growthRate = this.solow.getGrowthRate();
        this.monetary.step(growthRate / 100);
        this.fiscal.step(this.solow.state.output);
        
        // Show indicator impacts when a new event occurs (without popup)
        if (newEvent && preEventState && postEventState) {
            this.showIndicatorImpacts(preEventState, postEventState);
            this.pauseSimulation();
        }
        
        this.eventSystem.updateActiveEvents();
        
        this.recordEconomyData();
        this.updateDisplay();
        this.updateCharts();
    }

    private recordEconomyData(): void {
        const data: EconomyData = {
            year: this.solow.state.year,
            gdpPerCapita: this.solow.state.gdpPerCapita,
            capital: this.solow.state.capital,
            population: this.solow.state.labor,
            growthRate: this.solow.getGrowthRate(),
            inflation: this.monetary.state.inflation * 100,
            unemployment: this.monetary.state.unemployment * 100
        };
        
        this.economyHistory.push(data);
        
        if (this.economyHistory.length > 100) {
            this.economyHistory.shift();
        }
    }

    private updateDisplay(): void {
        this.updateElement('current-year', this.solow.state.year.toString());
        this.updateElement('gdp-per-capita', `$${this.solow.state.gdpPerCapita.toFixed(2)}`);
        this.updateElement('capital-stock', `$${this.solow.state.capital.toFixed(2)}`);
        this.updateElement('population', Math.round(this.solow.state.labor).toLocaleString());
        this.updateElement('growth-rate', `${this.solow.getGrowthRate().toFixed(2)}%`);
        this.updateElement('inflation', `${(this.monetary.state.inflation * 100).toFixed(2)}%`);
        this.updateElement('unemployment', `${(this.monetary.state.unemployment * 100).toFixed(2)}%`);
        
        const eventDisplay = document.getElementById('event-display');
        if (eventDisplay) {
            eventDisplay.innerHTML = `<p>${this.eventSystem.getEventMessage()}</p>`;
        }
    }

    private updateCharts(): void {
        const labels = this.economyHistory.map(data => data.year.toString());
        const gdpData = this.economyHistory.map(data => data.gdpPerCapita);
        const inflationData = this.economyHistory.map(data => data.inflation);
        const unemploymentData = this.economyHistory.map(data => data.unemployment);
        const growthData = this.economyHistory.map(data => data.growthRate);

        if (this.gdpChart) {
            this.gdpChart.data.labels = labels;
            this.gdpChart.data.datasets[0].data = gdpData;
            this.gdpChart.update('none');
        }

        if (this.indicatorsChart) {
            this.indicatorsChart.data.labels = labels;
            this.indicatorsChart.data.datasets[0].data = inflationData;
            this.indicatorsChart.data.datasets[1].data = unemploymentData;
            this.indicatorsChart.data.datasets[2].data = growthData;
            this.indicatorsChart.update('none');
        }
    }

    private updateElement(id: string, value: string): void {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    private updateControlDisplay(id: string, value: string): void {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    private showEventNotification(event: any, preEventState?: any, postEventState?: any): void {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.id = 'event-modal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;

        // Create modal content
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            border-radius: 10px;
            padding: 30px;
            max-width: 500px;
            margin: 20px;
            text-align: center;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        `;

        const eventTypeClass = event.type === 'positive' ? 'positive' : 
                              event.type === 'negative' ? 'negative' : 'mixed';
        const eventEmoji = event.type === 'positive' ? '📈' : 
                          event.type === 'negative' ? '📉' : '⚠️';

        modal.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 15px;">${eventEmoji}</div>
            <h2 style="color: #2c3e50; margin-bottom: 15px;">${event.name}</h2>
            <p style="font-size: 1.1rem; color: #666; margin-bottom: 20px; line-height: 1.5;">
                ${event.description}
            </p>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <strong>Duration:</strong> ${event.duration} year${event.duration > 1 ? 's' : ''}
            </div>
            <button id="continue-btn" style="
                background: #3498db;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 5px;
                font-size: 1rem;
                cursor: pointer;
                transition: background 0.3s;
            ">Continue Simulation</button>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Add continue button functionality
        const continueBtn = document.getElementById('continue-btn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                document.body.removeChild(overlay);
                this.clearIndicatorImpacts();
                // Don't automatically restart - let user decide
            });
        }

        // Close modal when clicking overlay
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
                this.clearIndicatorImpacts();
            }
        });
    }

    private showIndicatorImpacts(preEventState: any, postEventState: any): void {
        const impacts = [
            {
                id: 'gdp-per-capita',
                name: 'GDP per Capita',
                pre: preEventState.gdpPerCapita,
                post: postEventState.gdpPerCapita,
                format: (val: number) => `$${val.toFixed(2)}`
            },
            {
                id: 'capital-stock',
                name: 'Capital Stock',
                pre: preEventState.capital,
                post: postEventState.capital,
                format: (val: number) => `$${val.toFixed(2)}`
            },
            {
                id: 'population',
                name: 'Population',
                pre: preEventState.population,
                post: postEventState.population,
                format: (val: number) => Math.round(val).toLocaleString()
            },
            {
                id: 'inflation',
                name: 'Inflation',
                pre: preEventState.inflation,
                post: postEventState.inflation,
                format: (val: number) => `${val.toFixed(2)}%`
            },
            {
                id: 'unemployment',
                name: 'Unemployment',
                pre: preEventState.unemployment,
                post: postEventState.unemployment,
                format: (val: number) => `${val.toFixed(2)}%`
            }
        ];

        impacts.forEach(impact => {
            const element = document.getElementById(impact.id);
            if (element && Math.abs(impact.post - impact.pre) > 0.01) {
                const change = impact.post - impact.pre;
                const percentChange = ((change / Math.abs(impact.pre)) * 100);
                const isPositive = change > 0;
                
                // Create impact indicator
                const indicator = document.createElement('div');
                indicator.className = 'impact-indicator';
                indicator.style.cssText = `
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    background: ${isPositive ? '#27ae60' : '#e74c3c'};
                    color: white;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    gap: 2px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    z-index: 100;
                    animation: impactPulse 0.6s ease-out;
                `;
                
                const arrow = isPositive ? '↗' : '↘';
                const sign = isPositive ? '+' : '';
                indicator.innerHTML = `
                    ${arrow} ${sign}${Math.abs(percentChange).toFixed(1)}%
                `;
                
                // Position indicator relative to the metric element
                const parent = element.closest('.metric') as HTMLElement;
                if (parent) {
                    parent.style.position = 'relative';
                    parent.appendChild(indicator);
                }
            }
        });

        // Add CSS animation
        if (!document.getElementById('impact-styles')) {
            const style = document.createElement('style');
            style.id = 'impact-styles';
            style.textContent = `
                @keyframes impactPulse {
                    0% {
                        transform: scale(0.8);
                        opacity: 0;
                    }
                    50% {
                        transform: scale(1.1);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    private clearIndicatorImpacts(): void {
        const indicators = document.querySelectorAll('.impact-indicator');
        indicators.forEach(indicator => {
            indicator.remove();
        });
    }

}

document.addEventListener('DOMContentLoaded', () => {
    new MacroEconSimulator();
});