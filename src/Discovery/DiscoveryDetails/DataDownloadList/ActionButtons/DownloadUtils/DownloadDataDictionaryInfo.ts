import { DiscoveryConfig } from '../../../../DiscoveryConfig';
import { DiscoveryResource } from '../../../../Discovery';
import { mdsURL } from '../../../../../localconf';
import { fetchWithCreds } from '../../../../../actions';

const DownloadDataDictionaryInfo = (
  discoveryConfig: DiscoveryConfig,
  resourceInfo: DiscoveryResource,
  showDownloadVariableMetadataButton: Boolean,
  setDataDictionaryInfo: Function
) => {
  const dataDictionaryReference =
    discoveryConfig.features.exportToWorkspace.variableMetadataFieldName;
  console.log('dataDictionaryReference', dataDictionaryReference);
  if (showDownloadVariableMetadataButton) {
    const studyID = resourceInfo._hdp_uid;
    fetchWithCreds({ path: `${mdsURL}/${studyID}` }).then((statusResponse) => {
      const { data } = statusResponse;
      console.log(data[dataDictionaryReference as string]);
      console.log(
        `if (
        statusResponse.status === 200 &&
        data &&
        data[dataDictionaryReference as string] &&
        Object.keys(data[dataDictionaryReference as string]).length !== 0
      )`,
        Boolean(
          statusResponse.status === 200 &&
            data &&
            data[dataDictionaryReference as string] /* &&
            Object.keys(data[dataDictionaryReference as string]).length !== 0*/
        )
      );
      if (
        statusResponse.status === 200 &&
        data &&
        data[dataDictionaryReference as string] &&
        Object.keys(data[dataDictionaryReference as string]).length !== 0
      ) {
        setDataDictionaryInfo({
          noVariableLevelMetadata: false,
          dataDictionaries: data.data_dictionaries,
        });
      }
    });
  }
};

export default DownloadDataDictionaryInfo;
