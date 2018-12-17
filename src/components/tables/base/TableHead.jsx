import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Table.less';

class TableHead extends Component {
  render() {
    return (
      <thead className='base-table__head'>
        <tr>
          {
            this.props.cols.map((col, i) => (
              <th
                className='base-table__column-head'
                key={`col_${col}_${i}`}
              >
                {col}
              </th>
            ))
          }
        </tr>
      </thead>
    );
  }
}

TableHead.propTypes = {
  cols: PropTypes.array.isRequired,
};

export default TableHead;
