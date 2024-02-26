import { useHistory } from 'react-router-dom';
import GetPermaLink from '../../../Utils/GetPermaLink';

const UseHandleRedirectToLoginClick = () => {
  const history = useHistory();

  // HandleRedirectFromDiscoveryDetailsToLoginClick don't need action to be resumable, but it should open the same discovery details page after logging in
  const HandleRedirectFromDiscoveryDetailsToLoginClick = (uid: string) => {
    const permalink = GetPermaLink(uid);
    history.push('/login', { from: `${permalink}` });
  };
  return { HandleRedirectFromDiscoveryDetailsToLoginClick };
  // TODO: add HandleRedirectFromDiscoveryToLoginClick() in the future for the main discovery page actions, which need to be resumable
};

export default UseHandleRedirectToLoginClick;
