import React from 'react';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { fetchWithCreds } from '../../../../../../actions';
import { mdsURL } from '../../../../../../localconf';
import DownloadStatus from '../../../Interfaces/DownloadStatus';
import { DiscoveryResource } from '../../../../../Discovery';

interface IdataDictionaries {
  value: {
    [key: string]: any;
  };
}

const DownloadVariableMetadata = async (
  resourceInfo: DiscoveryResource,
  setDownloadStatus: Function
) => {
  const zip = new JSZip();
  // const studyID = resourceInfo['_hdp_uid']; ??????
  // Need to follow up regarding how to get studyID?

  const studyID = 'HDP00001';
  const projectTitle = resourceInfo.project_title;

  const DOWNLOAD_FAIL_INFO: DownloadStatus = {
    inProgress: false,
    message: {
      title: 'Download failed',
      content: (
        <React.Fragment>
          <p>
            Data Dictionary with name:<em> {projectTitle || studyID}</em> cannot
            download variable-level metadata with ID:
            <em> {studyID}</em>.
          </p>
          <p>Please try again later and contact support.</p>
        </React.Fragment>
      ),
      active: true,
    },
  };

  const fetchData = async (key: string, value: string) =>
    new Promise((resolve, reject) => {
      fetchWithCreds({ path: `${mdsURL}/${value}` }).then((statusResponse) => {
        const { data } = statusResponse;
        if (statusResponse.status !== 200 || !data) {
          setDownloadStatus(DOWNLOAD_FAIL_INFO);
          reject(new Error(`Issue with ${key}: ${value}`));
        } else {
          zip.file(key, JSON.stringify(data));
          resolve(`Data resolved for ${key}: ${value}`);
        }
      });
    });

  const fetchDataForAllFiles = async (dataDictionaries: IdataDictionaries) => {
    try {
      await Promise.all(
        Object.entries(dataDictionaries).map(([key, value]) =>
          fetchData(key, value)
        )
      ).then(() => {
        zip.generateAsync({ type: 'blob' }).then((content) => {
          FileSaver.saveAs(content, 'variable-metadata.zip');
        });
      });
    } catch (error) {
      setDownloadStatus(DOWNLOAD_FAIL_INFO);
      console.error('Error fetching data:', error);
    }
  };

  fetchWithCreds({ path: `${mdsURL}/${studyID}` }).then((statusResponse) => {
    const { data } = statusResponse;
    if (statusResponse.status !== 200 || !data) {
      setDownloadStatus(DOWNLOAD_FAIL_INFO);
    } else {
      console.log('data', data);
      const dataDictionaries: IdataDictionaries = data.data_dictionaries;
      if (Object.keys(dataDictionaries).length !== 0) {
        fetchDataForAllFiles(dataDictionaries);
      }
    }
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
 * As a result: Cannot find value from the value associated with the key variableMetadataFieldName
 * Not clear what [Name] means for Data Dictionary and Study.resourceInfo.project_title?
 */
