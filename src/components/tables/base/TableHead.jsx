import React from 'react';
import PropTypes from 'prop-types';
import './Table.less';

/**
 * @typedef {Object} TableHeadProps
 * @property {string[]} cols
 */

/** @param {TableHeadProps} props */
function TableHead({ cols }) {
  return (
    <thead className='base-table__head'>
      <tr>
        {cols.map((col, i) => (
          <th className='base-table__column-head' key={`col_${col}_${i}`}>
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );
}

TableHead.propTypes = {
  cols: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default TableHead;
