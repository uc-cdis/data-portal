import React from 'react';
import PropTypes from 'prop-types';
import { getType } from '../../utils';
import './DataDictionaryPropertyTable.css';

class DataDictionaryPropertyTable extends React.Component {
  render() {
    const borderModifier = this.props.hasBorder ? ''
      : 'data-dictionary-property-table--without-border';
    return (
      <div className={`data-dictionary-property-table ${borderModifier}`}>
        <table className='data-dictionary-property-table__table'>
          <thead className='data-dictionary-property-table__head'>
            <tr className='data-dictionary-property-table__row'>
              <th
                className='data-dictionary-property-table__data
                data-dictionary-property-table__data--property'
              >
                Property
              </th>
              <th
                className='data-dictionary-property-table__data
                data-dictionary-property-table__data--type'
              >
                Type
              </th>
              <th
                className='data-dictionary-property-table__data
                data-dictionary-property-table__data--required'
              >
                Required
              </th>
              <th
                className='data-dictionary-property-table__data
                data-dictionary-property-table__data--description'
              >
                Description
              </th>
              <th
                className='data-dictionary-property-table__data
                data-dictionary-property-table__data--term'
              >
                Term
              </th>
            </tr>
          </thead>
          <tbody>
            {
              Object.keys(this.props.properties)
                .sort((k1, k2) => {
                  const required1 = this.props.requiredProperties.includes(k1);
                  const required2 = this.props.requiredProperties.includes(k2);
                  if (required1) return -1;
                  if (required2) return 1;
                  return 0;
                })
                .map((propertyKey) => {
                  const property = this.props.properties[propertyKey];
                  const type = getType(property);
                  let rawDescription = 'No Description';
                  if ('description' in property) {
                    rawDescription = property.description;
                  }
                  if ('term' in property) {
                    rawDescription = property.term.description;
                  }
                  const descriptionElements = (
                    <React.Fragment>
                      {
                        rawDescription &&
                      rawDescription.split('\\n').map((desc, i) => (
                        <span key={`${propertyKey}-desc-${i}`}>
                          {desc}
                        </span>
                      ))
                      }
                    </React.Fragment>
                  );
                  const isRequired = this.props.requiredProperties.includes(propertyKey);
                  return (
                    <tr key={propertyKey}>
                      <td className='data-dictionary-property-table__data'>{propertyKey}</td>
                      <td className='data-dictionary-property-table__data'>
                        <ul>
                          {
                            typeof type === 'string' ? (<li>{type}</li>) : type.map(t => (
                              <li key={t}>{t}</li>
                            ))
                          }
                        </ul>
                      </td>
                      <td className='data-dictionary-property-table__data'>
                        { isRequired ? (
                          <span className='data-dictionary-property-table__required'>
                            <i className='g3-icon g3-icon--star data-dictionary-property-table__required-icon' />Required
                          </span>
                        ) : (
                          <span>No</span>
                        )
                        }
                      </td>
                      <td className='data-dictionary-property-table__data'>{descriptionElements}</td>
                      <td className='data-dictionary-property-table__data' />
                    </tr>
                  );
                })
            }

          </tbody>
        </table>
      </div>
    );
  }
}

DataDictionaryPropertyTable.propTypes = {
  properties: PropTypes.object.isRequired,
  requiredProperties: PropTypes.array,
  hasBorder: PropTypes.bool,
};

DataDictionaryPropertyTable.defaultProps = {
  requiredProperties: [],
  hasBorder: true,
};

export default DataDictionaryPropertyTable;
