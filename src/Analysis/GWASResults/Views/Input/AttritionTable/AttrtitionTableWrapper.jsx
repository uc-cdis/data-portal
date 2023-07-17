import React from 'react';
import PropTypes from 'prop-types';

import './AttritionTable.css';
import AttritionTable from './AttrtitionTable';

const AttritionTableWrapper = ({ data }) => (
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

AttritionTableWrapper.propTypes = {
  data: PropTypes.array.isRequired,
};

export default AttritionTableWrapper;
