import React from 'react';
import PropTypes from 'prop-types'; // see https://github.com/facebook/prop-types#prop-types
import Select from 'react-select';
import { analysisApps } from '../localconf';
import './AnalysisApp.css';

class AnalysisApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jobInput: null,
      loaded: false,
      app: null,
    }
  }

  componentDidMount() {
    this.setState({
      app: analysisApps[this.props.params.app],
      loaded: true,
    })
  }

  onSubmitJob = (e) => {
    console.log('e', e.target)
    e.preventDefault();
    const inputId = this.state.jobInput ? this.state.jobInput : e.target.input.value;
    this.props.submitJob(inputId);
  }

  isJobRunning = () => this.props.job && this.props.job.status !== 'Completed';

  selectChange = (option) => {
    this.setState({ jobInput: option ? option.value : null });
  }

  render() {
    console.log('this.props', this.props)
    const { job } = this.props;
    const { loaded, app } = this.state;
    return (
      <React.Fragment>
      {
        loaded ?
          <div>
            <h3>{app.title}</h3>
            <p>{app.description}</p>
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
};

AnalysisApp.defaultProps = {
  job: {},
  submitJob: () => {}
}

export default AnalysisApp;
