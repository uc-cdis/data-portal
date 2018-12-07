import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Table.less';

class TableHead extends Component {
  calculateWidth = (colNum) => {
    if (colNum === 0) {
      return 10;
    } else if (colNum == 3) {
      return 20;
    }
    return 100 / this.props.cols.length;
  }
  render() {
    return (
      <thead className='base-table__head'>
        <tr>
          {
            this.props.cols.map((col, i) => (
              <th
                className='base-table__column-head'
                key={`col_${col}_${i}`}
                style={{ width: `${this.calculateWidth(i)}%` }}
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
