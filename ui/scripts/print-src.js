const glob = require('glob');
const manifest = require('../manifest.json');

// let srcFiles = [];

// manifest.sourceFiles.forEach(pattern => srcFiles.push(glob.sync(pattern)));


process.stdout.write(manifest.sourceFiles.reduce((accumulator, value) => accumulator + glob.sync(value).join('\n') + '\n', ''));

// let srcFiles = [];

// manifest.sourceFiles.forEach(pattern => srcFiles.push(glob.sync(pattern)));

// console.log(srcFiles);

//srcFiles.forEach(file => process.stdout.write(file));