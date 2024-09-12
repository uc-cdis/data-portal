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

/** @typedef {import('./types').ColorScheme} ColorScheme */
/** @typedef {import('./types').SurvivalData} SurvivalData */

/**
 * @typedef {Object} SurvivalPlotProps
 * @property {SurvivalData[]} data
 * @property {number} [endTime]
 * @property {boolean} [efsFlag]
 * @property {number} startTime
 * @property {number} timeInterval
 */

/** @param {SurvivalPlotProps} props */
function Plot({ data, endTime, efsFlag, startTime, timeInterval }) {
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

  const filteredData = filterSurvivalByTime(data, startTime, endTime);

  return (
    <ResponsiveContainer height={300 + Math.floor(data.length / 5) * 25}>
      <LineChart
        data={filteredData}
        margin={{ left: 20, bottom: 10, right: 20 }}
      >
        <XAxis
          dataKey='time'
          type='number'
          label={{
            value: 'Time from diagnosis (in years)',
            position: 'insideBottom',
            offset: -5,
          }}
          ticks={getXAxisTicks(filteredData, timeInterval, endTime)}
          domain={['dataMin', endTime]}
        />
        <YAxis
          label={{
            value: efsFlag
              ? 'Event-free survival rate'
              : 'Overall survival rate',
            angle: -90,
            position: 'insideBottomLeft',
            offset: 15,
          }}
        />
        <CartesianGrid strokeDasharray='3 3' />
        <Legend
          verticalAlign='top'
          onMouseEnter={handleLegendMouseEnter}
          onMouseLeave={handleLegendMouseLeave}
        />
        {filteredData.map(({ data, name }) => (
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
}

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
  endTime: PropTypes.number,
  startTime: PropTypes.number.isRequired,
  timeInterval: PropTypes.number.isRequired,
};

/** @param {SurvivalPlotProps} props */
function SurvivalPlot(props) {
  return (
    <div className='explorer-survival-analysis__survival-plot'>
      {props.data.length === 0 ? (
        <div className='explorer-survival-analysis__figure-placeholder'>
          The table one will appear here.
        </div>
      ) : (
        <Plot {...props} />
      )}
    </div>
  );
}

SurvivalPlot.propTypes = Plot.propTypes;

export default memo(SurvivalPlot);
