import FileSaver from 'file-saver';

export const MSG_FAILED_DOWNLOAD = 'Failed to download file';

/*
* Check if an object as chain of keys
* obj - object
* keyChainString - keys separated by dotf
* return: boolean, whether object as keys
* e.g.: obj={ a: { b: {c: 1 } } }, keyChainString='a.b.c', return true
* e.g.: obj={ a: { b: 1 } }, keyChainString='a.b.c', return false
*/
export const hasKeyChain = (obj, keyChainString) => {
  if (!obj) return false;
  const keyList = keyChainString.split('.');
  if (keyList.length === 0) return false;
  let o = obj;
  for (let i = 0; i < keyList.length; i += 1) {
    const key = keyList[i];
    if (!o[key]) {
      return false;
    }
    o = o[key];
  }
  return true;
};

/*
* Constructs graphql string for arranger to get data.
*   selectedTableRows - list of id for selected data
*   indexType - type name of index for query
*   filterFieldId - field name for filetering
*   nodeList - list of node for respone
*   isGettingCount - if set true, only get count of total hits;
*      if set false, need to provide actual `count` for next argument
*   count - count of hits for response. Required if `isGettingCount` if false
*/
export const constructGraphQLQuery = (
  selectedTableRows,
  indexType,
  filterFieldId,
  nodeList,
  isGettingCount,
  count,
) => {
  const sqonObj = {
    op: 'and',
    content: [
      {
        op: 'in',
        content: {
          field: filterFieldId,
          value: [...selectedTableRows],
        },
      },
    ],
  };
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
      first: isGettingCount ? 0 : count,
    },
  };
  return gqlQuery;
};

/**
* Query arranger for data file mapping by a list of IDs
*   apiFunc - function created by arranger for fetching data
*   projectId - arranger project ID
*   idList - list of ids for query
*   arrangerConfig - arranger configuration object, must has following keys for manifest query:
*       graphqlField - the data type name for arranger
*       manifestMapping.fileIndexType - type name of file index
*       manifestMapping.fileReferenceIdField - field name of reference field in file index
*/
const queryFileMappingData = async (apiFunc, projectId, idList, arrangerConfig) => {
  if (!hasKeyChain(arrangerConfig, 'manifestMapping.fileIndexType')
    || !hasKeyChain(arrangerConfig, 'manifestMapping.fileReferenceIdField')) {
    throw MSG_FAILED_DOWNLOAD;
  }
  const countQuery = await apiFunc({
    endpoint: `/${projectId}/graphql`,
    body: constructGraphQLQuery(
      idList,
      arrangerConfig.manifestMapping.fileIndexType,
      arrangerConfig.manifestMapping.fileReferenceIdField,
      [
        arrangerConfig.manifestMapping.fileIdField,
        arrangerConfig.manifestMapping.fileReferenceIdField,
      ],
      true),
  });
  if (!countQuery) {
    throw MSG_FAILED_DOWNLOAD;
  }
  const count = countQuery.data[arrangerConfig.manifestMapping.fileIndexType].hits.total;
  const manifest = await apiFunc({
    endpoint: `/${projectId}/graphql`,
    body: constructGraphQLQuery(
      idList,
      arrangerConfig.manifestMapping.fileIndexType,
      arrangerConfig.manifestMapping.fileReferenceIdField,
      [
        arrangerConfig.manifestMapping.fileIdField,
        arrangerConfig.manifestMapping.fileReferenceIdField,
      ],
      false,
      count,
    ),
  });
  if (!manifest) {
    throw MSG_FAILED_DOWNLOAD;
  }
  const manifestJSON = manifest.data[arrangerConfig.manifestMapping.fileIndexType]
    .hits.edges.map(item => item.node);
  return manifestJSON;
};

const getArrangerTableColumns = async (apiFunc, projectId, arrangerConfig) => {
  if (!hasKeyChain(arrangerConfig, 'graphqlField')) {
    throw MSG_FAILED_DOWNLOAD;
  }
  const body = {
    query: `query columnsStateQuery
            {
              ${arrangerConfig.graphqlField} {
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
    endpoint: `/${projectId}/graphql`,
    body,
  });
  if (!hasKeyChain(response, `data.${arrangerConfig.graphqlField}.columnsState.state.columns`)) {
    throw MSG_FAILED_DOWNLOAD;
  }
  const columns = response.data[arrangerConfig.graphqlField].columnsState.state.columns
    .filter(col => col.show)
    .map(col => col.field);
  return columns;
};

/**
* Query arranger for data by a list of IDs
*   apiFunc - function created by arranger for fetching data
*   projectId - arranger project ID
*   idList - list of ids for query
*   arrangerConfig - arranger configuration object, must has `graphqlField` key for index type name
*   fields - list of fields for query
*/
const queryDataByIds = async (
  apiFunc,
  projectId,
  idList,
  arrangerConfig,
  fields,
) => {
  if (!hasKeyChain(arrangerConfig, 'graphqlField')) {
    throw MSG_FAILED_DOWNLOAD;
  }
  const responseData = await apiFunc({
    endpoint: `/${projectId}/graphql`,
    body: constructGraphQLQuery(
      idList,
      arrangerConfig.graphqlField,
      '_id', // Arranger always uses this for table index
      [...fields],
      false,
      idList.length,
    ),
  });
  if (!responseData) {
    throw MSG_FAILED_DOWNLOAD;
  }
  if (!hasKeyChain(responseData, `data.${arrangerConfig.graphqlField}.hits.edges`)) {
    throw MSG_FAILED_DOWNLOAD;
  }
  const responseDataJSON = responseData.data[arrangerConfig.graphqlField]
    .hits.edges.map(item => item.node);
  return responseDataJSON;
};

/*
* Download selected data in arranger table. Arguments:
*   apiFunc - function created by arranger for fetching data
*   projectId - arranger project ID
*   selectedTableRows - list of ids of selected rows
*   fileName - file name for downloading
*   arrangerConfig - arranger configuration object, has `graphqlField` key as arranger type name
*/
export const downloadData = async (
  apiFunc,
  projectId,
  selectedTableRows,
  arrangerConfig,
  fileName,
) => {
  const columns = await getArrangerTableColumns(
    apiFunc,
    projectId,
    arrangerConfig,
  );
  const responseDataJSON = await queryDataByIds(
    apiFunc,
    projectId,
    selectedTableRows,
    arrangerConfig,
    columns,
  );
  const blob = new Blob([JSON.stringify(responseDataJSON, null, 2)], { type: 'text/json' });
  FileSaver.saveAs(blob, fileName);
};

/*
* Download manifest data for selected rows in arranger table. Arguments:
*   apiFunc - function created by arranger for fetching data
*   projectId - arranger project ID
*   selectedTableRows - list of ids of selected rows
*   fileName - file name for downloading
*   arrangerConfig - arranger configuration object, should include following keys:
*       graphqlField - the data type name for arranger
*       manifestMapping.fileIndexType - type name of file index
*       manifestMapping.fileReferenceIdField - field name of reference field in file index
*
*/
export const downloadManifest = async (
  apiFunc,
  projectId,
  selectedTableRows,
  arrangerConfig,
  fileName,
) => {
  const manifestJSON = await queryFileMappingData(
    apiFunc,
    projectId,
    selectedTableRows,
    arrangerConfig,
  );
  const blob = new Blob([JSON.stringify(manifestJSON, null, 2)], { type: 'text/json' });
  FileSaver.saveAs(blob, fileName);
};
