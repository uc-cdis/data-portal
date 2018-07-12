import React from 'react';
import { storiesOf } from '@storybook/react';
import CustomPieChart from '../components/charts/CustomPieChart';
import SummaryBarChart from '../components/charts/SummaryBarChart';
import SummaryPieChart from '../components/charts/SummaryPieChart';
import SummaryChartGroup from '../components/charts/SummaryChartGroup';
import PercentageStackedBarChart from '../components/charts/PercentageStackedBarChart';

const payload = [
  { name: 'test1' },
  { name: 'test2' },
  { name: 'test3' },
];

const chartData = [
  { name: 'H1N1', value: 400 },
  { name: 'VN1203', value: 300 },
  { name: 'HIV', value: 300 },
  { name: 'HuCoV_EMC', value: 200 },
  { name: 'SARS_CoV', value: 278 },
  { name: 'CA04', value: 189 },
];

const summaries = [
  { type: 'bar', data: chartData },
  { type: 'pie', data: chartData },
  { type: 'pie', data: chartData },
  { type: 'bar', data: chartData },
  { type: 'bar', data: chartData },
];

storiesOf('Chart', module)
  .add('CustomPieChart', () => (
    <CustomPieChart payload={payload} />
  ))
  .add('SummaryBarChart', () => (
    <SummaryBarChart data={chartData} title="bar chart title" vertical monoColor={false} />
  ))
  .add('SummaryPieChart', () => (
    <SummaryPieChart data={chartData} title="pie chart title" />
  ))
  .add('SummaryChartGroup', () => (
    <SummaryChartGroup summaries={summaries} />
  ))
  .add('PercentageStackedBarChart', () => (
    <PercentageStackedBarChart data={chartData} />
  ));
