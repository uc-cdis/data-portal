import React from 'react';
import PropTypes from 'prop-types';
import { Space, Spin, Result } from 'antd';
import getReduxStore from '../reduxStore';
import Toaster from '@gen3/ui-component/dist/components/Toaster';
import Button from '@gen3/ui-component/dist/components/Button';
import {
  fetchDataset, fetchFiles, resetSingleStudyData, fetchStudyViewerConfig,
} from './reduxer';
import './StudyViewer.css';
import StudyCard from './StudyCard';
import { manifestServiceApiPath } from '../localconf';
import { fetchWithCreds } from '../actions';

class StudyViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataType: undefined,
      exportingPFBToWorkspace: false,
      toasterOpen: false,
      toasterHeadline: '',
      downloadingInProgress: {
        data: false,
      },
      exportPFBToWorkspaceGUID: '',
      exportPFBToWorkspaceStatus: null,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.job && !this.props.job.status) {
      this.onJobFailed('There was an error please refresh the page and try again');
    }
    if (this.props.job && this.props.job.status === 'Failed' && prevProps.job && prevProps.job.status !== 'Failed') {
      this.onJobFailed('There was an error exporting your cohort.');
    }
    if (this.props.job && this.props.job.status === 'Completed' && prevProps.job && prevProps.job.status !== 'Completed') {
      this.fetchJobResult()
        .then((res) => {
          if (this.state.exportingPFBToWorkspace) {
            const pfbGUID = `${res.data.output}`.split('\n')[0];
            this.sendPFBToWorkspace(pfbGUID);
          } else {
            console.log('this ran???');
            this.setState({
              exportPFBURL: `${res.data.output}`.split('\n'),
              toasterOpen: true,
              toasterHeadline: prevState.pfbSuccessText,
            });
          }
        });
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.match.params.dataType && nextProps.match.params.dataType !== prevState.dataType) {
      return { dataType: nextProps.match.params.dataType };
    }
    return null;
  }

  getPanelExpandStatus = (openMode, index) => {
    if (openMode === 'open-all') {
      return true;
    } if (openMode === 'close-all') {
      return false;
    }
    return (index === 0);
  }

  onJobFailed = (toasterHeadline) => {
    this.setState({
      toasterOpen: true,
      toasterHeadline,
      downloadingInProgress: { data: false },
    });
  }

  exportToWorkspace = (buttonConfig) => {
    //check if it is already running
    if (this.state.exportingPFBToWorkspace) {
      this.setState({
        toasterOpen: true,
        toasterHeadline: 'An export is already in progress.',
      });
      return false;
    }
    this.setState({
      exportingPFBToWorkspace: true,
      downloadingInProgress: { data: true },
      toasterOpen: true,
      exportPFBToWorkspaceGUID: '',
    });

    this.props.submitJob({
      action: 'export',
      access_format: 'guid',
      input: {filter: { "=": { auth_resource_path : buttonConfig.accessibleValidationValue } }, root_node: buttonConfig.root_node},
    });
    this.props.checkJobStatus();
    this.setState({
      toasterHeadline: 'Your export is in progress.',
    });
  };

  sendPFBToWorkspace = (pfbGUID) => {
    console.log('exportToWorkspace called');
    const JSONBody = { guid: pfbGUID };
    fetchWithCreds({
      path: `${manifestServiceApiPath}cohorts`,
      body: JSON.stringify(JSONBody),
      method: 'POST',
    })
      .then(
        ({ status, data }) => {
          const errorMsg = (data.error ? data.error : '');
          switch (status) {
          case 200:
            this.setState((prevState) => ({
              exportingPFBToWorkspace: false,
              exportPFBToWorkspaceGUID: pfbGUID,
              toasterOpen: true,
              toasterHeadline: 'A PFB for this cohort will be saved to your workspace. The GUID for your PFB is displayed below.',
              exportPFBToWorkspaceStatus: status,
              downloadingInProgress: { data: false },
            }));
            return;
          default:
            this.setState({
              exportingPFBToWorkspace: false,
              exportPFBToWorkspaceGUID: '',
              toasterOpen: true,
              toasterHeadline: `There was an error exporting your cohort (${status}). ${errorMsg}`,
              exportPFBToWorkspaceStatus: status,
              downloadingInProgress: { data: false },
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
      exportPFBURL: '',
    });
  };

  getToaster = () => ((
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
  ));

  render() {
    if (this.props.noConfigError) {
      this.props.history.push('/not-found');
    }

    if (!this.props.datasets) {
      if (this.state.dataType) {
        getReduxStore().then(
          (store) => Promise.allSettled(
            [
              store.dispatch(fetchDataset(decodeURIComponent(this.state.dataType))),
              store.dispatch(fetchFiles(decodeURIComponent(this.state.dataType), 'object')),
              store.dispatch(resetSingleStudyData()),
            ],
          ));
      }
      return (
        <div className='study-viewer'>
          <div className='study-viewer_loading'>
            <Spin size='large' tip='Loading data...' />
          </div>
        </div>
      );
    }

    const studyViewerConfig = fetchStudyViewerConfig(this.state.dataType);
    const { datasets } = this.props;
    const order = studyViewerConfig.defaultOrderBy;
    if (datasets.length === 0) {
      return (
        <div className='study-viewer'>
          <Result
            title='No data available'
          />
        </div>
      );
    }

    // handle openFirstRowAccessor
    if (datasets.length > 0
      && studyViewerConfig.openMode === 'open-first'
      && studyViewerConfig.openFirstRowAccessor !== ''
      && !order // defaultOrderBy overrides openFirstRowAccessor
    ) {
      datasets.forEach((item, i) => {
        if (item.rowAccessorValue === studyViewerConfig.openFirstRowAccessor) {
          datasets.splice(i, 1);
          datasets.unshift(item);
        }
      });
    }

    // sort items - order = [<field name>, <"asc" (default) or "desc">]
    if (order) {
      const field = order[0];
      const desc = (order.length > 1 && order[1] === 'desc') || false;
      datasets.sort((a, b) => {
        // find the field...
        let aVal = a[field]; // eg 'title', 'rowAccessorValue'...
        let bVal = b[field];
        if (!aVal || !bVal) {
          // eg a field from blockFields or tableFields
          Object.entries(a).forEach(([key, value]) => {
            if (value && value[field]) {
              aVal = value[field];
              bVal = b[key][field];
            }
          });
        }
        if (desc) {
          return (bVal > aVal) ? 1 : -1;
        }
        return (aVal > bVal) ? 1 : -1; // asc by default
      });
    }

    return (
      <div className='study-viewer'>
        <div className='h2-typo study-viewer__title'>
          {studyViewerConfig.title}
        </div>
        {(datasets.length > 0)
          ? (
            <Space className='study-viewer__space' direction='vertical'>
              {(datasets.map((d, i) => (
                <StudyCard
                  key={i}
                  data={d}
                  fileData={this.props.fileData
                    .filter((fd) => fd.rowAccessorValue === d.rowAccessorValue)}
                  studyViewerConfig={studyViewerConfig}
                  initialPanelExpandStatus={this.getPanelExpandStatus(studyViewerConfig.openMode, i)}
                  exportToWorkspaceAction={this.exportToWorkspace}
                  exportToWorkspaceEnabled={!this.state.exportingPFBToWorkspace}
                />
              )))}
            </Space>
          )
          : null}
          { this.getToaster() }
      </div>
    );
  }
}

StudyViewer.propTypes = {
  datasets: PropTypes.array,
  fileData: PropTypes.array,
  noConfigError: PropTypes.string,
  history: PropTypes.object.isRequired,
  match: PropTypes.shape(
    {
      params: PropTypes.object,
      path: PropTypes.string,
    },
  ).isRequired,
  submitJob: PropTypes.func.isRequired,
  resetJobState: PropTypes.func.isRequired,
  checkJobStatus: PropTypes.func.isRequired,
  fetchJobResult: PropTypes.func.isRequired,
  job: PropTypes.object,
};

StudyViewer.defaultProps = {
  datasets: undefined,
  fileData: [],
  noConfigError: undefined,
  job: null,
};

export default StudyViewer;
