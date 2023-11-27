import PropTypes from 'prop-types';
import { cellValueToText } from './Table';
import './Table.css';
import { isValidElement } from 'react';

function TableRow({ cols }) {
  return (
    <tr className='base-table__row base-table__row--stripe-color'>
      {cols.map((col, i) => {
        let displayedCol;
        if (Array.isArray(col)) {
          displayedCol = <ul className='base-table__cell-list-value'>
            {col.map((value, j) => {
              return <li key={`col_${i}_row_${j}`}>
                {isValidElement(value) ? value : cellValueToText(value)}
              </li>;
            })}
          </ul>;
        } else {
          displayedCol = isValidElement(col) ? col : cellValueToText(col);
        }
        return <td className='base-table__cell' key={`col_${i}`}>
          {displayedCol}
        </td>;
      })}
    </tr>
  );
}

TableRow.propTypes = {
  cols: PropTypes.array.isRequired,
};

export default TableRow;
