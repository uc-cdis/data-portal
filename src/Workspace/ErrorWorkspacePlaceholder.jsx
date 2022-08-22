import React from 'react';
import { Redirect } from 'react-router-dom';
import isEnabled from '../helpers/featureFlags';
import './Workspace.less';
import NotFoundSVG from '../img/not-found.svg';
import { components } from '../params';
import workspaceRegistrationConfig from '../localconf';

class ErrorWorkspacePlaceholder extends React.Component {
  render() {
    if (isEnabled('workspaceRegistration')) {
      if (workspaceRegistrationConfig) {
        return <Redirect to='/workspace/register' />;
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
  }
}

export default ErrorWorkspacePlaceholder;
