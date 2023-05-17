import React, { useContext } from 'react';
import { useQuery } from 'react-query';
import { Spin, Button, Tooltip } from 'antd';
import SharedContext from '../../Utils/SharedContext';
import {
  fetchPresignedUrlForWorkflowArtifact,
  queryConfig,
} from '../../Utils/gwasWorkflowApi';
import LoadingErrorMessage from '../../SharedComponents/LoadingErrorMessage/LoadingErrorMessage';

const JobDetails = () => {
  const { selectedRowData } = useContext(SharedContext);

  const url =
    'https://qa-mickey.planx-pla.net/ga4gh/wes/v2/status/gwas-workflow-9398100811?uid=e88fcf45-03b3-47ce-8bf1-909bd9623937';

  const fetchData = async () => {
    const res = await fetch(url);
    console.log(JSON.stringify(res));
    return res.json();
  };

  const { data, status } = useQuery('user', fetchData);

  const getParameterData = (key) => {
    return data?.arguments?.parameters.find((obj) => obj.name === key).value;
  };

  if (status === 'error') {
    return (
      <React.Fragment>
        <LoadingErrorMessage message='Error getting job details' />
      </React.Fragment>
    );
  }
  if (status === 'loading') {
    return (
      <div className='spinner-container'>
        <Spin />
      </div>
    );
  }

  return (
    <section className='job-details'>
      {JSON.stringify(data?.arguments)}
      <h2 className='job-details-title'>Job Name</h2>
      <div className='GWASResults-flex-col job-details-table'>
        <div className='GWASResults-flex-row'>
          <div>Number of PCs</div>
          <div>{getParameterData('n_pcs')}</div>
        </div>
        <div className='GWASResults-flex-row'>
          <div>MAF Cutoff</div>
          <div id='modal-maf-threshold'>mafThreshold</div>
        </div>
        <div className='GWASResults-flex-row'>
          <div>HARE Ancestry</div>
          <div id='modal-hare-ancestry'>selectedHare?.concept_value_name</div>
        </div>
        <div className='GWASResults-flex-row'>
          <div>Imputation Score Cutoff</div>
          <div id='modal-imputation-score'>imputationScore</div>
        </div>
        <hr />
        <div className='GWASResults-flex-row'>
          <div>Cohort</div>
          <div id='modal-cohort'>selectedCohort?.cohort_name</div>
        </div>
        <div className='GWASResults-flex-row'>
          <div>Outcome Phenotype</div>
          <div id='modal-outcome'>
            outcome?.concept_name ?? outcome?.provided_name
          </div>
        </div>
        <div id='modal-population-size' className='GWASResults-flex-row'>
          <div>item.population Size</div>
          <div>item.size</div>
        </div>
        <div className='GWASResults-flex-row'>
          <div>Covariates</div>
          <div id='modal-covariates'>
            covariate?.concept_name <br /> covariate.provided_name
          </div>
        </div>

        <div className='GWASResults-flex-row'>
          <div>Minimum Outlier Cutoff</div>
          <div id='modal-covariates'>0.5</div>
        </div>
        <div className='GWASResults-flex-row'>
          <div>Maxmimum Outlier Cutoff</div>
          <div id='modal-covariates'>12.5</div>
        </div>
      </div>
    </section>
  );
};
export default JobDetails;
