import {
  BarChart, Bar, Tooltip, XAxis, YAxis,
  CartesianGrid, LabelList,
} from 'recharts';
import PropTypes from 'prop-types';
import React from 'react';
import _ from 'underscore';
import helper from './helper';
import './PercentageStackedBarChart.less';

const getPercentageDataLabels = chartData => chartData.map(entry => entry.name);

const xAxisStyle = {
  fontSize: '10px',
  fontWeight: 600,
  lineHeight: '1em',
  letterSpacing: '.02rem',
  color: '#3283c8',
};

const labelListStyle = {
  fill: '#FFFFFF',
  fontSize: '14px',
  fontWeight: 600,
};

class PercentageStackedBarChart extends React.Component {
  render() {
    const percentageData = helper.getPercentageData(
      this.props.data,
      this.props.percentageFixedPoint,
    );
    const percentageDataLabels = getPercentageDataLabels(this.props.data);
    return (
      <div className='percentage-bar-chart'>
        <BarChart
          width={580}
          height={155}
          data={percentageData}
          layout='vertical'
          margin={{
            top: 28, right: 12, bottom: 8, left: 12,
          }}
          barSize={30}
        >
          <Tooltip />
          <CartesianGrid />
          <XAxis
            axisLine={false}
            tickLine={false}
            ticks={_.range(0, 101, 10)}
            type='number'
            domain={[0, 100]}
            tickMargin={10}
            style={xAxisStyle}
            tickFormatter={helper.addPercentage}
          />
          <YAxis axisLine={false} tickLine={false} dataKey='name' type='category' hide />
          {
            percentageDataLabels.map((name, index) => (
              <Bar
                key={name}
                dataKey={name}
                stackId='a'
                fill={helper.getCategoryColor(index, this.props.localTheme)}
              >
                <LabelList dataKey={name} position='center' style={labelListStyle} formatter={helper.addPercentage} className='percentage-bar-chart__label-list' />
              </Bar>
            ))
          }
        </BarChart>
        <div className='percentage-bar-chart__legend'>
          <ul>
            {
              percentageDataLabels.map((name, index) => (
                <li key={`label-${name}`}>
                  <span
                    className='percentage-bar-chart__legend-color'
                    style={{
                      background: helper.getCategoryColor(index, this.props.localTheme),
                    }}
                  />
                  <span className='percentage-bar-chart__legend-name form-body'>
                    {name}
                  </span>
                  <span className='percentage-bar-chart__legend-value form-caption'>
                    {'('.concat(Number(this.props.data[index].value).toLocaleString()).concat(')')}
                  </span>
                </li>
              ))
            }
          </ul>
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
  data: PropTypes.arrayOf(ChartDataShape).isRequired,
  localTheme: PropTypes.object.isRequired,
  percentageFixedPoint: PropTypes.number,
};

PercentageStackedBarChart.defaultProps = {
  percentageFixedPoint: 2,
};

export default PercentageStackedBarChart;
