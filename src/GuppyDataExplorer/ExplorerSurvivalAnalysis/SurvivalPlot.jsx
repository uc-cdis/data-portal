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
import { schemeCategory10 } from 'd3-scale-chromatic';
import { getXAxisTicks } from './utils';
import './typedef';

/**
 * @param {Object} prop
 * @param {SurvivalData[]} prop.data
 * @param {number} prop.timeInterval
 */
const Plot = ({ data, timeInterval }) => {
  const [opacity, setOpacity] = useState({});
  useEffect(() => {
    const initOpacity = {};
    for (const { name } of data) initOpacity[name] = 1;
    setOpacity(initOpacity);
  }, [data]);

  function handleLegendMouseEnter({ value: lineName }) {
    const newOpacity = { ...opacity };
    for (const name in newOpacity) if (name != lineName) newOpacity[name] = 0.1;
    setOpacity(newOpacity);
  }

  function handleLegendMouseLeave({ value: lineName }) {
    const newOpacity = { ...opacity };
    for (const name in newOpacity) if (name != lineName) newOpacity[name] = 1;
    setOpacity(newOpacity);
  }

  return (
    <ResponsiveContainer height={300}>
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
          domain={['dataMin', 'auto']}
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
        {data.map((series, i) => (
          <Line
            key={series.name}
            data={series.data}
            dataKey='prob'
            dot={false}
            name={series.name}
            type='stepAfter'
            stroke={schemeCategory10[i]}
            strokeOpacity={opacity[series.name]}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

/**
 * @param {Object} prop
 * @param {SurvivalData[]} prop.data
 * @param {string} prop.stratificationVariable
 * @param {number} prop.timeInterval
 */
const SurvivalPlot = ({ data, stratificationVariable, timeInterval }) => (
  <div className='explorer-survival-analysis__survival-plot'>
    {data.length === 0 ? (
      <div className='explorer-survival-analysis__figure-placeholder'>
        Survival plot here
      </div>
    ) : stratificationVariable === '' ? (
      <Plot data={data} timeInterval={timeInterval} />
    ) : (
      Object.entries(
        data.reduce((acc, { name, data }) => {
          const [factorKey, stratificationKey] = name.split(',');
          const stratificationValue = acc.hasOwnProperty(stratificationKey)
            ? [...acc[stratificationKey], { name: factorKey, data }]
            : [{ name: factorKey, data }];

          return { ...acc, [stratificationKey]: stratificationValue };
        }, {})
      ).map(([key, data]) => (
        <Fragment key={key}>
          <div className='explorer-survival-analysis__figure-title'>{key}</div>
          <Plot data={data} timeInterval={timeInterval} />
        </Fragment>
      ))
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
      name: PropTypes.string,
    })
  ).isRequired,
  stratificationVariable: PropTypes.string.isRequired,
  timeInterval: PropTypes.number.isRequired,
};

export default React.memo(SurvivalPlot);
