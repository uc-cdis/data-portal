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
    .flatMap(({ group, data }) =>
      data.map((d) => ({
        group: group.length === 0 ? 'All' : group[0].value,
        ...d,
      }))
    )
    .filter(({ time }) => (time - minTime) % timeInterval === 0);
};

const getMaxTime = (/** @type {RisktableData[]} */ data) =>
  Math.max(...data.flatMap(({ data }) => data.map(({ time }) => time)));

const CustomYAxisTick = (/** @type {Object} */ { x, y, payload }) => {
  const name = payload.value;

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
        dataKey='group'
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
 * @param {boolean} prop.isStratified
 * @param {number} prop.timeInterval
 */
const RiskTable = ({ data, isStratified, timeInterval }) => (
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
        {isStratified ? (
          Object.entries(
            data.reduce((acc, { group, data }) => {
              const [factor, stratification] = group;
              const stratificationKey = JSON.stringify(stratification);
              const stratificationValue = acc.hasOwnProperty(stratificationKey)
                ? [...acc[stratificationKey], { group: [factor], data }]
                : [{ group: [factor], data }];

              return { ...acc, [stratificationKey]: stratificationValue };
            }, {})
          ).map(([key, data], i, arr) => (
            <Fragment key={key}>
              <div className='explorer-survival-analysis__figure-title'>
                {JSON.parse(key).value}
              </div>
              <Table
                data={data}
                timeInterval={timeInterval}
                isLast={i === arr.length - 1}
              />
            </Fragment>
          ))
        ) : (
          <Table data={data} timeInterval={timeInterval} isLast />
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
      group: PropTypes.arrayOf(
        PropTypes.exact({
          variable: PropTypes.string,
          value: PropTypes.string,
        })
      ),
    })
  ).isRequired,
  isStratified: PropTypes.bool.isRequired,
  timeInterval: PropTypes.number.isRequired,
};

export default React.memo(RiskTable);
