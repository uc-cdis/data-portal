/* eslint-disable no-shadow */
import { memo } from 'react';
import PropTypes from 'prop-types';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  LabelList,
  ResponsiveContainer,
} from 'recharts';
import { filterRisktableByTime, getXAxisTicks } from './utils';
import './typedef';

/**
 * @param {RisktableData[]} data
 * @param {number} timeInterval
 */
const parseRisktable = (data, timeInterval) => {
  const minTime = data[0].data[0].time;
  return data
    .flatMap(({ name, data }) => data.map((d) => ({ name, ...d })))
    .filter(({ time }) => (time - minTime) % timeInterval === 0);
};

const CustomYAxisTick = (/** @type {Object} */ { x, y, payload }) => {
  const name = payload.value;

  return (
    <g transform={`translate(${x},${y})`}>
      <title>{name}</title>
      <text dx={-15} dy={4} fill='#666' textAnchor='end'>
        <tspan>{name.length > 10 ? `${name.substring(0, 9)}..` : name}</tspan>
      </text>
    </g>
  );
};

CustomYAxisTick.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  payload: PropTypes.shape({ value: PropTypes.string }),
};

/**
 * @param {Object} prop
 * @param {RisktableData[]} prop.data
 * @param {number} prop.endTime
 * @param {number} prop.timeInterval
 */
const Table = ({ data, endTime, timeInterval }) => (
  <ResponsiveContainer height={(data.length + 2) * 30}>
    <ScatterChart
      margin={{
        bottom: 10,
        left: 20,
        right: 20,
      }}
    >
      <XAxis
        dataKey='time'
        type='number'
        domain={['dataMin', endTime]}
        label={{
          value: 'Time (in year)',
          position: 'insideBottom',
          offset: -5,
        }}
        ticks={getXAxisTicks(data, timeInterval, endTime)}
      />
      <YAxis
        dataKey='name'
        type='category'
        allowDuplicatedCategory={false}
        axisLine={false}
        reversed
        tickSize={0}
        tick={<CustomYAxisTick />}
      />
      <Scatter data={parseRisktable(data, timeInterval)} fill='transparent'>
        <LabelList dataKey='nrisk' />
      </Scatter>
    </ScatterChart>
  </ResponsiveContainer>
);

Table.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.exact({
      data: PropTypes.arrayOf(
        PropTypes.exact({
          nrisk: PropTypes.number,
          time: PropTypes.number,
        })
      ),
      name: PropTypes.string,
    })
  ).isRequired,
  endTime: PropTypes.number.isRequired,
  timeInterval: PropTypes.number.isRequired,
};

/**
 * @param {Object} prop
 * @param {RisktableData[]} prop.data
 * @param {number} prop.endTime
 * @param {number} prop.startTime
 * @param {number} prop.timeInterval
 */
function RiskTable({ data, endTime, timeInterval, startTime }) {
  return (
    <div className='explorer-survival-analysis__risk-table'>
      {data.length === 0 ? (
        <div className='explorer-survival-analysis__figure-placeholder'>
          The number at risk table will appear here.
        </div>
      ) : (
        <>
          <div
            className='explorer-survival-analysis__figure-title'
            style={{ fontSize: '1.2rem' }}
          >
            Number at risk
          </div>
          <Table
            data={filterRisktableByTime(data, startTime, endTime)}
            endTime={endTime}
            timeInterval={timeInterval}
          />
        </>
      )}
    </div>
  );
}

RiskTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.exact({
      data: PropTypes.arrayOf(
        PropTypes.exact({
          nrisk: PropTypes.number,
          time: PropTypes.number,
        })
      ),
      name: PropTypes.string,
    })
  ).isRequired,
  endTime: PropTypes.number.isRequired,
  startTime: PropTypes.number.isRequired,
  timeInterval: PropTypes.number.isRequired,
};

export default memo(RiskTable);
