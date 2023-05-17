import React, { useContext } from 'react';
import { useQuery } from 'react-query';
import { Spin, Button, Tooltip } from 'antd';
import { gwasWorkflowPath } from '../../../../localconf';
import SharedContext from '../../Utils/SharedContext';
import {
  fetchPresignedUrlForWorkflowArtifact,
  queryConfig,
} from '../../Utils/gwasWorkflowApi';
import LoadingErrorMessage from '../../SharedComponents/LoadingErrorMessage/LoadingErrorMessage';

const JobDetails = () => {
  const { selectedRowData } = useContext(SharedContext);
  const { name, uid } = selectedRowData;
  const endpoint = `${gwasWorkflowPath}status/${name}?uid=${uid}`;

  const url =
    'https://qa-mickey.planx-pla.net/ga4gh/wes/v2/status/gwas-workflow-9398100811?uid=e88fcf45-03b3-47ce-8bf1-909bd9623937';

  console.log('expected', url);
  console.log('endpoint:', endpoint);

  const fetchData = async () => {
    const res = await fetch(endpoint);
    console.log(JSON.stringify(res));
    return res.json();
  };

  const { data, status } = useQuery('user', fetchData);

  const getParameterData = (key) => {
    const datum = data?.arguments?.parameters.find((obj) => obj.name === key)
      .value;
    if (datum) return datum;
    else return 'Data not found';
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
  if (!data) {
    return <LoadingErrorMessage message='Issue Loading Data for Job Details' />;
  }

  return (
    <>
      {JSON.stringify(data)}
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
            <div>
              {JSON.parse(getParameterData('outcome'))['concept_name'] ||
                JSON.parse(getParameterData('outcome'))['provided_name']}
            </div>
          </div>
          <div className='GWASResults-flex-row'>
            <div>Final Size</div>
            <div>Dunno?</div>
          </div>
          <div className='GWASResults-flex-row'>
            <div>Covariates</div>
            <div>Dunno?</div>
          </div>

          <div className='GWASResults-flex-row'>
            <div>Minimum Outlier Cutoff</div>
            <div>Dunno?</div>
          </div>
          <div className='GWASResults-flex-row'>
            <div>Maxmimum Outlier Cutoff</div>
            <div>Dunno?</div>
          </div>
        </div>
      </section>
    </>
  );
};
export default JobDetails;
