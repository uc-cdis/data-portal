import React from 'react';
import { workspaceUrl } from '../localconf';
import './Workspace.less';

class Workspace extends React.Component {
  render() {
    return (
      <iframe
        title='Workspace'
        frameBorder='0'
        className='workspace'
        src={workspaceUrl}
      />
    );
  }
}

export default Workspace;
