const fs = require('fs');
const path = require('path');
const {
  buildClientSchema,
  printSchema,
} = require('graphql/utilities/index');

const schemaPath = path.join(__dirname, 'schema.json');
const schemaSDLPath = path.join(__dirname, 'schema.graphql');

const writeSchemaSDL = (schema) => {
  const introspection = schema.data || schema;
  const graphQLSchema = buildClientSchema(introspection);
  fs.writeFileSync(schemaSDLPath, `${printSchema(graphQLSchema)}\n`);
};

if (require.main === module) {
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  writeSchemaSDL(schema);
}

module.exports = { writeSchemaSDL };
