import FileSaver from 'file-saver';

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
                            ${nodeList.join('\n')}
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

const MSG_FAILED_DOWNLOAD = 'Failed to download manifest file';
const queryFileMappingData = async (apiFunc, projectId, selectedTableRows, arrangerConfig) => {
  const countQuery = await apiFunc({
    endpoint: `/${projectId}/graphql`,
    body: constructGraphQLQuery(
      selectedTableRows,
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
      selectedTableRows,
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

const getColumns = async (apiFunc, projectId, arrangerConfig) => {
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
  const columns = response.data[arrangerConfig.graphqlField].columnsState.state.columns
    .filter(col => col.show)
    .map(col => col.field);
  return columns;
};

const querySelectedData = async (
  apiFunc,
  projectId,
  selectedTableRows,
  arrangerConfig,
  columns,
) => {
  const responseData = await apiFunc({
    endpoint: `/${projectId}/graphql`,
    body: constructGraphQLQuery(
      selectedTableRows,
      arrangerConfig.graphqlField,
      '_id', // Arranger always uses this for table index
      [...columns],
      false,
      selectedTableRows.length,
    ),
  });
  if (!responseData) {
    throw MSG_FAILED_DOWNLOAD;
  }
  const responseDataJSON = responseData.data[arrangerConfig.graphqlField]
    .hits.edges.map(item => item.node);
  return responseDataJSON;
};

export const downloadData = async (
  apiFunc,
  projectId,
  selectedTableRows,
  arrangerConfig,
  fileName,
) => {
  const columns = await getColumns(
    apiFunc,
    projectId,
    arrangerConfig,
  );
  const responseDataJSON = await querySelectedData(
    apiFunc,
    projectId,
    selectedTableRows,
    arrangerConfig,
    columns,
  );
  const blob = new Blob([JSON.stringify(responseDataJSON, null, 2)], { type: 'text/json' });
  FileSaver.saveAs(blob, fileName);
};
