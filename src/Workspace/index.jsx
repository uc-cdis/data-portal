import React from 'react';
import './Workspace.less';

class Workspace extends React.Component {
  render() {
    return (
      <iframe title='Workspace' frameBorder='0' className='workspace' src='/workspace/' />
    );
  }
}

export default Workspace;
