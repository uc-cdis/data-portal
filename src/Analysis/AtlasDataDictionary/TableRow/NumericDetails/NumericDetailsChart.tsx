import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import {
  FULLSIZE_CHART_HEIGHT,
  FULLSIZE_CHART_WIDTH,
  HISTROGRAM_CHART_FILL_COLOR,
  PREVIEW_CHART_HEIGHT,
  PREVIEW_CHART_WIDTH,
} from '../Constants';
import { INumericValueSummary } from '../../Interfaces/Interfaces';

interface INumericDetailsChart {
  chartData: INumericValueSummary[];
  preview: boolean;
  chartType: string;
}

const NumericDetailsChart = ({
  chartData,
  preview,
  chartType,
}: INumericDetailsChart) => {
  let chartWidth = PREVIEW_CHART_WIDTH;
  let chartHeight = PREVIEW_CHART_HEIGHT;
  if (!preview) {
    chartWidth = FULLSIZE_CHART_WIDTH;
    chartHeight = FULLSIZE_CHART_HEIGHT;
  }

  const sortedChartData = chartData.sort((a, b) => a.start - b.start);
  console.log('chartData', chartData);

  const formatXAxis = (tick: string) => {
    console.log('tick', tick);
    const maxLabelLength = 15;
    if (tick.length > 5) return tick.substring(0, maxLabelLength) + '...';
    else return tick;
  };

  return (
    <div style={{ margin: '0 auto', width: chartWidth, textAlign: 'center' }}>
      <BarChart
        width={chartWidth}
        height={chartHeight}
        data={sortedChartData}
        {...{
          overflow: 'visible',
        }}
      >
        {!preview && (
          <>
            <CartesianGrid opacity={0.5} />
            <XAxis
              height={chartType === 'Number' ? 15 : 60}
              dataKey={chartType === 'Number' ? 'start' : 'name'}
              angle={chartType === 'Number' ? 0 : -25}
              textAnchor={chartType === 'Number' ? 'start' : 'end'}
              fontSize={10}
              tickFormatter={(tick) => formatXAxis(tick)}
              tickLine
            />
            <YAxis tickLine={false} axisLine={false} />
          </>
        )}
        <Bar dataKey='personCount' fill={HISTROGRAM_CHART_FILL_COLOR} />
      </BarChart>

      {!preview && chartType === 'Number' && (
        <strong style={{ fontSize: '10px', paddingLeft: '65px' }}>
          VALUE AS NUMBER
        </strong>
      )}
    </div>
  );
};

export default NumericDetailsChart;
