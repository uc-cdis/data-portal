import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  LabelList,
  ResponsiveContainer,
} from 'recharts';
import { getXAxisTicks } from './utils';
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

const getMaxTime = (/** @type {RisktableData[]} */ data) =>
  Math.max(...data.flatMap(({ data }) => data.map(({ time }) => time)));

const CustomYAxisTick = (/** @type {Object} */ { x, y, payload }) => {
  const name =
    payload.value === 'All' ? payload.value : payload.value.split('=')[1];

  return (
    <g transform={`translate(${x},${y})`}>
      <title>{name}</title>
      <text dx={-15} dy={4} fill='#666' textAnchor='end'>
        <tspan>{name.length > 10 ? name.substring(0, 9) + '..' : name}</tspan>
      </text>
    </g>
  );
};

/**
 * @param {Object} prop
 * @param {RisktableData[]} prop.data
 * @param {boolean} prop.isLast
 * @param {number} prop.timeInterval
 */
const Table = ({ data, isLast, timeInterval }) => (
  <ResponsiveContainer height={(data.length + (isLast ? 2 : 0.5)) * 30}>
    <ScatterChart
      margin={{
        bottom: isLast ? 10 : 0,
        left: 20,
        right: 20,
      }}
    >
      <XAxis
        dataKey='time'
        type='number'
        domain={['dataMin', getMaxTime(data)]}
        hide={!isLast}
        label={
          isLast
            ? { value: 'Time (in year)', position: 'insideBottom', offset: -5 }
            : {}
        }
        ticks={getXAxisTicks(data, timeInterval)}
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

/**
 * @param {Object} prop
 * @param {RisktableData[]} prop.data
 * @param {boolean} prop.notStratified
 * @param {number} prop.timeInterval
 */
const RiskTable = ({ data, notStratified, timeInterval }) => (
  <div className='explorer-survival-analysis__risk-table'>
    {data.length === 0 ? (
      <div className='explorer-survival-analysis__figure-placeholder'>
        Rist table here
      </div>
    ) : (
      <>
        <div
          className='explorer-survival-analysis__figure-title'
          style={{ fontSize: '1.2rem' }}
        >
          Number at risk
        </div>
        {notStratified ? (
          <Table data={data} timeInterval={timeInterval} isLast />
        ) : (
          Object.entries(
            data.reduce((acc, { name, data }) => {
              const [factorKey, stratificationKey] = name.split(',');
              const stratificationValue = acc.hasOwnProperty(stratificationKey)
                ? [...acc[stratificationKey], { name: factorKey, data }]
                : [{ name: factorKey, data }];

              return { ...acc, [stratificationKey]: stratificationValue };
            }, {})
          ).map(([key, data], i, arr) => (
            <Fragment key={key}>
              <div className='explorer-survival-analysis__figure-title'>
                {key.split('=')[1]}
              </div>
              <Table
                data={data}
                timeInterval={timeInterval}
                isLast={i === arr.length - 1}
              />
            </Fragment>
          ))
        )}
      </>
    )}
  </div>
);

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
  timeInterval: PropTypes.number.isRequired,
};

export default React.memo(RiskTable);
