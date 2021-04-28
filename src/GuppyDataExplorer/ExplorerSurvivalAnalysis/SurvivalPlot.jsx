import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import { getXAxisTicks } from './utils';
import './typedef';

/**
 * @param {Object} prop
 * @param {Object} prop.colorScheme
 * @param {SurvivalData[]} prop.data
 * @param {number} prop.timeInterval
 */
const Plot = ({ colorScheme, data, timeInterval }) => {
  const [opacity, setOpacity] = useState({});
  useEffect(() => {
    const initOpacity = {};
    for (const { group } of data) initOpacity[group[0].value] = 1;
    setOpacity(initOpacity);
  }, [data]);

  function handleLegendMouseEnter({ value: lineName }) {
    const newOpacity = { ...opacity };
    for (const name in newOpacity)
      newOpacity[name] = name === lineName ? 1 : 0.1;
    setOpacity(newOpacity);
  }

  function handleLegendMouseLeave({ value: lineName }) {
    const newOpacity = { ...opacity };
    for (const name in newOpacity) if (name !== lineName) newOpacity[name] = 1;
    setOpacity(newOpacity);
  }

  return (
    <ResponsiveContainer height={300 + Math.floor(data.length / 5) * 25}>
      <LineChart data={data} margin={{ left: 20, bottom: 10, right: 20 }}>
        <XAxis
          dataKey='time'
          type='number'
          label={{
            value: 'Time (in year)',
            position: 'insideBottom',
            offset: -5,
          }}
          ticks={getXAxisTicks(data, timeInterval)}
          domain={['dataMin', (dataMax) => Math.ceil(dataMax)]}
        />
        <YAxis
          label={{
            value: 'Survival rate',
            angle: -90,
            position: 'insideLeft',
          }}
        />
        <CartesianGrid strokeDasharray='3 3' />
        <Legend
          verticalAlign='top'
          onMouseEnter={handleLegendMouseEnter}
          onMouseLeave={handleLegendMouseLeave}
        />
        {data.map(({ group, data }) => (
          <Line
            key={group[0].value}
            data={data}
            dataKey='prob'
            dot={false}
            name={group[0].value}
            type='stepAfter'
            stroke={colorScheme[group[0].value]}
            strokeOpacity={opacity[group[0].value]}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

/**
 * @param {Object} prop
 * @param {Object} prop.colorScheme
 * @param {SurvivalData[]} prop.data
 * @param {boolean} prop.isStratified
 * @param {number} prop.timeInterval
 */
const SurvivalPlot = ({ colorScheme, data, isStratified, timeInterval }) => (
  <div className='explorer-survival-analysis__survival-plot'>
    {data.length === 0 ? (
      <div className='explorer-survival-analysis__figure-placeholder'>
        Survival plot here
      </div>
    ) : isStratified ? (
      Object.entries(
        data.reduce((acc, { group, data }) => {
          const [factor, stratification] = group;
          const stratificationKey = JSON.stringify(stratification);
          const stratificationValue = acc.hasOwnProperty(stratificationKey)
            ? [...acc[stratificationKey], { group: [factor], data }]
            : [{ group: [factor], data }];

          return { ...acc, [stratificationKey]: stratificationValue };
        }, {})
      ).map(([key, data]) => (
        <Fragment key={key}>
          <div className='explorer-survival-analysis__figure-title'>
            {JSON.parse(key).value}
          </div>
          <Plot {...{ colorScheme, data, timeInterval }} />
        </Fragment>
      ))
    ) : (
      <Plot {...{ colorScheme, data, timeInterval }} />
    )}
  </div>
);

SurvivalPlot.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.exact({
      data: PropTypes.arrayOf(
        PropTypes.exact({
          prob: PropTypes.number,
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

export default React.memo(SurvivalPlot);
