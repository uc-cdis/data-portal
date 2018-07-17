
import {
  PieChart, Pie, Tooltip, Cell,
} from 'recharts';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';

const PieChartWrapper = styled.div`
  width: 100%;
  padding: 12px;
  background-color: white;
`;

const PieChartTitle = styled.div`
  text-align: center;
  border-bottom: solid black 1px;
  line-height: 10px;
  height: 22px;
`;

const PieChartInnerWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const PieChartLegendWrapper = styled.div`
  width: 70px;
  flexGrow: 0;
  padding-top: 8px;
`;

const pieChartStyle = {
  flexGrow: 1,
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: '22px',
};

const LegendWrapper = styled.div`
  text-align: right;
  margin-bottom: 22px;
`;

const LegendName = styled.div`
`;

const LegendValue = styled.div`
  margin-top: 8px;
`;

const calculateBarChartData = (data, showPercentage, percentageFixedPoint) => {
  if (showPercentage) {
    let sum = 0;
    data.forEach((d) => { sum += d.value; });
    let percentLeft = 100;
    return data.map((entry, index, array) => {
      let percentage;
      if (index < array.length - 1) {
        percentage = entry.value * 100 / sum;
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

class SummaryPieChart extends React.Component {
  render() {
    const useTwoColors = this.props.data.length === 2;
    const getCategoryColor = (index) => {
      if (useTwoColors) {
        return this.props.localTheme[`pieChartTwoColor.pie${(index % 2) + 1}Color`];
      }
      const i = (index % 9) + 1;
      return this.props.localTheme[`barGraph.bar${i}Color`];
    };
    const barChartData = calculateBarChartData(this.props.data,
      this.props.showPercentage, this.props.percentageFixedPoint);
    const dataKey = this.props.showPercentage ? 'percentage' : 'value';
    const toPercentageFormatter = per => (`${per}%`);
    return (
      <PieChartWrapper>
        <PieChartTitle className="h4-typo">
          {this.props.title}
        </PieChartTitle>
        <PieChartInnerWrapper>
          <PieChartLegendWrapper>
            {
              barChartData.map(entry => (
                <LegendWrapper className="form-body" key={'text'.concat(entry.name)}>
                  <LegendName>
                    {entry.name}
                  </LegendName>
                  <LegendValue className="form-special-number">
                    {
                      this.props.showPercentage ? `${entry[dataKey]}%` : entry[dataKey]
                    }
                  </LegendValue>
                </LegendWrapper>))
            }
          </PieChartLegendWrapper>
          <PieChart
            width={this.props.outerRadius * 2}
            height={this.props.outerRadius * 2}
            style={pieChartStyle}
          >
            <Pie
              dataKey={dataKey}
              isAnimationActive={false}
              data={barChartData}
              innerRadius={this.props.innerRadius}
              outerRadius={this.props.outerRadius}
              fill="#8884d8"
            >
              {
                barChartData.map((entry, index) => (
                  <Cell
                    key={'pie'.concat(index)}
                    dataKey={dataKey}
                    fill={getCategoryColor(index)}
                  />))
              }
            </Pie>
            <Tooltip formatter={toPercentageFormatter} />
          </PieChart>
        </PieChartInnerWrapper>
      </PieChartWrapper>
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
  localTheme: PropTypes.object.isRequired,
  innerRadius: PropTypes.number,
  outerRadius: PropTypes.number,
  showPercentage: PropTypes.bool,
  percentageFixedPoint: PropTypes.number,
};

SummaryPieChart.defaultProps = {
  innerRadius: 31.5,
  outerRadius: 43,
  showPercentage: true,
  percentageFixedPoint: 2,
};

export default SummaryPieChart;
