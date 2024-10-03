import { DiscoveryConfig } from '../../../../../../../DiscoveryConfig';
import { DiscoveryResource } from '../../../../../../../Discovery';
import { mdsURL } from '../../../../../../../../localconf';
import { fetchWithCreds } from '../../../../../../../../actions';
import VariableLevelMetadata from '../../Interfaces/VariableLevelMetadata';

const DownloadVariableMetadataInfo = (
  discoveryConfig: DiscoveryConfig,
  resourceInfo: DiscoveryResource,
  showDownloadVariableMetadataButton: Boolean,
  setVariableMetadataInfo: Function,
) => {
  const vlmdFieldReference = discoveryConfig.features.exportToWorkspace.variableMetadataFieldName;
  if (showDownloadVariableMetadataButton) {
    const studyID = resourceInfo._hdp_uid;
    fetchWithCreds({ path: `${mdsURL}/${studyID}` }).then((statusResponse) => {
      const { data } = statusResponse;
      if (
        statusResponse.status === 200
        && data
        && data[vlmdFieldReference as string]
        && Object.keys(data[vlmdFieldReference as string]).length !== 0
      ) {
        const variableLevelMetadataRecords: VariableLevelMetadata = {};
        if (data[vlmdFieldReference as string].data_dictionaries) {
          variableLevelMetadataRecords.dataDictionaries = data[vlmdFieldReference as string].data_dictionaries;
        }
        if (data[vlmdFieldReference as string].common_data_elements) {
          variableLevelMetadataRecords.cdeMetadata = data[vlmdFieldReference as string].common_data_elements;
        }
        if (Object.keys(variableLevelMetadataRecords).length) {
          setVariableMetadataInfo({
            noVariableLevelMetadata: false,
            variableLevelMetadataRecords,
          });
        }
      }
    });
  }
};

export default DownloadVariableMetadataInfo;
