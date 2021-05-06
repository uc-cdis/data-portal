import fetch from 'isomorphic-fetch';
import flat from 'flat';
import papaparse from 'papaparse';
import { FILE_DELIMITERS } from './const';

const graphqlEndpoint = '/graphql';
const downloadEndpoint = '/download';
const statusEndpoint = '/_status';

/**
 * Converts JSON to a specified file format.
 * Defaultes to JSON if file format is not supported.
 * @param {Object} json
 * @param {string} format
 */
function jsonToFormat(json, format) {
  return format in FILE_DELIMITERS
    ? papaparse.unparse(
        Object.values(json).map((value) => flat(value, { delimiter: '_' })),
        { delimiter: FILE_DELIMITERS[format] }
      )
    : json;
}

/**
 * @param {string} field
 * @returns {string}
 */
function histogramQueryStrForEachField(field) {
  const [fieldName, ...nestedFieldNames] = field.split('.');
  return nestedFieldNames.length === 0
    ? `${fieldName} {
        histogram {
          key
          count
        }
      }`
    : `${fieldName} {
        ${histogramQueryStrForEachField(nestedFieldNames.join('.'))}
      }`;
}

/**
 * @param {object} opt
 * @param {string} opt.path
 * @param {string} opt.type
 * @param {string[]} opt.fields
 * @param {object} [opt.gqlFilter]
 * @param {AbortSignal} [opt.signal]
 */
function queryGuppyForAggs({ path, type, fields, gqlFilter, signal }) {
  const query = (gqlFilter !== undefined
    ? `query ($filter: JSON) {
        _aggregation {
          ${type} (filter: $filter, filterSelf: false, accessibility: all) {
            ${fields.map((field) => histogramQueryStrForEachField(field))}
          }
          accessible: ${type} (filter: $filter, accessibility: accessible) {
            _totalCount
          }
          all: ${type} (filter: $filter, accessibility: all) {
            _totalCount
          }
        }
      }`
    : `query {
        _aggregation {
          ${type} (accessibility: all) {
            ${fields.map((field) => histogramQueryStrForEachField(field))}
          }
          accessible: ${type} (accessibility: accessible) {
            _totalCount
          }
          all: ${type} (accessibility: all) {
            _totalCount
          }
        }
      }`
  ).replace(/\s+/g, ' ');

  return fetch(`${path}${graphqlEndpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables: { filter: gqlFilter } }),
    signal,
  }).then((response) => response.json());
}

/** @param {string} path */
function queryGuppyForStatus(path) {
  return fetch(`${path}${statusEndpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json());
}

/**
 * @param {string} mainField
 * @param {boolean} numericAggAsText
 */
function nestedHistogramQueryStrForEachField(mainField, numericAggAsText) {
  return `${mainField} {
    ${numericAggAsText ? 'asTextHistogram' : 'histogram'} {
      key
      count
      missingFields {
        field
        count
      }
      termsFields {
        field
        terms {
          key
          count
        }
      }
    }
  }`;
}

/**
 * @param {object} opt
 * @param {string} opt.path
 * @param {string} opt.type
 * @param {string} opt.mainField
 * @param {boolean} [opt.numericAggAsText]
 * @param {string[]} [opt.termsFields]
 * @param {string[]} [opt.missingFields]
 * @param {object} [opt.gqlFilter]
 * @param {AbortSignal} [opt.signal]
 */
function queryGuppyForSubAgg({
  path,
  type,
  mainField,
  numericAggAsText = false,
  termsFields,
  missingFields,
  gqlFilter,
  signal,
}) {
  const query = (gqlFilter !== undefined
    ? `query ($filter: JSON, $nestedAggFields: JSON) {
        _aggregation {
            ${type} (filter: $filter, filterSelf: false, nestedAggFields: $nestedAggFields, accessibility: all) {
              ${nestedHistogramQueryStrForEachField(
                mainField,
                numericAggAsText
              )}
            }
          }
        }`
    : `query ($nestedAggFields: JSON) {
        _aggregation {
          ${type} (nestedAggFields: $nestedAggFields, accessibility: all) {
            ${nestedHistogramQueryStrForEachField(mainField, numericAggAsText)}
          }
        }
      }`
  ).replace(/\s+/g, ' ');

  return fetch(`${path}${graphqlEndpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: {
        filter: gqlFilter,
        nestedAggFields: { termsFields, missingFields },
      },
    }),
    signal,
  })
    .then((response) => response.json())
    .catch((err) => {
      throw new Error(`Error during queryGuppyForSubAgg ${err}`);
    });
}

const rawDataQueryStrForEachField = (field) => {
  const splittedFieldArray = field.split('.');
  const splittedField = splittedFieldArray.shift();
  if (splittedFieldArray.length === 0) {
    return `
    ${splittedField}
    `;
  }
  return `
  ${splittedField} {
    ${rawDataQueryStrForEachField(splittedFieldArray.join('.'))}
  }`;
};

/**
 * @param {object} opt
 * @param {string} opt.path
 * @param {string} opt.type
 * @param {string[]} opt.fields
 * @param {object} [opt.gqlFilter]
 * @param {*} [opt.sort]
 * @param {number} [opt.offset]
 * @param {number} [opt.size]
 * @param {AbortSignal} [opt.signal]
 * @param {string} [opt.format]
 * @param {boolean} [opt.withTotalCount]
 */
export function queryGuppyForRawData({
  path,
  type,
  fields,
  gqlFilter,
  sort,
  offset = 0,
  size = 20,
  signal,
  format,
  withTotalCount = false,
}) {
  const queryArgument = [
    sort ? '$sort: JSON' : '',
    gqlFilter ? '$filter: JSON' : '',
    format ? '$format: Format' : '',
  ]
    .filter((e) => e)
    .join(', ');
  const queryLine = queryArgument ? `query (${queryArgument})` : 'query';

  const dataTypeArgument = [
    'accessibility: accessible',
    `offset: ${offset}`,
    `first: ${size}`,
    format && 'format: $format',
    sort && 'sort: $sort',
    gqlFilter && 'filter: $filter',
  ]
    .filter((e) => e)
    .join(', ');
  const dataTypeLine = `${type} (${dataTypeArgument})`;

  const aggregationArgument = [
    'accessibility: accessible',
    gqlFilter ? 'filter: $filter' : '',
  ]
    .filter((e) => e)
    .join(', ');
  const aggregationFragment = withTotalCount
    ? `_aggregation {
      ${type} (${aggregationArgument}) {
        _totalCount
      }
    }`
    : '';

  const processedFields = fields.map((field) =>
    rawDataQueryStrForEachField(field)
  );
  const query = `${queryLine} {
    ${dataTypeLine} {
      ${processedFields.join('\n')}
    }
    ${aggregationFragment}
  }`.replace(/\s+/g, ' ');

  return fetch(`${path}${graphqlEndpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: {
        format,
        filter: gqlFilter,
        sort,
      },
    }),
    signal,
  })
    .then((response) => response.json())
    .catch((err) => {
      throw new Error(`Error during queryGuppyForRawData ${err}`);
    });
}

