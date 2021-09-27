import React from 'react';
import PropTypes from 'prop-types';
import CountBox from './CountBox';
import './DataSummaryCardGroup.less';
import { parseParamWidth } from '../../utils.js';

/**
 * @typedef {Object} SummaryValue
 * @property {string} label
 * @property {number} value
 */

/**
 * @typedef {Object} DataSummaryCardGroupProps
 * @property {('left' | 'center')} [align]
 * @property {boolean} [connected]
 * @property {number | string} [height]
 * @property {number} [lockValue]
 * @property {(SummaryValue | SummaryValue[])[]} summaryItems
 * @property {number | string} [width]
 */

/** @param {DataSummaryCardGroupProps} props */
function DataSummaryCardGroup({
  align = 'center',
  connected = false,
  height = 97,
  lockValue = -1,
  summaryItems,
  width = '100%',
}) {
  const totalWidth = parseParamWidth(width);
  return (
    <div
      className='data-summary-card-group'
      style={{
        width: totalWidth,
        height,
      }}
    >
      {summaryItems.map((item, index) => (
        <div
          className={'data-summary-card-group__'
            .concat(connected ? 'connected' : 'separated')
            .concat('-card')}
          key={!Array.isArray(item) ? item.label : item[0].label}
        >
          {connected && index > 0 && <div className='left-border' />}
          {!Array.isArray(item) ? (
            <CountBox
              label={item.label}
              value={item.value}
              align={align}
              lockValue={lockValue}
            />
          ) : (
            <div className='data-summary-card-group__sub-card-group'>
              {item.map((subItem, subIndex) => (
                <div
                  className='data-summary-card-group__sub-card-item'
                  key={subItem.label}
                >
                  {subIndex > 0 && <div className='left-border' />}
                  <CountBox
                    label={subItem.label}
                    value={subItem.value}
                    align={align}
                    lockValue={lockValue}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const summaryValuePropType = PropTypes.exact({
  label: PropTypes.string,
  value: PropTypes.number,
});
DataSummaryCardGroup.propTypes = {
  align: PropTypes.oneOf(['left', 'center']),
  connected: PropTypes.bool,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  lockValue: PropTypes.number,
  summaryItems: PropTypes.arrayOf(
    PropTypes.oneOfType([
      summaryValuePropType,
      PropTypes.arrayOf(summaryValuePropType),
    ])
  ).isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default DataSummaryCardGroup;
