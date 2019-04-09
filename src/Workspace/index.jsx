import React from 'react';
import { workspaceUrl, wtsPath } from '../localconf';
import './Workspace.less';
import { fetchWithCreds } from '../actions';
import Spinner from '../components/Spinner';

class Workspace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      connectedStatus: false,
    };
  }

  componentDidMount() {
    fetchWithCreds({
      path: `${wtsPath}connected`,
      method: 'GET',
    })
      .then(
        ({ status }) => {
          if (status !== 200) {
            window.location.href = `${wtsPath}/authorization_url?redirect=${window.location.pathname}`;
          } else {
            this.connected();
          }
        },
      );
  }

  connected = () => {
    this.setState({ connectedStatus: true });
  }

  render() {
    return ((this.state.connectedStatus) ?
      (
        <iframe
          title='Workspace'
          frameBorder='0'
          className='workspace'
          src={workspaceUrl}
        />
      )
      :
      <Spinner text='Connecting to Workspace' />

    );
  }
}

export default Workspace;
