import { useHistory } from 'react-router-dom';
import GetPermaLink from './GetPermaLink';

const handleRedirectToLoginClick = (
  action: 'download' | 'export' | 'manifest' | null = null,
  props,
  history,
  location,
) => {
  const serializableState = {
    ...props.discovery,
    actionToResume: action,
    // reduce the size of the redirect url by only storing resource id
    // resource id is remapped to its resource after redirect and resources load in index component
    selectedResourceIDs: props.discovery.selectedResources.map(
      (resource) => resource[props.config.minimalFieldMapping.uid],
    ),
  };
  delete serializableState.selectedResources;
  const queryStr = `?state=${encodeURIComponent(
    JSON.stringify(serializableState),
  )}`;
  history.push('/login', { from: `${location.pathname}${queryStr}` });
};

const UseHandleRedirectToLoginClick = () => {
  const history = useHistory();

  // HandleRedirectFromDiscoveryDetailsToLoginClick don't need action to be resumable,
  // but it should open the same discovery details page after logging in
  const HandleRedirectFromDiscoveryDetailsToLoginClick = (uid: string) => {
    const permalink = GetPermaLink(uid);
    history.push('/login', { from: `${permalink}` });
  };
  return { HandleRedirectFromDiscoveryDetailsToLoginClick };
  // TODO: add HandleRedirectFromDiscoveryToLoginClick() in the future for the main discovery page actions,
  // which need to be resumable
};

export { UseHandleRedirectToLoginClick, handleRedirectToLoginClick };
