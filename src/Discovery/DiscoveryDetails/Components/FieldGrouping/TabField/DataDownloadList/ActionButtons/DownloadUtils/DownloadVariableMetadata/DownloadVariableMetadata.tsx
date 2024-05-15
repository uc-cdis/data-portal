import React from 'react';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { fetchWithCreds } from '../../../../../../../../../actions';
import { mdsURL } from '../../../../../../../../../localconf';
import { INITIAL_DOWNLOAD_STATUS } from '../Constants';
import DownloadStatus from '../../../Interfaces/DownloadStatus';
import { DiscoveryResource } from '../../../../../../../../Discovery';
import VariableLevelMetadata from '../../../Interfaces/VariableLevelMetadata';
import SanitizeFileName from './SanitizeFileName';

const DownloadVariableMetadata = async (
  variableLevelMetadataRecords: VariableLevelMetadata,
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
              &nbsp;cannot download data dictionary with name <strong>{key}</strong>.
          </p>
          <p>Please try again later and contact support.</p>
        </React.Fragment>
      ),
    },
  } as DownloadStatus);

  const fetchData = async (key: string, value: string, type: string) => new Promise((resolve, reject) => {
    fetchWithCreds({ path: `${mdsURL}/${value}` }).then((statusResponse) => {
      let { data } = statusResponse;
      if (statusResponse.status !== 200 || !data) {
        setDownloadStatus(createUniqueDownloadErrorMsg(key));
        reject(new Error(`Issue with ${key}: ${value}`));
      } else {
        const sanitizedFileName = SanitizeFileName(key);
        let subDirectoryName = '';
        if (type === 'cde') {
          subDirectoryName = 'common_data_elements/';
          data = data.cde_metadata;
        } else if (type === 'dd') {
          subDirectoryName = 'data_dictionaries/';
          data = data.data_dictionary;
        }
        zip.file(`${subDirectoryName}${sanitizedFileName}`, JSON.stringify(data));
        resolve(`Data resolved for ${key}: ${value}, with type ${type}`);
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
        [...Object.entries(variableLevelMetadataRecords.dataDictionaries || []).map(([key, value]) => fetchData(key, value, 'dd'),
        ),
        ...Object.entries(variableLevelMetadataRecords.cdeMetadata || []).map(([key, value]) => fetchData(key, value, 'cde'),
        )],
      ).then(() => {
        zip.generateAsync({ type: 'blob' }).then((content) => {
          FileSaver.saveAs(content, 'variable-level-metadata.zip');
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
