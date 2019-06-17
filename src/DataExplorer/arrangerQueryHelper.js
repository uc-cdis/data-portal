import { hasKeyChain } from './utils';

const LIMIT_COUNT = 10000;
const getEndpoint = projectId => `/${projectId}/graphql`;

/**
 * Parse data object from elasticsearch result
 * @param {Object} responseData - The response data object
 * @param {string} indexType - the index type name for query
 * @returns {Object[]} list of matched results
 */
const parseDataFromResponseContent = (
  responseData,
  indexType,
) => {
  const MSG_PARSE_DATA_FAIL = 'Error while parsing reponse data';
  if (!hasKeyChain(responseData, `data.${indexType}.hits.edges`)) {
    throw MSG_PARSE_DATA_FAIL;
  }
  return responseData.data[indexType].hits.edges.map(item => item.node);
};

/**
 * Parse count number from elasticsearch result
 * @param {Object} responseData - The response data object
 * @param {string} indexType - the index type name for query
 * @returns {number} the count number
 */
const parseCountFromResponseContent = (
  responseData,
  indexType,
) => {
  const MSG_PARSE_COUNT_FAIL = 'Error while parsing reponse data';
  if (!hasKeyChain(responseData, `data.${indexType}.hits.total`)) {
    throw MSG_PARSE_COUNT_FAIL;
  }
  return responseData.data[indexType].hits.total;
};

/**
 * Constructs graphql string for arranger to get data.
 * @param {string} indexType - type name of index for query
 * @param {Object} sqonObj - a sqon object for filtering
 * @param {stirng[]} nodeList - list of fields for respone
 * @param {boolean} isGettingCount - if set true, only get count of total hits;
 *      if set false, need to provide actual `count` for next argument
 * @param {number} [count] - count of hits for response. Required if `isGettingCount` if false
 * @returns {object} graphql query object
 */
export const constructGraphQLQueryWithSQON = (
  indexType,
  sqonObj,
  nodeList,
  isGettingCount,
  count,
) => {
  const getContentQuery = `edges {
                          node {
                            ${nodeList.join('\n                            ')}
                          }
                        }`;
  const gqlQuery = {
    query: `query ($first: Int, $sqon: JSON){
                ${indexType} {
                  hits (first: $first, filters: $sqon) {
                    ${isGettingCount ? 'total' : getContentQuery}
                  }
                }
              }`,
    variables: {
      sqon: sqonObj,
      first: isGettingCount ? 0 : Math.min(count, LIMIT_COUNT),
    },
  };
  return gqlQuery;
};

/**
 * Constructs graphql aggregation string for arranger to get data.
 * @param {string} indexType - type name of index for query
 * @param {string} key - key name to get aggregation
 * @returns {object} graphql query object
 */
export const constructAggregationQuery = (
  indexType,
  key,
) => {
  const gqlQuery = {
    query: `query {
                ${indexType} {
                  aggregations {
                    ${key} {
                      buckets {
                        doc_count
                        key
                      }
                    }
                  }
                }
              }`,
  };
  return gqlQuery;
};

/**
 * Query arranger for aggregation by aggregation key
 * @param {function} apiFunc - function created by arranger for fetching data
 * @param {stirng} projectId - arranger project ID
 * @param {string} indexType - index type for query
 * @param {string} key - key name to get aggregation
 * @returns {Object[]} List of objects, each has the same keys as in "fields"
 */
export const queryAggregations = async (
  apiFunc,
  projectId,
  indexType,
  key,
) => {
  const MSG_QUERY_BY_AGG_FAIL = 'Error while querying Arranger aggregation';
  const responseData = await apiFunc({
    endpoint: getEndpoint(projectId),
    body: constructAggregationQuery(
      indexType,
      key,
    ),
  });
  if (!responseData) {
    throw MSG_QUERY_BY_AGG_FAIL;
  }
  return responseData.data[indexType].aggregations[key].buckets;
};

/**
 * Constructs graphql string for arranger to get data.
 * @param {Object[]} filters - a list of {name, values}
 * @param {string} indexType - type name of index for query
 * @param {string[]} nodeList - list of node for respone
 * @param {boolean} isGettingCount - if set true, only get count of total hits;
 *      if set false, need to provide actual `count` for next argument
 * @param {number} [count] - count of hits for response. Required if `isGettingCount` if false
 * @returns {object} graphql query object
 */
export const constructGraphQLQuery = (
  filters,
  indexType,
  nodeList,
  isGettingCount,
  count,
) => {
  const sqonObj = {
    op: 'and',
    content: filters.map(filter => ({
      op: 'in',
      content: {
        field: filter.name,
        value: [...filter.values],
      },
    })),
  };
  return constructGraphQLQueryWithSQON(indexType, sqonObj, nodeList, isGettingCount, count);
};

/**
 * Get list of column id in arranger table
 * @param {function} apiFunc - function created by arranger for fetching data
 * @param {stirng} projectId - arranger project ID
 * @param {string} indexType - index type for query
 * @returns {string[]} list of column id strings
 */
