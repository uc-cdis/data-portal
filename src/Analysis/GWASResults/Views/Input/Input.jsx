import React, { useContext } from 'react';
import { useQuery } from 'react-query';
import { Spin, Button, Tooltip } from 'antd';
import DetailPageHeader from '../../SharedComponents/DetailPageHeader/DetailPageHeader';
import SharedContext from '../../Utils/SharedContext';
import {
  fetchPresignedUrlForWorkflowArtifact,
  queryConfig,
} from '../../Utils/gwasWorkflowApi';
import LoadingErrorMessage from '../../SharedComponents/LoadingErrorMessage/LoadingErrorMessage';
import './Input.css';

const Input = () => {
  const { selectedRowData } = useContext(SharedContext);

  /*
  const { name, uid } = selectedRowData;
  const { data, status } = useQuery(
    ['fetchPresignedUrlForWorkflowArtifact', name, uid, 'manhattan_plot_index'],
    () => fetchPresignedUrlForWorkflowArtifact(name, uid, 'manhattan_plot_index'),
    queryConfig,
  );
    */

  const displayTopSection = () => (
    <section className='results-top'>
      <div className='GWASResults-flex-row'>
        <div className='GWASResults-flex-col'>
          <DetailPageHeader pageTitle={'Input Details'} />
        </div>
      </div>
      <div className='GWASResults-flex-row section-header'>
        <h1>Input Details</h1>
      </div>
    </section>
  );

  const jobDetails = () => (
    <section style={{ margin: '0 auto' }}>
      {' '}
      <div className='GWASResults-flex-col'>
        <div className='GWASResults-flex-row'>
          <div>Number of PCs</div>
          <div id='modal-num-of-pcs'>numOfPCs</div>
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
            <div>covariate?.concept_name ?? covariate.provided_name</div>
          </div>
        </div>
      </div>
    </section>
  );

  /*
  if (status === 'error') {
    return (
      <React.Fragment>
        {displayTopSection()}
        <LoadingErrorMessage message='Error getting Manhattan plot' />
      </React.Fragment>
    );
  }
  if (status === 'loading') {
    return (
      <React.Fragment>
        {displayTopSection()}
        <div className='spinner-container'>
          Fetching Manhattan plot... <Spin />
        </div>
      </React.Fragment>
    );
  }

  if (!data) {
    return (
      <React.Fragment>
        {displayTopSection()}
        <LoadingErrorMessage message='Failed to load image, no image path' />
      </React.Fragment>
    );
  }

  const displaySpinnerWhileImageLoadsOrErrorIfItFails = () => {
    if (imageLoadFailed) {
      return (
        <LoadingErrorMessage message='Failed to load image, invalid image path' />
      );
    }
    if (imageLoaded) {
      return '';
    }
    return (
      <div className='spinner-container'>
        Loading... <Spin />
      </div>
    );
  };
  */

  return (
    <div className='results-view'>
      {displayTopSection()}
      {jobDetails()}
    </div>
  );
};
export default Input;
