import cloneDeep from 'lodash.clonedeep';
import flat from 'flat';
import papaparse from 'papaparse';
import { FILE_DELIMITERS, FILTER_TYPE, GUPPY_URL } from './const';
import { headers } from '../../localconf';

/** @typedef {import("../types").AnchorConfig} AnchorConfig */
/** @typedef {import("../types").AnchoredFilterState} AnchoredFilterState */
/** @typedef {import("../types").FilterState} FilterState */
/** @typedef {import("../types").GqlFilter} GqlFilter */
/** @typedef {import("../types").GqlInFilter} GqlInFilter */
/** @typedef {import("../types").GqlSimpleFilter} GqlSimpleFilter */
/** @typedef {import("../types").GqlNestedFilter} GqlNestedFilter */
/** @typedef {import("../types").GqlNestedAnchoredFilter} GqlNestedAnchoredFilter */
/** @typedef {import("../types").GqlSort} GqlSort */
/** @typedef {import("../types").EmptyFilter} EmptyFilter */
/** @typedef {import("../types").OptionFilter} OptionFilter */
/** @typedef {import("../types").RangeFilter} RangeFilter */

const graphqlEndpoint = `${GUPPY_URL}/graphql`;
const downloadEndpoint = `${GUPPY_URL}/download`;
const statusEndpoint = `${GUPPY_URL}/_status`;

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
        { delimiter: FILE_DELIMITERS[format] },
      )
    : json;
}

/**
 * @param {string} field
 * @returns {string}
 */
function buildHistogramQueryStrForField(field) {
  const [fieldName, ...nestedFieldNames] = field.split('.');
  return nestedFieldNames.length === 0
    ? `${fieldName} {
        histogram {
          key
          count
        }
      }`
    : `${fieldName} {
        ${buildHistogramQueryStrForField(nestedFieldNames.join('.'))}
      }`;
}

/** @param {GqlFilter} gqlFilter */
function checkFilterSelf(gqlFilter) {
  // No filter
  if (gqlFilter === undefined) return false;

  // AND always sets `filterSelf: false`
  if (!('OR' in gqlFilter)) return false;

  // OR without any filter sets `filterSelf: false`
  if (gqlFilter.OR.length === 0) return false;

  // OR with more than one filter always sets `filterSelf: true`
  if (gqlFilter.OR.length > 1) return true;

  // OR with a single non-nested filter sets `filterSelf: false`
  if (!('nested' in gqlFilter.OR[0])) return false;

  // OR with a single nested filter is complicated due to anchored filter
  if ('OR' in gqlFilter.OR[0].nested) {
    const { nested } = gqlFilter.OR[0];

    // Nested OR sets `filter: true` if with more than one filter
    if (nested.OR.length > 1) return true;

    // Nested OR with anchored filter sets `filter: true`
    // if more than one filter is used with anchor
    if (
      'AND' in nested.OR[0] &&
      nested.OR[0].AND.length === 2 &&
      'OR' in nested.OR[0].AND[1]
    )
      return nested.OR[0].AND[1].OR.length > 1;
  }

  // default to `filterSelf: false`
  return false;
}

/**
 * @param {object} args
 * @param {string} args.type
 * @param {string[]} args.fields
 * @param {GqlFilter} [args.gqlFilter]
 * @param {AbortSignal} [args.signal]
 */
export function queryGuppyForAggregationChartData({
  type,
  fields,
  gqlFilter,
  signal,
}) {
  const query = (
    gqlFilter !== undefined
      ? `query ($filter: JSON) {
        _aggregation {
          ${type} (filter: $filter, accessibility: all) {
            ${fields.map(buildHistogramQueryStrForField).join('\n')}
          }
        }
      }`
      : `query {
        _aggregation {
          ${type} (accessibility: all) {
            ${fields.map(buildHistogramQueryStrForField).join('\n')}
          }
        }
      }`
  ).replace(/\s+/g, ' ');

  return fetch(graphqlEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify({ query, variables: { filter: gqlFilter } }),
    signal,
  }).then((response) => response.json());
}

