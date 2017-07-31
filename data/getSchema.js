const fetch = require('node-fetch');
const fs = require('fs');
const {
  buildClientSchema,
  printSchema,
} = require('graphql/utilities/index');
const path = require('path');

const schemaPath = path.join(__dirname, 'schema');
const SERVER = 'http://localhost:5000/v0/submission/getschema';

// Save JSON of full schema introspection for Babel Relay Plugin to use
fetch(SERVER, {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})
  .then(res => res.json())
  .then(schemaJSON => {
    fs.writeFileSync(`${schemaPath}.json`, JSON.stringify(schemaJSON, null, 2));

    // Save user readable type system shorthand of schema
    const graphQLSchema = buildClientSchema(schemaJSON.data);
    fs.writeFileSync(`${schemaPath}.graphql`, printSchema(graphQLSchema));
  });
