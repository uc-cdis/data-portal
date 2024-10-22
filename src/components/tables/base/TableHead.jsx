import { useState } from 'react';
import PropTypes from 'prop-types';
import { defaultTheme, Provider, Form, Flex } from '@adobe/react-spectrum';
import dictIcons from '../../../img/icons/index';
import IconComponent from '../../Icon';
import './Table.css';
import { cellValueToText } from './TableRow';
import DateRangePicker from '../../DateRangePicker';
import SimpleInputField from '../../SimpleInputField';
import MultiSelect from '../../MultiSelect';

/**
 * @typedef {Object} TableHeadProps
 * @property {string[]} cols
 * @property {function} setFilters
 * @property {any[][]} data
 */

/** @param {TableHeadProps} props */
function TableHead({ cols, setFilters, data, filterConfig }) {
  const [filters] = useState([]);

  return (
    <thead className='base-table__head'>
      <tr>
        {cols.map((col, i) => {
          const dataValues = data.map((dataCol) => dataCol[i]);
          return (
            <th className='base-table__column-head' key={`col_${col}_${i}`}>
              {typeof dataValues[0] === 'number' ||
              typeof dataValues[0] === 'undefined' ||
              dataValues[0] === '' ||
              filterConfig[col] === false ? (
                col
              ) : (
                <>
                  <IconComponent
                    dictIcons={dictIcons}
                    iconName='filter'
                    height='12px'
                  />{' '}
                  {col}
                </>
              )}
            </th>
          );
        })}
      </tr>
      <tr>
        {cols.map((col, i) => {
          const isFilterable = filterConfig[col] ?? true; // Default to `true` if not specified
          if (!isFilterable) {
            return null;
          }
          const dataValues = data.map((dataCol) => dataCol[i]);
          const stringValues = Array.isArray(dataValues[0])
            ? dataValues.flat().map((val) => cellValueToText(val))
            : dataValues.map((val) => cellValueToText(val));
          const uniqueValues = Array.from(new Set(stringValues));

          if (dataValues[0] instanceof Date) {
            return (
              <th className='base-table__column-head' key={`col_${col}_${i}`}>
                <Provider theme={defaultTheme}>
                  <Form validationBehavior='native'>
                    <Flex
                      margin={0}
                      direction='row'
                      alignItems='center'
                      gap={8}
                    >
                      <DateRangePicker
                        onChange={(range) => {
                          filters[i] = range;
                          setFilters([...filters]);
                        }}
                      />
                    </Flex>
                  </Form>
                </Provider>
              </th>
            );
          }
          return (
            <th className='base-table__column-head' key={`col_${col}_${i}`}>
              {/* Heuristic to check if we should filter by value with Select or free-text input */}
              {(() => {
                if (
                  dataValues.length === uniqueValues.length ||
                  uniqueValues.length > 10
                ) {
                  if (
                    typeof dataValues[0] === 'number' ||
                    typeof dataValues[0] === 'undefined' ||
                    dataValues[0] === ''
                  ) {
                    return null;
                  }

                  return (
                    <SimpleInputField
                      className='base-table__filter-field'
                      label={`Filter ${col}`}
                      hideLabel
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
                  );
                }

                if (
                  typeof dataValues[0] === 'number' ||
                  typeof dataValues[0] === 'undefined' ||
                  dataValues[0] === ''
                ) {
                  return null;
                }

                return (
                  <Provider theme={defaultTheme}>
                    <Form validationBehavior='native'>
                      <Flex
                        margin={0}
                        direction='row'
                        alignItems='center'
                        gap={8}
                      >
                        <MultiSelect
                          onChange={(options) => {
                            filters[i] = options.map((opt) => opt.text);
                            setFilters([...filters]);
                          }}
                          items={uniqueValues.map((value, index) => ({
                            id: index,
                            text: value,
                          }))}
                        />
                      </Flex>
                    </Form>
                  </Provider>
                );
              })()}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}

TableHead.propTypes = {
  cols: PropTypes.arrayOf(PropTypes.string).isRequired,
  setFilters: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.any)).isRequired,
  filterConfig: PropTypes.object,
};

TableHead.defaultProps = {
  filterConfig: {},
};

export default TableHead;
