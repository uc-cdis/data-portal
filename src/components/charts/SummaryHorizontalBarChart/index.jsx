import {
  ResponsiveContainer, BarChart, Bar,
  Tooltip, XAxis, YAxis, LabelList, Cell,
} from 'recharts';
import PropTypes from 'prop-types';
import React from 'react';
import helper from '../helper';
import './SummaryHorizontalBarChart.less';

// FIXME: add back in animation (https://github.com/recharts/recharts/issues/1083)
class SummaryBarChart extends React.Component {
  render() {
    const {
      barChartStyle,
      labelValueStyle,
      xAxisStyle,
      yAxisStyle,
    } = this.props;
    const barChartHeight = (this.props.data.length * barChartStyle.barSize)
      + ((this.props.data.length + 1) * barChartStyle.barGap) + 2;
    const barChartData = helper.calculateChartData(
      this.props.data,
      this.props.showPercentage,
      this.props.percentageFixedPoint,
    );
    const dataKey = helper.getDataKey(this.props.showPercentage);
    return (
      <div className='summary-horizontal-bar-chart'>
        <div className='summary-horizontal-bar-chart__title-box'>
          <p className='summary-horizontal-bar-chart__title h4-typo'>
            {this.props.title}
          </p>
        </div>
        <ResponsiveContainer width='100%' height={barChartHeight}>
          <BarChart
            layout={barChartStyle.layout}
            data={barChartData}
            barCategoryGap={barChartStyle.barGap}
            barSize={barChartStyle.barSize}
            margin={barChartStyle.margins}
          >
            <Tooltip formatter={helper.percentageFormatter(this.props.showPercentage)} />
            <XAxis {...xAxisStyle} type='number' hide />
            <YAxis
              axisLine={yAxisStyle.axisLine}
              tickLine={yAxisStyle.tickLine}
              dataKey='name'
              type='category'
              style={yAxisStyle}
              interval={0}
            />
            <Bar dataKey={dataKey} isAnimationActive={false}>
              {
                barChartData.map((entry, index) => (
                  <Cell
                    key={dataKey}
                    fill={this.props.color
                      || helper.getCategoryColor(index)}
                  />
                ))
              }
              <LabelList
                dataKey={dataKey}
                position={labelValueStyle.position}
                offset={labelValueStyle.offset}
                style={labelValueStyle}
                formatter={helper.percentageFormatter(this.props.showPercentage)}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
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
  yAxisStyle: PropTypes.object,
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
  yAxisStyle: {
    fontSize: '12px',
    fontWeight: 'regular',
    lineHeight: '1em',
    letterSpacing: '.03rem',
    color: '#606060',
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
