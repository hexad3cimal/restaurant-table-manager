const env = process.env.NODE_ENV || 'dev'
const fs = require('fs');
const settings = fs.readFileSync(env+".json","utf8");


const importString = '(window.appSettings ='+settings+')'

fs.writeFile('dist/settings.js', importString, 'utf8', function (err) {
    if (err) {
        return console.log(err);
    }
}); 
