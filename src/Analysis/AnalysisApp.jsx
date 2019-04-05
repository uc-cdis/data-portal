import React from 'react';
import PropTypes from 'prop-types'; // see https://github.com/facebook/prop-types#prop-types
import Select from 'react-select';
import Button from '@gen3/ui-component/dist/components/Button';
import BackLink from '../components/BackLink';
import Spinner from '../components/Spinner';
import { fetchArrangerGraphQL } from '../actions';
import { analysisApps } from '../localconf';
import './AnalysisApp.css';

class AnalysisApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jobInput: null,
      loaded: false,
      app: null,
      options: null,
      result: null,
    };
  }

  componentDidMount() {
    this.updateApp();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.job.status === 'Complete') {
      this.fetchJobResult().then(result => this.setState({ result }));
    }
  }

  componentWillUnmount() {
    this.props.resetJobState();
  }

  onSubmitJob = (e) => {
    e.preventDefault();
    this.props.submitJob({ organ: this.state.jobInput });
    this.props.checkJobStatus();
  }

  fetchGWASOrganOptions = async () => fetchArrangerGraphQL({
    query: '{ patients{ aggregations { Oncology_Primary__ICDOSite { buckets { key } } } } }',
  }).then(organs =>
    organs.data.patients.aggregations.Oncology_Primary__ICDOSite.buckets
      .map(bucket => ({ label: bucket.key, value: bucket.key })));

  updateApp = async () => {
    this.setState({
      app: analysisApps[this.props.params.app],
      loaded: true,
      options: this.props.params.app === 'vaGWAS' ? await this.fetchGWASOrganOptions() : null,
    });
  }

  isJobRunning = () => this.props.job && this.props.job.status === 'Running';

  selectChange = (option) => {
    this.setState({ jobInput: option ? option.value : null });
  }

  fetchJobResult = async () => this.props.fetchJobResult(this.props.job.uid)

  render() {
    const { job, params } = this.props;
    const { loaded, app, options, result } = this.state;

    return (
      <React.Fragment>
        <BackLink url='/analysis' label='Back to Apps' />
        {
          loaded ?
            <div className='analysis-app'>
              <h2 className='analysis-app__title'>{app.title}</h2>
              <p className='analysis-app__description'>{app.description}</p>
              <div className='analysis-app__actions'>
                {
                  params.app === 'vaGWAS' ?
                    <Select
                      value={this.state.jobInput}
                      placeholder='Select your organ'
                      options={options}
                      onChange={this.selectChange}
                    />
                    : <input className='text-input' type='text' placeholder='input data' name='input' />
                }
                <Button label='Run Simulation' buttonType='primary' onClick={this.onSubmitJob} isPending={this.isJobRunning()} />
              </div>
              <div className='analysis-app__job-status'>
                { this.isJobRunning() ? <Spinner text='Job in progress...' /> : null }
                { job && job.status === 'Completed' ? <h3>Job Completed</h3> : null }
                { job && job.status === 'Failed' ? <h3>Job Failed</h3> : null }
                { result }
              </div>
            </div>
            : null
        }
      </React.Fragment>
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
