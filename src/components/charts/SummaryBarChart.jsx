
import {
  ResponsiveContainer, BarChart, Bar,
  Tooltip, XAxis, YAxis, LabelList, Cell,
} from 'recharts';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';

const BarChartTitle = styled.div`
  text-align: center;
  border-bottom: solid black 1px;
  line-height: 10px;
  height: 22px;
`;

const BarChartWrapper = styled.div`
  padding: 12px;
  background-color: white;
  & svg {
    overflow: visible;
  }
  width: 100%;
  height: 100%;
`;

const yAxisStyle = {
  fontSize: '12px',
  fontWeight: 'regular',
  lineHeight: '1em',
  letterSpacing: '.03rem',
  color: '#606060',
};

const labelValueStyle = {
  fontSize: '10px',
  fontWeight: 600,
  lineHeight: '1em',
  letterSpacing: '.02rem',
  color: '#3283c8',
};

const calculateBarChartData = (data, showPercentage, percentageFixedPoint) => {
  if (showPercentage) {
    let sum = 0;
    data.forEach((d) => { sum += d.value; });
    let percentLeft = 100;
    return data.map((entry, index, array) => {
      let percentage;
      if (index < array.length - 1) {
        percentage = (entry.value * 100) / sum;
      } else {
        percentage = percentLeft;
      }
      percentage = Number(Number.parseFloat(percentage).toFixed(percentageFixedPoint));
      percentLeft -= percentage;
      return Object.assign({ percentage }, entry);
    });
  }
  return data;
};

class SummaryBarChart extends React.Component {
  render() {
    const getCategoryColor = (index) => {
      // map index to (1-9)
      const i = (index % 9) + 1;
      return this.props.localTheme[`barGraph.bar${i}Color`];
    };
    const monoFillColor = this.props.monoColor ? this.props.color : undefined;
    const barChartHeight = (this.props.data.length * this.props.barSize)
      + ((this.props.data.length + 1) * this.props.barGap) + 2;
    const barChartData = calculateBarChartData(
      this.props.data,
      this.props.showPercentage,
      this.props.percentageFixedPoint,
    );
    const dataKey = this.props.showPercentage ? 'percentage' : 'value';
    const toPercentageFormatter = v => (this.props.showPercentage ? `${v}%` : v);
    return (
      <BarChartWrapper>
        <BarChartTitle className="h4-typo">
          {this.props.title}
        </BarChartTitle>
        <ResponsiveContainer width="100%" height={barChartHeight}>
          <BarChart
            layout={this.props.vertical ? 'vertical' : 'horizontal'}
            data={barChartData}
            barCategoryGap={this.props.barGap}
            barSize={this.props.barSize}
            margin={{ top: 4, right: 35, left: 15 }}
          >
            <Tooltip formatter={toPercentageFormatter} />
            <XAxis axisLine={false} tickLine={false} type="number" hide />
            <YAxis axisLine={false} tickLine={false} dataKey="name" type="category" style={yAxisStyle} interval={0} />
            <Bar dataKey={dataKey}>
              {
                barChartData.map((entry, index) => (
                  <Cell key={'bar'.concat(index)} fill={monoFillColor || getCategoryColor(index)} />
                ))
              }
              <LabelList dataKey={dataKey} position="right" offset={8} style={labelValueStyle} formatter={toPercentageFormatter} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </BarChartWrapper>
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
  localTheme: PropTypes.object.isRequired,
  vertical: PropTypes.bool,
  monoColor: PropTypes.bool,
  color: PropTypes.string,
  barSize: PropTypes.number,
  barGap: PropTypes.number,
  showPercentage: PropTypes.bool,
  percentageFixedPoint: PropTypes.number,
};

SummaryBarChart.defaultProps = {
  vertical: false,
  monoColor: false,
  color: '#3283c8',
  barSize: 11,
  barGap: 8,
  showPercentage: true,
  percentageFixedPoint: 2,
};

export default SummaryBarChart;
