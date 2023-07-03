import React, { useContext } from 'react';
import { Collapse } from 'antd';
import SharedContext from '../../../Utils/SharedContext';
import './AttritionTable.css';

const { Panel } = Collapse;
const AttritionTable = ({data, title}) => {
  const { selectedRowData } = useContext(SharedContext);
  const { name, uid } = selectedRowData;


  const getBreakDownForGroup = (groupName, conceptBreakdownArray) => {
    const matchingObject = conceptBreakdownArray.find(
      (obj) => obj.concept_value_name === groupName,
    );
    return matchingObject?.persons_in_cohort_with_value || <h3>❌</h3>;
  };

  return (
    <section data-testid='attrition-table' className='attrition-table'>
      <div className='attrition-table'>
        <Collapse
          defaultActiveKey={['1']}
          onClick={(event) => event.stopPropagation()}
        >
          <Panel key='1' header={title}>
            <table>
              <thead>
                <tr>
                  <th className='attrition-table--leftpad attrition-table--w15'>
                    Type
                  </th>
                  <th className='attrition-table--w15'>Name</th>
                  <th className='attrition-table--rightborder attrition-table--w5'>
                    Size
                  </th>
                  <th className='attrition-table--w15 attrition-table--leftpad'>
                    Non-Hispanic Black
                  </th>
                  <th className='attrition-table--w15'>Non-Hispanic Asian</th>
                  <th className='attrition-table--w15'>Non-Hispanic White</th>
                  <th className='attrition-table--w15'>Hispanic</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row, index) => (
                  <tr key={index}>
                    <td>{row?.type || <h3>❌</h3>}</td>
                    <td>{row?.name || <h3>❌</h3>}</td>
                    <td className='attrition-table--rightborder'>
                      {row?.size || <h3>❌</h3>}
                    </td>
                    <td>
                      {getBreakDownForGroup(
                        'non-Hispanic Black',
                        row?.concept_breakdown,
                      )}
                    </td>
                    <td>
                      {getBreakDownForGroup(
                        'non-Hispanic Asian',
                        row?.concept_breakdown,
                      )}
                    </td>
                    <td>
                      {getBreakDownForGroup(
                        'non-Hispanic White',
                        row?.concept_breakdown,
                      )}
                    </td>
                    <td>
                      {getBreakDownForGroup('Hispanic', row?.concept_breakdown)}
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
