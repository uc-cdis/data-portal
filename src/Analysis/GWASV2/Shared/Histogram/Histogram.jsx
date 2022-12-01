import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import PropTypes from 'prop-types';

// see https://recharts.org/en-US/examples/BarChartNoPadding

const Histogram = ({
  data,
}) => (
  <BarChart
    width={700}
    height={300}
    data={data}
    barSize={70}
  >
    <XAxis dataKey='quarter' />
    <YAxis />
    <Tooltip />
    <Legend />
    <CartesianGrid strokeDasharray='3 3' />
    <Bar dataKey='earnings' fill='#8884d8' />
  </BarChart>
);

Histogram.propTypes = {
  data: PropTypes.array.isRequired,
};

export default Histogram;
