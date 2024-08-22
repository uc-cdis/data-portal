import React from 'react';
import './Workspace.less';
import NotFoundSVG from '../img/not-found.svg';
import { components } from '../params';

const ErrorWorkspacePlaceholder = () => {
  const supportEmail = components.login?.email || 'support@gen3.org';
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
