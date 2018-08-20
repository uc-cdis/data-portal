import React from 'react';
import PropTypes from 'prop-types'; // see https://github.com/facebook/prop-types#prop-types
import './Analysis.less';

const AnalysisApp = ({ app, submitJob, job }) => {
  const onSubmitJob = (e) => {
    e.preventDefault();
    const inputId = e.target.input.value;
    submitJob(inputId);
  };
  const isJobRunning = () => job && job.status !== 'Completed';

  return (
    <div>
      <h3>{app.name}</h3>
      <p>{app.description}</p>
      <form onSubmit={onSubmitJob}>
        <input className='text-input' type='text' placeholder='input data' name='input' />
        <button href='#' className='button button-primary-orange' onSubmit={onSubmitJob} >Run simulation</button>
      </form>
      {isJobRunning() &&
        <p className='analysis__job-status'>Job running... </p>
      }
      {/* TODO: only render if result is a image */}
      {(job && job.status === 'Completed') &&
        <img className='analysis__result-image' src={job.resultURL} alt='analysis result' />
      }
    </div>

  );
};

AnalysisApp.propTypes = {
  app: PropTypes.object.isRequired,
  job: PropTypes.object.isRequired,
  submitJob: PropTypes.object.isRequired,
};

const Analysis = ({ job, submitJob }) => {
  const virusSimApp = {
    name: 'NDH Virulence Simulation',
    description: `This simulation runs a docker version of the Hypothesis Testing
        using Phylogenies (HyPhy) tool over data submitted in the NIAID Data Hub. \n
        The simulation is focused on modeling a Bayesian Graph Model (BGM) based on a binary matrix input.
        The implemented example predicts the virulence status of different influenza strains based on their mutations
        (the mutation panel is represented as the input binary matrix).`,
  };
  return (
    <AnalysisApp job={job} submitJob={submitJob} app={virusSimApp} />
  );
};

Analysis.propTypes = {
  job: PropTypes.object.isRequired,
  submitJob: PropTypes.object.isRequired,
};

export default Analysis;