/**
 * @param {object} args
 * @param {string} args.type
 * @param {GqlFilter} [args.gqlFilter]
 * @param {AbortSignal} [args.signal]
 */
export function queryGuppyForAggregationCountData({ type, gqlFilter, signal }) {
  const query = (
    gqlFilter !== undefined
      ? `query ($filter: JSON) {
        _aggregation {
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
          accessible: ${type} (accessibility: accessible) {
            _totalCount
          }
          all: ${type} (accessibility: all) {
            _totalCount
          }
        }
      }`
  ).replace(/\s+/g, ' ');

  return fetch(graphqlEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify({ query, variables: { filter: gqlFilter } }),
    signal,
  }).then((response) => response.json());
}

/**
 * @param {Object} args
 * @param {AnchorConfig} [args.anchorConfig]
 * @param {string} [args.anchorValue]
 * @param {{ title: string; fields: string[] }[]} args.filterTabs
 * @param {GqlFilter} [args.gqlFilter]
 */
export function getQueryInfoForAggregationOptionsData({
  anchorConfig,
  anchorValue = '',
  filterTabs,
  gqlFilter,
}) {
  const isUsingAnchor = anchorConfig !== undefined && anchorValue !== '';
  const anchorFilterPiece = isUsingAnchor
    ? { IN: { [anchorConfig.field]: [anchorValue] } }
    : undefined;

  /** @type {{ [group: string]: string[]; }} */
  const fieldsByGroup = {};
  /** @type {{ [group: string]: GqlFilter; }} */
  const gqlFilterByGroup = {};

  for (const { title, fields } of filterTabs)
    if (isUsingAnchor && anchorConfig.tabs.includes(title)) {
      for (const field of fields) {
        const [path, fieldName] = field.split('.');

        if (fieldName === undefined)
          fieldsByGroup.main = [...(fieldsByGroup?.main ?? []), field];
        else {
          fieldsByGroup[path] = [...(fieldsByGroup?.[path] ?? []), field];

          // add gqlFilterGroup for each nested field object path
          if (!(path in gqlFilterByGroup)) {
            const combineMode = gqlFilter ? Object.keys(gqlFilter)[0] : 'AND';
            const groupGqlFilter = cloneDeep(
              gqlFilter ?? { [combineMode]: [] },
            );

            if (anchorValue !== '' && 'AND' in groupGqlFilter) {
              const filters = /** @type {GqlFilter[]} */ (
                groupGqlFilter[combineMode]
              );
              const found = /** @type {GqlNestedAnchoredFilter} */ (
                filters.find((f) => 'nested' in f && f.nested.path === path)
              );
              if (found === undefined) {
                filters.push(
                  /** @type {GqlNestedAnchoredFilter} */ ({
                    nested: { path, AND: [anchorFilterPiece] },
                  }),
                );
              } else if (Array.isArray(found.nested.AND)) {
                found.nested.AND.push(anchorFilterPiece);
              }
            }
            gqlFilterByGroup[`filter_${path}`] = groupGqlFilter;
          }
        }
      }
    } else {
      fieldsByGroup.main = [...(fieldsByGroup?.main ?? []), ...fields];
    }

  if (fieldsByGroup.main?.length > 0) gqlFilterByGroup.filter_main = gqlFilter;

  return {
    fieldsByGroup,
    gqlFilterByGroup,
  };
}

/**
 * @param {object} args
 * @param {boolean} [args.filterSelf]
 * @param {{ [group: string]: string[]}} args.fieldsByGroup
 * @param {boolean} [args.isFilterEmpty]
 * @param {boolean} [args.isInitialQuery]
 * @param {string} args.type
 */
