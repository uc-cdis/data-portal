import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Label,
} from 'recharts';
import PropTypes from 'prop-types';


const CustomTooltip = ({ active, payload, binLabel }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'lightgray'}}>
        <p>{`Number of persons: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

// TODO - improve tickGap - e.g. the minTickGap={50} below needs to be dynamically calculated
const Histogram = ({
  data,
  xAxisDataKey,
  barDataKey,
  chartWidth,
  chartHeight,
  barColor,
  xAxisLegend,
}) => (
  <BarChart
    width={chartWidth}
    height={chartHeight}
    data={data}
    margin={{ top: 20, bottom: 65, right: 60 }}
  >
    <XAxis dataKey={xAxisDataKey} minTickGap={50} tickFormatter={(tick) => Math.round(tick * 10) / 10}>
      <Label value={xAxisLegend || xAxisDataKey} position='bottom' offset={20} />
    </XAxis>
    <YAxis />
    <Tooltip content={<CustomTooltip />} />
    <CartesianGrid strokeDasharray='3 3' />
    <Bar dataKey={barDataKey} fill={barColor} />
  </BarChart>
);

Histogram.propTypes = {
  data: PropTypes.array.isRequired,
  xAxisDataKey: PropTypes.string.isRequired,
  barDataKey: PropTypes.string.isRequired,
  chartWidth: PropTypes.number,
  chartHeight: PropTypes.number,
  barColor: PropTypes.string,
  xAxisLegend: PropTypes.string,
};

Histogram.defaultProps = {
  chartWidth: 600,
  chartHeight: 500,
  barColor: '#8884d8',
  xAxisLegend: null,
};

export default Histogram;
