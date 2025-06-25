/* eslint-disable no-console */
const { writeFileSync } = require('fs');
const { graphviz } = require('@hpcc-js/wasm');
const { loadDictionary } = require('./dictionaryHelper');
const { createDotStringFromDictionary } = require('./graphvizLayoutHelper');

const dictionary = loadDictionary();
const dotString = createDotStringFromDictionary(dictionary);
console.log('Creating graphviz layout for the following DOT string:');
console.log(dotString);

graphviz
  .layout(dotString, 'json', 'dot')
  .then((json) => writeFileSync(`${__dirname}/graphvizLayout.json`, json));
