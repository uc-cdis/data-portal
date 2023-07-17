import React, { useState, useContext } from 'react';
import DetailPageHeader from '../../Components/DetailPageHeader/DetailPageHeader';
import JobDetails from './JobDetails/JobDetails';
import AttritionTableWrapper from './AttritionTable/AttrtitionTableWrapper';
import { useQuery } from 'react-query';
import { Spin } from 'antd';
import SharedContext from '../../Utils/SharedContext';
import {
  getDataForWorkflowArtifact,
  queryConfig,
} from '../../Utils/gwasWorkflowApi';
import LoadingErrorMessage from '../../Components/LoadingErrorMessage/LoadingErrorMessage';
import './Input.css';

const Input = () => {
  const { selectedRowData } = useContext(SharedContext);
  const { name, uid } = selectedRowData;
  const { data, status } = useQuery(
    [`getDataForWorkflowArtifact${name}`, name, uid, 'attrition_json_index'],
    () => getDataForWorkflowArtifact(name, uid, 'attrition_json_index'),
    queryConfig
  );

  const displayTopSection = () => (
    <section className='results-top'>
      <div className='GWASResults-flex-row'>
        <div className='GWASResults-flex-col'>
          <DetailPageHeader pageTitle={'Input Details'} />
        </div>
      </div>
    </section>
  );

  if (status === 'error') {
    return (
      <>
        {displayTopSection()}
        <LoadingErrorMessage
          data-testid='loading-error-message'
          message='Error getting attrition table data due to status'
        />
      </>
    );
  }

  if (status === 'loading') {
    return (
      <>
        {displayTopSection()}
        <div className='spinner-container' data-testid='spinner'>
          <Spin />
        </div>
      </>
    );
  }

  if (
    !data ||
    data.length === 0 ||
    data[0].table_type !== 'case' ||
    data.error
  ) {
    return (
      <>
        {displayTopSection()}
        <LoadingErrorMessage message='Error Getting Attrition Table Data' />
      </>
    );
  }

  return (
    <div className='results-view'>
      {displayTopSection()}
      <AttritionTableWrapper data={data} />
      <JobDetails attritionTableData={data} />
    </div>
  );
};
export default Input;
