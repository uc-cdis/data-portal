import React from 'react';
import { Redirect } from 'react-router-dom';
import isEnabled from '../helpers/featureFlags';
import './Workspace.less';
import NotFoundSVG from '../img/not-found.svg';
import { components } from '../params';

class ErrorWorkspacePlaceholder extends React.Component {
  render() {
    const supportEmail = components.login?.email || 'support@datacommons.io';
    if (isEnabled('workspaceRegistration')) {
      return <Redirect to='/workspace/register' />;
    }
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
