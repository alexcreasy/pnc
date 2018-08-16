const fs = require('fs');
const browserify = require('browserify');
const babelify = require('babelify');
const parcelify = require('parcelify');
const glob = require('glob');

const OUTPUT_FILE = 'dist/index.js';

 browserify({ 
    debug: true,   
    insertGlobalVars: {
      'lodash': () => 'require("lodash")',
      'jQuery': () => 'require("jquery")'
    } 
  })
  .transform(babelify)
  .plugin('parcelify', { bundles: { style: './dist/lib.css' }})
  .add('index.js')
  .add('.tmp/templateCache.js')
  .bundle()
  .on('error', error => console.error('Error: ' + error.message))
  .pipe(fs.createWriteStream(OUTPUT_FILE));
 