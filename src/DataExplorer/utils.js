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
    if (o[key] === undefined) {
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
*       manifestMapping.fileReferenceIdFieldInFileIndex - name of reference field in file index
*/
const queryFileMappingData = async (apiFunc, projectId, idList, arrangerConfig) => {
  if (!hasKeyChain(arrangerConfig, 'manifestMapping.fileIndexType')
    || !hasKeyChain(arrangerConfig, 'manifestMapping.fileReferenceIdFieldInFileIndex')) {
    throw MSG_FAILED_DOWNLOAD;
  }
  const countQuery = await apiFunc({
    endpoint: `/${projectId}/graphql`,
    body: constructGraphQLQuery(
      idList,
      arrangerConfig.manifestMapping.fileIndexType,
      arrangerConfig.manifestMapping.fileReferenceIdFieldInFileIndex,
      [
        arrangerConfig.manifestMapping.fileIdField,
        arrangerConfig.manifestMapping.fileReferenceIdFieldInFileIndex,
      ],
      true),
  });
  if (!countQuery) {
    throw MSG_FAILED_DOWNLOAD;
  }
  if (!hasKeyChain(countQuery, `data.${arrangerConfig.manifestMapping.fileIndexType}.hits.total`)) {
    throw MSG_FAILED_DOWNLOAD;
  }
  const count = countQuery.data[arrangerConfig.manifestMapping.fileIndexType].hits.total;
  const manifest = await apiFunc({
    endpoint: `/${projectId}/graphql`,
    body: constructGraphQLQuery(
      idList,
      arrangerConfig.manifestMapping.fileIndexType,
      arrangerConfig.manifestMapping.fileReferenceIdFieldInFileIndex,
      [
        arrangerConfig.manifestMapping.fileIdField,
        arrangerConfig.manifestMapping.fileReferenceIdFieldInFileIndex,
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
*       manifestMapping.fileReferenceIdFieldInFileIndex - name of reference field in file index
*       manifestMapping.fileReferenceIdFieldInDataIndex - name of reference field in data index
*
*/
export const downloadManifest = async (
  apiFunc,
  projectId,
  selectedTableRows,
  arrangerConfig,
  fileName,
) => {
  if (!hasKeyChain(arrangerConfig, 'manifestMapping.fileReferenceIdFieldInDataIndex')) {
    throw MSG_FAILED_DOWNLOAD;
  }
  const idList = (await queryDataByIds(
    apiFunc,
    projectId,
    selectedTableRows,
    arrangerConfig,
    [arrangerConfig.manifestMapping.fileReferenceIdFieldInDataIndex],
  )).map((d) => {
    if (!d[arrangerConfig.manifestMapping.fileReferenceIdFieldInDataIndex]) {
      throw MSG_FAILED_DOWNLOAD;
    }
    return d[arrangerConfig.manifestMapping.fileReferenceIdFieldInDataIndex];
  });
  const manifestJSON = await queryFileMappingData(
    apiFunc,
    projectId,
    idList,
    arrangerConfig,
  );
  const blob = new Blob([JSON.stringify(manifestJSON, null, 2)], { type: 'text/json' });
  FileSaver.saveAs(blob, fileName);
};

/*
* Buttons are grouped by their dropdownId value.
* This function calculates and groups buttons under the same dropdown,
* and return a map of dropdown ID and related infos for that dropdown:
*   cnt: how many buttons under this dropdown
*   dropdownConfig: infos for this dropdown, e.g. "title"
*   buttonConfigs: a list of button configs (includes buttion title, button type, etc.)
*/
export const calculateDropdownButtonConfigs = (explorerTableConfig) => {
  const dropdownConfig = explorerTableConfig
    && explorerTableConfig.dropdowns
    && Object.keys(explorerTableConfig.dropdowns).length > 0
    && Object.keys(explorerTableConfig.dropdowns)
      .reduce((map, dropdownId) => {
        const buttonCount = explorerTableConfig.buttons
          .filter(btnCfg => btnCfg.enabled)
          .filter(btnCfg => btnCfg.dropdownId && btnCfg.dropdownId === dropdownId)
          .length;
        const drpdnCfg = explorerTableConfig.dropdowns[dropdownId];
        const buttonConfigs = explorerTableConfig.buttons
          .filter(btnCfg => btnCfg.enabled)
          .filter(btnCfg => btnCfg.dropdownId && btnCfg.dropdownId === dropdownId);
        const ret = Object.assign({}, map);
        ret[dropdownId] = {
          cnt: buttonCount,
          dropdownConfig: drpdnCfg,
          buttonConfigs,
        };
        return ret;
      }, {});
  return dropdownConfig;
};
