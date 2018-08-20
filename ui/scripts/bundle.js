// const fs = require('fs');
// const glob = require('glob');
// const babel = require('babel-core');
const config = require('../manifest.json');

process.stdout.write(config.js.dependencies.join(' '));