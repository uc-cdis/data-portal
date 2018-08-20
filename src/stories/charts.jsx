import React from 'react';
import { storiesOf } from '@storybook/react';
import SummaryHorizontalBarChart from '../components/charts/SummaryHorizontalBarChart';
import SummaryPieChart from '../components/charts/SummaryPieChart';
import SummaryChartGroup from '../components/charts/SummaryChartGroup';
import PercentageStackedBarChart from '../components/charts/PercentageStackedBarChart';

const chartData = [
  { name: 'H1N1', value: 4000 },
  { name: 'VN1203', value: 3000 },
  { name: 'HIV', value: 2800 },
  { name: 'HuCoV_EMC', value: 2000 },
  { name: 'SARS_CoV', value: 2708 },
  { name: 'CA04', value: 1890 },
];

const chartData1 = [
  { name: 'H1N1', value: 400 },
  { name: 'VN1203', value: 300 },
];

const chartData2 = [
  { name: 'H1N1', value: 400 },
  { name: 'VN1203', value: 300 },
  { name: 'HIV', value: 300 },
];

const summaries = [
  { type: 'bar', title: 'Gender', data: chartData1 },
  { type: 'pie', title: 'Birth-Year', data: chartData },
  { type: 'pie', title: 'Species', data: chartData1 },
  { type: 'bar', title: 'Race', data: chartData2 },
  { type: 'bar', title: 'Virus', data: chartData },
];

storiesOf('Chart', module)
  .add('SummaryHorizontalBarChart', () => (
    <SummaryHorizontalBarChart data={chartData} title='bar chart title' showPercentage={false} />
  ))
  .add('SummaryHorizontalBarChart with single color and percentage', () => (
    <SummaryHorizontalBarChart data={chartData} title='bar chart title' color='#3283c8' />
  ))
  .add('SummaryPieChart', () => (
    <SummaryPieChart data={chartData} title='pie chart title' showPercentage />
  ))
  .add('SummaryChartGroup', () => (
    <SummaryChartGroup summaries={summaries} width={1010} />
  ))
  .add('PercentageStackedBarChart', () => (
    <PercentageStackedBarChart data={chartData} />
  ));
