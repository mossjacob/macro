# MacroEconomic Simulator

An interactive web-based macroeconomic simulation game built with TypeScript that incorporates various economic models including the Solow growth model.

## Features

- **Interactive Solow Growth Model**: Simulates economic growth based on capital accumulation, labor growth, and technological progress
- **Random Economic Events**: Realistic events like recessions, technology booms, natural disasters, and more
- **Policy Controls**: Adjust savings rate, interest rates, government spending, and tax rates
- **Real-time Visualization**: Charts showing GDP per capita and key economic indicators over time
- **Gamified Experience**: Make policy decisions in response to economic events

## Getting Started

### Prerequisites
- Node.js (for TypeScript compilation)
- A modern web browser
- Python 3 (optional, for local server)

### Installation & Running

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Compile TypeScript:**
   ```bash
   npm run build
   ```

3. **Start local server:**
   ```bash
   npm run serve
   ```
   
   Or simply open `index.html` in your browser.

4. **Development mode (auto-compile):**
   ```bash
   npm run watch
   ```

## How to Play

1. **Start the Simulation**: Click the "Start" button to begin the economic simulation
2. **Monitor Indicators**: Watch GDP per capita, inflation, unemployment, and other key metrics
3. **Respond to Events**: Random events will occur (recessions, tech booms, etc.)
4. **Make Policy Decisions**: Adjust economic levers:
   - **Savings Rate**: Higher rates increase capital accumulation but reduce consumption
   - **Interest Rate**: Central bank rate affecting investment and inflation
   - **Government Spending**: Fiscal stimulus that can boost growth
   - **Tax Rate**: Government revenue that affects disposable income

## Economic Models

### Solow Growth Model
- Models long-term economic growth
- Based on capital accumulation, labor force growth, and technological progress
- Production function: Y = A × K^α × L^(1-α)

### Monetary Policy
- Phillips curve relationship between inflation and unemployment
- Interest rate adjustments based on inflation targeting

### Fiscal Policy  
- Government spending and taxation effects
- Debt-to-GDP ratio monitoring with automatic stabilizers

## File Structure

```
├── src/
│   ├── types.ts           # TypeScript interfaces and types
│   ├── economic-models.ts # Core economic model implementations
│   ├── events.ts          # Random event system
│   └── app.ts             # Main application logic
├── dist/                  # Compiled JavaScript output
├── styles.css             # Application styling
├── index.html             # Main HTML file
└── package.json           # Project configuration
```

## Contributing

This is an educational simulation. Feel free to:
- Add new economic models
- Create additional random events
- Improve the user interface
- Add more sophisticated policy options
