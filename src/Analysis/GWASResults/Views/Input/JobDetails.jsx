import React, { useContext } from 'react';
import { useQuery } from 'react-query';
import { Spin } from 'antd';
import { gwasWorkflowPath } from '../../../../localconf';
import isJsonString from '../../Utils/IsJsonString';
import SharedContext from '../../Utils/SharedContext';
import LoadingErrorMessage from '../../SharedComponents/LoadingErrorMessage/LoadingErrorMessage';

const JobDetails = () => {
  const { selectedRowData } = useContext(SharedContext);
  const { name, uid } = selectedRowData;
  const endpoint = `${gwasWorkflowPath}status/${name}?uid=${uid}`;

  const fetchData = async () => {
    const res = await fetch(endpoint);
    return res.json();
  };

  const { data, status } = useQuery('jobDetails', fetchData);

  if (status === 'error') {
    return <LoadingErrorMessage message='Error getting job details' />;
  }
  if (status === 'loading') {
    return (
      <div className='spinner-container' data-testid='spinner'>
        <Spin />
      </div>
    );
  }

  if (!data || data.length === 0 || data.error) {
    return <LoadingErrorMessage message='Issue Loading Data for Job Details' />;
  }

  const getParameterData = (key) => {
    const datum = data?.arguments?.parameters?.find((obj) => obj.name === key);
    return datum?.value || 'Data not found';
  };

  const getPhenotype = () => {
    if (
      getParameterData('outcome') &&
      isJsonString(getParameterData('outcome'))
    ) {
      console.log('here');
      return (
        JSON.parse(getParameterData('outcome'))?.concept_name ||
        JSON.parse(getParameterData('outcome'))?.provided_name
      );
    }
    return 'Data not found';
  };

  const processCovariates = () => {
    const input = JSON.stringify(getParameterData('variables'));
    let covariatesString = input.replaceAll('\\n', '');
    covariatesString = covariatesString.substring(
      1,
      covariatesString.length - 1
    );
    const strToRemove = '\\"';
    covariatesString = covariatesString.replaceAll(strToRemove, '"');
    if (isJsonString(covariatesString)) {
      const covariatesJSON = JSON.parse(covariatesString);
      return covariatesJSON;
    }
    return false;
  };

  const displayCovariates = () => {
    const covariates = processCovariates();
    if (covariates && covariates.length > 0) {
      return covariates.map((obj, index) => (
        <React.Fragment key={index}>
          <span className='covariate-item'>
            {obj?.concept_name}
            {obj?.provided_name}
            {!obj?.concept_name && !obj?.provided_name && 'Data not found'}
          </span>
          <br />
        </React.Fragment>
      ));
    }
    return 'Data not found';
  };

  return (
    <section className='job-details'>
      <h2 className='job-details-title'>{data.wf_name}</h2>
      <div className='GWASResults-flex-col job-details-table'>
        <div className='GWASResults-flex-row'>
          <div>Number of PCs</div>
          <div>{getParameterData('n_pcs')}</div>
        </div>
        <div className='GWASResults-flex-row'>
          <div>MAF Cutoff</div>
          <div>{getParameterData('maf_threshold')}</div>
        </div>
        <div className='GWASResults-flex-row'>
          <div>HARE Ancestry</div>
          <div>{getParameterData('hare_population')}</div>
        </div>
        <div className='GWASResults-flex-row'>
          <div>Imputation Score Cutoff</div>
          <div>{getParameterData('imputation_score_cutoff')}</div>
        </div>
        <hr />
        <div className='GWASResults-flex-row'>
          <div>Cohort</div>
          <div>{getParameterData('source_population_cohort')}</div>
        </div>
        <div className='GWASResults-flex-row'>
          <div>Phenotype</div>
          <div>{getPhenotype()}</div>
        </div>
        <div className='GWASResults-flex-row'>
          <div>Final Size</div>
          <div>TBD</div>
        </div>
        <div className='GWASResults-flex-row'>
          <div>Covariates</div>
          <div>{displayCovariates()}</div>
        </div>
      </div>
    </section>
  );
};
export default JobDetails;
