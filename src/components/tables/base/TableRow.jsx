import PropTypes from 'prop-types';
import './Table.css';

function TableRow({ cols }) {
  return (
    <tr className='base-table__row base-table__row--stripe-color'>
      {cols.map((col, i) => {
        let displayedCol = col;
        if (Array.isArray(col)) {
          displayedCol = <ul className='base-table__cell-list-value'>
            {col.map((value, j) => (
              <li key={`col_${i}_row_${j}`}>
                {value}
              </li>
            ))}
          </ul>;
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
