import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CountBox from './CountBox';
import './DataSummaryCardGroup.less';

/**
 * Little card with a bunch of counters on it for cases, experiments, files, ...
 */
class DataSummaryCardGroup extends Component {
  render() {
    const totalWidth = typeof this.props.width === 'string' || `${this.props.width}px`;
    return (
      <div
        className="data-summary-card-group"
        style={{
          width: totalWidth,
          height: this.props.height,
        }}
      >
        {
          this.props.summaryItems.map((item, index) => (
            <div
              className={'data-summary-card-group__card'.concat(this.props.connected ? ' connected' : ' separated')}
              key={item.label || item[0].label}
            >
              {this.props.connected && index > 0
                && <div className="data-summary-card-group__card-left-border" />
              }
              {
                !item.length ? (
                  <CountBox
                    label={item.label}
                    value={item.value}
                    align={this.props.align}
                  />
                ) : (
                  <div className="data-summary-card-group__sub-card-group">
                    {
                      item.map((subItem, subIndex) => (
                        <div className="data-summary-card-group__sub-card-item" key={subItem.label}>
                          {subIndex > 0
                            && <div className="data-summary-card-group__sub-card-left-border" />
                          }
                          <CountBox
                            label={subItem.label}
                            value={subItem.value}
                            align={this.props.align}
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
};

DataSummaryCardGroup.defaultProps = {
  connected: false,
  align: 'center',
  width: '100%',
  height: 97,
};

export default DataSummaryCardGroup;
