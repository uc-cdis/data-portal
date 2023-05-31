import React, { useContext } from 'react';
import { useQuery } from 'react-query';
import { Spin } from 'antd';
import { gwasWorkflowPath } from '../../../../../localconf';
import IsJsonString from '../../../Utils/IsJsonString';
import { getDataForWorkflowArtifact } from '../../../Utils/gwasWorkflowApi';
import { queryConfig } from '../../../Utils/gwasWorkflowApi';
import SharedContext from '../../../Utils/SharedContext';
import LoadingErrorMessage from '../../../Components/LoadingErrorMessage/LoadingErrorMessage';

const AttritionTable = () => {
  const { selectedRowData } = useContext(SharedContext);
  const { name, uid } = selectedRowData;
  const { data, status } = useQuery(
    ['getDataForWorkflowArtifact' + name, name, uid, 'attrition_json_index'],
    () => getDataForWorkflowArtifact(name, uid, 'attrition_json_index'),
    queryConfig
  );

  if (status === 'error') {
    return <LoadingErrorMessage message='Error getting attrition table data' />;
  }
  if (status === 'loading') {
    return (
      <div className='spinner-container' data-testid='spinner'>
        <Spin />
      </div>
    );
  }

  if (!data || data.length === 0 || data.error) {
    return (
      <LoadingErrorMessage message='Issue Loading Data for Attrition Table' />
    );
  }

  return (
    <section data-testid='attrition-table' className='attrition-table'>
      <h2> Attrition table</h2>
      {JSON.stringify(data)}
    </section>
  );
};
export default AttritionTable;
