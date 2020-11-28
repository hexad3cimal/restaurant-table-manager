const rimraf = require('rimraf');
const fs = require('fs');

const api = process.env.NODE_ENV === 'production' ? 'http://localhost:8090/v1/api/' : '/v1/api/';

rimraf.sync('public/scripts/deps.js');

const importContent = `window.restAppConfig = ({ 'api' : '${api}' })`;
fs.writeFileSync('public/scripts/deps.js', importContent);
