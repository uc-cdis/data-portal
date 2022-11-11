/**
 * Little helper to fetch schema.json (used by the Relayjs compiler) from indexd,
 * and dataDictionary.json from the gdc api (used by data/gqlSetup.js to customize gql queries
 * based on the active dictionary before Relay compile).
 *
 * Ex: https://dev.bionimbus.org/api/v0/submission/getschema
 *     https://dev.bionimbus.org/api/v0/submission/_dictionary/_all
 */
const https = require('https');
const http = require('http');
const fetch = require('node-fetch');
const fs = require('fs');
const {
  buildClientSchema,
  printSchema,
} = require('graphql/utilities/index');

const { gdcSubPath } = (function () {
  function addSlash(path) { return (`${path}/`).replace(/\/+$/, '/'); }

  if (process.argv.length < 3) {
    let gdcDefaultPath = 'http://localhost:5000/v0/submission/';

    if (process.env.PORTAL_HOSTNAME) {
      gdcDefaultPath = `https://${process.env.PORTAL_HOSTNAME}/api/v0/submission/`;
      if (process.env.PORTAL_HOSTNAME.startsWith('revproxy')) {
        gdcDefaultPath = `http://${process.env.PORTAL_HOSTNAME}/api/v0/submission/`;
      }
    }
    return { status: 'ok', gdcSubPath: addSlash(process.env.GDC_SUBPATH || gdcDefaultPath) };
  }
  const arg1 = process.argv[2];
  if (!arg1.match(/^https?:\/\//)) {
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
    return { status: 'exit' };
  }
  return { status: 'ok', gdcSubPath: addSlash(arg1) };
}());

if (!gdcSubPath) {
  process.exit(1);
}

const schemaUrl = `${gdcSubPath}getschema`;
const schemaPath = `${__dirname}/schema.json`;
const dictUrl = `${gdcSubPath}_dictionary/_all`;
const dictPath = `${__dirname}/dictionary.json`;
const httpAgent = new http.Agent({
  rejectUnauthorized: false,
});
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const retryBackoff = [2000, 4000, 8000, 16000];

/**
 * Wrapper around fetch - retries call on 429 status
 * up to 4 times with exponential backoff
 *
 * @param {string} urlStr
 * @param {*} opts
 */
async function fetchJsonRetry(urlStr, opts) {
  let retryCount = 0;
  let doRequest = null; // for eslint happiness

  async function doRetry(reason) {
    if (retryCount > retryBackoff.length) {
      return Promise.reject(`failed fetch ${reason}, max retries ${retryBackoff.length} exceeded for ${urlStr}`);
    }

    return new Promise(((resolve) => {
      // sleep and try again ...
      const retryIndex = Math.min(retryCount, retryBackoff.length - 1);
      const sleepMs = retryBackoff[retryIndex] + Math.floor(Math.random() * 2000);
      retryCount += 1;
      console.log(`failed fetch - ${reason}, sleeping ${sleepMs} then retry ${urlStr}`);
      setTimeout(() => {
        resolve('ok');
        console.log(`Retrying ${urlStr} after sleep - ${retryCount}`);
      }, sleepMs);
    })).then(doRequest);
  }

  doRequest = async function () {
    if (retryCount > 0) {
      console.log(`Re-fetching ${urlStr} - retry no ${retryCount}`);
    }
    return fetch(urlStr, opts,
    ).then(
      (res) => {
        if (res.status === 200) {
          return res.json().catch(
            (err) => doRetry(`failed json parse - ${err}`),
          );
        }
        return doRetry(`non-200 from server: ${res.status}`);
      },
      (err) => doRetry(err),
    );
  };

  return doRequest();
}

async function fetchJson(url) {
  console.log(`Fetching ${url}`);
  return fetchJsonRetry(url, {
    agent: url.match(/^https:/) ? httpsAgent : httpAgent,
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
}

const actionList = [];

actionList.push(
  // Save JSON of full schema introspection for Babel Relay Plugin to use
  fetchJson(schemaUrl).then((schema) => {
    fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2));

    // Save user readable type system shorthand of schema
    const graphQLSchema = buildClientSchema(schema.data);
    fs.writeFileSync(`${__dirname}/schema.graphql`, printSchema(graphQLSchema));
  }),
);

actionList.push(
  fetchJson(dictUrl).then(
    (dict) => {
      fs.writeFileSync(dictPath, JSON.stringify(dict, null, 2));
    },
  ),
);

Promise.all(actionList).then(
  () => {
    console.log('All done!');
    process.exit(0);
  },
  (err) => {
    console.error('Error: ', err);
    process.exit(2);
  },
);