export const getArrangerTableColumns = async (apiFunc, projectId, indexType) => {
  const MSG_GET_COLUMN_FAIL = 'Get Arranger table columns fail';
  const body = {
    query: `query columnsStateQuery
            {
              ${indexType} {
                columnsState {
                  state {
                    type
                    keyField
                    defaultSorted {
                      id
                      desc
                    }
                    columns {
                      field
                      show
                    }
                  }
                }
              }
            }`,
  };
  const response = await apiFunc({
    endpoint: getEndpoint(projectId),
    body,
  });
  if (!hasKeyChain(response, `data.${indexType}.columnsState.state.columns`)) {
    throw MSG_GET_COLUMN_FAIL;
  }
  const columns = response.data[indexType].columnsState.state.columns
    .filter(col => col.show)
    .map(col => col.field);
  return columns;
};

/**
 * Query arranger for data by a list of IDs
 * @param {function} apiFunc - function created by arranger for fetching data
 * @param {stirng} projectId - arranger project ID
 * @param {string} graphqlIdField - index type for query
 * @param {string[]} idList - list of ids for query
 * @param {string} indexType - type of index for query
 * @param {string[]} fields - list of target fields for response
 * @returns {Object[]} List of objects, each has the same keys as in "fields"
 */
export const queryDataByIds = async (
  apiFunc,
  projectId,
  graphqlIdField,
  idList,
  indexType,
  fields,
) => {
  const MSG_QUERY_BY_ID_FAIL = 'Error while querying Arranger data by ID';
  if (idList === null) {
    throw MSG_QUERY_BY_ID_FAIL;
  }
  const responseData = await apiFunc({
    endpoint: getEndpoint(projectId),
    body: constructGraphQLQuery(
      [{ name: graphqlIdField.toString(), values: idList }],
      indexType,
      [...fields],
      false,
      idList.length,
    ),
  });
  if (!responseData) {
    throw MSG_QUERY_BY_ID_FAIL;
  }
  return parseDataFromResponseContent(responseData, indexType);
};

/**
 * Query arranger for data by a sqon object
 * @param {function} apiFunc - function created by arranger for fetching data
 * @param {stirng} projectId - arranger project ID
 * @param {Object} sqonObj - a sqon object for filtering
 * @param {string} indexType - index type for query
 * @param {string[]} fields - list of target fields for response
 * @returns {Object[]} List of objects, each has the same keys as in "fields"
 */
export const queryDataBySQON = async (
  apiFunc,
  projectId,
  sqonObj,
  indexType,
  fields,
) => {
  const MSG_QUERY_BY_SQON_FAIL = 'Error while querying Arranger data by sqon';
  const countQuery = await apiFunc({
    endpoint: getEndpoint(projectId),
    body: constructGraphQLQueryWithSQON(
      indexType,
      sqonObj,
      [...fields],
      true,
    ),
  });
  if (!countQuery) {
    throw MSG_QUERY_BY_SQON_FAIL;
  }
  const count = parseCountFromResponseContent(countQuery, indexType);
  const responseData = await apiFunc({
    endpoint: getEndpoint(projectId),
    body: constructGraphQLQueryWithSQON(
      indexType,
      sqonObj,
      [...fields],
      false,
      count,
    ),
  });
  return parseDataFromResponseContent(responseData, indexType);
};

/**
 * Query arranger for how many data that match any "filterValues" for "filterField"
 * @param {function} apiFunc - function created by arranger for fetching data
 * @param {stirng} projectId - arranger project ID
 * @param {string} indexType - index type for query
 * @param {Object[]} filters - a list of {name, values}
 * @returns {number} number of matched objects
 */
export const queryCountByValues = async (
  apiFunc,
  projectId,
  indexType,
  filters,
) => {
  const MSG_QUERY_COUNT_BY_VALUE_FAIL = 'Error while querying Arranger count by values';
  const countQueryResponse = await apiFunc({
    endpoint: getEndpoint(projectId),
    body: constructGraphQLQuery(
      filters,
      indexType,
      [],
      true),
  });
  if (!countQueryResponse) {
    throw MSG_QUERY_COUNT_BY_VALUE_FAIL;
  }
  const count = parseCountFromResponseContent(countQueryResponse, indexType);
  return count;
};


/**
 * Query arranger for data records that match any "filterValues" for "filterField"
 * @param {function} apiFunc - function created by arranger for fetching data
 * @param {stirng} projectId - arranger project ID
 * @param {string} indexType - index type for query
 * @param {Object[]} filters - a list of {name, values}
 * @param {string[]} returnFields - list of target fields for response
 * @returns {Object[]} List of objects, each has the same keys as in "returnFields"
 */
export const queryDataByValues = async (
  apiFunc,
  projectId,
  indexType,
  filters,
  returnFields,
) => {
  const MSG_QUERY_BY_VALUE_FAIL = 'Error while querying Arranger data by values';
  const count = await queryCountByValues(apiFunc, projectId, indexType, filters);
  const responseData = await apiFunc({
    endpoint: getEndpoint(projectId),
    body: constructGraphQLQuery(
      filters,
      indexType,
      [...returnFields],
      false,
      count,
    ),
  });
  if (!responseData) {
    throw MSG_QUERY_BY_VALUE_FAIL;
  }
  return parseDataFromResponseContent(responseData, indexType);
};