export function buildQueryForAggregationOptionsData({
  filterSelf = false,
  fieldsByGroup,
  isFilterEmpty,
  isInitialQuery = false,
  type,
}) {
  const queryVariables = [];
  for (const group of Object.keys(fieldsByGroup))
    if (!(isFilterEmpty && group === 'main'))
      queryVariables.push(`$filter_${group}: JSON`);

  const { main, ...fieldsByAnchoredGroup } = fieldsByGroup;
  const hasMainFields = main !== undefined;
  const mainHistogramQueryFragment = hasMainFields
    ? main.map(buildHistogramQueryStrForField).join('\n')
    : '';
  const mainQueryFragment = hasMainFields
    ? `main: ${type} ${
        isFilterEmpty
          ? '(accessibility: all)'
          : `(filter: $filter_main, filterSelf: ${filterSelf}, accessibility: all)`
      } {
      ${mainHistogramQueryFragment}
    }`
    : '';

  const unfilteredQueryFragment =
    hasMainFields && isInitialQuery && !isFilterEmpty
      ? `unfiltered: ${type} (accessibility: all) {
        ${mainHistogramQueryFragment}
      }`
      : '';

  const anchoredPathQueryFragments = [];
  for (const [group, fields] of Object.entries(fieldsByAnchoredGroup))
    anchoredPathQueryFragments.push(`
      anchored_${group}: ${type} (filter: $filter_${group}, filterSelf: ${filterSelf}, accessibility: all) {
        ${fields.map(buildHistogramQueryStrForField).join('\n')}
      }
    `);

  return `query ${
    queryVariables.length > 0 ? `(${queryVariables.join(', ')})` : ''
  } {
    _aggregation {
      ${mainQueryFragment}
      ${unfilteredQueryFragment}
      ${anchoredPathQueryFragments.join('\n')}
    }
  }`.replace(/\s+/g, ' ');
}

/**
 * @param {object} args
 * @param {AnchorConfig} [args.anchorConfig]
 * @param {string} args.anchorValue
 * @param {{ title: string, fields: string[]}[]} args.filterTabs
 * @param {GqlFilter} [args.gqlFilter]
 * @param {boolean} [args.isInitialQuery]
 * @param {AbortSignal} [args.signal]
 * @param {string} args.type
 */
export function queryGuppyForAggregationOptionsData({
  anchorConfig,
  anchorValue,
  filterTabs,
  gqlFilter,
  isInitialQuery,
  signal,
  type,
}) {
  const { fieldsByGroup, gqlFilterByGroup } =
    getQueryInfoForAggregationOptionsData({
      anchorConfig,
      anchorValue,
      filterTabs,
      gqlFilter,
    });

  const isFilterEmpty = gqlFilter === undefined;
  const filterSelf = checkFilterSelf(gqlFilter);
  const query = buildQueryForAggregationOptionsData({
    filterSelf,
    fieldsByGroup,
    isFilterEmpty,
    isInitialQuery,
    type,
  });
  const variables = { ...gqlFilterByGroup };

  return fetch(graphqlEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify({ query, variables }),
    signal,
  }).then((response) => response.json());
}

