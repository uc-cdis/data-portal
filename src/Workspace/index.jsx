import React from 'react';
import parse from 'html-react-parser';
import Button from '@gen3/ui-component/dist/components/Button';

import {
  workspaceUrl,
  wtsPath,
  externalLoginOptionsUrl,
  workspaceOptionsUrl,
  workspaceLaunchUrl,
  workspaceTerminateUrl,
  workspaceStatusUrl,
  workspacePageDescription,
} from '../localconf';
import './Workspace.less';
import { fetchWithCreds } from '../actions';
import Spinner from '../components/Spinner';
import jupyterIcon from '../img/icons/jupyter.svg';
import rStudioIcon from '../img/icons/rstudio.svg';
import galaxyIcon from '../img/icons/galaxy.svg';
import ohifIcon from '../img/icons/ohif-viewer.svg';
import WorkspaceOption from './WorkspaceOption';
import WorkspaceLogin from './WorkspaceLogin';

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
      notebookIsfullpage: false,
      externalLoginOptions: [],
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

  getExternalLoginOptions = () => {
    fetchWithCreds({
      path: `${externalLoginOptionsUrl}`,
      method: 'GET',
    }).then(
      ({ data }) => {
        this.setState({ externalLoginOptions: data.providers });
      },
    );
  }

  getWorkspaceStatus = async () => fetchWithCreds({
    path: `${workspaceStatusUrl}`,
    method: 'GET',
  }).then(
    ({ data }) => data.status,
  ).catch(() => 'Error');

  getIcon = (notebook) => {
    if (this.regIcon(notebook, 'R Studio')) {
      return rStudioIcon;
    } else if (this.regIcon(notebook, 'Jupyter')) {
      return jupyterIcon;
    } else if (this.regIcon(notebook, 'Galaxy')) {
      return galaxyIcon;
    } else if (this.regIcon(notebook, 'DICOM')) {
      return ohifIcon;
    }
    return jupyterIcon;
  }

  regIcon = (str, pattn) => new RegExp(pattn).test(str)

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
    this.getExternalLoginOptions();
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

  handleTerminateButtonClick = () => {
    // exit full page
    this.setState({ notebookIsfullpage: false });
    // terminate workspace
    this.terminateWorkspace();
  }

  handleFullpageButtonClick = () => {
    this.setState({
      notebookIsfullpage: !this.state.notebookIsfullpage,
    });
  }

  render() {
    const terminateButton = (
      <Button
        className='workspace__button'
        onClick={this.handleTerminateButtonClick}
        label='Terminate Workspace'
        buttonType='primary'
        isPending={this.state.notebookStatus === 'Terminating'}
      />
    );

    const cancelButton = (
      <Button
        className='workspace__button'
        onClick={() => this.terminateWorkspace()}
        label='Cancel'
        buttonType='primary'
        isPending={this.state.notebookStatus === 'Terminating'}
      />
    );

    const fullpageButton = (
      <Button
        className='workspace__button'
        onClick={this.handleFullpageButtonClick}
        label={this.state.notebookIsfullpage ? 'Exit Fullscreen' : 'Make Fullscreen'}
        buttonType='secondary'
        rightIcon={this.state.notebookIsfullpage ? 'back' : 'external-link'}
      />
    );

    if (this.state.connectedStatus && this.state.notebookStatus && !this.state.defaultNotebook) {
      // NOTE both the containing element and the iframe have class '.workspace',
      // although no styles should be shared between them. The reason for this
      // is for backwards compatibility with Jenkins integration tests that select by classname.
      return (
        <div
          className={`workspace ${this.state.notebookIsfullpage ? 'workspace--fullpage' : ''}`}
        >
          {
            this.state.notebookStatus === 'Running' ||
              this.state.notebookStatus === 'Stopped' ?
              <React.Fragment>
                <div className='workspace__iframe'>
                  <iframe
                    className='workspace'
                    title='Workspace'
                    frameBorder='0'
                    src={`${workspaceUrl}proxy/`}
                  />
                </div>
                <div className='workspace__buttongroup'>
                  { terminateButton }
                  { fullpageButton }
                </div>
              </React.Fragment>
              : null
          }
          {
            this.state.notebookStatus === 'Launching' ?
              <React.Fragment>
                <div className='workspace__spinner-container'>
                  <Spinner text='Launching Workspace, this process may take several minutes' />
                </div>
                <div className='workspace__buttongroup'>
                  { cancelButton }
                </div>
              </React.Fragment>
              : null
          }
          {
            this.state.notebookStatus === 'Terminating' ?
              <div className='workspace__spinner-container'>
                <Spinner text='Terminating workspace...' />
              </div>
              : null
          }
          {
            this.state.notebookStatus !== 'Launching' &&
            this.state.notebookStatus !== 'Terminating' &&
            this.state.notebookStatus !== 'Running' &&
            this.state.notebookStatus !== 'Stopped' ?
              <div>
                {workspacePageDescription ?
                  <p className='workspace__description'>
                    {parse(workspacePageDescription)}
                  </p>
                  : null}
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
                <WorkspaceLogin
                  providers={this.state.externalLoginOptions}
                />
              </div>
              : null
          }
        </div>
      );
    } else if (this.state.defaultNotebook && this.state.connectedStatus) {
      // If this commons does not use Hatchery to spawn workspaces, then this
      // default workspace is shown.
      return (
        <div className='workspace__default'>
          <iframe
            title='Workspace'
            frameBorder='0'
            className='workspace__iframe'
            src={workspaceUrl}
          />
        </div>
      );
    }
    return <Spinner />;
  }
}

export default Workspace;
