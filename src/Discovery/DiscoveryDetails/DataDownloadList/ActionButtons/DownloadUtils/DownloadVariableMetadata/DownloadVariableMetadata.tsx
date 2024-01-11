import React from 'react';
import { fetchWithCreds } from '../../../../../../actions';
import { mdsURL } from '../../../../../../localconf';
import { DOWNLOAD_FAIL_STATUS } from '../Constants';

const DownloadVariableMetadata = async (resourceInfo: object) => {
  //const studyID = resourceInfo['_hdp_uid'];
  const studyID = 'HDP00001';
  let data_dictionaries = '';
  fetchWithCreds({ path: `${mdsURL}/${studyID}` }).then((statusResponse) => {
    const { status } = statusResponse.data;
    if (statusResponse.status !== 200 || !status) {
      alert(DOWNLOAD_FAIL_STATUS);
    }
    console.log('statusResponse', statusResponse);
    console.log(
      'statusResponse.data.data_dictionaries',
      statusResponse.data.data_dictionaries
    );
    data_dictionaries = statusResponse.data.data_dictionaries;
  });

  return null;
};

export default DownloadVariableMetadata;

/**
 * ISSUES:
 * Test study HDP00001 is not configured for DataDownloadList
 * fieldConfig.type === 'dataDownloadList' is false
 * Cannot find two now optional added into
 * “discoveryConfig.features.exportToWorkspace”: “variableMetadataFieldName” and “enableDownloadVariableMetadata”
 * Cannot  value from the value associated with the key variableMetadataFieldName
 */
