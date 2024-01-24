import React from 'react';
import { BarChart, Bar } from 'recharts';
import { IValueSummary } from '../../Interfaces/Interfaces';
import {
  BARCHART_FILL_COLOR,
  PREVIEW_CHART_HEIGHT,
  PREVIEW_CHART_WIDTH,
} from '../Constants';

interface INonNumericDetailsPreviewChart {
  chartData: IValueSummary[];
}
// SIMPLE BARCHART
const NonNumericDetailsPreviewChart = ({
  chartData,
}: INonNumericDetailsPreviewChart) => (
  <React.Fragment>
    <BarChart
      width={PREVIEW_CHART_WIDTH}
      height={PREVIEW_CHART_HEIGHT}
      data={chartData}
    >
      <Bar dataKey='personCount' fill={BARCHART_FILL_COLOR} />
    </BarChart>
  </React.Fragment>
);

export default NonNumericDetailsPreviewChart;
