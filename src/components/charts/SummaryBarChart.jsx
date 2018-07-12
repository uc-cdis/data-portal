
import {
  ResponsiveContainer, BarChart, Bar, Legend, Tooltip, XAxis, YAxis, LabelList, Cell,
} from 'recharts';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';
import { localTheme } from '../../localconf';

const barChartContainerStyle = {
  height: '100px',
  width: '100px',
};

const getCategoryColor = (index) => {
  // map index to (1-9)
  const i = (index % 9) + 1;
  return localTheme[`barGraph.bar${i}Color`];
};

class SummaryBarChart extends React.Component {
  render() {
    const monoFillColor = this.props.monoColor ? this.props.color : undefined;

    return (
      <div>
        <h1>
          {this.props.title}
        </h1>
        <BarChart layout={this.props.vertical ? 'vertical' : 'horizontal'} width={200} height={200} data={this.props.data}>
          <Tooltip />
          <XAxis axisLine={false} tickLine={false} type="number" hide />
          <YAxis axisLine={false} tickLine={false} dataKey="name" type="category" />
          <Bar dataKey="value" barSize={20} fill="#413ea0">
            {
              this.props.data.map((entry, index) => (
                <Cell key={'bar'.concat(index)} dataKey="value" fill={monoFillColor || getCategoryColor(index)} />))
            }
          </Bar>
        </BarChart>
      </div>
    );
  }
}

SummaryBarChart.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  vertical: PropTypes.bool,
  monoColor: PropTypes.bool,
  color: PropTypes.string,
};

SummaryBarChart.defaultProps = {
  vertical: false,
  monoColor: false,
  color: '#3283c8',
};

export default SummaryBarChart;
