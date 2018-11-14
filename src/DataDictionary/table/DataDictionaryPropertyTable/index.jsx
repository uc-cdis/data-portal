import React from 'react';
import PropTypes from 'prop-types';
import { getType } from '../../utils';
import './DataDictionaryPropertyTable.css';

class DataDictionaryPropertyTable extends React.Component {
  render() {
    return (
      <div className='data-dictionary-property-table'>
        <table className='data-dictionary-property-table__table'>
          <thead className='data-dictionary-property-table__head'>
            <tr className='data-dictionary-property-table__row'>
              <td
                className='data-dictionary-property-table__data
                data-dictionary-property-table__data--property'
              >
                Property
              </td>
              <td
                className='data-dictionary-property-table__data
                data-dictionary-property-table__data--type'
              >
                Type
              </td>
              <td
                className='data-dictionary-property-table__data
                data-dictionary-property-table__data--required'
              >
                Required
              </td>
              <td
                className='data-dictionary-property-table__data
                data-dictionary-property-table__data--description'
              >
                Description
              </td>
              <td
                className='data-dictionary-property-table__data
                data-dictionary-property-table__data--term'
              >
                Term
              </td>
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
};

DataDictionaryPropertyTable.defaultProps = {
  requiredProperties: [],
};

export default DataDictionaryPropertyTable;
