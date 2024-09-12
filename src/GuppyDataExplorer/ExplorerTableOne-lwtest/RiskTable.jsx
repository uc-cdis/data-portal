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

/** @typedef {import('./types').RisktableData} RisktableData */

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

function CustomYAxisTick(/** @type {Object} */ { x, y, payload }) {
  const name = payload.value;

  return (
    <g transform={`translate(${x},${y})`}>
      <title>{name}</title>
      <text dx={-15} dy={4} fill='#666' textAnchor='end'>
        <tspan>{name.length > 10 ? `${name.substring(0, 9)}..` : name}</tspan>
      </text>
    </g>
  );
}

CustomYAxisTick.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  payload: PropTypes.shape({ value: PropTypes.string }),
};

/**
 * @typedef {Object} RiskTableProps
 * @property {RisktableData[]} data
 * @property {number} [endTime]
 * @property {number} startTime
 * @property {number} timeInterval
 */

/** @param {RiskTableProps} props */
function Table({ data, endTime, startTime, timeInterval }) {
  const filteredData = filterRisktableByTime(data, startTime, endTime);
  return (
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
            value: 'Time from diagnosis (in years)',
            position: 'insideBottom',
            offset: -5,
          }}
          ticks={getXAxisTicks(filteredData, timeInterval, endTime)}
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
        <Scatter
          data={parseRisktable(filteredData, timeInterval)}
          fill='transparent'
        >
          <LabelList dataKey='nrisk' />
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}

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
  endTime: PropTypes.number,
  startTime: PropTypes.number.isRequired,
  timeInterval: PropTypes.number.isRequired,
};

/** @param {RiskTableProps} props */
function RiskTable(props) {
  return (
    <div className='explorer-survival-analysis__risk-table'>
      {props.data.length === 0 ? (
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
          <Table {...props} />
        </>
      )}
    </div>
  );
}

RiskTable.propTypes = Table.propTypes;

export default memo(RiskTable);
