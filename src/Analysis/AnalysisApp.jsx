import React from 'react';
import PropTypes from 'prop-types'; // see https://github.com/facebook/prop-types#prop-types
import Select from 'react-select';
import BackLink from '../components/BackLink';
import { analysisApps } from '../localconf';
import './AnalysisApp.css';

class AnalysisApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jobInput: null,
      loaded: false,
      app: null,
    };
  }

  componentDidMount() {
    this.updateApp();
  }

  onSubmitJob = (e) => {
    e.preventDefault();
    const inputId = this.state.jobInput ? this.state.jobInput : e.target.input.value;
    this.props.submitJob(inputId);
  }

  updateApp = () => {
    this.setState({
      app: analysisApps[this.props.params.app],
      loaded: true,
    });
  }

  isJobRunning = () => this.props.job && this.props.job.status !== 'Completed';

  selectChange = (option) => {
    this.setState({ jobInput: option ? option.value : null });
  }

  render() {
    const { job } = this.props;
    const { loaded, app } = this.state;
    return (
      <React.Fragment>
        <BackLink url='/analysis' label='Back to Apps' />
        {
          loaded ?
            <div>
              <h2 className='analysis-app__title'>{app.title}</h2>
              <p className='analysis-app__description'>{app.description}</p>
              <form className='analysis-app__form' onSubmit={this.onSubmitJob}>
                {
                  app.id === 'vaGWAS' ?
                    <Select
                      value={this.state.jobInput}
                      placeholder='Select your organ'
                      options={app.options}
                      onChange={this.selectChange}
                    />
                    : <input className='text-input' type='text' placeholder='input data' name='input' />
                }
                <button href='#' className='button button-primary-orange' onSubmit={this.onSubmitJob} >Run simulation</button>
              </form>
              {
                this.isJobRunning() &&
              <p className='analysis-app__job-status'>Job running... </p>
              }
              {/* TODO: only render if result is a image */}
              {
                (job && job.status === 'Completed') &&
              <img className='analysis-app__result-image' src={job.resultURL} alt='analysis result' />
              }
            </div>
            : null
        }
      </React.Fragment>
    );
  }
}

AnalysisApp.propTypes = {
  job: PropTypes.object,
  submitJob: PropTypes.func,
  params: PropTypes.shape({
    app: PropTypes.string.isRequired,
  }).isRequired,
};

AnalysisApp.defaultProps = {
  job: null,
  submitJob: () => {},
};

export default AnalysisApp;
