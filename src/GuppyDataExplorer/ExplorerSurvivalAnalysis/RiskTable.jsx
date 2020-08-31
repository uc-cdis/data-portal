import React from 'react';
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

const isStratified = (data) => data[0].name.split(',').length > 1;

const parseRisktable = (data, timeInterval) => {
  const minTime = data[0].data[0].time;
  return data
    .flatMap(({ name, data }) => data.map((d) => ({ name, ...d })))
    .filter(({ time }) => (time - minTime) % timeInterval === 0);
};

const RiskTable = ({ data, timeInterval }) => (
  <div className='explorer-survival-analysis__risk-table'>
    {data.length === 0 ? (
      <div className='explorer-survival-analysis__figure-placeholder'>
        Rist table here
      </div>
    ) : (
      <>
        <div className='explorer-survival-analysis__figure-title'>
          Number at risk
        </div>
        <ResponsiveContainer height={(data.length + 2) * 30}>
          <ScatterChart
            margin={{
              left: isStratified(data) ? 80 : 20,
              bottom: 10,
              right: 20,
            }}
          >
            <XAxis
              dataKey='time'
              type='number'
              label={{
                value: 'Time (in year)',
                position: 'insideBottom',
                offset: -5,
              }}
              ticks={getXAxisTicks(data, timeInterval)}
              domain={['dataMin', 'dataMax']}
            />
            <YAxis
              dataKey='name'
              type='category'
              allowDuplicatedCategory={false}
              axisLine={false}
              reversed
              tickSize={0}
              tick={{ dx: -20 }}
            />
            <Scatter
              data={parseRisktable(data, timeInterval)}
              fill='transparent'
            >
              <LabelList dataKey='nrisk' />
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </>
    )}
  </div>
);

RiskTable.propTypes = {
  data: PropTypes.array.isRequired,
  timeInterval: PropTypes.number.isRequired,
};

export default RiskTable;
