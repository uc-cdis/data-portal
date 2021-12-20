/* eslint-disable no-shadow */
import { memo, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { schemeCategory10 } from 'd3-scale-chromatic';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import { filterSurvivalByTime, getXAxisTicks } from './utils';
import './typedef';

/**
 * @param {Object} prop
 * @param {SurvivalData[]} prop.data
 * @param {number} prop.endTime
 * @param {number} prop.timeInterval
 */
const Plot = ({ data, endTime, timeInterval }) => {
  const colorScheme = useMemo(() => {
    /** @type {ColorScheme} */
    const colorScheme = {};
    for (const [count, { name }] of data.entries())
      if (colorScheme[name] === undefined)
        colorScheme[name] = schemeCategory10[count % 9];

    return colorScheme;
  }, [data]);

  const [opacity, setOpacity] = useState({});
  useEffect(() => {
    const initOpacity = {};
    for (const { name } of data) initOpacity[name] = 1;
    setOpacity(initOpacity);
  }, [data]);

  function handleLegendMouseEnter({ value: lineName }) {
    const newOpacity = { ...opacity };
    for (const name of Object.keys(newOpacity))
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
          ticks={getXAxisTicks(data, timeInterval, endTime)}
          domain={['dataMin', endTime]}
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
        {data.map(({ data, name }) => (
          <Line
            key={name}
            data={data}
            dataKey='prob'
            dot={false}
            name={name}
            type='stepAfter'
            stroke={colorScheme[name]}
            strokeOpacity={opacity[name]}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

Plot.propTypes = {
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
  endTime: PropTypes.number.isRequired,
  timeInterval: PropTypes.number.isRequired,
};

/**
 * @param {Object} prop
 * @param {SurvivalData[]} prop.data
 * @param {number} prop.endTime
 * @param {number} prop.startTime
 * @param {number} prop.timeInterval
 */
function SurvivalPlot({ data, endTime, timeInterval, startTime }) {
  return (
    <div className='explorer-survival-analysis__survival-plot'>
      {data.length === 0 ? (
        <div className='explorer-survival-analysis__figure-placeholder'>
          The survival curves plot will appear here.
        </div>
      ) : (
        <Plot
          data={filterSurvivalByTime(data, startTime, endTime)}
          endTime={endTime}
          timeInterval={timeInterval}
        />
      )}
    </div>
  );
}

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
  endTime: PropTypes.number.isRequired,
  startTime: PropTypes.number.isRequired,
  timeInterval: PropTypes.number.isRequired,
};

export default memo(SurvivalPlot);
