/**
 * Little script build src/gqlHelper.js from a template
 * to which application specific variables are applied.
 */

const nunjucks = require( 'nunjucks' );
const fs = require( 'fs' );
const conf = require("../src/localconf.js" );

const cwd = process.cwd();
const dataFolder = process.argv[1].replace( /\/[^\/]*$/, "" );
const templateName = "gqlHelper.js.njk";

if ( ! fs.existsSync( dataFolder + "/" + templateName ) ) {
  console.error( "ERR: " + dataFolder + "/" + templateName + " does not exist - bailing out" );
  process.exit( 1 );
}

if ( ! conf.gqlSetup ) {
  console.error( "ERR: No 'gqlSetup' data configured in src/localconf.js for app " + conf.app + " - baling out", conf );
  process.exit( 2 );
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
  console.log( "// App is: " + conf.app );
  console.log( nunjucks.render( templateName, conf.gqlSetup ) );
}



