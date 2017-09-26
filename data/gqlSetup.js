/**
 * Little script build src/gqlHelper.js from a template
 * to which application specific variables are applied.
 */

const nunjucks = require( 'nunjucks' );
const fs = require( 'fs' );
//const conf = require("../src/localconf.js" );
const helper = require( "./dictionaryHelper.js" );
const cwd = process.cwd();
const dataFolder = __dirname;
const dictPath = dataFolder + "/dictionary.json";
const templateName = "gqlHelper.js.njk";


if ( ! fs.existsSync( dataFolder + "/" + templateName ) ) {
  console.error( "ERR: " + dataFolder + "/" + templateName + " does not exist - bailing out" );
  process.exit( 1 );
}

if ( ! fs.existsSync( dictPath ) ) {
  console.error( "ERR: " + dictPath + " does not exists - npm run schema - bailing out" );
  process.exit( 2 );
}

const dict = helper.loadJsonFile( dictPath );
if ( dict.status !== "ok" ) {
  console.error( "Error loading dictionary at " + dictPath, dict.error );
  process.exit( 3 );
}

const gqlSetup = helper.dictToGQLSetup( dict.data );

if ( ! gqlSetup ) {
  console.error( "ERR: No 'gqlSetup' data configured in src/localconf.js for app " + conf.app + " - baling out", conf );
  process.exit( 4 );
}

if ( process.argv.length > 2 && process.argv[2].match( /^-+h(elp)?$/ ) ){
  console.log( `
  Generator for dictionary-dependent gql for the data-portal.
  Relayjs validates gql at compile time.
  Typical use:
      node data/gqlSetup.js > src/gqlHelper.js
  ` );
} else {
  nunjucks.configure( dataFolder, { autoescape: false } );
  console.log( nunjucks.render( templateName, gqlSetup ) );
}

