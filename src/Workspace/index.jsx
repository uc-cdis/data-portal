import React from 'react';
import { workspaceUrl, wtsPath } from '../localconf';
import './Workspace.less';
import { fetchWithCreds } from '../actions';

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
