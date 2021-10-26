const { params } = require('./parameters');
const { paramByApp, getGraphQL } = require('./dictionaryHelper');

const componentTexts = paramByApp(params, 'components');

function getChartText() {
  const graphQL = getGraphQL(paramByApp(params, 'graphql'));
  const boardPluralNames = graphQL.boardCounts.map((item) => item.plural);
  if (boardPluralNames.length < 4) {
    boardPluralNames.push('Files');
  }
  const detailPluralNames = graphQL.projectDetails.map((item) => item.plural);
  if (detailPluralNames.length < 4) {
    detailPluralNames.push('Files');
  }
  const indexChartNames = graphQL.boardCounts.map((item) => item.plural);
  if (indexChartNames.length < 4) {
    indexChartNames.push('Files');
  }
  return {
    boardPluralNames,
    chartNames: graphQL.chartCounts.map((item) => item.name),
    indexChartNames,
    detailPluralNames,
  };
}

function paramByDefault(prs, key) {
  return prs.default[key];
}

const defaultTexts = paramByDefault(params, 'components');
const defaultGA = paramByApp(params, 'gaTrackingId');
const defaultRequiredCerts = paramByApp(params, 'requiredCerts');

function fillDefaultValues(values, defaultValues) {
  const res = values;
  Object.keys(defaultValues).forEach((key) => {
    if (!Object.keys(res).includes(key)) {
      res[key] = defaultValues[key];
    }
  });
  res.charts = getChartText();
  return res;
}

function insertSpace(times) {
  let first = '';
  for (let i = 0; i < times; i += 1) {
    first += ' ';
  }
  return first;
}

function containsVariables(value, variables) {
  for (let i = 0; i < variables.length; i += 1) {
    if (value.includes(variables[i])) {
      return variables[i];
    }
  }
  return null;
}

function doWrapping(value, leftWrapper, rightWrapper, indent, spaces) {
  const ending = spaces === 0 ? '' : '\n';
  const lWrapper = spaces === 0 ? leftWrapper : `${leftWrapper}\n`;
  const rWrapper = spaces === 0 ? rightWrapper : `${rightWrapper}`;
  return `${lWrapper}${value}${ending}${insertSpace(indent)}${rWrapper}`;
}

function doStringify(value, variables, indent = 0, spaces = 0) {
  const ending = spaces === 0 ? '' : '\n';
  if (Array.isArray(value)) {
    const objs = value
      .map(
        (item) =>
          `${insertSpace(indent + spaces)}${doStringify(
            item,
            variables,
            indent + spaces,
            spaces
          )}`
      )
      .join(`,${ending}`);
    return doWrapping(objs, '[', ']', indent, spaces);
  }
  if (typeof value === 'string') {
    const variable = containsVariables(value, variables);
    if (variable !== null) {
      return `\`${value.replace(`#${variable}#`, `\$\{${variable}\}`)}\``;
    }
    return JSON.stringify(value);
  }

  if (typeof value !== 'object') {
    // not an object, stringify using native function
    return JSON.stringify(value);
  }
  // Implements recursive object serialization according to JSON spec
  // but without quotes around the keys.
  const props = Object.keys(value)
    .map(
      (key) =>
        `${insertSpace(indent + spaces)}${key}:${doStringify(
          value[key],
          variables,
          indent + spaces,
          spaces
        )}`
    )
    .join(`,${ending}`);
  return doWrapping(props, '{', '}', indent, spaces);
}

function stringify(value, variables = [], spaces = 0) {
  return doStringify(value, variables, 0, spaces);
}

function isPlainObject(o) {
  return !!o && typeof o === 'object' && !Array.isArray(o);
}

/**
 * Build a configuration that does a 2-level merge
 * of the default and app configs excluding 'components'
 *
 * @param {string} appIn defaults to process.env.APP || "default"
 * @param {[string}]:config} data dictionary of application configs
 * @return 2-level merged app config
 */
function buildConfig(appIn, data) {
  const app = appIn || process.env.APP || 'default';
  const appConfig = data[app] || {};
  const defaultConfig = data.default || {};
  const result = { ...defaultConfig, ...appConfig };
  delete result.components;
  Object.keys(result).forEach((k) => {
    if (
      isPlainObject(result[k]) &&
      isPlainObject(defaultConfig[k]) &&
      isPlainObject(appConfig[k])
    )
      result[k] = { ...defaultConfig[k], ...appConfig[k] };
  });
  return result;
}

function getConsortiumList(dict) {
  const consortiumList = dict.subject.properties.consortium.enum || [];
  return JSON.stringify(consortiumList, null, 2);
}

function getEnumFilterList(config, dict) {
  const filterSet = new Set();
  for (const { filters } of config.explorerConfig ?? [])
    for (const { fields } of filters.tabs ?? [])
      for (const field of fields) filterSet.add(field);

  const enumPropSet = new Set();
  for (const value of Object.values(dict))
    if (value.properties !== undefined)
      for (const [propName, propValue] of Object.entries(value.properties))
        if (propValue.enum !== undefined) enumPropSet.add(propName);

  const filterList = Array.from(filterSet);
  const enumFilterSet = new Set();
  for (const filter of filterList)
    if (enumPropSet.has(filter)) enumFilterSet.add(filter);

  return JSON.stringify(Array.from(enumFilterSet), null, 2);
}

const config = buildConfig(process.env.app, params);
// eslint-disable-next-line import/no-dynamic-require
const dict = require(`${__dirname}/dictionary.json`);
console.log(`const gaTracking = '${defaultGA}';`);
console.log(
  "const hostname = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}/` : 'http://localhost/';"
);
console.log(
  `const components = ${stringify(
    fillDefaultValues(componentTexts, defaultTexts),
    ['hostname'],
    2
  )};`
);
console.log(`const config = ${JSON.stringify(config, null, '  ')};`);
console.log(
  `const requiredCerts = [${defaultRequiredCerts.map((item) => `'${item}'`)}];`
);
console.log(`const consortiumList = ${getConsortiumList(dict)};`);
console.log(`const enumFilterList = ${getEnumFilterList(config, dict)};`);
console.log(
  'module.exports = { components, config, gaTracking, requiredCerts, consortiumList, enumFilterList };'
);
