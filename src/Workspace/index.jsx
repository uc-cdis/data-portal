import React from 'react';
import parse from 'html-react-parser';
import Button from '@gen3/ui-component/dist/components/Button';
import { Popconfirm, Steps } from 'antd';

import {
  workspaceUrl,
  wtsPath,
  externalLoginOptionsUrl,
  workspaceOptionsUrl,
  workspaceLaunchUrl,
  workspaceTerminateUrl,
  workspaceStatusUrl,
  workspacePageTitle,
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
import sessionMonitor from '../SessionMonitor';

const { Step } = Steps;
class Workspace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      connectedStatus: false,
      options: [],
      workspaceStatus: null,
      workspaceLaunchStepsConfig: null,
      interval: null,
      workspaceID: null,
      defaultWorkspace: false,
      workspaceIsFullpage: false,
      externalLoginOptions: [],
    };
    this.workspaceStates = [
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

  oniframeLoad = (e) => {
    // force workspace iframe acquire focus if it does not have yet
    // to fix the noVNC workspace doesn't respond to keyboard event when came up
    e.target.focus();

    // add event listeners for sessionMonitor timeout
    const iframeContent = e.target.contentDocument;
    if (iframeContent) {
      iframeContent.addEventListener('mousedown', () => sessionMonitor.updateUserActivity(), false);
      iframeContent.addEventListener('keypress', () => sessionMonitor.updateUserActivity(), false);
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
    ).catch(() => this.setState({ defaultWorkspace: true }));
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

  getWorkspaceStatus = async () => {
    const workspaceStatus = await fetchWithCreds({
      path: `${workspaceStatusUrl}`,
      method: 'GET',
    }).then(
      ({ data }) => data,
    ).catch(() => 'Error');
    if (workspaceStatus.status === 'Running' && (!this.state.workspaceStatus || this.state.workspaceStatus === 'Not Found' || this.state.workspaceStatus === 'Launching')) {
      await fetchWithCreds({
        path: `${workspaceUrl}proxy/`,
        method: 'GET',
      }).then(
        ({ status }) => {
          if (status !== 200) {
            workspaceStatus.status = 'Launching';
            workspaceStatus.conditions = [{
              type: 'ProxyConnected',
              status: 'False',
            }];
          }
        },
      ).catch(() => 'Error');
    }
    return workspaceStatus;
  }

  getIcon = (workspace) => {
    if (this.regIcon(workspace, 'R Studio') || this.regIcon(workspace, 'RStudio')) {
      return rStudioIcon;
    } if (this.regIcon(workspace, 'Jupyter')) {
      return jupyterIcon;
    } if (this.regIcon(workspace, 'Galaxy')) {
      return galaxyIcon;
    } if (this.regIcon(workspace, 'DICOM')) {
      return ohifIcon;
    }
    return jupyterIcon;
  }

  getWorkspaceLaunchSteps = (workspaceStatusData) => {
    if (!(workspaceStatusData.status !== 'Launching' || workspaceStatusData.status !== 'Stopped')
    || !workspaceStatusData.conditions || workspaceStatusData.conditions.length === 0) {
      // if status is not 'Launching', or 'Stopped',
      // or we don't have conditions array, don't display steps bar
      return undefined;
    }
    const workspaceLaunchStepsConfig = {
      currentIndex: 0,
      currentStepsStatus: 'process',
      steps: [
        {
          title: 'Scheduling Pod',
          description: '',
        },
        {
          title: 'Initializing Pod',
          description: '',
        },
        {
          title: 'Getting Containers Ready',
          description: '',
        },
        {
          title: 'Waiting for Proxy',
          description: '',
        },
      ],
    };
    // status: 'Stopped' means the pod has errored
    if (workspaceStatusData.status === 'Stopped') {
      workspaceLaunchStepsConfig.currentStepsStatus = 'error';
    }
    // update step description according to the condition array
    if (workspaceStatusData.conditions.some((element) => (
      (element.type === 'PodScheduled' && element.status === 'True')
    ))) {
      workspaceLaunchStepsConfig.steps[0].description = 'Pod scheduled';
    }
    if (workspaceStatusData.conditions.some((element) => (
      (element.type === 'Initialized' && element.status === 'True')
    ))) {
      workspaceLaunchStepsConfig.steps[1].description = 'Pod initialized';
    }

    // condition type: PodScheduled + status: false => at step 0
    if (workspaceStatusData.conditions.some((element) => (element.type === 'PodScheduled' && element.status === 'False'))) {
      workspaceLaunchStepsConfig.steps[0].description = 'In progress';
      return workspaceLaunchStepsConfig;
    }

    // condition type: Initialized + status: false => at step 1
    if (workspaceStatusData.conditions.some((element) => (element.type === 'Initialized' && element.status === 'False'))) {
      workspaceLaunchStepsConfig.currentIndex = 1;
      workspaceLaunchStepsConfig.steps[1].description = 'In progress';
      return workspaceLaunchStepsConfig;
    }

    // here we are at step 2
    if (workspaceStatusData.conditions.some((element) => (
      (element.type === 'ContainersReady' && element.status === 'False')
    ))) {
      workspaceLaunchStepsConfig.currentIndex = 2;
      workspaceLaunchStepsConfig.steps[2].description = 'In progress';
      return workspaceLaunchStepsConfig;
    }

    // here we are at step 3, step 3 have no k8s pod/container conditions
    workspaceLaunchStepsConfig.steps[0].description = 'Pod scheduled';
    workspaceLaunchStepsConfig.steps[1].description = 'Pod initialized';
    workspaceLaunchStepsConfig.steps[2].description = 'All containers are ready';

    // condition type: ProxyConnected + status: false => at step 3
    if (workspaceStatusData.conditions.some((element) => (element.type === 'ProxyConnected' && element.status === 'False'))) {
      workspaceLaunchStepsConfig.currentIndex = 3;
      workspaceLaunchStepsConfig.steps[3].description = 'In progress';
      return workspaceLaunchStepsConfig;
    }
    if (workspaceStatusData.conditions.some((element) => (element.type === 'ProxyConnected' && element.status === 'True'))) {
      workspaceLaunchStepsConfig.currentIndex = 3;
      workspaceLaunchStepsConfig.currentStepsStatus = 'success';
      workspaceLaunchStepsConfig.steps[3].description = 'Proxy is ready';
    }
    return workspaceLaunchStepsConfig;
  }

  regIcon = (str, pattn) => new RegExp(pattn).test(str)

  launchWorkspace = (workspace) => {
    this.setState({ workspaceID: workspace.id }, () => {
      fetchWithCreds({
        path: `${workspaceLaunchUrl}?id=${workspace.id}`,
        method: 'POST',
      }).then(() => {
        this.checkWorkspaceStatus();
      });
    });
  }

  terminateWorkspace = () => {
    this.setState({
      workspaceID: null,
      workspaceStatus: 'Terminating',
      workspaceLaunchStepsConfig: null,
    }, () => {
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
    if (!this.state.defaultWorkspace) {
      this.getWorkspaceStatus().then((data) => {
        if (data.status === 'Launching' || data.status === 'Terminating' || data.status === 'Stopped') {
          this.checkWorkspaceStatus();
        } else {
          this.setState({
            workspaceStatus: data.status,
            workspaceLaunchStepsConfig: null,
          });
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
        const data = await this.getWorkspaceStatus();
        if (this.workspaceStates.includes(data.status)) {
          const workspaceLaunchStepsConfig = this.getWorkspaceLaunchSteps(data);
          this.setState({
            workspaceStatus: data.status,
            workspaceLaunchStepsConfig,
          }, () => {
            if (this.state.workspaceStatus !== 'Launching'
              && this.state.workspaceStatus !== 'Terminating') {
              clearInterval(this.state.interval);
            }
          });
        }
      }, 5000);
      this.setState({ interval });
    } catch (e) {
      console.log('Error checking workspace status:', e);
    }
  }

  handleTerminateButtonClick = () => {
    // exit full page
    this.setState({ workspaceIsFullpage: false });
    // terminate workspace
    this.terminateWorkspace();
  }

  handleFullpageButtonClick = () => {
    this.setState((prevState) => ({
      workspaceIsFullpage: !prevState.workspaceIsFullpage,
    }));
  }

  render() {
    const terminateButton = (
      // wrap up terminate button with Popconfirm
      <Popconfirm
        title='Are you sure to terminate your workspace?'
        onConfirm={this.handleTerminateButtonClick}
        okText='Yes'
        cancelText='No'
      >
        <Button
          className='workspace__button'
          label='Terminate Workspace'
          buttonType='primary'
          isPending={this.state.workspaceStatus === 'Terminating'}
        />
      </Popconfirm>
    );

    const cancelButton = (
      <Button
        className='workspace__button'
        onClick={() => this.terminateWorkspace()}
        label='Cancel'
        buttonType='primary'
        isPending={this.state.workspaceStatus === 'Terminating'}
      />
    );

    const fullpageButton = (
      <Button
        className='workspace__button'
        onClick={this.handleFullpageButtonClick}
        label={this.state.workspaceIsFullpage ? 'Exit Fullscreen' : 'Make Fullscreen'}
        buttonType='secondary'
        rightIcon={this.state.workspaceIsFullpage ? 'back' : 'external-link'}
      />
    );

    if (this.state.connectedStatus && this.state.workspaceStatus && !this.state.defaultWorkspace) {
      // NOTE both the containing element and the iframe have class '.workspace',
      // although no styles should be shared between them. The reason for this
      // is for backwards compatibility with Jenkins integration tests that select by classname.
      return (
        <div
          className={`workspace ${this.state.workspaceIsFullpage ? 'workspace--fullpage' : ''}`}
        >
          {
            this.state.workspaceStatus === 'Running'
              ? (
                <React.Fragment>
                  <div className='workspace__iframe'>
                    <iframe
                      className='workspace'
                      title='Workspace'
                      frameBorder='0'
                      src={`${workspaceUrl}proxy/`}
                      onLoad={this.oniframeLoad}
                    />
                  </div>
                  <div className='workspace__buttongroup'>
                    { terminateButton }
                    { fullpageButton }
                  </div>
                </React.Fragment>
              )
              : null
          }
          {
            this.state.workspaceStatus === 'Launching'
            || this.state.workspaceStatus === 'Stopped'
              ? (
                <React.Fragment>
                  <div className='workspace__spinner-container'>
                    {(this.state.workspaceLaunchStepsConfig)
                      ? (
                        <Steps
                          current={this.state.workspaceLaunchStepsConfig.currentIndex}
                          status={this.state.workspaceLaunchStepsConfig.currentStepsStatus}
                        >
                          { (this.state.workspaceLaunchStepsConfig.steps.map((step) => (
                            <Step
                              key={step.title}
                              title={step.title}
                              description={step.description}
                            />
                          ))) }
                        </Steps>
                      )
                      : null}
                    {(this.state.workspaceStatus === 'Launching')
                      ? <Spinner text='Launching Workspace, this process may take several minutes' />
                      : null}
                  </div>
                  <div className='workspace__buttongroup'>
                    { cancelButton }
                  </div>
                </React.Fragment>
              )
              : null
          }
          {
            this.state.workspaceStatus === 'Terminating'
              ? (
                <div className='workspace__spinner-container'>
                  <Spinner text='Terminating workspace...' />
                </div>
              )
              : null
          }
          {
            this.state.workspaceStatus !== 'Launching'
            && this.state.workspaceStatus !== 'Terminating'
            && this.state.workspaceStatus !== 'Running'
            && this.state.workspaceStatus !== 'Stopped'
              ? (
                <div>
                  {workspacePageTitle
                    ? (
                      <h2 className='workspace__title'>
                        {parse(workspacePageTitle)}
                      </h2>
                    )
                    : null}
                  {workspacePageDescription
                    ? (
                      <div className='workspace__description'>
                        {parse(workspacePageDescription)}
                      </div>
                    )
                    : null}
                  <div className='workspace__options'>
                    {
                      this.state.options.map((option, i) => {
                        const desc = option['cpu-limit']
                          ? `${option['cpu-limit']}CPU, ${option['memory-limit']} memory`
                          : '';
                        return (
                          <WorkspaceOption
                            key={i}
                            icon={this.getIcon(option.name)}
                            title={option.name}
                            description={desc}
                            onClick={() => this.launchWorkspace(option)}
                            isPending={this.state.workspaceID === option.id}
                            isDisabled={
                              !!this.state.workspaceID
                            && this.state.workspaceID !== option.id
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
              )
              : null
          }
        </div>
      );
    } if (this.state.defaultWorkspace && this.state.connectedStatus) {
      // If this commons does not use Hatchery to spawn workspaces, then this
      // default workspace is shown.
      return (
        <div className='workspace__default'>
          <iframe
            title='Workspace'
            frameBorder='0'
            className='workspace__iframe'
            src={workspaceUrl}
            onLoad={this.oniframeLoad}
          />
        </div>
      );
    }
    return <Spinner />;
  }
}

export default Workspace;