export function queryGuppyForStatus() {
  return fetch(statusEndpoint, {
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
 * @param {object} args
 * @param {string} args.type
 * @param {string} args.mainField
 * @param {boolean} [args.numericAggAsText]
 * @param {string[]} [args.termsFields]
 * @param {string[]} [args.missingFields]
 * @param {GqlFilter} [args.gqlFilter]
 * @param {AbortSignal} [args.signal]
 */
export function queryGuppyForSubAggregationData({
  type,
  mainField,
  numericAggAsText = false,
  termsFields,
  missingFields,
  gqlFilter,
  signal,
}) {
  const query = (
    gqlFilter !== undefined
      ? `query ($filter: JSON, $nestedAggFields: JSON) {
        _aggregation {
            ${type} (filter: $filter, filterSelf: ${checkFilterSelf(
              gqlFilter,
            )}, nestedAggFields: $nestedAggFields, accessibility: all) {
              ${nestedHistogramQueryStrForEachField(
                mainField,
                numericAggAsText,
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

  return fetch(graphqlEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
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
      throw new Error(`Error during queryGuppyForSubAggregationData ${err}`);
    });
}

/**
 * @param {string} field
 * @returns {string}
 */
function rawDataQueryStrForEachField(field) {
  const [fieldName, ...nestedFieldNames] = field.split('.');
  return nestedFieldNames.length === 0
    ? `${fieldName}`
    : `${fieldName} {
      ${rawDataQueryStrForEachField(nestedFieldNames.join('.'))}
    }`;
}

/**
 * @param {object} args
 * @param {string} args.type
 * @param {string[]} args.fields
 * @param {GqlFilter} [args.gqlFilter]
 * @param {GqlSort} [args.sort]
 * @param {number} [args.offset]
 * @param {number} [args.size]
 * @param {AbortSignal} [args.signal]
 * @param {string} [args.format]
 * @param {boolean} [args.withTotalCount]
 */
export function queryGuppyForRawData({
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

  const query = `${queryLine} {
    ${dataTypeLine} {
      ${fields.map(rawDataQueryStrForEachField).join('\n')}
    }
    ${aggregationFragment}
  }`.replace(/\s+/g, ' ');

  return fetch(graphqlEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
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
 * @param {string} fieldName
 * @param {EmptyFilter | OptionFilter | RangeFilter} filterValues
 * @returns {GqlSimpleFilter}
 */
function parseSimpleFilter(fieldName, filterValues) {
  const invalidFilterError = new Error(
    `Invalid filter object for "${fieldName}": ${JSON.stringify(filterValues)}`,
  );
  if (filterValues === undefined) throw invalidFilterError;

  // a range-type filter
  if (filterValues.__type === FILTER_TYPE.RANGE) {
    const { lowerBound, upperBound } = filterValues;
    if (typeof lowerBound === 'number' && typeof upperBound === 'number')
      return {
        AND: [
          { GTE: { [fieldName]: lowerBound } },
          { LTE: { [fieldName]: upperBound } },
        ],
      };
  }

  // an option-type filter
  if (filterValues.__type === FILTER_TYPE.OPTION) {
    const { selectedValues, __combineMode, isExclusion } = filterValues;
    const hasSelectedValues = selectedValues?.length > 0;

    if (!hasSelectedValues && isExclusion) {
      // do nothing when only selecting NOT but no other values
      return undefined;
    }

    if (hasSelectedValues) {
      if (isExclusion) {
        return {
          AND: selectedValues.map((selectedValue) => ({
            '!=': { [fieldName]: selectedValue },
          })),
        };
      }
      return __combineMode === 'AND'
        ? {
            AND: selectedValues.map((selectedValue) => ({
              IN: { [fieldName]: [selectedValue] },
            })),
          }
        : { IN: { [fieldName]: selectedValues } };
    }
    if (__combineMode !== undefined) {
      // with a combine setting only - ignore it.
      return undefined;
    }
  }

  throw invalidFilterError;
}

/**
 * @param {string} anchorName Formatted as "[anchorFieldName]:[anchorValue]"
 * @param {AnchoredFilterState} anchoredFilterState
 * @param {"AND" | "OR"} combineMode
 * @returns {GqlNestedAnchoredFilter[]}
 */
function parseAnchoredFilters(anchorName, anchoredFilterState, combineMode) {
  const filterState = anchoredFilterState;
  if (filterState === undefined || Object.keys(filterState).length === 0)
    return undefined;

  const [anchorFieldName, anchorValue] = anchorName.split(':');
  const anchorFilter = { IN: { [anchorFieldName]: [anchorValue] } };

  /** @type {GqlNestedAnchoredFilter[]} */
  const nestedFilters = [];
  /** @type {{ [path: string]: number }} */
  const nestedFilterIndices = {};
  let nestedFilterIndex = 0;

  for (const [filterKey, filterValues] of Object.entries(filterState.value)) {
    const [path, fieldName] = filterKey.split('.');

    const simpleFilter = parseSimpleFilter(fieldName, filterValues);

    if (simpleFilter !== undefined) {
      if (!(path in nestedFilterIndices)) {
        nestedFilterIndices[path] = nestedFilterIndex;
        nestedFilters.push(
          /** @type {GqlNestedAnchoredFilter} */ ({
            nested: { path, AND: [anchorFilter, { [combineMode]: [] }] },
          }),
        );
        nestedFilterIndex += 1;
      }

      nestedFilters[nestedFilterIndices[path]].nested.AND[1][combineMode].push(
        simpleFilter,
      );
    }
  }

  return nestedFilters;
}

/**
 * Convert filter obj into GQL filter format
 * @param {EmptyFilter | FilterState} filterState
 * @returns {GqlFilter}
 */
export function getGQLFilter(filterState) {
  if (
    filterState === undefined ||
    !('value' in filterState) ||
    Object.keys(filterState.value).length === 0
  )
    return undefined;

  const combineMode = filterState.__combineMode ?? 'AND';
  if (filterState.__type === FILTER_TYPE.COMPOSED)
    return { [combineMode]: filterState.value.map(getGQLFilter) };

  /** @type {GqlSimpleFilter[]} */
  const simpleFilters = [];

  /** @type {GqlNestedFilter[]} */
  const nestedFilters = [];
  /** @type {{ [path: string]: number }} */
  const nestedFilterIndices = {};
  let nestedFilterIndex = 0;

  for (const [filterKey, filterValues] of Object.entries(filterState.value)) {
    const [fieldStr, nestedFieldStr] = filterKey.split('.');
    const isNestedField = nestedFieldStr !== undefined;
    const fieldName = isNestedField ? nestedFieldStr : fieldStr;

    if (filterValues.__type === FILTER_TYPE.ANCHORED) {
      const parsedAnchoredFilters = parseAnchoredFilters(
        fieldName,
        filterValues,
        combineMode,
      );
      for (const { nested } of parsedAnchoredFilters) {
        if (!(nested.path in nestedFilterIndices)) {
          nestedFilterIndices[nested.path] = nestedFilterIndex;
          nestedFilters.push(
            /** @type {GqlNestedFilter} */ ({
              nested: { path: nested.path, [combineMode]: [] },
            }),
          );
          nestedFilterIndex += 1;
        }

        nestedFilters[nestedFilterIndices[nested.path]].nested[
          combineMode
        ].push({ AND: nested.AND });
      }
    } else {
      const simpleFilter = parseSimpleFilter(fieldName, filterValues);

      if (simpleFilter !== undefined) {
        if (isNestedField) {
          const path = fieldStr; // parent path

          if (!(path in nestedFilterIndices)) {
            nestedFilterIndices[path] = nestedFilterIndex;
            nestedFilters.push(
              /** @type {GqlNestedFilter} */ ({
                nested: { path, [combineMode]: [] },
              }),
            );
            nestedFilterIndex += 1;
          }

          nestedFilters[nestedFilterIndices[path]].nested[combineMode].push(
            simpleFilter,
          );
        } else {
          simpleFilters.push(simpleFilter);
        }
      }
    }
  }

  return { [combineMode]: [...simpleFilters, ...nestedFilters] };
}

/**
 * Download all data from guppy using fields, filter, and sort args.
 * @param {object} args
 * @param {string} args.type
 * @param {string[]} [args.fields]
 * @param {GqlFilter} [args.gqlFilter]
 * @param {GqlSort} [args.sort]
 * @param {string} [args.format]
 */
export function downloadDataFromGuppy({
  type,
  fields,
  gqlFilter,
  sort,
  format,
}) {
  const JSON_FORMAT = format === 'json' || format === undefined;
  return fetch(downloadEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accessibility: 'accessible',
      filter: gqlFilter,
      type,
      fields,
      sort,
    }),
  }).then((res) =>
    JSON_FORMAT ? res.json() : jsonToFormat(res.json(), format),
  );
}

/**
 * @param {object} args
 * @param {string} args.type
 * @param {FilterState} [args.filter]
 */
export function queryGuppyForTotalCounts({ type, filter }) {
  const hasFilter =
    filter !== undefined ||
    (filter.__type === FILTER_TYPE.COMPOSED
      ? filter.value.length > 0
      : Object.keys(filter.value ?? {}).length > 0);
  const query = (
    hasFilter
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

  return fetch(graphqlEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
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
 * @param {object} args
 * @param {string} args.type
 */
export function getAllFieldsFromGuppy({ type }) {
  return fetch(graphqlEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
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
