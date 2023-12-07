import { useHistory, useLocation } from 'react-router-dom';
import { DiscoveryConfig } from '../../../../DiscoveryConfig';
import { DiscoveryResource } from '../../../../Discovery';

const UseHandleRedirectToLoginClick = () => {
  const history = useHistory();
  const location = useLocation();

  const HandleRedirectToLoginClick = (
    resource: DiscoveryResource,
    discoveryConfig: DiscoveryConfig,
    action: 'download' | 'export' | 'manifest' | null = null,
  ) => {
    const serializableState = {
      // discovery,
      actionToResume: action,
      // reduce the size of the redirect url by only storing resource id
      // resource id is remapped to its resource after redirect and resources load in index component
      selectedResourceIDs: [resource].map(
        (resourceObj) => resourceObj[discoveryConfig.minimalFieldMapping.uid],
      ),
    };
    // delete serializableState.selectedResources;
    const queryStr = `?state=${encodeURIComponent(
      JSON.stringify(serializableState),
    )}`;
    history.push('/login', { from: `${location.pathname}${queryStr}` });
  };
  return { HandleRedirectToLoginClick };
};

export default UseHandleRedirectToLoginClick;
