import React from 'react';
import PropTypes from 'prop-types'; // see https://github.com/facebook/prop-types#prop-types
import Select from 'react-select';
import { overrideSelectTheme } from '../utils';
import Button from '../gen3-ui-component/components/Button';
import BackLink from '../components/BackLink';
import Spinner from '../components/Spinner';
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
    };
  }

  componentDidMount() {
    this.updateApp();
  }

  componentDidUpdate() {
    if (this.props.job && this.props.job.status === 'Completed') {
      this.fetchJobResult().then((res) => {
        this.setState({ results: `${res.data.output}`.split('\n') });
      });
    }
  }

  componentWillUnmount() {
    this.props.resetJobState();
  }

  onSubmitJob = (e) => {
    e.preventDefault();
    this.clearResult();
    this.props.submitJob({
      organ: this.state.jobInput ? this.state.jobInput.value : null,
    });
    this.props.checkJobStatus();
  };

  getAppContent = (app) => {
    switch (app) {
      case 'vaGWAS':
        return (
          <>
            <Select
              value={this.state.jobInput}
              placeholder='Select your organ'
              options={analysisApps[app].options}
              onChange={this.selectChange}
              theme={overrideSelectTheme}
            />
            <Button
              label='Run Analysis'
              buttonType='primary'
              onClick={this.onSubmitJob}
              isPending={this.isJobRunning()}
            />
          </>
        );
      default:
        return (
          <>
            <input
              className='text-input'
              type='text'
              placeholder='input data'
              name='input'
            />
            <Button
              label='Run'
              buttonType='primary'
              onClick={this.onSubmitJob}
              isPending={this.isJobRunning()}
            />
          </>
        );
    }
  };

  isJobRunning = () => this.props.job && this.props.job.status === 'Running';

  selectChange = (option) => {
    this.setState(
      {
        jobInput: option,
        results: null,
      },
      () => {
        if (option === null || this.props.job) {
          this.props.resetJobState();
        }
      }
    );
  };

  fetchJobResult = async () => this.props.fetchJobResult(this.props.job.uid);

  clearResult = () => {
    this.setState({ results: null });
  };

  updateApp = async () => {
    this.setState({
      app: analysisApps[this.props.params.app],
      loaded: true,
    });
  };

  render() {
    const { job, params } = this.props;
    const { loaded, app, results } = this.state;
    const appContent = this.getAppContent(params.app);

    return (
      <div className='analysis-app-wrapper'>
        <BackLink url='/analysis' label='Back to Apps' />
        {loaded ? (
          <div className='analysis-app'>
            <h2 className='analysis-app__title'>{app.title}</h2>
            <p className='analysis-app__description'>{app.description}</p>
            <div className='analysis-app__actions'>{appContent}</div>
            <div className='analysis-app__job-status'>
              {this.isJobRunning() ? (
                <Spinner text='Job in progress...' />
              ) : null}
              {job && job.status === 'Completed' ? (
                <h3>Job Completed</h3>
              ) : null}
              {job && job.status === 'Failed' ? <h3>Job Failed</h3> : null}
              {results ? results.map((line, i) => <p key={i}>{line}</p>) : null}
            </div>
          </div>
        ) : null}
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
