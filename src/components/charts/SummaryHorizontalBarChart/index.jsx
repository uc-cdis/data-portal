import {
  ResponsiveContainer, BarChart, Bar,
  Tooltip, XAxis, YAxis, LabelList, Cell,
} from 'recharts';
import PropTypes from 'prop-types';
import React from 'react';
import {
  calculateChartData,
  getDataKey,
  getCategoryColor,
  percentageFormatter,
} from '../helper';
import './SummaryHorizontalBarChart.less';

// FIXME: add back in animation (https://github.com/recharts/recharts/issues/1083)
class SummaryBarChart extends React.Component {
  render() {
    const {
      barChartStyle,
      labelValueStyle,
      xAxisStyle,
    } = this.props;
    const barChartHeight = (this.props.data.length * barChartStyle.barSize)
      + ((this.props.data.length + 1) * barChartStyle.barGap) + 2;
    const barChartData = calculateChartData(
      this.props.data,
      this.props.showPercentage,
      this.props.percentageFixedPoint,
    );
    const dataKey = getDataKey(this.props.showPercentage);
    return (
      <div className='summary-horizontal-bar-chart'>
        <div className='summary-horizontal-bar-chart__title-box'>
          <p className='summary-horizontal-bar-chart__title h4-typo'>
            {this.props.title}
          </p>
        </div>
        <div>
          <div className='summary-horizontal-bar-chart__legend'>
            {
              barChartData.map((entry, i) => (
                <div
                  key={i}
                  className='summary-horizontal-bar-chart__legend-item'
                >
                  {entry.name}
                </div>
              ))
            }
          </div>
          <div className='summary-horizontal-bar-chart__responsive-container'>
            <ResponsiveContainer width='100%' height={barChartHeight}>
              <BarChart
                layout={barChartStyle.layout}
                data={barChartData}
                barCategoryGap={barChartStyle.barGap}
                barSize={barChartStyle.barSize}
                margin={barChartStyle.margins}
              >
                <Tooltip
                  formatter={percentageFormatter(this.props.showPercentage)}
                />
                <XAxis {...xAxisStyle} type='number' hide />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  dataKey='name'
                  type='category'
                  hide
                />
                <Bar dataKey={dataKey} isAnimationActive={false}>
                  {
                    barChartData.map((entry, index) => (
                      <Cell
                        key={dataKey}
                        fill={this.props.color
                          || getCategoryColor(index)}
                      />
                    ))
                  }
                  <LabelList
                    dataKey={dataKey}
                    position={labelValueStyle.position}
                    offset={labelValueStyle.offset}
                    style={labelValueStyle}
                    formatter={percentageFormatter(this.props.showPercentage)}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }
}

const ChartDataShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
});

SummaryBarChart.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(ChartDataShape).isRequired,
  color: PropTypes.string,
  showPercentage: PropTypes.bool,
  percentageFixedPoint: PropTypes.number,
  xAxisStyle: PropTypes.object,
  labelValueStyle: PropTypes.object,
  barChartStyle: PropTypes.object,
};

SummaryBarChart.defaultProps = {
  color: undefined,
  showPercentage: true,
  percentageFixedPoint: 2,
  xAxisStyle: {
    axisLine: false,
    tickLine: false,
  },
  labelValueStyle: {
    fontSize: '10px',
    fontWeight: 600,
    lineHeight: '1em',
    letterSpacing: '.02rem',
    color: '#3283c8',
    position: 'right',
    offset: 8,
  },
  barChartStyle: {
    margins: {
      top: 4,
      right: 35,
      left: 15,
    },
    layout: 'vertical',
    barSize: 11,
    barGap: 8,
  },
};

export default SummaryBarChart;
