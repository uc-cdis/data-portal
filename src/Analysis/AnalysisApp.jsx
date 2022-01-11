import React from 'react';
import PropTypes from 'prop-types'; // see https://github.com/facebook/prop-types#prop-types
import Select from 'react-select';
import { Spin } from 'antd';
import Button from '@gen3/ui-component/dist/components/Button';
import BackLink from '../components/BackLink';
import HIVCohortFilter from '../HIVCohortFilter/HIVCohortFilter';
import ReduxGWASApp from './GWASApp/ReduxGWASApp';
import ReduxGWASUIApp from './GWASUIApp/ReduxGWASUIApp';
import { analysisApps } from '../localconf';
import './AnalysisApp.css';

class AnalysisApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jobInput: null,
      loaded: false,
      app: null,
      results: null,
      analysisIsFullscreen: false,
      isIframeApp: false,
    };
  }

  componentDidMount() {
    this.updateApp();
  }

  static getDerivedStateFromProps(props) {
    if (props.job && props.job.status === 'Completed') {
      this.fetchJobResult()
        .then((res) => ({ results: `${res.data.output}`.split('\n') }));
    }
    return null;
  }

  componentWillUnmount() {
    this.props.resetJobState();
  }

  onSubmitJob = (e) => {
    e.preventDefault();
    this.clearResult();
    this.props.submitJob({ organ: this.state.jobInput ? this.state.jobInput.value : null });
    this.props.checkJobStatus();
  }

  getAppContent = (app) => {
    switch (app) {
    case 'vaGWAS':
      return (
        <React.Fragment>
          <Select
            value={this.state.jobInput}
            placeholder='Select your organ'
            options={analysisApps[app].options}
            onChange={this.selectChange}
          />
          <Button label='Run Analysis' buttonType='primary' onClick={this.onSubmitJob} isPending={this.isJobRunning()} />
        </React.Fragment>
      );
    case 'ndhHIV':
      return (
        <HIVCohortFilter />
      );
    case 'ndhVirus':
      return (
        <React.Fragment>
          <input className='text-input' type='text' placeholder='input data' name='input' />
          <Button label='Run' buttonType='primary' onClick={this.onSubmitJob} isPending={this.isJobRunning()} />
        </React.Fragment>
      );
    case 'GWASApp':
      return (
        <ReduxGWASApp />
      );
    case 'GWASUIApp':
      return (
        <ReduxGWASUIApp />
      );
    default:
      return (
        <React.Fragment>
          <div className='analysis-app__iframe-wrapper'>
            <iframe
              className='analysis-app__iframe'
              title='Analysis App'
              frameBorder='0'
              src={`${this.state.app.applicationUrl}`}
              onLoad={this.handleIframeApp}
            />
          </div>
        </React.Fragment>
      );
    }
  }

  isJobRunning = () => this.props.job && this.props.job.status === 'Running';

  selectChange = (option) => {
    this.setState({
      jobInput: option,
      results: null,
    }, () => {
      if (option === null || this.props.job) {
        this.props.resetJobState();
      }
    });
  }

  fetchJobResult = async () => this.props.fetchJobResult(this.props.job.uid);

  clearResult = () => {
    this.setState({ results: null });
  }

  updateApp = async () => {
    this.setState({
      app: analysisApps[decodeURIComponent(this.props.params.app)],
      loaded: true,
    });
  }

  handleFullscreenButtonClick = () => {
    this.setState((prevState) => ({
      analysisIsFullscreen: !prevState.analysisIsFullscreen,
    }));
  }

  handleIframeApp = () => {
    this.setState({
      isIframeApp: true,
    });
  }

  render() {
    const { job, params } = this.props;
    const { loaded, app, results } = this.state;
    if (!app) {
      return <Spin size='large' tip='Loading App...' />;
    }

    const fullscreenButton = (
      <Button
        className='analysis-app__button'
        onClick={this.handleFullscreenButtonClick}
        label={this.state.analysisIsFullscreen ? 'Exit Fullscreen' : 'Make Fullscreen'}
        buttonType='secondary'
        rightIcon={this.state.analysisIsFullscreen ? 'back' : 'external-link'}
      />
    );
    const appContent = this.getAppContent(decodeURIComponent(params.app));
    let showJobStatus = false;
    if (!app.applicationUrl) {
      showJobStatus = true;
    }

    return (
      <div className='analysis-app-wrapper'>
        <BackLink url='/analysis' label='Back to Apps' />
        {
          loaded
            ? (
              <div className='analysis-app'>
                <h2 className='analysis-app__title'>{app.title}</h2>
                <p className='analysis-app__description'>{app.description}</p>
                <div className={`${this.state.analysisIsFullscreen ? 'analysis-app__fullscreen' : ''}`}>
                  <div className='analysis-app__actions'>
                    { appContent }
                  </div>
                  { this.state.isIframeApp
                    ? (
                      <div className='analysis-app__buttongroup'>
                        { fullscreenButton }
                      </div>
                    ) : null}
                </div>
                {(showJobStatus)
                  ? (
                    <div className='analysis-app__job-status'>
                      { this.isJobRunning() ? <Spin size='large' tip='Job in progress...' /> : null }
                      { job && job.status === 'Completed' ? <h3>Job Completed</h3> : null }
                      { job && job.status === 'Failed' ? <h3>Job Failed</h3> : null }
                      { results ? results.map((line, i) => <p key={i}>{line}</p>) : null }
                    </div>
                  )
                  : null}
              </div>
            )
            : null
        }
      </div>
    );
  }
}

AnalysisApp.propTypes = {
  job: PropTypes.object,
  submitJob: PropTypes.func.isRequired,
  resetJobState: PropTypes.func.isRequired,
  checkJobStatus: PropTypes.func.isRequired,
  fetchJobResult: PropTypes.func.isRequired,
  params: PropTypes.shape({
    app: PropTypes.string.isRequired,
  }).isRequired,
};

AnalysisApp.defaultProps = {
  job: null,
};

export default AnalysisApp;
