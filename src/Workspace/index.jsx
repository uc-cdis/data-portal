import React from 'react';
import { workspaceUrl } from '../localconf';
import './Workspace.less';
import { fetchWithCreds } from '../actions';

class Workspace extends React.Component {

  componentDidMount() {
    fetchWithCreds({
      path: '/oauth2/check'
      method: 'GET'
    })
      .then(
        ({ status, data }) => {
          if (status != 200) {
            this.props.history.push('/oauth2/authorization_url')
          }
        }
      )
  }

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
