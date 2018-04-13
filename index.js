#!/usr/bin/env node
var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');
var os = require('os')

if (process.argv.length < 3) {
    console.log([
        'Usage: bpwc clear-cache',
        '',
        'Tool used to clear babel cache'
    ].join('\n'));
    process.exit(0);
}

const Void = () => void 0;

clearCache();
function clearCache() {
    [
        path.join(os.homedir(), '.babel.json')
    ].forEach(file => fs.unlink(file, Void))

    let dirPaths = [
        path.join(process.cwd(), 'node_modules', '.cache', 'babel-loader')
    ].forEach(dir => rimraf(dir, Void))
}
