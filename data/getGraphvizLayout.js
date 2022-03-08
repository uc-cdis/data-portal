/* eslint-disable no-console */
const { readFileSync, writeFileSync } = require('fs');
const path = require('path');
const { graphviz } = require('@hpcc-js/wasm');
const { createDotStringFromDictionary } = require('./graphvizLayoutHelper');

const dictString = readFileSync(`${__dirname}/dictionary.json`, 'utf8');
const dictionary = JSON.parse(dictString);

const wasmRelativePath = '../node_modules/@hpcc-js/wasm/dist/graphvizlib.wasm';
const wasm = readFileSync(path.resolve(__dirname, wasmRelativePath));

const dotString = createDotStringFromDictionary(dictionary);
console.log('Creating graphviz layout for the following DOT string:');
console.log(dotString);

graphviz
  .layout(dotString, 'json', 'dot', { wasmBinary: new Uint8Array(wasm) })
  .then((json) => writeFileSync(`${__dirname}/graphvizLayout.json`, json));
