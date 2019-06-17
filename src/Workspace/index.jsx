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
      notebookStatus: null,
      interval: null,
      notebookType: null,
      defaultNotebook: false,
    };
    this.notebookStates = [
      'Not Found',
      'Launching',
      'Terminating',
      'Running',
      'Stopped',
    ];
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

  componentWillUnmount() {
    if (this.state.interval) {
      clearInterval(this.state.interval);
    }
  }

  getWorkspaceOptions = () => {
    fetchWithCreds({
      path: `${workspaceOptionsUrl}`,
      method: 'GET',
    }).then(
      ({ data }) => {
        /* eslint-disable */
        const sortedResults = data.sort((a, b) =>
          (a.name !== b.name ? a.name < b.name ? -1 : 1 : 0));
        /* eslint-enable */
        this.setState({ options: sortedResults });
      },
    ).catch(() => this.setState({ defaultNotebook: true }));
  }

  getWorkspaceStatus = async () => fetchWithCreds({
    path: `${workspaceStatusUrl}`,
    method: 'GET',
  }).then(
    ({ data }) => data.status,
  ).catch(() => 'Error');

  getIcon = (notebook) => {
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

  launchWorkspace = (notebook) => {
    this.setState({ notebookType: notebook.name }, () => {
      fetchWithCreds({
        path: `${workspaceLaunchUrl}?id=${notebook.id}`,
        method: 'POST',
      }).then(() => {
        this.checkWorkspaceStatus();
      });
    });
  }

  terminateWorkspace = () => {
    this.setState({ notebookType: null, notebookStatus: 'Terminating' }, () => {
      fetchWithCreds({
        path: `${workspaceTerminateUrl}`,
        method: 'POST',
      }).then(() => {
        this.checkWorkspaceStatus();
      });
    });
  }

  connected = () => {
    this.getWorkspaceOptions();
    if (!this.state.defaultNotebook) {
      this.getWorkspaceStatus().then((status) => {
        if (status === 'Launching' || status === 'Terminating' || status === 'Error') {
          this.checkWorkspaceStatus();
        } else {
          this.setState({ notebookStatus: status });
        }
        this.setState({ connectedStatus: true });
      });
    }
  }

  checkWorkspaceStatus = async () => {
    if (this.state.interval) {
      clearInterval(this.state.interval);
    }
    try {
      const interval = setInterval(async () => {
        const status = await this.getWorkspaceStatus();
        if (this.notebookStates.includes(status)) {
          this.setState({ notebookStatus: status }, () => {
            if (this.state.notebookStatus !== 'Launching' &&
              this.state.notebookStatus !== 'Terminating') {
              clearInterval(this.state.interval);
            }
          });
        }
      }, 2000);
      this.setState({ interval });
    } catch (e) {
      console.log('Error checking workspace status:', e);
    }
  }

  render() {
    const terminateButton = (
      <Button
        className='workspace__terminate-button'
        onClick={() => this.terminateWorkspace()}
        label='Terminate Workspace'
        buttonType='primary'
        isPending={this.state.notebookStatus === 'Terminating'}
      />
    );

    if (this.state.connectedStatus && this.state.notebookStatus && !this.state.defaultNotebook) {
      return (
        <div className='workspace'>
          {
            this.state.notebookStatus === 'Running' ||
              this.state.notebookStatus === 'Stopped' ?
              <div className='workspace__iframe'>
                { terminateButton }
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
              <React.Fragment>
                { terminateButton }
                <Spinner text='Launching workspace...' />
              </React.Fragment>
              : null
          }
          {
            this.state.notebookStatus === 'Terminating' ?
              <Spinner text='Terminating workspace...' />
              : null
          }
          {
            this.state.notebookStatus !== 'Launching' &&
            this.state.notebookStatus !== 'Terminating' &&
            this.state.notebookStatus !== 'Running' &&
            this.state.notebookStatus !== 'Stopped' ?
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
                        isPending={this.state.notebookType === option.name}
                        isDisabled={
                          !!this.state.notebookType &&
                          this.state.notebookType !== option.name
                        }
                      />
                    );
                  })
                }
              </div>
              : null
          }
        </div>
      );
    } else if (this.state.defaultNotebook && this.state.connectedStatus) {
      return (
        <iframe
          title='Workspace'
          frameBorder='0'
          className='workspace'
          src={workspaceUrl}
        />
      );
    }
    return <Spinner />;
  }
}

export default Workspace;
