import React, { useContext, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Spin } from 'antd';
import {
  getDataForWorkflowArtifact,
  queryConfig,
} from '../../../Utils/gwasWorkflowApi';
import SharedContext from '../../../Utils/SharedContext';
import LoadingErrorMessage from '../../../Components/LoadingErrorMessage/LoadingErrorMessage';
import './AttritionTable.css';
import AttritionTable from './AttrtitionTable';

const AttritionTableWrapper = ({ setTotalSizes }) => {
  const { selectedRowData } = useContext(SharedContext);
  const { name, uid } = selectedRowData;
  const { data, status } = useQuery(
    [`getDataForWorkflowArtifact${name}`, name, uid, 'attrition_json_index'],
    () => getDataForWorkflowArtifact(name, uid, 'attrition_json_index'),
    queryConfig
  );

  const findSizeOfLastRow = (tableData) =>
    tableData?.rows[tableData?.rows.length - 1]?.size;

  useEffect(() => {
    if (data?.length > 0) {
      const caseSize = data[0]?.rows && findSizeOfLastRow(data[0]);
      const controlSize = data[1]?.rows ? findSizeOfLastRow(data[1]) : null;
      const totalSize =
        controlSize !== null ? caseSize + controlSize : caseSize;
      setTotalSizes({
        case: caseSize,
        control: controlSize,
        total: totalSize,
      });
    }
  }, [data]);

  if (status === 'error') {
    return (
      <LoadingErrorMessage
        data-testid='loading-error-message'
        message='Error getting attrition table data'
      />
    );
  }

  if (status === 'loading') {
    return (
      <div className='spinner-container' data-testid='spinner'>
        <Spin />
      </div>
    );
  }

  if (
    !data ||
    data.length === 0 ||
    data[0].table_type !== 'case' ||
    data.error
  ) {
    return <LoadingErrorMessage message='Error Getting Attrition Table Data' />;
  }

  return (
    <section
      data-testid='attrition-table-wrapper'
      className='attrition-table-wrapper'
    >
      <AttritionTable tableData={data[0]} title='Case Cohort Attrition Table' />
      {data[1]?.table_type === 'control' && (
        <AttritionTable
          tableData={data[1]}
          title='Control Cohort Attrition Table'
        />
      )}
    </section>
  );
};
export default AttritionTableWrapper;
