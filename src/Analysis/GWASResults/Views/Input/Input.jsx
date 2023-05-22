import React, { useContext } from 'react';
import { useQuery } from 'react-query';
import { Spin, Button, Tooltip } from 'antd';
import DetailPageHeader from '../../SharedComponents/DetailPageHeader/DetailPageHeader';
import SharedContext from '../../Utils/SharedContext';
import JobDetails from './JobDetails';
import {
  fetchPresignedUrlForWorkflowArtifact,
  queryConfig,
} from '../../Utils/gwasWorkflowApi';
import LoadingErrorMessage from '../../SharedComponents/LoadingErrorMessage/LoadingErrorMessage';
import './Input.css';

const Input = () => {
  const { selectedRowData } = useContext(SharedContext);

  const url = 'https://qa-mickey.planx-pla.net/ga4gh/wes/v2/status/gwas-workflow-9398100811?uid=e88fcf45-03b3-47ce-8bf1-909bd9623937';

  const fetchData = async () => {
    const res = await fetch(url);
    return res.json();
  };

  const { jobDetailsData, jobDetailsStatus } = useQuery('users', fetchData);

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
      <JobDetails />
    </div>
  );
};
export default Input;
