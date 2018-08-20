/**
 * Little script build src/gqlHelper.js from a template
 * to which application specific variables are applied.
 */

const fs = require('fs');
const nunjucks = require('nunjucks');
const helper = require('./dictionaryHelper.js');
const utils = require('./utils.js');

const dataFolder = __dirname;
const dictPath = `${dataFolder}/dictionary.json`;
const templateName = 'gqlHelper.js.njk';


if (!fs.existsSync(`${dataFolder}/${templateName}`)) {
  console.error(`ERR: ${dataFolder}/${templateName} does not exist - bailing out`);
  process.exit(1);
}

if (!fs.existsSync(dictPath)) {
  console.error(`ERR: ${dictPath} does not exists - npm run schema - bailing out`);
  process.exit(2);
}

const dict = utils.loadJsonFile(dictPath);
if (dict.status !== 'ok') {
  console.error(`Error loading dictionary at ${dictPath}`, dict.error);
  process.exit(3);
}

let gqlSetup = helper.dictToGQLSetup(dict.data);

if (!gqlSetup) {
  console.error('ERR: unable to interpret data/dictionary.json - baling out');
  process.exit(4);
}

const paramGQLSetup = helper.paramSetup();
if (!paramGQLSetup) {
  console.error('ERR: unable to interpret data/parameters.js - baling out');
  process.exit(4);
}

gqlSetup = Object.assign(paramGQLSetup, gqlSetup);
console.error(gqlSetup);

if (process.argv.length > 2 && process.argv[2].match(/^-+h(elp)?$/)) {
  console.log(`
  Generator for dictionary-dependent gql for the data-portal.
  Relayjs validates gql at compile time.
  Typical use:
      node data/gqlSetup.js > src/gqlHelper.js
  `);
} else {
  nunjucks.configure(dataFolder, { autoescape: false });
  console.log(nunjucks.render(templateName, gqlSetup));
}
