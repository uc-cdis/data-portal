import React, { Fragment } from 'react';
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

const Plot = ({ data, timeInterval }) => (
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
      <Legend verticalAlign='top' />
      {data.map((series, i) => (
        <Line
          key={series.name}
          data={series.data}
          dataKey='prob'
          dot={false}
          name={series.name}
          type='stepAfter'
          stroke={schemeCategory10[i]}
        />
      ))}
    </LineChart>
  </ResponsiveContainer>
);

const SurvivalPlot = ({ data, timeInterval }) => (
  <div className='explorer-survival-analysis__survival-plot'>
    {Array.isArray(data) ? (
      data.length === 0 ? (
        <div className='explorer-survival-analysis__figure-placeholder'>
          Survival plot here
        </div>
      ) : (
        <Plot data={data} timeInterval={timeInterval} />
      )
    ) : (
      Object.keys(data).map((key) => (
        <Fragment key={key}>
          <div className='explorer-survival-analysis__figure-title'>{key}</div>
          <Plot data={data[key]} timeInterval={timeInterval} />
        </Fragment>
      ))
    )}
  </div>
);

SurvivalPlot.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  timeInterval: PropTypes.number.isRequired,
};

export default SurvivalPlot;
