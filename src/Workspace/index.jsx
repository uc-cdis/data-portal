import React from 'react';
import Button from '@gen3/ui-component/dist/components/Button';
import { workspaceUrl, wtsPath,
  workspaceOptionsUrl,
  workspaceLaunchUrl,
  workspaceTerminateUrl,
  workspaceStatusUrl,
} from '../localconf';
import './Workspace.less';
import { fetchWithCreds } from '../actions';
import Spinner from '../components/Spinner';
import jupyterIcon from '../img/icons/jupyter.svg';
import rStudioIcon from '../img/icons/rstudio.svg';
import galaxyIcon from '../img/icons/galaxy.svg';
import WorkspaceOption from './WorkspaceOption';

class Workspace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      connectedStatus: false,
      options: [],
      notebookStatus: 'Not Found',
      interval: null,
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

  getWorkspaceOptions = () => {
    fetchWithCreds({
      path: `${workspaceOptionsUrl}`,
      method: 'GET',
    }).then(
      ({ data }) => {
        this.setState({ options: data });
      },
    );
  }

  getWorkspaceStatus = async () => {
    console.log('fetching status...');
    return fetchWithCreds({
      path: `${workspaceStatusUrl}`,
      method: 'GET',
    }).then(
      ({ data }) => data.status,
    );
  }

  launchWorkspace = (notebook) => {
    fetchWithCreds({
      path: `${workspaceLaunchUrl}?hash=${notebook.id}`,
      method: 'GET',
    }).then(
      () => {
        this.checkWorkspaceStatus();
      },
    );
  }

  terminateWorkspace = () => {
    fetchWithCreds({
      path: `${workspaceTerminateUrl}`,
      method: 'GET',
    }).then(() => {
      this.checkWorkspaceStatus();
    });
  }

  connected = () => {
    this.setState({ connectedStatus: true }, () => {
      this.getWorkspaceOptions();
      this.getWorkspaceStatus().then((status) => {
        this.setState({ notebookStatus: status });
      });
    });
  }

  checkWorkspaceStatus = async () => {
    if (!this.state.interval) {
      console.log('start polling...');
      try {
        const interval = setInterval(async () => {
          const status = await this.getWorkspaceStatus();
          this.setState({ notebookStatus: status }, () => {
            if (this.state.notebookStatus !== 'Launching' &&
              this.state.notebookStatus !== 'Terminating') {
              console.log('clearing interval');
              clearInterval(this.state.interval);
            }
          });
        }, 2000);
        console.log('setting interval...');
        this.setState({ interval });
      } catch (e) {
        console.log(e);
      }
    }
  }

  getIcon = notebook => {
    switch (notebook) {
      case 'R Studio':
      return rStudioIcon;
      case 'Jupyter Notebook Bio Python':
      return jupyterIcon;
      case 'Jupyter Notebook Bio R':
      return jupyterIcon;
      case 'Galaxy':
      return galaxyIcon;
      default:
      return jupyterIcon;
    }
  }

  render() {
    return ((this.state.connectedStatus) ?
      <div className='workspace'>
        {
          this.state.notebookStatus === 'Running' ?
            <div className='workspace__iframe'>
              <Button
                className='workspace__iframe-button'
                onClick={() => this.terminateWorkspace()}
                label='Terminate Workspace'
                buttonType='primary'
              />
              <iframe
                title='Workspace'
                frameBorder='0'
                className='workspace'
                src={`${workspaceUrl}proxy/`}
              />
            </div>
            : null
        }
        {
          this.state.notebookStatus === 'Launching' ?
            <Spinner text='Launching workspace...' />
            : null
        }
        {
          this.state.notebookStatus === 'Terminating' ?
            <Spinner text='Terminating workspace...' />
            : null
        }
        {
          this.state.notebookStatus === 'Not Found' ?
            <div className='workspace__options'>
              {
                this.state.options.map((option, i) => {
                  const desc = option['cpu-limit'] ?
                    `${option['cpu-limit']}CPU, ${option['memory-limit']} memory`
                    : '';
                  return (
                    <WorkspaceOption
                      key={i}
                      icon={this.getIcon(option.name)}
                      title={option.name}
                      description={desc}
                      onClick={() => this.launchWorkspace(option)}
                    />
                  );
                })
              }
            </div>
            : null
        }
      </div>
      :
      <Spinner text='Loading options...' />

    );
  }
}

export default Workspace;
