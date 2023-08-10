import React from 'react';
import { Redirect } from 'react-router-dom';
import parse from 'html-react-parser';
import Button from '@gen3/ui-component/dist/components/Button';
import {
  Popconfirm, Steps, Collapse, Row, Col, Statistic, Alert, message, Card,
  Menu, Dropdown, Button as Btn, Tooltip, Space,
} from 'antd';
import { datadogRum } from '@datadog/browser-rum';

import {
  DownOutlined, UserOutlined, QuestionCircleOutlined, LoadingOutlined, ExclamationCircleOutlined,
} from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import isEnabled from '../helpers/featureFlags';
import {
  workspaceUrl,
  externalLoginOptionsUrl,
  workspaceOptionsUrl,
  workspaceLaunchUrl,
  workspaceTerminateUrl,
  workspaceStatusUrl,
  workspaceSetPayModelUrl,
  workspaceAllPayModelsUrl,
  workspacePageTitle,
  workspacePageDescription,
  stridesPortalURL,
  showExternalLoginsOnProfile,
  workspaceErrorUrl,
} from '../localconf';
import './Workspace.less';
import { fetchWithCreds } from '../actions';
import getReduxStore from '../reduxStore';
import Spinner from '../components/Spinner';
import jupyterIcon from '../img/icons/jupyter.svg';
import rStudioIcon from '../img/icons/rstudio.svg';
import rLogoIcon from '../img/icons/rlogo.svg';
import galaxyIcon from '../img/icons/galaxy.svg';
import ohifIcon from '../img/icons/ohif-viewer.svg';
import WorkspaceOption from './WorkspaceOption';
import WorkspaceLogin from './WorkspaceLogin';
import sessionMonitor from '../SessionMonitor';
import workspaceSessionMonitor from './WorkspaceSessionMonitor';
import { initWorkspaceRefreshToken } from './WorkspaceRefreshToken';

const { Step } = Steps;
const { Panel } = Collapse;

