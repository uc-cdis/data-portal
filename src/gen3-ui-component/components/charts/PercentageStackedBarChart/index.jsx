import {
  BarChart, Bar, Tooltip, XAxis, YAxis,
  CartesianGrid, LabelList, ResponsiveContainer,
} from 'recharts';
import PropTypes from 'prop-types';
import React from 'react';
import helper from '../helper';
import './PercentageStackedBarChart.css';
import LockedContent from '../LockedContent';

const getPercentageDataLabels = chartData => chartData.map(entry => entry.name);

// FIXME: add back in animation (https://github.com/recharts/recharts/issues/1083)
class PercentageStackedBarChart extends React.Component {
  getItemColor(index) {
    if (this.props.useCustomizedColorMap) {
      return this.props.customizedColorMap[index % this.props.customizedColorMap.length];
    }
    return helper.getCategoryColor(index);
  }

  render() {
    let chart = null;
    if (helper.shouldHideChart(this.props.data, this.props.lockValue)) {
      chart = (
        <div className='percentage-bar-chart__locked'>
          <LockedContent lockMessage={this.props.lockMessage} />
        </div>
      );
    } else {
      const percentageData = helper.getPercentageData(
        this.props.data,
        this.props.percentageFixedPoint,
      );
      const percentageDataLabels = getPercentageDataLabels(this.props.data);
      const { barChartStyle, xAxisStyle, labelListStyle } = this.props;
      chart = (
        <div className='percentage-bar-chart__content'>
          <div className='percentage-bar-chart__chart'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={percentageData} {...barChartStyle}>
                <Tooltip />
                <CartesianGrid />
                <XAxis
                  type='number'
                  style={xAxisStyle}
                  tickFormatter={helper.addPercentage}
                  {...xAxisStyle}
                />
                <YAxis axisLine={false} tickLine={false} dataKey='name' type='category' hide />
                {
                  percentageDataLabels.map((name, index) => (
                    <Bar
                      key={name}
                      dataKey={name}
                      stackId='a'
                      isAnimationActive={false}
                      fill={this.getItemColor(index)}
                    >
                      <LabelList
                        dataKey={name}
                        position={labelListStyle.position}
                        style={labelListStyle}
                        formatter={helper.addPercentage}
                        className='percentage-bar-chart__label-list'
                      />
                    </Bar>
                  ))
                }
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className='percentage-bar-chart__legend'>
            <div className='percentage-bar-chart__ul'>
              {
                percentageDataLabels.map((name, index) => (
                  <li className='percentage-bar-chart__legend-item' key={`label-${name}`}>
                    <span
                      className='percentage-bar-chart__legend-color'
                      style={{
                        background: this.getItemColor(index),
                      }}
                    />
                    <span className='percentage-bar-chart__legend-name'>
                      {name}
                    </span>
                    <span className='percentage-bar-chart__legend-value'>
                      {'('.concat(Number(this.props.data[index].value).toLocaleString()).concat(')')}
                    </span>
                  </li>
                ))
              }
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className='percentage-bar-chart'>
        <div className='percentage-bar-chart__title-box'>
          <p className='percentage-bar-chart__title h4-typo'>{this.props.title}</p>
        </div>
        <div className='percentage-bar-chart__content-box'>
          {chart}
        </div>
      </div>
    );
  }
}

const ChartDataShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
});

PercentageStackedBarChart.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(ChartDataShape).isRequired,
  percentageFixedPoint: PropTypes.number,
  barChartStyle: PropTypes.object,
  xAxisStyle: PropTypes.object,
  labelListStyle: PropTypes.object,
  lockValue: PropTypes.number, // if one of the value is equal to `lockValue`, lock the chart
  lockMessage: PropTypes.string,
  useCustomizedColorMap: PropTypes.bool,
  customizedColorMap: PropTypes.arrayOf(PropTypes.string),
};

PercentageStackedBarChart.defaultProps = {
  percentageFixedPoint: 2,
  barChartStyle: {
    layout: 'vertical',
    margin: {
      top: 28,
      right: 12,
      bottom: 8,
      left: 12,
    },
    barSize: 30,
  },
  xAxisStyle: {
    fontSize: '10px',
    fontWeight: 600,
    lineHeight: '1em',
    letterSpacing: '.02rem',
    color: '#3283c8',
    axisLine: false,
    tickLine: false,
    ticks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    domain: [0, 100],
    tickMargin: 10,
  },
  labelListStyle: {
    fill: '#FFFFFF',
    fontSize: '14px',
    fontWeight: 600,
    position: 'center',
  },
  lockValue: -1,
  lockMessage: 'This chart is hidden because it contains fewer than 1000 subjects',
  useCustomizedColorMap: false,
  customizedColorMap: ['#3283c8'],
};

export default PercentageStackedBarChart;
