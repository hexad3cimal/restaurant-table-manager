const rimraf = require('rimraf');
const fs = require('fs');

const api = process.env === 'production' ? 'http://localhost:8090/v1/api/' : '/v1/api/';

rimraf.sync('assets/import.js');

const importContent = `window.geoConfig = ({ 'api' : '${api}' })`;
fs.writeFileSync('assets/import.js', importContent);
