
import {
  ResponsiveContainer, PieChart, Pie, Legend, Tooltip, Cell,
} from 'recharts';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';
import { localTheme } from '../../localconf';

const pieChartContainerStyle = {
  height: '200px',
  width: '200px',
};

const pieChartStyle = {
};

const pieStyle = {
};

const legendStyle = {
  fontSize: '10px',
};

class SummaryPieChart extends React.Component {
  render() {
    const getCategoryColor = (index) => {
      // map index to (1-9)
      const i = (index % 9) + 1;
      return localTheme[`barGraph.bar${i}Color`];
    };
    return (
      <div>
        <h1>
          {this.props.title}
        </h1>
        <div style={pieChartContainerStyle}>
          <ResponsiveContainer>
            <PieChart width={200} height={200}>
              <Pie dataKey="value" isAnimationActive={false} data={this.props.data} cx={50} cy={60} innerRadius={40} outerRadius={60} fill="#8884d8">
                {
                  this.props.data.map((entry, index) => (
                    <Cell key={'pie'.concat(index)} dataKey="value" fill={getCategoryColor(index)} />))
                }
              </Pie>
              <Legend align="left" wrapperStyle={legendStyle} layout="vertical" />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
}

SummaryPieChart.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default SummaryPieChart;
