const glob = require('glob');
const fs = require('fs');
const manifest = require('../manifest.json');


const OUTPUT_FILE = 'index.js';

const dependencies = manifest.dependencies;
const sourceFiles = manifest.sourceFiles;
const output = [];


dependencies.forEach(dep => output.push(`require('${dep}');`));

output.push('\n\n');

sourceFiles.forEach(pattern => {
    let files = glob.sync(pattern);

    files.forEach(file => output.push(`require('${file.slice(0, file.length - 3 )}');`));
});


let toWrite = output.join('\n');

console.debug(`Writing to ${OUTPUT_FILE}\n\n`, toWrite);

fs.writeFileSync(OUTPUT_FILE, toWrite, 'utf-8');