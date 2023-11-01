import PropTypes from 'prop-types';
import dictIcons from '../../../img/icons/index';
import IconComponent from '../../Icon';
import './Table.css';
import { cellValueToText } from './Table';

/**
 * @typedef {Object} TableHeadProps
 * @property {string[]} cols
 * @property {function} setFilters
 * @property {any[][]} data
 */

/** @param {TableHeadProps} props */
function TableHead({ cols, setFilters, data }) {
  let filters = [];
  return (
    <thead className='base-table__head'>
      <tr>
        {cols.map((col, i) => {
          let dataValues = data.map((dataCol) => dataCol[i]);
          return <th className='base-table__column-head' key={`col_${col}_${i}`}>
            {
              typeof dataValues[0] === 'number' ||
              typeof dataValues[0] === 'undefined' ||
              dataValues[0] === '' ?
              <>{col}</> :
              <><IconComponent dictIcons={dictIcons} iconName='filter' height='12px' /> {col}</>
            }
          </th>
        })}
      </tr>
      <tr>
        {cols.map((col, i) => {
            let dataValues = data.map((dataCol) => dataCol[i]);
            let stringValues = dataValues.map((val) => cellValueToText(val));
            let uniqueValues = Array.from(new Set(stringValues));

            return <th className='base-table__column-head' key={`col_${col}_${i}`}>
              {/* heuristic to check if we should filter by value with Select or free-text input */}
              {dataValues.length === uniqueValues.length || uniqueValues.length > 10 ? 
                (
                  typeof dataValues[0] === 'number' ||
                  typeof dataValues[0] === 'undefined' ||
                  dataValues[0] === '' ?
                  null : (
                      <input
                        onChange={(e) => {
                          filters[i] = e.target.value;
                          setFilters(filters);
                        }}
                        type='text'
                      />
                    )
                ) : (
                  typeof dataValues[0] === 'number' ||
                  typeof dataValues[0] === 'undefined' ||
                  dataValues[0] === '' ? 
                  null : (
                      <select
                        onChange={(e) => {
                          filters[i] = e.target.value;
                          setFilters(filters);
                        }}
                      >
                        {uniqueValues.map((val, k) => 
                          (<option key={`col_${i}_row_${k}`}>{val}</option>))
                        }
                      </select>
                    )
                  )
              }
            </th>;
        })}
        </tr>
    </thead>
  );
}

TableHead.propTypes = {
  cols: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default TableHead;
