import { useState } from 'react';
import PropTypes from 'prop-types';
import dictIcons from '../../../img/icons/index';
import IconComponent from '../../Icon';
import './Table.css';
import { cellValueToText } from './Table';
import DateRangePicker from '../../DateRangePicker';
import { 
  defaultTheme,
  Provider,
  Form,
  Flex
} from '@adobe/react-spectrum';
import Select from 'react-select';
import SimpleInputField from '../../SimpleInputField';

/**
 * @typedef {Object} TableHeadProps
 * @property {string[]} cols
 * @property {function} setFilters
 * @property {any[][]} data
 */

/** @param {TableHeadProps} props */
function TableHead({ cols, setFilters, data }) {
  let [filters] = useState([]);

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
            let stringValues = Array.isArray(dataValues[0]) ? 
              dataValues.flat().map((val) => cellValueToText(val)) : 
              dataValues.map((val) => cellValueToText(val));
            let uniqueValues = Array.from(new Set(stringValues));

            if (dataValues[0] instanceof Date) {
              return <th className='base-table__column-head' key={`col_${col}_${i}`}>
                <Provider theme={defaultTheme}>
                  <Form validationBehavior="native">
                    <Flex margin={0} direction="row" alignItems='center' gap={8}>
                      <DateRangePicker onChange={(range) => {
                          filters[i] = range;
                          setFilters([...filters]);
                        }}
                      />
                    </Flex>
                  </Form>
                </Provider>
              </th>;
            }

            return <th className='base-table__column-head' key={`col_${col}_${i}`}>
              {/* heuristic to check if we should filter by value with Select or free-text input */}
              {dataValues.length === uniqueValues.length || uniqueValues.length > 10 ? 
                (
                  typeof dataValues[0] === 'number' ||
                  typeof dataValues[0] === 'undefined' ||
                  dataValues[0] === '' ?
                  null : (
                      <SimpleInputField
                        className='base-table__filter-field'
                        label={`Filter ${col}`}
                        hideLabel={true}
                        input={
                          <input
                            name={`${col}-filter-input`}
                            onChange={(e) => {
                              filters[i] = e.target.value;
                              setFilters([...filters]);
                            }}
                            type='text'
                          />
                        }
                      />
                    )
                ) : (
                  typeof dataValues[0] === 'number' ||
                  typeof dataValues[0] === 'undefined' ||
                  dataValues[0] === '' ? 
                  null :
                  <Select
                    isMulti={true}
                    name={`${col}-filter-input`}
                    options={uniqueValues.map((value) => ({ value, label: value }))}
                    className="base-table__filter-field"
                    classNamePrefix="select"
                    onChange={(options) => {
                      filters[i] = options.map((opt) => opt.value);
                      setFilters([...filters]);
                    }}
                  />
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