class Workspace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      connectedStatus: false,
      options: [],
      workspaceStatus: null,
      workspaceLaunchStepsConfig: null,
      interval: null,
      payModelInterval: null,
      workspaceID: null,
      hasWorkspaceAccess: true,
      workspaceIsFullpage: false,
      externalLoginOptions: [],
      payModel: {},
    };
    this.workspaceStates = [
      'Not Found',
      'Launching',
      'Terminating',
      'Running',
      'Stopped',
      'Errored',
    ];
  }

  componentDidMount() {
    // Check if workspaceTokenServiceRefreshTokenAtLogin is NOT set.
    // Because if is already enabled, then an extra refresh is not
    // really needed, since it has already happened at login, so just call the callback:
    if (!isEnabled('workspaceTokenServiceRefreshTokenAtLogin')) {
      const redirectLocation = { from: `${window.location.pathname}` };
      initWorkspaceRefreshToken(redirectLocation, this.connected);
    } else {
      this.connected();
    }
  }

  componentWillUnmount() {
    if (this.state.interval) {
      clearInterval(this.state.interval);
    }
    if (this.state.payModelInterval) {
      clearInterval(this.state.payModelInterval);
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
        const sortedResults = data.sort((a, b) => {
          if (a.name === b.name) {
            return 0;
          }
          if (a.name < b.name) {
            return -1;
          }
          return 1;
        });
        this.setState({ options: sortedResults });
      },
    ).catch(() => this.setState({ hasWorkspaceAccess: false }));
  }

  getExternalLoginOptions = () => {
    fetchWithCreds({
      path: `${externalLoginOptionsUrl}`,
      method: 'GET',
    }).then(
      ({ data }) => {
        this.setState({ externalLoginOptions: data.providers || [] });
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

  getWorkspacePayModel = async () => {
    const payModels = await fetchWithCreds({
      path: `${workspaceAllPayModelsUrl}`,
      method: 'GET',
    }).then(
      ({ status, data }) => {
        if (status === 200) {
          return data;
        }
        return null;
      }).catch(() => 'Error');

    return payModels || {};
  }

  getIcon = (workspace) => {
    if (this.regIcon(workspace, 'R Studio') || this.regIcon(workspace, 'RStudio')) {
      return rStudioIcon;
    } if (this.regIcon(workspace, 'R Notebook')) {
      return rLogoIcon;
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
      const cs = workspaceStatusData.containerStates;
      console.log('container status length:' + cs.length);

      if (cs.some((element) => (
        (element.state && element.state.terminated)
      ))) {
        workspaceLaunchStepsConfig.steps[2].description = 'Error';
        workspaceLaunchStepsConfig.currentStepsStatus = 'error';
      }
      else
      {
        if(cs.length > 1)
        {
          //Display Detailed Pod Statuses
          for (let i = 0; i < cs.length; i++)
          {
            let j = i+1
            workspaceLaunchStepsConfig.steps[2].description = workspaceLaunchStepsConfig.steps[2].description.concat(' \n Container ' + j + ' Ready: ' + cs[i].ready);
          }
        }
      }
      return workspaceLaunchStepsConfig;
    }

    // here we are at step 3, step 3 have no k8s pod/container conditions
    workspaceLaunchStepsConfig.steps[0].description = 'Pod scheduled';
    workspaceLaunchStepsConfig.steps[1].description = 'Pod initialized';

    // Display ECS status
    if(workspaceStatusData.workspaceType == 'ECS')
    {
      workspaceLaunchStepsConfig.currentIndex = 2;
      if(workspaceStatusData.status == 'Launching')
      {
        workspaceLaunchStepsConfig.steps[2].description = 'ECS task pending';
      }
      else if(workspaceStatusData.status != 'Active')
      {
        workspaceLaunchStepsConfig.steps[2].description = 'ECS task failed';
      }
      return workspaceLaunchStepsConfig;
    }

    workspaceLaunchStepsConfig.steps[2].description = 'All containers are ready';

    // condition type: ProxyConnected + status: false => at step 3
    if (workspaceStatusData.conditions.some((element) => (element.type === 'ProxyConnected' && element.status === 'False'))) {
      workspaceLaunchStepsConfig.currentIndex = 3;
      workspaceLaunchStepsConfig.steps[3].description = 'In progress. If you are stuck here for more than a few minutes, cancel launch and try again or contact user support.';
      return workspaceLaunchStepsConfig;
    }
    if (workspaceStatusData.conditions.some((element) => (element.type === 'ProxyConnected' && element.status === 'True'))) {
      workspaceLaunchStepsConfig.currentIndex = 3;
      workspaceLaunchStepsConfig.currentStepsStatus = 'success';
      workspaceLaunchStepsConfig.steps[3].description = 'Proxy is ready';
    }
    return workspaceLaunchStepsConfig;
  }

  regIcon = (str, pattern) => new RegExp(pattern).test(str)

  launchWorkspace = (workspace) => {
    this.setState({ workspaceID: workspace.id }, () => {
      fetchWithCreds({
        path: `${workspaceLaunchUrl}?id=${workspace.id}`,
        method: 'POST',
      }).then(({ status }) => {
        switch (status) {
        case 200:
          datadogRum.addAction('workspaceLaunch', {
            workspaceName: workspace.name,
          });
          this.checkWorkspaceStatus();
          break;
        default:
          message.error('There is an error when trying to launch your workspace');
          this.setState({
            workspaceID: null,
            workspaceLaunchStepsConfig: null,
          });
        }
      });
    });
  }

  terminateWorkspace = () => {
    this.setState({
      workspaceID: null,
      workspaceStatus: 'Terminating',
      workspaceLaunchStepsConfig: null,
    }, () => {
      getReduxStore().then(
        (store) => {
          // dismiss all banner/popup, if any
          store.dispatch({ type: 'UPDATE_WORKSPACE_ALERT', data: { showShutdownPopup: false, showShutdownBanner: false } });
        },
      );
      fetchWithCreds({
        path: `${workspaceTerminateUrl}`,
        method: 'POST',
      }).then(() => {
        this.checkWorkspaceStatus({ triggerPayModelCall: true });
      });
    });
  }

  connected = () => {
    this.getWorkspaceOptions();
    this.getExternalLoginOptions();
    this.getWorkspacePayModel().then((data) => {
      if (Object.keys(data).length) {
        // only set the interval when there are pay model data
        this.checkWorkspacePayModel();
      }
      this.setState({
        payModel: data,
      });
    });
    if (this.state.hasWorkspaceAccess) {
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

  checkWorkspaceStatus = async (args) => {
    if (this.state.interval) {
      clearInterval(this.state.interval);
    }
    try {
      const interval = setInterval(async () => {
        const data = await this.getWorkspaceStatus();
        if (this.workspaceStates.includes(data.status)) {
          const workspaceLaunchStepsConfig = this.getWorkspaceLaunchSteps(data);
          let workspaceStatus = data.status;
          if (args?.triggerPayModelCall && workspaceStatus === 'Not Found') {
            this.getWorkspacePayModel().then((payModelData) => {
              this.setState({
                payModel: payModelData,
              });
            });
          }
          if (workspaceLaunchStepsConfig && workspaceLaunchStepsConfig.currentStepsStatus === 'error') {
            workspaceStatus = 'Stopped';
          }
          this.setState({
            workspaceStatus,
            workspaceLaunchStepsConfig,
          }, () => {
            if (this.state.workspaceStatus !== 'Launching'
              && this.state.workspaceStatus !== 'Terminating') {
              if (data.idleTimeLimit > 0) {
                // start ws session monitor only if idleTimeLimit exists
                workspaceSessionMonitor.start();
              }
              clearInterval(this.state.interval);
            }
          });
        } else if (data.status && data.status.toLowerCase().includes('Exception')) {
          this.setState({
            workspaceStatus: 'Errored',
          });
        }
      }, 10000);
      this.setState({ interval });
    } catch (e) {
      console.log('Error checking workspace status:', e);
    }
  }

  checkWorkspacePayModel = async () => {
    if (this.state.payModelInterval) {
      clearInterval(this.state.payModelInterval);
    }
    try {
      const payModelInterval = setInterval(async () => {
        const data = await this.getWorkspacePayModel();
        this.setState({
          payModel: data,
        });
      }, 30000);
      this.setState({ payModelInterval });
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

  handleMenuClick = async (e) => {
    if (this.state.payModel.all_pay_models[e.key].request_status === 'above limit') {
      message.error('Selected pay model usage has exceeded its available funding. Please choose another pay model. Contact brhsupport@datacommons.io with questions.');
      return;
    }
    await fetchWithCreds({
      path: `${workspaceSetPayModelUrl}?id=${this.state.payModel.all_pay_models[e.key].bmh_workspace_id}`,
      method: 'POST',
    }).then(({ status }) => {
      if (status === 200) {
        this.getWorkspacePayModel().then((data) => {
          this.setState({
            payModel: data,
          });
        });
      }
    });
  };

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

    const menu = (
      <Menu onClick={this.handleMenuClick}>
        {
          ((this.state.payModel.all_pay_models !== null && this.state.payModel.all_pay_models !== undefined)) ? (
            this.state.payModel.all_pay_models.map((option, i) => (
              <Menu.Item
                key={i}
                id={option.bmh_workspace_id}
                icon={option.request_status === 'active' ? <UserOutlined /> : <ExclamationCircleOutlined />}
              >
                {`${option.workspace_type} \t - $${Number.parseFloat(option['total-usage']).toFixed(2)} \t ${option.request_status ? `(${option.request_status})` : ''}`}
              </Menu.Item>
            ))
          ) : null
        }
      </Menu>
    );

    if (this.state.connectedStatus && this.state.workspaceStatus && this.state.hasWorkspaceAccess) {
      // NOTE both the containing element and the iframe have class '.workspace',
      // although no styles should be shared between them. The reason for this
      // is for backwards compatibility with Jenkins integration tests that select by classname.
      const showExternalLoginsHintBanner = this.state.externalLoginOptions.length > 0
        && this.state.externalLoginOptions.some((option) => !option.refresh_token_expiration);
      const isPayModelAboveLimit = this.state.payModel.current_pay_model?.request_status === 'above limit';
      const isPaymodelNeededToLaunch = Object.keys(this.state.payModel).length > 0 && this.state.payModel.current_pay_model == null;
      return (
        <div
          className={`workspace ${this.state.workspaceIsFullpage ? 'workspace--fullpage' : ''}`}
        >
          {
            (Object.keys(this.state.payModel).length > 0) ? (
              <Collapse defaultActiveKey={['1']} className='workspace__pay-model' onClick={(event) => event.stopPropagation()}>
                <Panel header='Account Information' key='1'>
                  <Row gutter={{
                    xs: 8, sm: 16, md: 24, lg: 32,
                  }}
                  >
                    <Col className='gutter-row' span={8}>
                      <Card
                        title='Account'
                        extra={(stridesPortalURL)
                          ? (
                            <a href={stridesPortalURL} target='_blank' rel='noreferrer'>
                              <Space>
                                Workspace Account Manager
                                <Tooltip title='This link is external'>
                                  <FontAwesomeIcon
                                    icon={'external-link-alt'}
                                  />
                                </Tooltip>
                              </Space>
                            </a>
                          )
                          : null}
                      >
                        {(this.state.workspaceStatus !== 'Not Found')
                          ? (
                            <div className='workspace__pay-model-selector'>
                              <Dropdown overlay={menu} disabled>
                                <Btn block size='large'>
                                  {(this.state.payModel.current_pay_model) ? (this.state.payModel.current_pay_model.workspace_type || 'N/A') : 'Select a Pay model'} <LoadingOutlined />
                                </Btn>
                              </Dropdown>
                              <Tooltip title='Switching paymodels is only allowed when you have no running workspaces.'>
                                <QuestionCircleOutlined className='workspace__pay-model-selector-icon' />
                              </Tooltip>
                            </div>
                          ) : (
                            <div className='workspace__pay-model-selector'>
                              <Dropdown overlay={menu}>
                                <Btn block size='large'>
                                  {(this.state.payModel.current_pay_model) ? (this.state.payModel.current_pay_model.workspace_type || 'N/A') : 'Select a Pay model'} <DownOutlined />
                                </Btn>
                              </Dropdown>
                              {(this.state.workspaceStatus === 'Errored') ? (
                                <Tooltip title='There is an error with this pay model, please contact support for help.'>
                                  <ExclamationCircleOutlined className='workspace__pay-model-selector-icon__error' />
                                </Tooltip>
                              ) : null}
                            </div>
                          )}
                      </Card>
                    </Col>
                    <Col className='gutter-row' span={8}>
                      <Card title='Total Charges (USD)'>
                        <Statistic value={Number.isNaN(Number.parseFloat(this.state.payModel.current_pay_model?.['total-usage'])) ? 'N/A' : this.state.payModel.current_pay_model?.['total-usage']} precision={2} />
                      </Card>
                    </Col>
                    <Col className='gutter-row' span={8}>
                      <Card title='Spending Limit (USD)'>
                        <Statistic precision={2} value={Number.isNaN(Number.parseFloat(this.state.payModel.current_pay_model?.['hard-limit'])) ? 'N/A' : this.state.payModel.current_pay_model?.['hard-limit']} />
                      </Card>
                    </Col>
                  </Row>
                  <Row gutter={{
                    xs: 8, sm: 16, md: 24, lg: 32,
                  }}
                  >
                    <Col className='gutter-row' span={32} />
                  </Row>
                </Panel>
              </Collapse>
            )
              : null
          }
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
                    {terminateButton}
                    {fullpageButton}
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
                          {(this.state.workspaceLaunchStepsConfig.steps.map((step) => (
                            <Step
                              classname = 'workspaceStep'
                              key={step.title}
                              title={step.title}
                              description={step.description}
                            />
                          )))}
                        </Steps>
                      )
                      : null}
                    {(this.state.workspaceStatus === 'Launching')
                      ? <Spinner text='Launching Workspace, this process may take several minutes' />
                      : null}
                    {(this.state.workspaceStatus === 'Stopped')
                      ? (
                        <div className='spinner'>
                          <div className='spinner__text'>
                            {'The Workspace launching process has stopped, please click the Cancel button and try again'}
                          </div>
                        </div>
                      )
                      : null}
                  </div>
                  <div className='workspace__buttongroup'>
                    {cancelButton}
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
                  {isPaymodelNeededToLaunch
                    ? (
                      <Alert
                        description='Please Select a Paymodel in order to launch a workspace'
                        type='error'
                        banner
                        closable
                      />
                    )
                    : null}
                  {showExternalLoginsHintBanner
                    ? (
                      <Alert
                        description={
                          showExternalLoginsOnProfile
                            ? 'To analyze all data to which you have access, please authorize external data resources in the Profile page.'
                            : 'Please link account to additional data resources at the bottom of the page'
                        }
                        type='info'
                        banner
                        closable
                      />
                    )
                    : null}
                  {isPayModelAboveLimit
                    ? (
                      <Alert
                        description='Selected pay model usage has exceeded its available funding.  Please replenish your funds or choose a different pay model. Contact brhsupport@datacommons.io if you have questions.'
                        type='error'
                        banner
                        closable
                      />
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
                              (!!this.state.workspaceID
                              && this.state.workspaceID !== option.id)
                              || isPayModelAboveLimit
                              || isPaymodelNeededToLaunch
                            }
                          />
                        );
                      })
                    }
                  </div>
                  {
                    (!showExternalLoginsOnProfile)
                    && (
                      <WorkspaceLogin
                        providers={this.state.externalLoginOptions}
                      />
                    )
                  }
                </div>
              )
              : null
          }
        </div>
      );
    } if (this.state.connectedStatus && !this.state.hasWorkspaceAccess) {
      if (isEnabled('workspaceRegistration')) {
        console.log('This is navigated to workspace register page');
        return <Redirect to='/workspace/request-access' />;
      }
      return <Redirect to={workspaceErrorUrl} />;
    }
    return <Spinner />;
  }
}

export default Workspace;
