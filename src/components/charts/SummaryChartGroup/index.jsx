import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SummaryPieChart from '../SummaryPieChart';
import SummaryHorizontalBarChart from '../SummaryHorizontalBarChart';
import './SummaryChartGroup.less';
import { parseParamWidth } from '../../../utils.js';

class SummaryChartGroup extends Component {
  render() {
    const width = parseParamWidth(this.props.width);
    return (
      <div className='summary-chart-group' style={{ width }}>
        {
          this.props.summaries.map((item, index) => (
            <div className='summary-chart-group__column' key={item.title}>
              {
                index > 0 && <div className='summary-chart-group__column-left-border' />
              }
              {
                item.type === 'pie'
                  ? (
                    <SummaryPieChart
                      data={item.data}
                      title={item.title}
                    />
                  ) : (
                    <SummaryHorizontalBarChart
                      data={item.data}
                      title={item.title}
                      vertical
                      color={this.props.barChartColor}
                    />
                  )
              }
            </div>
          ))
        }
      </div>
    );
  }
}

SummaryChartGroup.propTypes = {
  summaries: PropTypes.arrayOf(PropTypes.object).isRequired,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  barChartColor: PropTypes.string,
};

SummaryChartGroup.defaultProps = {
  width: '100%',
  barChartColor: '#3283c8',
};

export default SummaryChartGroup;
