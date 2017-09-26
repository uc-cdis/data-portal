/**
 * Little helper to fetch schema.json (used by the Relayjs compiler) from indexd,
 * and dataDictionary.json from the gdc api (used by data/gqlSetup.js to customize gql queries
 * based on the active dictionary before Relay compile).
 * 
 * Ex: https://dev.bionimbus.org/api/v0/submission/getschema
 *     https://dev.bionimbus.org/api/v0/submission/_dictionary/_all 
 */
const fetch = require('node-fetch');
const fs = require('fs');
const {
  buildClientSchema,
  printSchema,
} = require('graphql/utilities/index');
const path = require('path');

const { gdcSubPath } = (function () {
  function addSlash( path ) { return (path + '/').replace(/\/+$/, '/'); }

  if (process.argv.length < 3) {
    const gdcDefaultPath = process.env.HOSTNAME ? `https://${process.env.HOSTNAME}/api/v0/submission/` : 'http://localhost:5000/v0/submission/';    
    return { status: "ok", gdcSubPath: addSlash( process.env.GDC_SUBPATH || gdcDefaultPath ) };
  }
  const arg1 = process.argv[2];
  if (!arg1.match(/^https?\:\/\//)) {
    console.log(`
    getSchema downloads data/schema.json and data/dictionary.json from the environment's
    gdc-api for later use configuring gql queries for the portal environment, and
    running the relayjs gql compiler.

    Use: node getSchema.js [gdcSubmissionApiPath]
        - where gdcSubmissionApiPath defaults to: process.env.GDC_SUBPATH || 'http://localhost:5000/v0/submission/'
        - example - if gdcSubmissionApiPath = https://dev.bionimbus.org/api/vo/submission/, 
            then the script loads:
            * https://dev.bionimbus.org/api/v0/submission/_dictionary/_all
            * https://dev.bionimbus.org/api/v0/submission/getschema
    `);
    return { status: "exit" };
  }
  return { status: "ok", gdcSubPath: addSlash( arg1 ) };
})();

if (!gdcSubPath) {
  process.exit(1);
}

const schemaUrl = gdcSubPath + "getschema";
const schemaPath = __dirname + "/schema.json";
const dictUrl = gdcSubPath + "_dictionary/_all";
const dictPath = __dirname + "/dictionary.json";

async function fetchJson(url) {
  console.log("Fetching " + url);
  return fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(res => res.json()
    ).catch(err => {
      console.err("Error processing " + url, err);
      return Promise.reject(err);
    });
}

const actionList = [];

actionList.push(
  // Save JSON of full schema introspection for Babel Relay Plugin to use
  fetchJson(schemaUrl).then(schema => {
    fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2));

    // Save user readable type system shorthand of schema
    const graphQLSchema = buildClientSchema(schema.data);
    fs.writeFileSync(`${__dirname}/schema.graphql`, printSchema(graphQLSchema));
  })
);

actionList.push(
  fetchJson(dictUrl).then(
    dict => {
      fs.writeFileSync(dictPath, JSON.stringify(dict, null, 2));
    }
  )
);

Promise.all(actionList).then(
  function () {
    console.log("All done!");
    process.exit(0);
  },
  function (err) {
    console.error("Error: ", err);
    process.exit(2);
  }
);
