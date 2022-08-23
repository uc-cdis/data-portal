import React from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import isEnabled from '../helpers/featureFlags';
import './Workspace.less';
import NotFoundSVG from '../img/not-found.svg';
import { components } from '../params';
import workspaceRegistrationConfig from '../localconf';

const ErrorWorkspacePlaceholder = () => {
  const history = useHistory();
  if (isEnabled('workspaceRegistration')) {
    if (workspaceRegistrationConfig) {
      console.log('Reloading to the different page!');
      // eslint-disable-next-line react/prop-types
      history.push('/workspace/register');
    }
    // eslint-disable-next-line no-console
    console.log('Unable to display registration form. Missing workspaceRegistrationConfig');
  }

  const supportEmail = components.login?.email || 'support@datacommons.io';
  return (
    <div className='error-workspace-placeholder__error-msg'>
      <h1>Error opening workspace...</h1>
      <p>
      Workspace access requires authorization. Please contact <a href={`mailto:${supportEmail}`}>{supportEmail}</a> for more information.
      </p>
      <NotFoundSVG />
    </div>
  );
};

export default ErrorWorkspacePlaceholder;
