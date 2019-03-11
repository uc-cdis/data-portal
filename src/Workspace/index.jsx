import React from 'react';
import { workspaceUrl, wtsPath } from '../localconf';
import './Workspace.less';
import { fetchWithCreds } from '../actions';

class Workspace extends React.Component {

  componentDidMount() {
    console.log("checking")
    fetchWithCreds({
      path: `${wtsPath}/connected`,
      method: 'GET'
    })
      .then(
        ({ status, data }) => {
          console.log("status was: " + status);
          if (status != 200) {
            console.log("connecting to WTS");
            this.props.history.push(`${wtsPath}/authorization_url`)
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
