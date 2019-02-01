import React from 'react';
import './Workspace.less';
import NotFoundSVG from '../img/not-found.svg';

class ErrorWorkspacePlaceholder extends React.Component {
  render() {
    return (
      <div className='error-workspace-placeholder__error-msg'>
        <h1>Error opening workspace...</h1>
        <p>Please try again later, or contact administrator for more information.</p>
        <NotFoundSVG />
      </div>
    );
  }
}

export default ErrorWorkspacePlaceholder;
