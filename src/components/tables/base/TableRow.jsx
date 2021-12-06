import PropTypes from 'prop-types';
import './Table.less';

function TableRow({ cols }) {
  return (
    <tr className='base-table__row base-table__row--stripe-color'>
      {cols.map((col, i) => (
        <td className='base-table__cell' key={`col_${i}`}>
          {col}
        </td>
      ))}
    </tr>
  );
}

TableRow.propTypes = {
  cols: PropTypes.array.isRequired,
};

export default TableRow;
