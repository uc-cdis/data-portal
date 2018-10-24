import FileSaver from 'file-saver';
import {
  getArrangerTableColumns,
  queryDataByIds,
  queryCountByValues,
  queryDataByValues,
} from './arrangerQueryHelper';
import { hasKeyChain } from './utils';

const checkArrangerGraphqlField = (arrangerConfig) => {
  const MSG_GQLFIELD_FAIL = 'Couldn\'t find key "graphqlField" in Arranger configuration.';
  if (!hasKeyChain(arrangerConfig, 'graphqlField')) {
    throw MSG_GQLFIELD_FAIL;
  }
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
 * @param {string} arrangerConfig.graphqlField - the data type name for arranger
 * @param {string} arrangerConfig.manifestMapping.resourceIndexType - type name of resource index
 * @param {string} arrangerConfig.manifestMapping.referenceIdFieldInResourceIndex - name of
 *                                reference field in resource index
 * @param {string} arrangerConfig.manifestMapping.referenceIdFieldInDataIndex - name of
 *                                reference field in data index
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
  checkArrangerGraphqlField(arrangerConfig);
  if (!hasKeyChain(arrangerConfig, 'manifestMapping.resourceIndexType')
    || !hasKeyChain(arrangerConfig, 'manifestMapping.referenceIdFieldInResourceIndex')) {
    throw MSG_DOWNLOAD_MANIFEST_FAIL;
  }
  const resourceIDList = (await queryDataByIds(
    apiFunc,
    projectId,
    selectedTableRows,
    arrangerConfig.graphqlField,
    [arrangerConfig.manifestMapping.referenceIdFieldInDataIndex],
  )).map((d) => {
    if (!d[arrangerConfig.manifestMapping.referenceIdFieldInDataIndex]) {
      throw MSG_DOWNLOAD_MANIFEST_FAIL;
    }
    return d[arrangerConfig.manifestMapping.referenceIdFieldInDataIndex];
  });
  const manifestJSON = await queryDataByValues(
    apiFunc,
    projectId,
    arrangerConfig.manifestMapping.resourceIndexType,
    arrangerConfig.manifestMapping.referenceIdFieldInResourceIndex,
    resourceIDList,
    [
      arrangerConfig.manifestMapping.resourceIdField,
      arrangerConfig.manifestMapping.referenceIdFieldInResourceIndex,
    ],
  );
  const blob = new Blob([JSON.stringify(manifestJSON, null, 2)], { type: 'text/json' });
  FileSaver.saveAs(blob, fileName);
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
 * @param {string} arrangerConfig.manifestMapping.referenceIdFieldInDataIndex - name of
 *                                reference field in data index
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
  const resourceIDList = (await queryDataByIds(
    apiFunc,
    projectId,
    selectedTableRows,
    arrangerConfig.graphqlField,
    [arrangerConfig.manifestMapping.referenceIdFieldInDataIndex],
  )).map((d) => {
    if (!d[arrangerConfig.manifestMapping.referenceIdFieldInDataIndex]) {
      throw MSG_GET_MANIFEST_COUNT_FAIL;
    }
    return d[arrangerConfig.manifestMapping.referenceIdFieldInDataIndex];
  });
  const manifestEntryCount = await queryCountByValues(
    apiFunc,
    projectId,
    arrangerConfig.manifestMapping.resourceIndexType,
    arrangerConfig.manifestMapping.referenceIdFieldInResourceIndex,
    resourceIDList,
  );
  return manifestEntryCount;
};
