import FileSaver from 'file-saver';
import {
  getArrangerTableColumns,
  queryDataByIds,
  queryCountByValues,
  queryDataByValues,
  queryAggregations,
} from './arrangerQueryHelper';
import { hasKeyChain } from './utils';
import { fetchWithCreds } from '../actions';
import { manifestServiceApiPath } from '../localconf';

const checkArrangerGraphqlField = (arrangerConfig) => {
  const MSG_GQLFIELD_FAIL = 'Couldn\'t find key "graphqlField" in Arranger configuration.';
  if (!hasKeyChain(arrangerConfig, 'graphqlField')) {
    throw MSG_GQLFIELD_FAIL;
  }
};

/**
 * Create manifest JSON for selected rows in arranger table.
 * @param {function} apiFunc - function created by arranger for fetching data
 * @param {string} projectId - arranger project ID
 * @param {string[]} selectedTableRows - list of ids of selected rows
 * @param {Object} arrangerConfig - arranger configuration object
 * @param {string} arrangerConfig.manifestMapping.resourceIndexType - type name of resource index
 * @param {string} arrangerConfig.manifestMapping.referenceIdFieldInResourceIndex - name of
 *                                reference field in resource index
 * @param {string} messageOnFail - message for describing a failure
 * @param {Function} errorCallback - callback function on error (Optional)
 *                                If undefined, simply throw error message
 */
const createManifestByFilter = async (
  apiFunc,
  projectId,
  selectedTableRows,
  arrangerConfig,
  errorCallback,
  messageOnFail,
) => {
  checkArrangerGraphqlField(arrangerConfig);
  if (!hasKeyChain(arrangerConfig, 'manifestMapping.resourceIndexType')
    || !hasKeyChain(arrangerConfig, 'manifestMapping.referenceIdFieldInResourceIndex')) {
    if (errorCallback === undefined) {
      throw messageOnFail;
    } else {
      errorCallback(500, messageOnFail);
    }
  }
  // Fetch docs by bucket for this key
  const key = arrangerConfig.manifestMapping.divideKey;
  const rowFilter = {
    name: arrangerConfig.manifestMapping.referenceIdFieldInResourceIndex,
    values: selectedTableRows,
  };
  let filtersByKey = [[rowFilter]];
  if (key !== undefined) {
    const keyBuckets = await queryAggregations(
      apiFunc,
      projectId,
      arrangerConfig.manifestMapping.resourceIndexType,
      key,
    );
    filtersByKey = keyBuckets.map(
      bucket => [rowFilter, { name: key, values: [bucket.key] }]);
  }
  const manifestJSON = await Promise.all(
    filtersByKey.map(filters => queryDataByValues(
      apiFunc,
      projectId,
      arrangerConfig.manifestMapping.resourceIndexType,
      filters,
      [
        arrangerConfig.manifestMapping.resourceIdField,
        arrangerConfig.manifestMapping.referenceIdFieldInResourceIndex,
      ],
    )));
  return manifestJSON;
};

/**
 * Download selected data in arranger table.
 * @param {function} apiFunc - function created by arranger for fetching data
 * @param {string} projectId - arranger project ID
 * @param {string[]} selectedTableRows - list of ids of selected rows
 * @param {string} fileName - file name for downloading
 * @param {Object} arrangerConfig - arranger configuration object
 * @param {string} arrangerConfig.graphqlField - the data type name for arranger
 */
export const downloadData = async (
  apiFunc,
  projectId,
  graphqlIdField,
  selectedTableRows,
  arrangerConfig,
  fileName,
) => {
  checkArrangerGraphqlField(arrangerConfig);
  const columns = await getArrangerTableColumns(
    apiFunc,
    projectId,
    arrangerConfig.graphqlField,
  );
  const responseDataJSON = await queryDataByIds(
    apiFunc,
    projectId,
    graphqlIdField,
    selectedTableRows,
    arrangerConfig.graphqlField,
    columns,
  );
  const blob = new Blob([JSON.stringify(responseDataJSON, null, 2)], { type: 'text/json' });
  FileSaver.saveAs(blob, fileName);
};

