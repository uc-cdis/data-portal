import { DiscoveryConfig } from '../../../../DiscoveryConfig';
import { DiscoveryResource } from '../../../../Discovery';
import DataDictionaries from '../../Interfaces/DataDictionaries';
import { mdsURL } from '../../../../../localconf';
import { fetchWithCreds } from '../../../../../actions';

// let dataDictionaries: DataDictionaries;
const DownloadDataDictionaryInfo = (
  discoveryConfig: DiscoveryConfig,
  resourceInfo: DiscoveryResource,
  showDownloadVariableMetadataButton: Boolean
) => {
  if (showDownloadVariableMetadataButton) {
    const studyID = resourceInfo._hdp_uid;
    fetchWithCreds({ path: `${mdsURL}/${studyID}` }).then((statusResponse) => {
      const { data } = statusResponse;
      if (statusResponse.status !== 200 || !data) {
        return { noVariableLevelMetadata: true, dataDictionaries: null };
      } else {
        if (
          data.dataDictionaries &&
          Object.keys(data.dataDictionaries).length !== 0
        ) {
          console.log('here!');
          return {
            noVariableLevelMetadata: false,
            dataDictionaries: data.dataDictionaries,
          };
        } else {
          return { noVariableLevelMetadata: true, dataDictionaries: null };
        }
      }
    });
    // return { noVariableLevelMetadata: false, dataDictionaries: null };
  } else {
    return { noVariableLevelMetadata: true, dataDictionaries: null };
  }
};

export default DownloadDataDictionaryInfo;

/*
 fetchWithCreds({ path: `${mdsURL}/${studyID}` }).then((statusResponse) => {
    const { data } = statusResponse;
    if (statusResponse.status !== 200 || !data) {
      setDownloadStatus(DOWNLOAD_FAIL_INFO);
    } else {
      try {
        const dataDictionaries: IdataDictionaries = data.data_dictionaries;
        console.log('dataDictionaries line 91', dataDictionaries);
        if (Object.keys(dataDictionaries).length !== 0) {
          fetchDataForAllFiles(dataDictionaries);
        }
      } catch (error) {
        setDownloadStatus(DOWNLOAD_FAIL_INFO);
        console.error('Error fetching data line 98:', error);
      }
    }
  });

*/
