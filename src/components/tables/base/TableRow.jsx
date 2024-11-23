import PropTypes from 'prop-types';
import { isValidElement } from 'react';
import innerText from 'react-innertext';
import './Table.css';

export function cellValueToText(value) {
  let text;
  if (value instanceof Date) {
    text = value.toLocaleDateString();
  } else if (Array.isArray(value)) {
    text = value.reduce((acc, item, index, array) => {
      if (index < array.length - 1) {
        return `${acc + cellValueToText(item)}, `;
      }
      return acc + cellValueToText(item);
    }, '');
  } else if (typeof value === 'object') {
    text = innerText(value);
  } else {
    text = value?.toString?.() ?? '';
  }
  return text;
}

function TableRow({ cols }) {
  return (
    <tr className='base-table__row base-table__row--stripe-color'>
      {cols.map((col, i) => {
        let displayedCol;
        if (Array.isArray(col)) {
          displayedCol = (
            <ul className='base-table__cell-list-value'>
              {col.map((value, j) => (
                <li key={`col_${i}_row_${j}`}>
                  {isValidElement(value) ? value : cellValueToText(value)}
                </li>
              ))}
            </ul>
          );
        } else {
          displayedCol = isValidElement(col) ? col : cellValueToText(col);
        }
        return (
          <td className='base-table__cell' key={`col_${i}`}>
            {displayedCol}
          </td>
        );
      })}
    </tr>
  );
}

TableRow.propTypes = {
  cols: PropTypes.array.isRequired,
};

export default TableRow;
