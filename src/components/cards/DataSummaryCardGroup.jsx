import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CountBox from './CountBox';
import './DataSummaryCardGroup.less';
import { parseParamWidth } from '../../utils.js';

class DataSummaryCardGroup extends Component {
  render() {
    const totalWidth = parseParamWidth(this.props.width);
    return (
      <div
        className='data-summary-card-group'
        style={{
          width: totalWidth,
          height: this.props.height,
        }}
      >
        {
          this.props.summaryItems.map((item, index) => (
            <div
              className={'data-summary-card-group__'.concat(this.props.connected ? 'connected' : 'separated').concat('-card')}
              key={item.label || item[0].label}
            >
              {this.props.connected && index > 0
                && <div className='left-border' />
              }
              {
                !item.length ? (
                  <CountBox
                    label={item.label}
                    value={item.value}
                    align={this.props.align}
                    lockValue={this.props.lockValue}
                  />
                ) : (
                  <div className='data-summary-card-group__sub-card-group'>
                    {
                      item.map((subItem, subIndex) => (
                        <div className='data-summary-card-group__sub-card-item' key={subItem.label}>
                          {subIndex > 0
                            && <div className='left-border' />
                          }
                          <CountBox
                            label={subItem.label}
                            value={subItem.value}
                            align={this.props.align}
                            lockValue={this.props.lockValue}
                          />
                        </div>
                      ))
                    }
                  </div>
                )
              }
            </div>
          ))
        }
      </div>
    );
  }
}

const summaryValueShape = PropTypes.shape({
  label: PropTypes.string,
  value: PropTypes.number,
});
const summarySubValueShape = PropTypes.arrayOf(summaryValueShape);
DataSummaryCardGroup.propTypes = {
  summaryItems: PropTypes.arrayOf(PropTypes.oneOfType([
    summaryValueShape,
    summarySubValueShape,
  ])).isRequired,
  connected: PropTypes.bool,
  align: PropTypes.oneOf(['left', 'center']),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.number,
  lockValue: PropTypes.number,
};

DataSummaryCardGroup.defaultProps = {
  connected: false,
  align: 'center',
  width: '100%',
  height: 97,
  lockValue: -1,
};

export default DataSummaryCardGroup;
