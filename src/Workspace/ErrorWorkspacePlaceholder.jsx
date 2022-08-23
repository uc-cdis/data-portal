import React from 'react';
import isEnabled from '../helpers/featureFlags';
import './Workspace.less';
import NotFoundSVG from '../img/not-found.svg';
import { components } from '../params';
import workspaceRegistrationConfig from '../localconf';

class ErrorWorkspacePlaceholder extends React.Component {
  componentDidUpdate() {
    if (isEnabled('workspaceRegistration')) {
      if (workspaceRegistrationConfig) {
        // eslint-disable-next-line react/prop-types
        this.props.history.push('/workspace/register');
      }
      // eslint-disable-next-line no-console
      console.log('Unable to display registration form. Missing workspaceRegistrationConfig');
    }
  }

  render() {
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
