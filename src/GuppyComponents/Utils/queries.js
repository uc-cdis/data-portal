import fetch from 'isomorphic-fetch';
import { jsonToFormat } from './conversion';

const graphqlEndpoint = '/graphql';
const downloadEndpoint = '/download';
const statusEndpoint = '/_status';

const histogramQueryStrForEachField = (field) => {
  const splittedFieldArray = field.split('.');
  const splittedField = splittedFieldArray.shift();
  if (splittedFieldArray.length === 0) {
    return (`
    ${splittedField} {
      histogram {
        key
        count
      }
    }`);
  }
  return (`
  ${splittedField} {
    ${histogramQueryStrForEachField(splittedFieldArray.join('.'))}
  }`);
};

const queryGuppyForAggs = (path, type, fields, gqlFilter, signal) => {
  const query = `query {
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
  }`;
  const queryBody = { query };
  if (gqlFilter) {
    const queryWithFilter = `query ($filter: JSON) {
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
    }`;
    queryBody.variables = { filter: gqlFilter };
    queryBody.query = queryWithFilter;
  }
  return fetch(`${path}${graphqlEndpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(queryBody),
    signal,
  }).then((response) => response.json());
};

const queryGuppyForStatus = (path) => fetch(`${path}${statusEndpoint}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
}).then((response) => response.json());

const nestedHistogramQueryStrForEachField = (mainField, numericAggAsText) => (`
  ${mainField} {
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
  }`);

