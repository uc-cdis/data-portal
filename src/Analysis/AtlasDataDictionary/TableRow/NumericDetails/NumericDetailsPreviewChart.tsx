import React from 'react';
import { BarChart, Bar, XAxis } from 'recharts';
import {
  HISTROGRAM_CHART_FILL_COLOR,
  PREVIEW_CHART_HEIGHT,
  PREVIEW_CHART_WIDTH,
} from '../Constants';
import { INumericValueSummary } from '../../Interfaces/Interfaces';
// import * as d3Array from 'd3-array';

interface INumericDetailsPreviewChart {
  chartData: INumericValueSummary[];
  preview: boolean;
}

// HISTOGRAM
/*
Histogram has: Numeric X and Y Axis
  See file: data-portal/src/Analysis/GWASApp/Components/Diagrams/PhenotypeHistogram/Histogram.jsx
  USES:         { start: 7, end: 51, personCount: 54 },
  Y Axis is Person count
  Position of the bar is according to value in the

  FOR EXAMPLE:
        <XAxis
        dataKey={start}
        minTickGap={50}
        tickFormatter={(tick) => formatNumber(tick)}
      >

Bar chart: Logs person count on X Axis

*/

const NumericDetailsPreviewChart = ({
  chartData,
  preview,
}: INumericDetailsPreviewChart) => {
  const minimumValueToRemoveSpacesBetweenBars = 4;
  const sortedChartData = chartData.sort((a, b) => a.start - b.start);
  return (
    <React.Fragment>
      <BarChart
        width={PREVIEW_CHART_WIDTH}
        height={PREVIEW_CHART_HEIGHT}
        data={sortedChartData}
        barCategoryGap={minimumValueToRemoveSpacesBetweenBars}
      >
        <Bar dataKey='personCount' fill={HISTROGRAM_CHART_FILL_COLOR} />
      </BarChart>
    </React.Fragment>
  );
};

export default NumericDetailsPreviewChart;
