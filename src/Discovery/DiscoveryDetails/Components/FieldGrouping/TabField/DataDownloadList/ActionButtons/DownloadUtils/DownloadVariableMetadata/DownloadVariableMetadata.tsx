import React from 'react';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { fetchWithCreds } from '../../../../../../../../../actions';
import { mdsURL } from '../../../../../../../../../localconf';
import { INITIAL_DOWNLOAD_STATUS } from '../Constants';
import DownloadStatus from '../../../Interfaces/DownloadStatus';
import { DiscoveryResource } from '../../../../../../../../Discovery';
import DataDictionaries from '../../../Interfaces/DataDictionaries';

const DownloadVariableMetadata = async (
  dataDictionaries: DataDictionaries,
  resourceInfo: DiscoveryResource,
  setDownloadStatus: Function,
) => {
  const zip = new JSZip();

  const createUniqueDownloadErrorMsg = (key: string) => ({
    inProgress: '',
    message: {
      title: 'Download failed',
      active: true,
      content: (
        <React.Fragment>
          <p>
              Study with name <strong>{resourceInfo.project_title}</strong>
              cannot download data dictionary with name <strong>{key}</strong>.
          </p>
          <p>Please try again later and contact support.</p>
        </React.Fragment>
      ),
    },
  } as DownloadStatus);

  const fetchData = async (key: string, value: string) => new Promise((resolve, reject) => {
    fetchWithCreds({ path: `${mdsURL}/${value}` }).then((statusResponse) => {
      const { data } = statusResponse;
      if (statusResponse.status !== 200 || !data) {
        setDownloadStatus(createUniqueDownloadErrorMsg(key));
        reject(new Error(`Issue with ${key}: ${value}`));
      } else {
        zip.file(key, JSON.stringify(data));
        resolve(`Data resolved for ${key}: ${value}`);
      }
    });
  });

  const fetchDataForAllFiles = async () => {
    try {
      setDownloadStatus({
        ...INITIAL_DOWNLOAD_STATUS,
        inProgress: 'DownloadVariableMetadata',
      });
      await Promise.all(
        Object.entries(dataDictionaries).map(([key, value]) => fetchData(key, value),
        ),
      ).then(() => {
        zip.generateAsync({ type: 'blob' }).then((content) => {
          FileSaver.saveAs(content, 'variable-metadata.zip');
        });
        setDownloadStatus(INITIAL_DOWNLOAD_STATUS);
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchDataForAllFiles();
};

export default DownloadVariableMetadata;
