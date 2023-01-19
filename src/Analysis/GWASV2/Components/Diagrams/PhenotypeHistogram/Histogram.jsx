import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Label,
} from 'recharts';
import PropTypes from 'prop-types';
import { formatNumber } from '../../../Utils/constants';
import './Histogram.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className='histogram-tooltip'>
        <p>{`Number of persons: ${formatNumber(payload[0].value)}, for values starting at: ${formatNumber(label)}`}</p>
      </div>
    );
  }

  return null;
};

CustomTooltip.propTypes = {
  active: PropTypes.any,
  payload: PropTypes.any,
  label: PropTypes.number,
};

CustomTooltip.defaultProps = {
  active: null,
  payload: null,
  label: null,
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
  yAxisLegend,
}) => (
  <BarChart
    width={chartWidth}
    height={chartHeight}
    data={data}
    margin={{ top: 20, bottom: 65, right: 60 }}
  >
    <XAxis dataKey={xAxisDataKey} minTickGap={50} tickFormatter={(tick) => formatNumber(tick)}>
      <Label value={xAxisLegend || xAxisDataKey} position='bottom' offset={20} />
    </XAxis>
    <YAxis>
      <Label value={yAxisLegend || barDataKey} position='top' offset={10} />
    </YAxis>
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
  yAxisLegend: PropTypes.string,
};

Histogram.defaultProps = {
  chartWidth: 600,
  chartHeight: 500,
  barColor: '#8884d8',
  xAxisLegend: null,
  yAxisLegend: null,
};

export default Histogram;
