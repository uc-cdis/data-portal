import React, { useContext } from 'react';
import { useQuery } from 'react-query';
import { Spin, Collapse } from 'antd';
import { gwasWorkflowPath } from '../../../../../localconf';
import IsJsonString from '../../../Utils/IsJsonString';
import { getDataForWorkflowArtifact } from '../../../Utils/gwasWorkflowApi';
import { queryConfig } from '../../../Utils/gwasWorkflowApi';
import SharedContext from '../../../Utils/SharedContext';
import LoadingErrorMessage from '../../../Components/LoadingErrorMessage/LoadingErrorMessage';
import './AttritionTable.css';

const { Panel } = Collapse;
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
      <div className='attrition-table'>
        <Collapse
          defaultActiveKey={['1']}
          onClick={(event) => event.stopPropagation()}
        >
          <Panel key='1' header='Attrition Table'>
            <table>
              <thead>
                <tr>
                  <th className='attrition-table--leftpad attrition-table--w15'>
                    Type
                  </th>
                  <th className='attrition-table--w15'>Name</th>
                  <th
                    className='attrition-table--rightborder
                attrition-table--w5'
                  >
                    Size
                  </th>
                  <th
                    className='attrition-table--w15
                attrition-table--leftpad'
                  >
                    Non-Hispanic Black
                  </th>
                  <th className='attrition-table--w15'>Non-Hispanic Asian</th>
                  <th className='attrition-table--w15'>Non-Hispanic White</th>
                  <th className='attrition-table--w15'>Hispanic</th>
                </tr>
              </thead>
              <tbody>
                {data[0].rows.map((row, index) => (
                  <tr key={index}>
                    <td>{row?.type || <h3>❌</h3>}</td>
                    <td>{row?.name || <h3>❌</h3>}</td>
                    <td className='attrition-table--rightborder'>
                      {row?.size || <h3>❌</h3>}
                    </td>
                    <td>
                      {row?.concept_breakdown[0]
                        ?.persons_in_cohort_with_value || <h3>❌</h3>}
                    </td>
                    <td>
                      {row?.concept_breakdown[1]
                        ?.persons_in_cohort_with_value || <h3>❌</h3>}
                    </td>
                    <td>
                      {row?.concept_breakdown[2]
                        ?.persons_in_cohort_with_value || <h3>❌</h3>}
                    </td>
                    <td>
                      {row?.concept_breakdown[3]
                        ?.persons_in_cohort_with_value || <h3>❌</h3>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        </Collapse>
      </div>
    </section>
  );
};
export default AttritionTable;
