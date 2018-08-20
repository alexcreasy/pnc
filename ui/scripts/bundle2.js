// const fs = require('fs');
// const glob = require('glob');
const babel = require('babel-core');
const config = require('../manifest.json');

files = config.js.dependencies.join(' ');

console.log(files);

const result = babel.transformFileSync(files);

//process.stdout.write(config.js.dependencies.join(' '));