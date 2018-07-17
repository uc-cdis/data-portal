import {
  BarChart, Bar, Tooltip, XAxis, YAxis,
  CartesianGrid, LabelList,
} from 'recharts';
import PropTypes from 'prop-types';
import React from 'react';
import _ from 'underscore';
import styled from 'styled-components';

const getPercentageData = (chartData, percentageFixedPoint) => {
  const result = {};
  const sum = chartData.reduce((a, entry) => a + entry.value, 0);
  let percentLeft = 100;
  chartData.forEach((entry, index, array) => {
    let percentage;
    if (index < array.length - 1) {
      percentage = (entry.value * 100) / sum;
    } else {
      percentage = percentLeft;
    }
    percentage = Number(Number.parseFloat(percentage).toFixed(percentageFixedPoint));
    percentLeft -= percentage;
    result[entry.name] = percentage;
  });
  return [result];
};

const getPercentageDataLabels = chartData => chartData.map(entry => entry.name);

const stackedBarChartStyle = {
  backgroundColor: '#FFFFFF',
};

const PercentageStackedBarChartWrapper = styled.div`
  width: 1010px;
  height: 155px;
  display: flex;
  background-color: white;
`;

const LegendWrapper = styled.div`
  -webkit-column-count: 2; /* Chrome, Safari, Opera */
  -moz-column-count: 2; /* Firefox */
  column-count: 2;
  width: 430px;
  padding-top: 22px;
  padding-left: 25px;
  padding-right: 25px;
`;

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

const LegendColorBlock = styled.span`
  background-color: ${props => props.fill};
  display: inline-block;
  height: 10px;
  width: 10px;
`;

const LegendNameText = styled.span`
  margin-left: 6px;
`;

const LegendValueText = styled.span`
  margin-left: 6px;
`;

class PercentageStackedBarChart extends React.Component {
  render() {
    const getCategoryColor = (index) => {
      // map index to (1-9)
      const i = (index % 9) + 1;
      return this.props.localTheme[`barGraph.bar${i}Color`];
    };
    const percentageData = getPercentageData(this.props.data, this.props.percentageFixedPoint);
    const percentageDataLabels = getPercentageDataLabels(this.props.data);
    const toPercentageFormatter = per => (`${per}%`);
    return (
      <PercentageStackedBarChartWrapper>
        <BarChart
          style={stackedBarChartStyle}
          width={580}
          height={155}
          data={percentageData}
          layout="vertical"
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
            type="number"
            domain={[0, 100]}
            tickMargin={10}
            style={xAxisStyle}
            tickFormatter={toPercentageFormatter}
          />
          <YAxis axisLine={false} tickLine={false} dataKey="name" type="category" hide />
          {
            percentageDataLabels.map((name, index) => (
              <Bar
                key={name}
                dataKey={name}
                stackId="a"
                fill={getCategoryColor(index)}
              >
                <LabelList dataKey={name} position="center" style={labelListStyle} formatter={toPercentageFormatter} />
              </Bar>
            ))
          }
        </BarChart>
        <LegendWrapper>
          <ul>
            {
              percentageDataLabels.map((name, index) => (
                <li key={`label-${name}`}>
                  <LegendColorBlock fill={getCategoryColor(index)} />
                  <LegendNameText className="form-body">
                    {name}
                  </LegendNameText>
                  <LegendValueText className="form-caption">
                    {'('.concat(Number(this.props.data[index].value).toLocaleString()).concat(')')}
                  </LegendValueText>
                </li>
              ))
            }
          </ul>
        </LegendWrapper>
      </PercentageStackedBarChartWrapper>
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
