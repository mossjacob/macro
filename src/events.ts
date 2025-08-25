import { RandomEvent, ActiveEvent, HistoricalEvent, EventEffects } from './types.js';

export class RandomEventSystem {
    private events: RandomEvent[];
    private activeEvents: ActiveEvent[];
    private eventHistory: HistoricalEvent[];

    constructor() {
        this.events = [
            {
                name: "Technology Boom",
                description: "New innovations boost productivity across the economy",
                probability: 0.05,
                effects: {
                    technology: 0.1,
                    productivity: 0.005
                },
                type: "positive",
                duration: 1
            },
            {
                name: "Financial Crisis",
                description: "Banking sector collapse destroys capital and reduces investment",
                probability: 0.03,
                effects: {
                    capital_destruction: 0.15,
                    unemployment_shock: 0.03
                },
                type: "negative",
                duration: 3
            },
            {
                name: "Natural Disaster",
                description: "Major earthquake destroys infrastructure and capital",
                probability: 0.02,
                effects: {
                    capital_destruction: 0.08,
                    population: -0.02
                },
                type: "negative",
                duration: 2
            },
            {
                name: "Baby Boom",
                description: "Population growth accelerates due to cultural changes",
                probability: 0.04,
                effects: {
                    population: 0.05
                },
                type: "mixed",
                duration: 5
            },
            {
                name: "Oil Crisis",
                description: "Energy prices spike, reducing productivity and increasing inflation",
                probability: 0.03,
                effects: {
                    inflation_shock: 0.04,
                    productivity: -0.01
                },
                type: "negative",
                duration: 2
            },
            {
                name: "Trade War",
                description: "International trade tensions reduce economic efficiency",
                probability: 0.04,
                effects: {
                    productivity: -0.008,
                    inflation_shock: 0.015
                },
                type: "negative",
                duration: 4
            },
            {
                name: "Medical Breakthrough",
                description: "Healthcare advances increase life expectancy and productivity",
                probability: 0.03,
                effects: {
                    population: 0.01,
                    technology: 0.05
                },
                type: "positive",
                duration: 1
            },
            {
                name: "Housing Bubble Burst",
                description: "Real estate market collapse reduces wealth and consumption",
                probability: 0.025,
                effects: {
                    capital_destruction: 0.1,
                    unemployment_shock: 0.025
                },
                type: "negative",
                duration: 3
            },
            {
                name: "Immigration Wave",
                description: "Large influx of workers changes labor market dynamics",
                probability: 0.04,
                effects: {
                    population: 0.03,
                    unemployment_shock: 0.01
                },
                type: "mixed",
                duration: 2
            },
            {
                name: "Recession",
                description: "Economic downturn reduces output and increases unemployment",
                probability: 0.08,
                effects: {
                    capital_destruction: 0.05,
                    unemployment_shock: 0.02,
                    productivity: -0.005
                },
                type: "negative",
                duration: 2
            },
            {
                name: "Tech Startup Boom",
                description: "Venture capital floods into new technology companies",
                probability: 0.06,
                effects: {
                    technology: 0.08,
                    inflation_shock: 0.01
                },
                type: "positive",
                duration: 2
            },
            {
                name: "Currency Crisis",
                description: "Currency devaluation affects international trade",
                probability: 0.02,
                effects: {
                    inflation_shock: 0.06,
                    capital_destruction: 0.03
                },
                type: "negative",
                duration: 1
            }
        ];
        
        this.activeEvents = [];
        this.eventHistory = [];
    }
    
    public checkForEvents(year: number): ActiveEvent | null {
        if (year === 0) return null;
        
        for (const event of this.events) {
            if (Math.random() < event.probability) {
                const activeEvent: ActiveEvent = {
                    ...event,
                    startYear: year,
                    remainingDuration: event.duration,
                    id: Date.now() + Math.random()
                };
                
                this.activeEvents.push(activeEvent);
                this.eventHistory.push({
                    name: event.name,
                    year: year,
                    description: event.description
                });
                
                return activeEvent;
            }
        }
        return null;
    }
    
    public getActiveEvents(): ActiveEvent[] {
        return this.activeEvents;
    }
    
    public updateActiveEvents(): void {
        this.activeEvents = this.activeEvents.filter(event => {
            event.remainingDuration--;
            return event.remainingDuration > 0;
        });
    }
    
    public applyEventEffects(economy: any): void {
        for (const event of this.activeEvents) {
            for (const [effectType, magnitude] of Object.entries(event.effects)) {
                if (magnitude !== undefined) {
                    if (['technology', 'productivity', 'population', 'depreciation', 'capital_destruction'].includes(effectType)) {
                        economy.solow.applyShock(effectType, magnitude);
                    } else if (['inflation_shock', 'unemployment_shock', 'money_supply_shock'].includes(effectType)) {
                        economy.monetary.applyMonetaryShock(effectType, magnitude);
                    }
                }
            }
        }
    }
    
    public getEventMessage(): string {
        if (this.activeEvents.length === 0) {
            return "Economy is stable...";
        }
        
        const messages = this.activeEvents.map(event => 
            `${event.name}: ${event.description} (${event.remainingDuration} years remaining)`
        );
        
        return messages.join(' | ');
    }
    
    public getRecentEvents(count: number = 5): HistoricalEvent[] {
        return this.eventHistory.slice(-count);
    }
}