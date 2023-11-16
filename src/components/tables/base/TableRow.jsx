import PropTypes from 'prop-types';
import { cellValueToText } from './Table';
import './Table.css';

function TableRow({ cols }) {
  return (
    <tr className='base-table__row base-table__row--stripe-color'>
      {cols.map((col, i) => {
        let displayedCol;
        if (Array.isArray(col)) {
          displayedCol = <ul className='base-table__cell-list-value'>
            {col.map((value, j) => {
              return <li key={`col_${i}_row_${j}`}>
                {cellValueToText(value)}
              </li>;
            })}
          </ul>;
        }
        return <td className='base-table__cell' key={`col_${i}`}>
          {Array.isArray(col) ? displayedCol : cellValueToText(col)}
        </td>;
      })}
    </tr>
  );
}

TableRow.propTypes = {
  cols: PropTypes.array.isRequired,
};

export default TableRow;
