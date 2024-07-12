import { useHistory, RouteComponentProps } from 'react-router-dom';
import GetPermaLink from './GetPermaLink';

const handleRedirectToLoginClickResumable = (
  action: 'download' | 'export' | 'manifest' | null = null,
  props: any,
  history: RouteComponentProps['history'],
  location: RouteComponentProps['location'],
) => {
  const serializableState = {
    ...props.discovery,
    actionToResume: action,
    // reduce the size of the redirect url by only storing resource id
    // resource id is remapped to its resource after redirect and resources load in index component
    selectedResourceIDs: props.discovery.selectedResources.map(
      (resource:any) => resource[props.config.minimalFieldMapping.uid],
    ),
  };
  delete serializableState.selectedResources;
  const queryStr = `?state=${encodeURIComponent(
    JSON.stringify(serializableState),
  )}`;
  // Resumes with previous action following redirect
  history.push('/login', { from: `${location.pathname}${queryStr}` });
};

const UseHandleRedirectToLoginClickNonResumable = () => {
  const history = useHistory();
  // HandleRedirectFromDiscoveryDetailsToLoginClick don't need action to be resumable,
  // but it should open the same discovery details page after logging in
  const HandleRedirectFromDiscoveryDetailsToLoginClick = (uid: string) => {
    const permalink = GetPermaLink(uid);
    history.push('/login', { from: `${permalink}` });
  };
  return { HandleRedirectFromDiscoveryDetailsToLoginClick };
};

export { UseHandleRedirectToLoginClickNonResumable, handleRedirectToLoginClickResumable };
