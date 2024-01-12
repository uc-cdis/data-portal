import React from 'react';
import { fetchWithCreds } from '../../../../../../actions';
import { mdsURL } from '../../../../../../localconf';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import DownloadStatus from '../../../Interfaces/DownloadStatus';
import { DiscoveryResource } from '../../../../../Discovery';

const DOWNLOAD_FAIL: DownloadStatus = {
  inProgress: false,
  message: {
    title: 'Download failed',
    content: (
      <p>
        There was a problem preparing your download. Please consider using the
        Gen3 SDK for Python (w/ CLI) to download these files via a manifest.
      </p>
    ),
    active: true,
  },
};
const DownloadVariableMetadata = async (
  resourceInfo: DiscoveryResource,
  setDownloadStatus: Function
) => {
  //const studyID = resourceInfo['_hdp_uid']; ??????
  // Need to follow up regarding how to get studyID?

  const studyID = 'HDP00001';
  const zip = new JSZip();
  let data_dictionaries = {};
  const { project_title } = resourceInfo;

  const DOWNLOAD_FAIL_INFO: DownloadStatus = {
    inProgress: false,
    message: {
      title: 'Download failed',
      content: (
        <>
          <p>
            Data Dictionary with name:<em> {project_title || studyID}</em>{' '}
            cannot download variable-level metadata with ID:
            <em> {studyID}</em>.
          </p>
          <p>Please try again later and contact support.</p>
        </>
      ),
      active: true,
    },
  };

  fetchWithCreds({ path: `${mdsURL}/${studyID}` }).then((statusResponse) => {
    const { data } = statusResponse;
    if (statusResponse.status !== 200 || !data || 1 != 2) {
      setDownloadStatus(DOWNLOAD_FAIL_INFO);
    } else {
      data_dictionaries = data.data_dictionaries;
      if (Object.keys(data_dictionaries).length !== 0) {
        fetchDataForAllFiles(data_dictionaries);
      }
    }
  });

  async function fetchData(key, value) {
    return new Promise((resolve, reject) => {
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
  }

  async function fetchDataForAllFiles(data_dictionaries) {
    try {
      await Promise.all(
        Object.entries(data_dictionaries).map(([key, value]) =>
          fetchData(key, value)
        )
      ).then(() => {
        zip.generateAsync({ type: 'blob' }).then((content) => {
          FileSaver.saveAs(content, `variable-metadata.zip`);
        });
      });
    } catch (error) {
      setDownloadStatus(DOWNLOAD_FAIL_INFO);
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
 * Not clear what [Name] means for Data Dictionary and Study.resourceInfo.project_title?
 */
