import React from 'react';
import './Workspace.less';

class ErrorWorkspacePlaceholder extends React.Component {
  render() {
    return (
      <h1 className='error-workspace-placeholder__error-msg'>
        Error opening workspace...
      </h1>
    );
  }
}

export default ErrorWorkspacePlaceholder;
