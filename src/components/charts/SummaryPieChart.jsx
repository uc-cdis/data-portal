import {
  PieChart, Pie, Tooltip, Cell,
} from 'recharts';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';
import ChartsHelper from './ChartsHelper';

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

const LegendItemWrapper = styled.div`
  text-align: right;
  margin-bottom: 22px;
`;

const LegendItemValue = styled.div`
  margin-top: 8px;
`;

class SummaryPieChart extends React.Component {
  render() {
    const useTwoColors = this.props.data.length === 2;
    const getColor = useTwoColors
      ? ChartsHelper.getCategoryColorFrom2Colors
      : ChartsHelper.getCategoryColor;
    const barChartData = ChartsHelper.calculateBarChartData(
      this.props.data,
      this.props.showPercentage,
      this.props.percentageFixedPoint,
    );
    const dataKey = ChartsHelper.getDataKey(this.props.showPercentage);

    return (
      <PieChartWrapper>
        <PieChartTitle className="h4-typo">
          {this.props.title}
        </PieChartTitle>
        <PieChartInnerWrapper>
          <PieChartLegendWrapper>
            {
              barChartData.map(entry => (
                <LegendItemWrapper key={'text'.concat(entry.name)}>
                  <div className="form-body">
                    {entry.name}
                  </div>
                  <LegendItemValue className="form-special-number">
                    {
                      // this.props.showPercentage ? `${entry[dataKey]}%` : entry[dataKey]
                      ChartsHelper.percentageFormatter(this.props.showPercentage)(entry[dataKey])
                    }
                  </LegendItemValue>
                </LegendItemWrapper>))
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
                    key={index}
                    dataKey={dataKey}
                    fill={getColor(index, this.props.localTheme, useTwoColors)}
                  />))
              }
            </Pie>
            <Tooltip formatter={ChartsHelper.percentageFormatter(this.props.showPercentage)} />
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