/**
 * Convert filter obj into GQL filter format
 * @param {object | undefined} filter
 */
export function getGQLFilter(filter) {
  if (filter === undefined || Object.keys(filter).length === 0) return;

  const facetsList = [];
  for (const [field, filterValues] of Object.entries(filter)) {
    const fieldSplitted = field.split('.');
    const fieldName = fieldSplitted[fieldSplitted.length - 1];
    const isRangeFilter =
      typeof filterValues.lowerBound !== 'undefined' &&
      typeof filterValues.upperBound !== 'undefined';
    const hasSelectedValues = filterValues?.selectedValues?.length > 0;

    if (!isRangeFilter && !hasSelectedValues)
      if (filterValues.__combineMode)
        // This filter only has a combine setting so far. We can ignore it.
        return;
      else throw new Error(`Invalid filter object ${filterValues}`);

    /** @type {{ AND?: any[]; IN?: { [x: string]: string[] }}} */
    const facetsPiece = {};
    if (isRangeFilter)
      facetsPiece.AND = [
        { '>=': { [fieldName]: filterValues.lowerBound } },
        { '<=': { [fieldName]: filterValues.upperBound } },
      ];
    else if (hasSelectedValues)
      filterValues.__combineMode === 'AND'
        ? (facetsPiece.AND = filterValues.selectedValues.map(
            (selectedValue) => ({ IN: { [fieldName]: [selectedValue] } })
          ))
        : // combine mode defaults to OR when not set.
          (facetsPiece.IN = { [fieldName]: filterValues.selectedValues });

    facetsList.push(
      fieldSplitted.length === 1
        ? facetsPiece
        : // nested field
          {
            nested: {
              path: fieldSplitted.slice(0, -1).join('.'), // parent path
              ...facetsPiece,
            },
          }
    );
  }

  return { AND: facetsList };
}

/** @param {string} path */
export function askGuppyAboutArrayTypes(path) {
  return queryGuppyForStatus(path).then((res) => res.indices);
}