const queryGuppyForSubAgg = (
  path,
  type,
  mainField,
  numericAggAsText = false,
  termsFields,
  missingFields,
  gqlFilter,
  signal,
) => {
  const nestedAggFields = {};
  if (termsFields) {
    nestedAggFields.termsFields = termsFields;
  }
  if (missingFields) {
    nestedAggFields.missingFields = missingFields;
  }

  const query = `query ($nestedAggFields: JSON) {
    _aggregation {
      ${type} (nestedAggFields: $nestedAggFields, accessibility: all) {
        ${nestedHistogramQueryStrForEachField(mainField, numericAggAsText)}
      }
    }
  }`;
  const queryBody = { query };
  queryBody.variables = { nestedAggFields };
  if (gqlFilter) {
    const queryWithFilter = `query ($filter: JSON, $nestedAggFields: JSON) {
      _aggregation {
        ${type} (filter: $filter, filterSelf: false, nestedAggFields: $nestedAggFields, accessibility: all) {
          ${nestedHistogramQueryStrForEachField(mainField, numericAggAsText)}
        }
      }
    }`;
    queryBody.variables = { filter: gqlFilter, nestedAggFields };
    queryBody.query = queryWithFilter;
  }
  return fetch(`${path}${graphqlEndpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(queryBody),
    signal,
  }).then((response) => response.json())
    .catch((err) => {
      throw new Error(`Error during queryGuppyForSubAgg ${err}`);
    });
};

const rawDataQueryStrForEachField = (field) => {
  const splittedFieldArray = field.split('.');
  const splittedField = splittedFieldArray.shift();
  if (splittedFieldArray.length === 0) {
    return (`
    ${splittedField}
    `);
  }
  return (`
  ${splittedField} {
    ${rawDataQueryStrForEachField(splittedFieldArray.join('.'))}
  }`);
};

export const queryGuppyForRawData = (
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
) => {
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

  const processedFields = fields.map((field) => rawDataQueryStrForEachField(field));
  const query = `${queryLine} {
    ${dataTypeLine} {
      ${processedFields.join('\n')}
    }
    ${aggregationFragment}
  }`;

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
  }).then((response) => response.json())
    .catch((err) => {
      throw new Error(`Error during queryGuppyForRawData ${err}`);
    });
};

export const getGQLFilter = (filterObj) => {
  const facetsList = [];
  Object.keys(filterObj).forEach((field) => {
    const filterValues = filterObj[field];
    const fieldSplitted = field.split('.');
    const fieldName = fieldSplitted[fieldSplitted.length - 1];
    // The combine mode defaults to OR when not set.
    const combineMode = filterValues.__combineMode ? filterValues.__combineMode : 'OR';

    const hasSelectedValues = filterValues.selectedValues && filterValues.selectedValues.length > 0;
    const hasRangeFilter = typeof filterValues.lowerBound !== 'undefined' && typeof filterValues.upperBound !== 'undefined';

    let facetsPiece = {};
    if (hasSelectedValues && combineMode === 'OR') {
      facetsPiece = {
        IN: {
          [fieldName]: filterValues.selectedValues,
        },
      };
    } else if (hasSelectedValues && combineMode === 'AND') {
      facetsPiece = { AND: [] };
      for (let i = 0; i < filterValues.selectedValues.length; i += 1) {
        facetsPiece.AND.push({
          IN: {
            [fieldName]: [filterValues.selectedValues[i]],
          },
        });
      }
    } else if (hasRangeFilter) {
      facetsPiece = {
        AND: [
          { '>=': { [fieldName]: filterValues.lowerBound } },
          { '<=': { [fieldName]: filterValues.upperBound } },
        ],
      };
    } else if (filterValues.__combineMode && !hasSelectedValues && !hasRangeFilter) {
      // This filter only has a combine setting so far. We can ignore it.
      return;
    } else {
      throw new Error(`Invalid filter object ${filterValues}`);
    }
    if (fieldSplitted.length > 1) { // nested field
      fieldSplitted.pop();
      facetsPiece = {
        nested: {
          path: fieldSplitted.join('.'), // parent path
          ...facetsPiece,
        },
      };
    }
    facetsList.push(facetsPiece);
  });
  const gqlFilter = {
    AND: facetsList,
  };
  return gqlFilter;
};

// eslint-disable-next-line max-len
export const askGuppyAboutArrayTypes = (path) => queryGuppyForStatus(path).then((res) => res.indices);

export const askGuppyForAggregationData = (path, type, fields, filter, signal) => {
  const gqlFilter = getGQLFilter(filter);
  return queryGuppyForAggs(path, type, fields, gqlFilter, signal);
};

export const askGuppyForSubAggregationData = ({
  path,
  type,
  mainField,
  numericAggAsText,
  termsNestedFields,
  missedNestedFields,
  filter,
  signal,
}) => {
  const gqlFilter = getGQLFilter(filter);
  return queryGuppyForSubAgg(
    path,
    type,
    mainField,
    numericAggAsText,
    termsNestedFields,
    missedNestedFields,
    gqlFilter,
    signal,
  );
};

export const askGuppyForRawData = (
  path,
  type,
  fields,
  filter,
  sort,
  offset = 0,
  size = 20,
  signal,
  format,
  withTotalCount,
) => {
  const gqlFilter = getGQLFilter(filter);
  return queryGuppyForRawData(
    path,
    type,
    fields,
    gqlFilter,
    sort,
    offset,
    size,
    signal,
    format,
    withTotalCount,
  );
};

export const getAllFieldsFromFilterConfigs = (filterTabConfigs) => filterTabConfigs
  .reduce((acc, cur) => acc.concat(cur.fields), []);

/**
 * Download all data from guppy using fields, filter, and sort args.
 * If total count is less than 10000 this will use normal graphql endpoint
 * If greater than 10000, use /download endpoint
 */
export const downloadDataFromGuppy = (
  path,
  type,
  size,
  {
    fields,
    filter,
    sort,
    format,
  },
) => {
  const SCROLL_SIZE = 10000;
  const JSON_FORMAT = (format === 'json' || format === undefined);
  if (size > SCROLL_SIZE) {
    const queryBody = { type, accessibility: 'accessible' };
    if (fields) queryBody.fields = fields;
    if (filter) queryBody.filter = getGQLFilter(filter);
    if (sort) queryBody.sort = sort;
    return fetch(`${path}${downloadEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(queryBody),
    }).then((res) => (JSON_FORMAT ? res.json() : jsonToFormat(res.json(), format)));
  }
  return askGuppyForRawData(path, type, fields, filter, sort, 0, size, format)
    .then((res) => {
      if (res && res.data && res.data[type]) {
        return JSON_FORMAT ? res.data[type] : jsonToFormat(res.data[type], format);
      }
      throw Error('Error downloading data from Guppy');
    });
};

export const askGuppyForTotalCounts = (path, type, filter) => {
  const gqlFilter = getGQLFilter(filter);
  const queryLine = `query ${gqlFilter ? '($filter: JSON)' : ''}{`;
  const typeAggsLine = `${type} ${gqlFilter ? '(filter: $filter, ' : '('} accessibility: all) {`;
  const query = `${queryLine}
    _aggregation {
      ${typeAggsLine}
        _totalCount
      }
    }
  }`;
  const queryBody = { query };
  queryBody.variables = {};
  if (gqlFilter) queryBody.variables.filter = gqlFilter;

  return fetch(`${path}${graphqlEndpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(queryBody),
  }).then((response) => response.json())
    .then((response) => response.data._aggregation[type]._totalCount)
    .catch((err) => {
      throw new Error(`Error during download ${err}`);
    });
};

export const getAllFieldsFromGuppy = (
  path,
  type,
) => {
  const query = `{
    _mapping {
      ${type}
    }
  }`;
  const queryBody = { query };
  return fetch(`${path}${graphqlEndpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(queryBody),
  }).then((response) => response.json())
    .then((response) => response.data._mapping[type])
    .catch((err) => {
      throw new Error(`Error when getting fields from guppy: ${err}`);
    });
};
