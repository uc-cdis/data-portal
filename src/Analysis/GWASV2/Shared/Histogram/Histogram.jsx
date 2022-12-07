import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import PropTypes from 'prop-types';

//TODO - add legend, auto-scaling, sorting, etc
const Histogram = ({
  data,
  xAxisDataKey,
  barDataKey,
  chartWidth,
  chartHeight,
  barColor
}) => (
  <BarChart
    width={chartWidth}
    height={chartHeight}
    data={data}
  >
    <XAxis dataKey={xAxisDataKey}/>
    <YAxis />
    <Tooltip />
    <CartesianGrid strokeDasharray='3 3' />
    <Bar dataKey={barDataKey} fill={barColor} />
  </BarChart>
);

Histogram.propTypes = {
  data: PropTypes.array.isRequired,
  xAxisDataKey: PropTypes.string.isRequired,
  barDataKey: PropTypes.array.isRequired,
  chartWidth: PropTypes.number,
  chartHeight: PropTypes.number,
  barColor: PropTypes.string
};

Histogram.defaultProps = {
  chartWidth: 500,
  chartHeight: 300,
  barColor: '#8884d8'
};

export default Histogram;