/**
 * Download manifest data for selected rows in arranger table.
 * @param {function} apiFunc - function created by arranger for fetching data
 * @param {string} projectId - arranger project ID
 * @param {string[]} selectedTableRows - list of ids of selected rows
 * @param {Object} arrangerConfig - arranger configuration object
 * @param {string} fileName - file name for downloading
 */
export const downloadManifest = async (
  apiFunc,
  projectId,
  selectedTableRows,
  arrangerConfig,
  fileName,
) => {
  const MSG_DOWNLOAD_MANIFEST_FAIL = 'Error downloading manifest file';
  const manifestJSON = await createManifestByFilter(
    apiFunc,
    projectId,
    selectedTableRows,
    arrangerConfig,
    undefined,
    MSG_DOWNLOAD_MANIFEST_FAIL);
  const blob = new Blob([JSON.stringify(manifestJSON.flat(), null, 2)], { type: 'text/json' });
  FileSaver.saveAs(blob, fileName);
};

/**
 * Download manifest data for selected rows in arranger table.
 * @param {function} apiFunc - function created by arranger for fetching data
 * @param {string} projectId - arranger project ID
 * @param {string[]} selectedTableRows - list of ids of selected rows
 * @param {Object} arrangerConfig - arranger configuration object
 * @param {Function} callback - callback function on success
 * @param {Function} errorCallback - callback function on error
 */
export const exportToWorkspace = async (
  apiFunc,
  projectId,
  selectedTableRows,
  arrangerConfig,
  callback,
  errorCallback,
) => {
  const MSG_EXPORT_MANIFEST_FAIL = 'Error exporting manifest file.';
  const MSG_EXPORT_FAIL = 'There was an error exporting your cohort.';
  const manifestJSON = await createManifestByFilter(
    apiFunc,
    projectId,
    selectedTableRows,
    arrangerConfig,
    errorCallback,
    MSG_EXPORT_MANIFEST_FAIL);
  fetchWithCreds({
    path: `${manifestServiceApiPath}`,
    body: JSON.stringify(manifestJSON.flat()),
    method: 'POST',
  })
    .then(
      ({ status, data }) => {
        switch (status) {
        case 200:
          callback(data);
          return;
        default:
          errorCallback(status, MSG_EXPORT_FAIL);
        }
      },
    );
};


/**
 * Get number of manifest entries for selected rows in arranger table.
 * @param {function} apiFunc - function created by arranger for fetching data
 * @param {string} projectId - arranger project ID
 * @param {string[]} selectedTableRows - list of ids of selected rows
 * @param {Object} arrangerConfig - arranger configuration object
 * @param {string} arrangerConfig.graphqlField - the data type name for arranger
 * @param {string} arrangerConfig.manifestMapping.resourceIndexType - type name of resource index
 * @param {string} arrangerConfig.manifestMapping.referenceIdFieldInResourceIndex - name of
 *                                reference field in resource index
 * @returns {number} number of manifest entries
 */
export const getManifestEntryCount = async (
  apiFunc,
  projectId,
  selectedTableRows,
  arrangerConfig,
) => {
  const MSG_GET_MANIFEST_COUNT_FAIL = 'Error getting manifest file count';
  checkArrangerGraphqlField(arrangerConfig);
  if (!hasKeyChain(arrangerConfig, 'manifestMapping.resourceIndexType')
    || !hasKeyChain(arrangerConfig, 'manifestMapping.referenceIdFieldInResourceIndex')) {
    throw MSG_GET_MANIFEST_COUNT_FAIL;
  }

  const manifestEntryCount = await queryCountByValues(
    apiFunc,
    projectId,
    arrangerConfig.manifestMapping.resourceIndexType,
    [{
      name: arrangerConfig.manifestMapping.referenceIdFieldInResourceIndex,
      values: selectedTableRows,
    }],
  );
  return manifestEntryCount;
};
