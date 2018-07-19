import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SummaryPieChart from './SummaryPieChart';
import SummaryBarChart from './SummaryBarChart';
import './SummaryChartGroup.less';

class SummaryChartGroup extends Component {
  render() {
    const width = (typeof this.props.width === 'number') ? `${this.props.width}px` : this.props.width;
    return (
      <div className="summary-chart-group" style={{ width }}>
        {
          this.props.summaries.map((item, index) => (
            <div className="summary-chart-group__column" key={item.title}>
              {
                index > 0 && <div className="summary-chart-group__column-left-border" />
              }
              {
                item.type === 'pie'
                  ? (
                    <SummaryPieChart
                      data={item.data}
                      title={item.title}
                      localTheme={this.props.localTheme}
                    />
                  ) : (
                    <SummaryBarChart
                      data={item.data}
                      title={item.title}
                      localTheme={this.props.localTheme}
                      vertical
                      monoColor
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
  localTheme: PropTypes.object.isRequired,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

SummaryChartGroup.defaultProps = {
  width: '100%',
};

export default SummaryChartGroup;
