import React from 'react';
import PropTypes from 'prop-types';
import { SearchResultItemShape } from '../../utils';
import {
  getMatchesSummaryForProperties,
  getPropertyNameFragment,
  getPropertyDescriptionFragment,
  getPropertyTypeFragment,
} from '../../highlightHelper';
import './DataDictionaryPropertyTable.css';

/**
 * @typedef {Object} DataDictionaryProperty
 * @property {string} description
 * @property {string} name
 * @property {string | string[]} type
 */

/**
 * @typedef {Object} MatchedResult
 * @property {{ description: string; id: string; properties: DataDictionaryProperty[]; title: string }} items
 * @property {{ arrayIndex: number; indicies: number[][]; key: string; value: string }} matches
 */

/**
 * @typedef {Object} DataDictionaryPropertyTableProps
 * @property {boolean} [hasBorder]
 * @property {boolean} [hideIsRequired]
 * @property {MatchedResult} [matchedResult]
 * @property {boolean} [needHighlightSearchResult]
 * @property {boolean} [onlyShowMatchedProperties]
 * @property {Object[]} properties
 * @property {string[]} [requiredProperties]
 */

/** @param {DataDictionaryPropertyTableProps} props */
function DataDictionaryPropertyTable({
  hasBorder = true,
  hideIsRequired = false,
  matchedResult,
  needHighlightSearchResult = false,
  onlyShowMatchedProperties = false,
  properties,
  requiredProperties = [],
}) {
  const borderModifier = hasBorder
    ? ''
    : 'data-dictionary-property-table--without-border';
  const propertyKeysList = hideIsRequired
    ? Object.keys(properties)
    : Object.keys(properties).sort((k1, k2) => {
        if (requiredProperties.includes(k1)) return -1;
        if (requiredProperties.includes(k2)) return 1;
        return 0;
      });
  const matchedPropertiesSummary =
    onlyShowMatchedProperties || needHighlightSearchResult
      ? getMatchesSummaryForProperties(properties, matchedResult?.matches)
      : [];
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
            {!hideIsRequired && (
              <th
                className='data-dictionary-property-table__data
                    data-dictionary-property-table__data--required'
              >
                Required
              </th>
            )}
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
          {propertyKeysList.map((propertyKey) => {
            const property = properties[propertyKey];
            let nameMatch = null;
            let descriptionMatch = null;
            let typeMatchList = null;
            if (needHighlightSearchResult) {
              const matchedSummaryItem = matchedPropertiesSummary.find(
                (item) => item.propertyKey === propertyKey
              );
              if (matchedSummaryItem) {
                nameMatch = matchedSummaryItem.nameMatch;
                descriptionMatch = matchedSummaryItem.descriptionMatch;
                typeMatchList = matchedSummaryItem.typeMatchList;
              } else if (onlyShowMatchedProperties) {
                return null;
              }
            }
            let termID = '';
            let termLink = '';
            if ('term' in property) {
              termID = property.term.termDef && property.term.termDef.cde_id;
              termLink =
                property.term.termDef && property.term.termDef.term_url;
            }
            const propertyNameFragment = getPropertyNameFragment(
              propertyKey,
              nameMatch,
              'data-dictionary-property-table__span'
            );
            const propertyTypeFragment = getPropertyTypeFragment(
              property,
              typeMatchList,
              'data-dictionary-property-table__span'
            );
            const propertyDescriptionFragment = getPropertyDescriptionFragment(
              property,
              descriptionMatch,
              'data-dictionary-property-table__span'
            );
            const isRequired = requiredProperties.includes(propertyKey);
            return (
              <tr key={propertyKey}>
                <td className='data-dictionary-property-table__data'>
                  {propertyNameFragment}
                </td>
                <td className='data-dictionary-property-table__data'>
                  {propertyTypeFragment}
                </td>
                {!hideIsRequired && (
                  <td className='data-dictionary-property-table__data'>
                    {isRequired ? (
                      <span className='data-dictionary-property-table__required'>
                        <i className='g3-icon g3-icon--star data-dictionary-property-table__required-icon' />
                        Required
                      </span>
                    ) : (
                      <span>No</span>
                    )}
                  </td>
                )}
                <td className='data-dictionary-property-table__data'>
                  {propertyDescriptionFragment}
                </td>
                <td className='data-dictionary-property-table__data'>
                  {termLink !== '' && <a href={termLink}>{termID}</a>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

DataDictionaryPropertyTable.propTypes = {
  hasBorder: PropTypes.bool,
  hideIsRequired: PropTypes.bool,
  matchedResult: SearchResultItemShape,
  needHighlightSearchResult: PropTypes.bool,
  onlyShowMatchedProperties: PropTypes.bool,
  properties: PropTypes.object.isRequired,
  requiredProperties: PropTypes.array,
};

export default DataDictionaryPropertyTable;
