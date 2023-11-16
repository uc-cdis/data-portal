import { useHistory } from 'react-router-dom';

const HandleRedirectToLoginClick = (
  resourceInfo,
  discoveryConfig,
  action: 'download' | 'export' | 'manifest' | null = null
) => {
  const history = useHistory();

  const useRedirectUser = () => {
    const serializableState = {
      // discovery,
      actionToResume: action,
      // reduce the size of the redirect url by only storing resource id
      // resource id is remapped to its resource after redirect and resources load in index component
      selectedResourceIDs: [resourceInfo].map(
        (resource) => resource[discoveryConfig.minimalFieldMapping.uid]
      ),
    };
    // delete serializableState.selectedResources;
    const queryStr = `?state=${encodeURIComponent(
      JSON.stringify(serializableState)
    )}`;
    history.push('/login', { from: `${location.pathname}${queryStr}` });
  };
  return { useRedirectUser };
};

export default HandleRedirectToLoginClick;
