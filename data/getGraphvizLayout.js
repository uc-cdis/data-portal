/* eslint-disable no-console */
const { readFileSync, writeFileSync } = require('fs');
const { graphviz } = require('@hpcc-js/wasm');
const { createDotStringFromDictionary } = require('./graphvizLayoutHelper');

const dictString = readFileSync(`${__dirname}/dictionary.json`, 'utf8');
const dictionary = JSON.parse(dictString);

const dotString = createDotStringFromDictionary(dictionary);
console.log('Creating graphviz layout for the following DOT string:');
console.log(dotString);

graphviz
  .layout(dotString, 'json', 'dot')
  .then((json) => writeFileSync(`${__dirname}/graphvizLayout.json`, json));
