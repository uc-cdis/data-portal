import React from 'react';
import PropTypes from 'prop-types';
import './Table.less';

/**
 * @typedef {Object} TableFootProps
 * @property {{ name: string; }[]} cols
 */

/** @param {TableFootProps} props */
function TableFoot({ cols }) {
  return (
    <tfoot className='base-table__foot'>
      <tr>
        {cols.map((col, i) => (
          <td className='base-table__cell' key={`col_${col.name}_${i}`}>
            {col.name}
          </td>
        ))}
      </tr>
    </tfoot>
  );
}

TableFoot.propTypes = {
  cols: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string.isRequired })
  ).isRequired,
};

export default TableFoot;
