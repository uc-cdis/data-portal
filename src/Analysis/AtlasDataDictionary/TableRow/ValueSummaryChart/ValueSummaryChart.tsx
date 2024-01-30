import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import * as d3Scale from 'd3-scale';
import {
  FULLSIZE_CHART_HEIGHT,
  CHART_FILL_COLOR,
  PREVIEW_CHART_HEIGHT,
  PREVIEW_CHART_WIDTH,
  FULLSIZE_CHART_WIDTH_MIN,
  FULLSIZE_CHART_WIDTH_MAX,
  FULLSIZE_CHART_MAX_EXPECTED_NUM_BARS,
} from './Constants';
import {
  IValueSummary,
  INumericValueSummary,
} from '../../Interfaces/Interfaces';

interface IValueSummaryChartProps {
  chartData: IValueSummary[] | INumericValueSummary[];
  preview: boolean;
  chartType: string;
}

const scaleWidthBasedOnChartDataLength = d3Scale
  .scaleLinear()
  .domain([1, FULLSIZE_CHART_MAX_EXPECTED_NUM_BARS])
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
  const xAxisFontSize = 10;
  const maxXAxisLabelLength = 15;
  const XAxisCharacterCutOff = maxXAxisLabelLength - 3;

  const processedChartData =
    chartType === 'Number'
      ? chartData.sort((a: any, b: any) => a.start - b.start)
      : chartData;

  const formatXAxisWithEllipsisIfTooLong = (tick: string) => {
    if (tick.length > XAxisCharacterCutOff)
      return `${tick.substring(0, maxXAxisLabelLength)}...`;
    return tick;
  };

  return (
    <div
      data-testid='value-summary-chart'
      style={{ margin: '0 auto', width: chartWidth, textAlign: 'center' }}
    >
      <BarChart
        width={chartWidth}
        height={chartHeight}
        data={processedChartData}
        {...{
          overflow: 'visible',
        }}
      >
        <Tooltip />
        {!preview && (
          <React.Fragment>
            <CartesianGrid opacity={0.5} />
            <XAxis
              height={xAxisHeight}
              dataKey={xAxisDataKey}
              angle={xAxisAngle}
              textAnchor={xAxisTextAnchor}
              fontSize={xAxisFontSize}
              tickFormatter={(tick) => formatXAxisWithEllipsisIfTooLong(tick)}
              tickLine
            />
            <YAxis tickLine={false} axisLine={false} />
          </React.Fragment>
        )}
        <Bar dataKey='personCount' fill={CHART_FILL_COLOR} />
      </BarChart>

      {!preview && chartType === 'Number' && (
        <strong style={{ fontSize: '10px', paddingLeft: '65px' }}>
          VALUE AS NUMBER
        </strong>
      )}
    </div>
  );
};

export default ValueSummaryChart;
