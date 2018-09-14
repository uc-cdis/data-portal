import {
  PieChart, Pie, Tooltip, Cell,
} from 'recharts';
import PropTypes from 'prop-types';
import React from 'react';
import helper from '../helper';
import './SummaryPieChart.less';

class SummaryPieChart extends React.Component {
  render() {
    const useTwoColors = this.props.data.length === 2;
    const getColor = useTwoColors
      ? helper.getCategoryColorFrom2Colors
      : helper.getCategoryColor;
    const pieChartData = helper.calculateChartData(
      this.props.data,
      this.props.showPercentage,
      this.props.percentageFixedPoint,
    );
    const dataKey = helper.getDataKey(this.props.showPercentage);

    return (
      <div className='summary-pie-chart'>
        <div className='summary-pie-chart__title-box'>
          <p className='summary-pie-chart__title h4-typo'>{this.props.title}</p>
        </div>
        <div className='summary-pie-chart__body'>
          <div className='summary-pie-chart__legend'>
            {
              pieChartData.map(entry => (
                <div className='summary-pie-chart__legend-item' key={'text'.concat(entry.name)}>
                  <div className='summary-pie-chart__legend-item-name'>
                    {entry.name}
                  </div>
                  <div className='summary-pie-chart__legend-item-value form-special-number'>
                    {
                      helper.percentageFormatter(this.props.showPercentage)(entry[dataKey])
                    }
                  </div>
                </div>))
            }
          </div>
          <PieChart
            width={this.props.outerRadius * 2}
            height={this.props.outerRadius * 2}
            style={this.props.pieChartStyle}
          >
            <Pie
              dataKey={dataKey}
              isAnimationActive={false}
              data={pieChartData}
              innerRadius={this.props.innerRadius}
              outerRadius={this.props.outerRadius}
              fill={this.props.pieChartStyle.fill}
            >
              {
                pieChartData.map((entry, index) => (
                  <Cell
                    key={dataKey}
                    dataKey={dataKey}
                    fill={getColor(index)}
                  />))
              }
            </Pie>
            <Tooltip formatter={helper.percentageFormatter(this.props.showPercentage)} />
          </PieChart>
        </div>
      </div>
    );
  }
}

const ChartDataShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
});

SummaryPieChart.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(ChartDataShape).isRequired,
  innerRadius: PropTypes.number,
  outerRadius: PropTypes.number,
  showPercentage: PropTypes.bool,
  percentageFixedPoint: PropTypes.number,
  pieChartStyle: PropTypes.object,
};

SummaryPieChart.defaultProps = {
  innerRadius: 31.5,
  outerRadius: 43,
  showPercentage: true,
  percentageFixedPoint: 2,
  pieChartStyle: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '22px',
    fill: '#8884d8',
  },
};

export default SummaryPieChart;
