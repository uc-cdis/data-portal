import PropTypes from 'prop-types';
import dictIcons from '../../../img/icons/index';
import IconComponent from '../../Icon';
import './Table.css';

/**
 * @typedef {Object} TableHeadProps
 * @property {string[]} cols
 * @property {function} setFilters
 */

/** @param {TableHeadProps} props */
function TableHead({ cols, setFilters }) {
  let filters = [];
  
  return (
    <thead className='base-table__head'>
      <tr>
        {cols.map((col, i) => (
          <th className='base-table__column-head' key={`col_${col}_${i}`}>
           <IconComponent dictIcons={dictIcons} iconName='filter' height='12px' /> {col}
          </th>
        ))}
      </tr>
      <tr>
        {cols.map((col, i) => (
            <th className='base-table__column-head' key={`col_${col}_${i}`}>
              <input
                onChange={(e) => {
                  filters[i] = e.target.value;
                  setFilters(filters);
                }}
                type='text'
              />
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
