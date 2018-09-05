import FileSaver from 'file-saver';

export const constructGraphQLQuery = (selectedTableRows, arrangerConfig, isGettingCount, count) => {
  const sqonObj = {
    op: 'and',
    content: [
      {
        op: 'in',
        content: {
          field: arrangerConfig.manifestMapping.fileReferenceIdField,
          value: [...selectedTableRows],
        },
      },
    ],
  };
  const getContentQuery = `edges {
                          node {
                            ${arrangerConfig.manifestMapping.fileIdField}
                            ${arrangerConfig.manifestMapping.fileReferenceIdField}
                          }
                        }`;
  const gqlQuery = {
    query: `query ($first: Int, $sqon: JSON){
                ${arrangerConfig.manifestMapping.fileIndexType} {
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
    body: constructGraphQLQuery(selectedTableRows, arrangerConfig, true),
  });
  if (!countQuery) {
    throw MSG_FAILED_DOWNLOAD;
  }
  const count = countQuery.data[arrangerConfig.manifestMapping.fileIndexType].hits.total;
  const manifest = await apiFunc({
    endpoint: `/${projectId}/graphql`,
    body: constructGraphQLQuery(selectedTableRows, arrangerConfig, false, count),
  });
  if (!manifest) {
    throw MSG_FAILED_DOWNLOAD;
  }
  const manifestJSON = manifest.data[arrangerConfig.manifestMapping.fileIndexType]
    .hits.edges.map(item => item.node);
  return manifestJSON;
};

const FILENAME = 'manifest.json';
export const downloadManifest = async (apiFunc, projectId, selectedTableRows, arrangerConfig) => {
  const manifestJSON = await queryFileMappingData(
    apiFunc,
    projectId,
    selectedTableRows,
    arrangerConfig,
  );
  const blob = new Blob([JSON.stringify(manifestJSON, null, 2)], { type: 'text/json' });
  FileSaver.saveAs(blob, FILENAME);
};
