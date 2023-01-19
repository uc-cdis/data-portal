import React from 'react';
import PropTypes from 'prop-types';
import Toaster from '@gen3/ui-component/dist/components/Toaster';
import Button from '@gen3/ui-component/dist/components/Button';
import { manifestServiceApiPath } from '../localconf';
import { fetchWithCreds } from '../actions';

class ExportToWorkspace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toasterOpen: false,
      toasterHeadline: '',
      exportPFBToWorkspaceGUID: '',
      exportPFBToWorkspaceStatus: null,
      jobFailed: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.exportToWorkspaceAction
      && this.props.exportToWorkspaceAction.accessibleValidationValue
      && !this.props.exportingPFBToWorkspace
      && this.props.exportToWorkspaceAction.accessibleValidationValue !== prevProps.exportToWorkspaceAction.accessibleValidationValue) {
      this.exportToWorkspace(this.props.exportToWorkspaceAction);
    }
    if (this.props.job && !this.props.job.status && !this.state.jobFailed) {
      this.onJobFailed('There was an error, please refresh the page and try again');
    }
    if (this.props.job && this.props.job.status === 'Failed' && prevProps.job && prevProps.job.status !== 'Failed' && !this.state.jobFailed) {
      this.onJobFailed('There was an error exporting your cohort, please refresh the page and try again');
    }
    if (this.props.job && this.props.job.status === 'Completed' && prevProps.job && prevProps.job.status !== 'Completed') {
      this.fetchJobResult()
        .then((res) => {
          if (this.props.exportingPFBToWorkspace) {
            const pfbGUID = `${res.data.output}`.split('\n')[0];
            this.sendPFBToWorkspace(pfbGUID);
          }
        });
    }
  }

  onJobFailed = (toasterHeadline) => {
    this.setState({
      toasterOpen: true,
      toasterHeadline,
      jobFailed: true,
    });
    this.props.exportingPFBToWorkspaceStateChange(false);
  }

  exportToWorkspace = (buttonConfig) => {
    this.props.exportingPFBToWorkspaceStateChange(true);
    this.setState({
      toasterOpen: true,
      exportPFBToWorkspaceGUID: '',
      jobFailed: false,
    });

    this.props.submitJob({
      action: 'export',
      access_format: 'guid',
      input: { filter: { '=': { auth_resource_path: buttonConfig.accessibleValidationValue } }, root_node: buttonConfig.root_node },
    });
    this.props.checkJobStatus();
    this.setState({
      toasterHeadline: 'Your export is in progress.',
    });
  };

  sendPFBToWorkspace = (pfbGUID) => {
    const JSONBody = { guid: pfbGUID };
    fetchWithCreds({
      path: `${manifestServiceApiPath}cohorts`,
      body: JSON.stringify(JSONBody),
      method: 'POST',
    })
      .then(
        ({ status, data }) => {
          const errorMsg = (data.error ? data.error : '');
          this.props.exportingPFBToWorkspaceStateChange(false);
          switch (status) {
          case 200:
            this.setState(() => ({
              exportPFBToWorkspaceGUID: pfbGUID,
              toasterOpen: true,
              toasterHeadline: 'The data has been exported to your workspace',
              exportPFBToWorkspaceStatus: status,
            }));
            return;
          default:
            this.setState({
              exportPFBToWorkspaceGUID: '',
              toasterOpen: true,
              toasterHeadline: `There was an error exporting your cohort (${status}). ${errorMsg}`,
              exportPFBToWorkspaceStatus: status,
            });
          }
        },
      );
  };

  isPFBRunning = () => this.props.job && this.props.job.status === 'Running';

  fetchJobResult = async () => this.props.fetchJobResult(this.props.job.uid);

  gotoWorkspace = () => this.props.history.push('/workspace');

  closeToaster = () => {
    this.setState({
      toasterOpen: false,
      toasterHeadline: '',
    });
  };

  render() {
    return (
      <Toaster isEnabled={this.state.toasterOpen} className={'explorer-button-group__toaster-div'}>
        <Button
          className='explorer-button-group__toaster-button'
          onClick={() => this.closeToaster()}
          label='Close'
          buttonType='primary'
          enabled
        />
        { (this.state.exportPFBToWorkspaceStatus === 200)
          ? (
            <Button
              className='explorer-button-group__toaster-button'
              label='Go To Workspace'
              buttonType='primary'
              enabled
              onClick={this.gotoWorkspace}
            />
          )
          : null}
        {
          <div className='explorer-button-group__toaster-text'>
            <div> {this.state.toasterHeadline} </div>
            { (this.state.exportPFBToWorkspaceGUID)
              ? <div>{ this.state.exportPFBToWorkspaceGUID } </div>
              : null}
            { (this.isPFBRunning())
              ? <div>Please do not navigate away from this page until your export is finished.</div>
              : null}
          </div>
        }
      </Toaster>
    );
  }
}

ExportToWorkspace.propTypes = {
  submitJob: PropTypes.func.isRequired,
  checkJobStatus: PropTypes.func.isRequired,
  fetchJobResult: PropTypes.func.isRequired,
  job: PropTypes.object,
  exportToWorkspaceAction: PropTypes.object.isRequired,
  exportingPFBToWorkspaceStateChange: PropTypes.func.isRequired,
  exportingPFBToWorkspace: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
};

ExportToWorkspace.defaultProps = {
  job: null,
};

export default ExportToWorkspace;
