import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import * as d3Scale from 'd3-scale';
import {
  FULLSIZE_CHART_HEIGHT,
  CHART_FILL_COLOR,
  PREVIEW_CHART_HEIGHT,
  PREVIEW_CHART_WIDTH,
  FULLSIZE_CHART_WIDTH_MIN,
  FULLSIZE_CHART_WIDTH_MAX,
  FULLSIZE_CHART_DEFAULT_NUM_BARS,
  X_AXIS_FONT_SIZE,
  MAX_X_AXIS_LABEL_LENGTH,
  X_AXIS_CHARACTER_CUT_OFF,
  GRID_OPACITY,
} from './ValueSummaryChartConstants';
import { IValueSummary } from '../../Interfaces/Interfaces';

interface IValueSummaryChartProps {
  chartData: IValueSummary[];
  preview: boolean;
  chartType: string;
}

const scaleWidthBasedOnChartDataLength = d3Scale
  .scaleLinear()
  .domain([1, FULLSIZE_CHART_DEFAULT_NUM_BARS])
  .range([FULLSIZE_CHART_WIDTH_MIN, FULLSIZE_CHART_WIDTH_MAX]);

const ValueSummaryChart = ({
  chartData,
  preview,
  chartType,
}: IValueSummaryChartProps) => {
  let chartWidth = PREVIEW_CHART_WIDTH;
  let chartHeight = PREVIEW_CHART_HEIGHT;
  if (!preview) {
    chartWidth = scaleWidthBasedOnChartDataLength(chartData.length);
    chartHeight = FULLSIZE_CHART_HEIGHT;
  }
  const xAxisHeight = chartType === 'Number' ? 15 : 60;
  const xAxisDataKey = chartType === 'Number' ? 'start' : 'name';
  const xAxisAngle = chartType === 'Number' ? 0 : -25;
  const xAxisTextAnchor = chartType === 'Number' ? 'middle' : 'end';

  const processedChartData = chartType === 'Number'
    ? chartData.sort((a: any, b: any) => a.start - b.start)
    : chartData;

  const formatXAxisWithEllipsisIfTooLong = (tick: string) => {
    if (tick.length > X_AXIS_CHARACTER_CUT_OFF) {
      return `${tick.substring(0, MAX_X_AXIS_LABEL_LENGTH)}...`;
    }
    return tick;
  };

  return (
    <div
      data-testid='value-summary-chart'
      className={`value-summary-chart ${chartType} ${preview ? 'preview' : ''}`}
      style={{ width: chartWidth }}
    >
      <BarChart
        width={chartWidth}
        height={chartHeight}
        data={processedChartData}
        {...{
          overflow: 'visible',
        }}
      >
        {!preview && (
          <React.Fragment>
            <Tooltip />
            <CartesianGrid opacity={GRID_OPACITY} />
            <XAxis
              height={xAxisHeight}
              dataKey={xAxisDataKey}
              angle={xAxisAngle}
              textAnchor={xAxisTextAnchor}
              fontSize={X_AXIS_FONT_SIZE}
              tickFormatter={(tick) => formatXAxisWithEllipsisIfTooLong(tick)}
              tickLine
            />
            <YAxis tickLine={false} axisLine={false} />
          </React.Fragment>
        )}
        <Bar dataKey='personCount' fill={CHART_FILL_COLOR} />
      </BarChart>
      {!preview && chartType === 'Number' && (
        <strong className='value-summary-chart-title'>VALUE AS NUMBER</strong>
      )}
    </div>
  );
};

export default React.memo(ValueSummaryChart);
