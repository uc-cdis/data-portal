import React from 'react';
import { Collapse } from 'antd';
import PropTypes from 'prop-types';
import './AttritionTable.css';

const { Panel } = Collapse;

const defaultHareGroups =  ['Non-Hispanic Black','Non-Hispanic Asian','Non-Hispanic White','Hispanic']

const AttritionTable = ({ tableData, title }) => {
  const getHareGroups = (conceptBreakdownArray) => {
    let groupNames = conceptBreakdownArray.map(item => {
      return { concept_value_name: item.concept_value_name };
    });
    return groupNames;
  };

  const displayHareGroupHeaders = (hareGroupNames) => {
    let i = 0;
    let buffer = [];

    while (i < hareGroupNames.length)
    {
      let groupName = hareGroupNames[i]['concept_value_name'];
      groupName = groupName.charAt(0).toUpperCase() + groupName.slice(1);

      if(i == 0)
      {
        buffer.push(<th className='attrition-table--w15 attrition-table--leftpad'>{groupName}</th>);
      }
      else
      {
        buffer.push(<th className='attrition-table--w15'>{groupName}</th>);
      }
      i++;
    }

    return buffer;
  }

  const displayGroupBreakDowns = (hareGroupNames, row) => {
    let i = 0;
    let buffer = [];

    while (i < hareGroupNames.length)
    {
      let groupName = hareGroupNames[i]["concept_value_name"];
      let count = getBreakDownForGroup(groupName, row?.concept_breakdown)
      buffer.push(<td>{count}</td>);
      i++;
    }

    return buffer;
  }

  const getBreakDownForGroup = (groupName, conceptBreakdownArray) => {
    const matchingObject = conceptBreakdownArray.find(
      (obj) => obj.concept_value_name === groupName,
    );

    return displayNumberOrX(matchingObject?.persons_in_cohort_with_value);
  };

  const displayRowType = (rowType) => {
    if (rowType) {
      return rowType === 'outcome' ? 'Outcome Phenotype' : rowType;
    }
    return <h3>❌</h3>;
  };

  const displayNumberOrX = (data) => {
    if(data || data == 0)
    {
      return data;
    }
    return <h3>❌</h3>;
  }

  let hareGroupNames = defaultHareGroups;

  if(tableData.rows)
  {
    console.log('start to get hare group names')
    console.log(tableData.rows[0])
    hareGroupNames = getHareGroups(tableData.rows[0]['concept_breakdown']);
  }

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
                  {displayHareGroupHeaders(hareGroupNames)}
                </tr>
              </thead>
              <tbody>
                {tableData.rows.map((row, index) => (
                  <tr key={index}>
                    <td className='row-type'>{displayRowType(row?.type)}</td>
                    <td>{row?.name || <h3>❌</h3>}</td>
                    <td className='attrition-table--rightborder'>
                      {displayNumberOrX(row?.size)}
                    </td>
                    {displayGroupBreakDowns(hareGroupNames, row)}
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

AttritionTable.propTypes = {
  tableData: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
};

export default AttritionTable;
