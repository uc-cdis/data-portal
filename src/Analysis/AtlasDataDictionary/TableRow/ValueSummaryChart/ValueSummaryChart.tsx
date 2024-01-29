import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import {
  FULLSIZE_CHART_HEIGHT,
  CHART_FILL_COLOR,
  PREVIEW_CHART_HEIGHT,
  PREVIEW_CHART_WIDTH,
  FULLSIZE_CHART_WIDTH_MIN,
  FULLSIZE_CHART_WIDTH_MAX,
  FULLSIZE_CHART_MAX_EXPECTED_NUM_BARS,
} from '../Constants';
import { INumericValueSummary } from '../../Interfaces/Interfaces';
import * as d3Scale from 'd3-scale';

interface INumericDetailsChart {
  chartData: INumericValueSummary[];
  preview: boolean;
  chartType: string;
}

let scaleWidthBasedOnChartDataLength = d3Scale
  .scaleLinear()
  .domain([1, FULLSIZE_CHART_MAX_EXPECTED_NUM_BARS])
  .range([FULLSIZE_CHART_WIDTH_MIN, FULLSIZE_CHART_WIDTH_MAX]);

const ValueSummaryChart = ({
  chartData,
  preview,
  chartType,
}: INumericDetailsChart) => {
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

  console.log(
    ' FULLSIZE_CHART_WIDTH_MIN,  FULLSIZE_CHART_WIDTH_MAX',
    FULLSIZE_CHART_WIDTH_MIN,
    FULLSIZE_CHART_WIDTH_MAX
  );
  console.log('chartData.length', chartData.length);
  console.log('chartWidth', chartWidth);

  const processedChartData =
    chartType === 'Number'
      ? chartData.sort((a, b) => a.start - b.start)
      : chartData;

  const formatXAxis = (tick: string) => {
    const maxLabelLength = 15;
    if (tick.length > 5) return `${tick.substring(0, maxLabelLength)}...`;
    return tick;
  };

  return (
    <div style={{ margin: '0 auto', width: chartWidth, textAlign: 'center' }}>
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
              tickFormatter={(tick) => formatXAxis(tick)}
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
