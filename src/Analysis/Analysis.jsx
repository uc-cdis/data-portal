import React from 'react';
import styled from 'styled-components';

const ResultImage = styled.img`
  border-radius: 10px;
  margin-top: 2em;
  box-shadow: 0px 0px 5px #dfdfdf;
  padding: 20px 20px;
  background: white;
`;
const JobStatus = styled.p`
  margin-top: 1em;
  font-style: italic;
  animation: color-change 2s infinite;
`;

const AnalysisApp = ({ app, submitJob, job, resultURL }) => {
  const onSubmitJob = (e) => {
    e.preventDefault();
    const inputId = e.target.input.value;
    submitJob(inputId);
  };
  const isJobRunning = (job) => {
    // return true;
    return job && job.status !== 'Completed';
  };

  return (
    <div>
      <h3>{app.name}</h3>
      <p>{app.description}</p>
      <form onSubmit={onSubmitJob}>
        <input className="text-input" type="text" placeholder="input data" name="input"/>
        <button href="#" className="button button-primary-orange" onSubmit={onSubmitJob} >Run simulation</button>
      </form>
      {isJobRunning(job) &&
        <JobStatus>Job running... </JobStatus>
      }
      {(job && job.status === 'Completed') &&
        <ResultImage src={job.resultURL} alt="analysis result" />
      }
    </div>

  );
};

const Analysis = ({ job, submitJob }) => {
  const virusSimApp = {
    name: 'NDH Virulence Simulation',
    description: `This simulation runs a docker version of the Hypothesis Testing
        using Phylogenies (HyPhy) tool over data submitted in the NIAID Data Hub. \n
        The simulation is focused on modeling a Bayesian Graph Model (BGM) based on a binary matrix input.
        The implemented example predicts the virulence status of different influenza strains based on their mutations
        (the mutation panel is represented as the input binary matrix).`
  };
  return (
    <AnalysisApp job={job} submitJob={submitJob} app={virusSimApp} />
  );
};

export default Analysis;
