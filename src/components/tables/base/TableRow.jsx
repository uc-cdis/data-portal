import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Table.less';

class TableRow extends Component {
  renderCols = cols => cols.map((col, i) => (
    <td className='base-table__cell' key={`col_${i}`}>{col}</td>
  ));

  render() {
    return (
      <tr className='base-table__row base-table__row--stripe-color'>
        {this.renderCols(this.props.cols)}
      </tr>
    );
  }
}

TableRow.propTypes = {
  cols: PropTypes.array.isRequired,
};

export default TableRow;
