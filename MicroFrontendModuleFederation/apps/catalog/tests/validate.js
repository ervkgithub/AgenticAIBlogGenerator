const fs = require('fs');
const path = require('path');

const appRoot = path.resolve(__dirname, '..');
const files = ['webpack.config.js', 'package.json', 'server.js', 'src/CatalogApp.js'];
const missing = files.filter((file) => !fs.existsSync(path.join(appRoot, file)));

if (missing.length > 0) {
  console.error('Missing catalog files:', missing.join(', '));
  process.exit(1);
}

console.log('Catalog remote validation passed.');
