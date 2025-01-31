import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Label,
  ReferenceLine,
} from 'recharts';
import PropTypes from 'prop-types';
import './Histogram.css';

const formatNumber = (number) => (Math.round(number * 10) / 10).toLocaleString();

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className='histogram-tooltip'>
        <p>
          {`Number of persons: ${formatNumber(
            payload[0].value,
          )}, for values starting at: ${formatNumber(label)}`}
        </p>
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
  useAnimation,
  minCutoff,
  maxCutoff,
}) => {
  const defaultAnimationTime = 400;
  const xValues = data.map((d) => d[xAxisDataKey]);
  // Find min value in the set of [(minCutoff OR Infinity), and xValues]:
  const minX = Math.min(minCutoff ?? Infinity, ...xValues);
  // Find max value in the set of [(maxCutoff OR -Infinity), and xValues]:
  const maxX = Math.max(maxCutoff ?? -Infinity, ...xValues);
  const padding = (maxX - minX) * 0.10;
  const xDomain = [minX - padding, maxX + padding];

  return (
    <div data-testid='histogram'>
      <BarChart
        width={chartWidth}
        height={chartHeight}
        data={data}
        margin={{ top: 20, bottom: 65, right: 60 }}
      >
        <XAxis
          dataKey={xAxisDataKey}
          type='number'
          domain={xDomain}
          minTickGap={50}
          tickFormatter={(tick) => formatNumber(tick)}
        >
          <Label
            value={xAxisLegend || xAxisDataKey}
            position='bottom'
            offset={20}
          />
        </XAxis>
        <YAxis>
          <Label value={yAxisLegend || barDataKey} position='top' offset={10} />
        </YAxis>
        <Tooltip content={<CustomTooltip />} />
        <CartesianGrid strokeDasharray='3 3' />
        <Bar dataKey={barDataKey} fill={barColor} animationDuration={useAnimation ? defaultAnimationTime : 0} />
        {/* Add ReferenceLines for min and max cutoffs */}
        {minCutoff !== undefined && (
          <ReferenceLine
            x={minCutoff}
            stroke='red'
            strokeDasharray='3 3'
            label={{ value: 'Min', position: 'top', fill: 'red' }}
          />
        )}
        {maxCutoff !== undefined && (
          <ReferenceLine
            x={maxCutoff}
            stroke='green'
            strokeDasharray='3 3'
            label={{ value: 'Max', position: 'top', fill: 'green' }}
          />
        )}
      </BarChart>
    </div>
  );
};

Histogram.propTypes = {
  data: PropTypes.array.isRequired,
  xAxisDataKey: PropTypes.string.isRequired,
  barDataKey: PropTypes.string.isRequired,
  chartWidth: PropTypes.number,
  chartHeight: PropTypes.number,
  barColor: PropTypes.string,
  xAxisLegend: PropTypes.string,
  yAxisLegend: PropTypes.string,
  useAnimation: PropTypes.bool,
  minCutoff: PropTypes.number,
  maxCutoff: PropTypes.number,
};

Histogram.defaultProps = {
  chartWidth: 600,
  chartHeight: 350,
  barColor: '#8884d8',
  xAxisLegend: null,
  yAxisLegend: null,
  useAnimation: true,
  minCutoff: undefined,
  maxCutoff: undefined,
};

export default Histogram;