/**
 * @param {object} opt
 * @param {string} opt.path
 * @param {string} opt.type
 * @param {string[]} opt.fields
 * @param {object} opt.filter
 * @param {AbortSignal} [opt.signal]
 */
export function askGuppyForAggregationData({ filter, ...opt }) {
  return queryGuppyForAggs({ ...opt, gqlFilter: getGQLFilter(filter) });
}

/**
 * @param {object} opt
 * @param {string} opt.path
 * @param {string} opt.type
 * @param {string} opt.mainField
 * @param {boolean} [opt.numericAggAsText]
 * @param {string[]} [opt.termsNestedFields]
 * @param {string[]} [opt.missedNestedFields]
 * @param {object} [opt.filter]
 * @param {AbortSignal} [opt.signal]
 */
export function askGuppyForSubAggregationData({
  termsNestedFields,
  missedNestedFields,
  filter,
  ...opt
}) {
  return queryGuppyForSubAgg({
    ...opt,
    termsFields: termsNestedFields,
    missingFields: missedNestedFields,
    gqlFilter: getGQLFilter(filter),
  });
}

/**
 * @param {object} opt
 * @param {string} opt.path
 * @param {string} opt.type
 * @param {string[]} opt.fields
 * @param {object} [opt.filter]
 * @param {*} [opt.sort]
 * @param {number} [opt.offset]
 * @param {number} [opt.size]
 * @param {AbortSignal} [opt.signal]
 * @param {string} [opt.format]
 * @param {boolean} [opt.withTotalCount]
 */
export function askGuppyForRawData({ filter, ...opt }) {
  return queryGuppyForRawData({
    ...opt,
    gqlFilter: getGQLFilter(filter),
  });
}

/** @param {object} filterTabConfigs */
export function getAllFieldsFromFilterConfigs(filterTabConfigs) {
  return filterTabConfigs.flatMap(({ fields }) => fields);
}

/**
 * Download all data from guppy using fields, filter, and sort args.
 * If total count is less than 10000 this will use normal graphql endpoint
 * If greater than 10000, use /download endpoint
 * @param {object} opt
 * @param {string} opt.path
 * @param {string} opt.type
 * @param {number} opt.size
 * @param {string[]} [opt.fields]
 * @param {object} [opt.filter]
 * @param {*} [opt.sort]
 * @param {string} [opt.format]
 */
export function downloadDataFromGuppy({
  path,
  type,
  size,
  fields,
  filter,
  sort,
  format,
}) {
  const SCROLL_SIZE = 10000;
  const JSON_FORMAT = format === 'json' || format === undefined;
  return size > SCROLL_SIZE
    ? fetch(`${path}${downloadEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessibility: 'accessible',
          filter: getGQLFilter(filter),
          type,
          fields,
          sort,
        }),
      }).then((res) =>
        JSON_FORMAT ? res.json() : jsonToFormat(res.json(), format)
      )
    : askGuppyForRawData({
        path,
        type,
        fields,
        filter,
        sort,
        size,
        format,
      }).then((res) => {
        if (res?.data?.[type])
          return JSON_FORMAT
            ? res.data[type]
            : jsonToFormat(res.data[type], format);

        throw Error('Error downloading data from Guppy');
      });
}

/**
 * @param {object} opt
 * @param {string} opt.path
 * @param {string} opt.type
 * @param {object} [opt.filter]
 */
export function askGuppyForTotalCounts({ path, type, filter }) {
  const query = (filter !== undefined || Object.keys(filter).length > 0
    ? `query ($filter: JSON) {
        _aggregation {
          ${type} (filter: $filter, accessibility: all) {
            _totalCount
          }
        }
      }`
    : `query {
        _aggregation {
          ${type} (accessibility: all) {
            _totalCount
          }
        }
      }`
  ).replace(/\s+/g, ' ');

  return fetch(`${path}${graphqlEndpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { filter: getGQLFilter(filter) },
    }),
  })
    .then((response) => response.json())
    .then((response) => response.data._aggregation[type]._totalCount)
    .catch((err) => {
      throw new Error(`Error during download ${err}`);
    });
}

/**
 * @param {object} opt
 * @param {string} opt.path
 * @param {string} opt.type
 */
export function getAllFieldsFromGuppy({ path, type }) {
  return fetch(`${path}${graphqlEndpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `{
        _mapping {
          ${type}
        }
      }`.replace(/\s+/g, ' '),
    }),
  })
    .then((response) => response.json())
    .then((response) => response.data._mapping[type])
    .catch((err) => {
      throw new Error(`Error when getting fields from guppy: ${err}`);
    });
}
