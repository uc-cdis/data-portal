import { BarChart, Bar, Legend, Tooltip, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import PropTypes from 'prop-types';
import React from 'react';
import _ from 'underscore';
import { localTheme } from '../../localconf';


const getPercentageData = (chartData) => {
  const result = {};
  const sum = chartData.reduce((a, entry) => a + entry.value, 0);
  chartData.forEach((entry) => {
    const per = entry.value * 100 / sum;
    result[entry.name] = per;
  });
  return [result];
};

const getPercentageDataLabels = chartData => chartData.map(entry => entry.name);

const getCategoryColor = (index) => {
  // map index to (1-9)
  const i = (index % 9) + 1;
  return localTheme[`barGraph.bar${i}Color`];
};

const legendStyle = {
  fontSize: '10px',
};

const stackedBarChartStyle = {
  backgroundColor: '#FFFFFF',
};

class PercentageStackedBarChart extends React.Component {
  render() {
    const percentageData = getPercentageData(this.props.data);
    const percentageDataLabels = getPercentageDataLabels(this.props.data);
    return (
      <BarChart style={stackedBarChartStyle} width={800} height={150} data={percentageData} layout="vertical">
        <Tooltip />
        <CartesianGrid />
        <XAxis axisLine={false} tickLine={false} ticks={_.range(0, 101, 10)} type="number" domain={[0, 100]} />
        <YAxis axisLine={false} tickLine={false} dataKey="name" type="category" />
        <Legend align="right" verticalAlign="middle" wrapperStyle={legendStyle} width={0} layout="vertical" />
        {
          percentageDataLabels.map((name, index) => (
            <Bar
              key={name}
              dataKey={name}
              stackId="a"
              fill={getCategoryColor(index)}
              barSize={20}
            />
          ))
        }
      </BarChart>
    );
  }
}

/**
 data format: [
    {name: 'H1N1', value: 400},
    {name: 'VN1203', value: 300},
    {name: 'HIV', value: 300},
    {name: 'HuCoV_EMC', value: 200},
    {name: 'SARS_CoV', value: 278},
    {name: 'CA04', value: 189}
  ];
*/
PercentageStackedBarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default PercentageStackedBarChart;
