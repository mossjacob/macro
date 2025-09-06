const fs = require('fs');
const path = require('path');

// Read the source index.html
const sourceHtml = fs.readFileSync('index.html', 'utf8');

// Create build version with relative script path
const buildHtml = sourceHtml.replace(
    'src="build/app.js"', 
    'src="app.js"'
);

// Ensure build directory exists
if (!fs.existsSync('build')) {
    fs.mkdirSync('build');
}

// Write the build version
fs.writeFileSync('build/index.html', buildHtml);

console.log('✅ Built index.html for production');