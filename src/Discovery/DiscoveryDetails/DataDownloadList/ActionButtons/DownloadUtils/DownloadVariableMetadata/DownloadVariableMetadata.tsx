import React from 'react';
import { fetchWithCreds } from '../../../../../../actions';
import { mdsURL } from '../../../../../../localconf';
import JSZip from 'jszip';
import FileSaver from 'file-saver';

const DownloadVariableMetadata = async (resourceInfo: object) => {
  //const studyID = resourceInfo['_hdp_uid'];
  // Need to follow up regarding how to get studyID?
  const studyID = 'HDP00001';
  let data_dictionaries = {};
  fetchWithCreds({ path: `${mdsURL}/${studyID}` }).then((statusResponse) => {
    const { data } = statusResponse;
    if (statusResponse.status !== 200 || !data) {
      alert(
        `First request Issue downloading variable metadata from ${mdsURL}/${studyID}, data is ${JSON.stringify(
          data
        )}`
      );
    } else {
      data_dictionaries = data.data_dictionaries;
      if (Object.keys(data_dictionaries).length !== 0) {
        // fetchEachFile(data_dictionaries);
        fetchDataForAllFiles(data_dictionaries);
      }
    }
  });

  var zip = new JSZip();
  /**** BAD APPROACH
  function fetchEachFile(data_dictionaries: object) {
    for (const [key, value] of Object.entries(data_dictionaries)) {
      fetchWithCreds({ path: `${mdsURL}/${value}` }).then((statusResponse) => {
        const { data } = statusResponse;
        if (statusResponse.status !== 200 || !data) {
          alert(
            `Second request: Issue downloading variable metadata from ${mdsURL}/${studyID}, data is ${data}`
          );
        } else {
          console.log('data from second request', data);
          zip.file(key, data);
        }
      });
    }
  }

  function downloadZip() {
    zip.generateAsync({ type: 'blob' }).then((content) => {
      FileSaver.saveAs(content, `variableMetadata.zip`);
    });
  }
  */
  /* BETTER APPROACH */
  async function fetchData(key, value) {
    return new Promise((resolve, reject) => {
      fetchWithCreds({ path: `${mdsURL}/${value}` }).then((statusResponse) => {
        const { data } = statusResponse;
        if (statusResponse.status !== 200 || !data) {
          alert(
            `Second request: Issue downloading variable metadata from ${mdsURL}/${studyID}, data is ${data}`
          );
        } else {
          console.log('data from second request', data);
          zip.file(key, JSON.stringify(data));
          resolve(`Data for fileRef ${key} ${value}`);
        }
      });
    });
  }

  async function fetchDataForAllFiles(data_dictionaries) {
    try {
      const results = await Promise.all(
        Object.entries(data_dictionaries).map(([key, value]) =>
          fetchData(key, value)
        )
      );
      console.log('All data fetched:', results);
      // Now you can proceed to download the information or perform other tasks
      zip.generateAsync({ type: 'blob' }).then((content) => {
        FileSaver.saveAs(content, `variableMetadata.zip`);
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  return null;
};

export default DownloadVariableMetadata;

/**
 * ISSUES:
 * Test study HDP00001 is not configured for DataDownloadList
 * fieldConfig.type === 'dataDownloadList' is false
 * Cannot find two now optional added into
 * “discoveryConfig.features.exportToWorkspace”: “variableMetadataFieldName” and “enableDownloadVariableMetadata”
 * As a result: Cannot find value from the value associated with the key variableMetadataFieldName
 */
