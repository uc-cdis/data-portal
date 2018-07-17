import React from 'react';
import { storiesOf } from '@storybook/react';
import CustomPieChart from '../components/charts/CustomPieChart';
import SummaryBarChart from '../components/charts/SummaryBarChart';
import SummaryPieChart from '../components/charts/SummaryPieChart';
import SummaryChartGroup from '../components/charts/SummaryChartGroup';
import PercentageStackedBarChart from '../components/charts/PercentageStackedBarChart';
import { localTheme } from '../localconf';

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
  .add('CustomPieChart', () => (
    <CustomPieChart payload={payload} />
  ))
  .add('SummaryBarChart', () => (
    <SummaryBarChart data={chartData} title="bar chart title" vertical monoColor={false} localTheme={localTheme} />
  ))
  .add('SummaryBarChart with monoColor={true}', () => (
    <SummaryBarChart data={chartData} title="bar chart title" vertical monoColor={true} localTheme={localTheme} />
  ))
  .add('SummaryPieChart', () => (
    <SummaryPieChart data={chartData} title="pie chart title" localTheme={localTheme}/>
  ))
  .add('SummaryChartGroup', () => (
    <SummaryChartGroup summaries={summaries} width={1010} localTheme={localTheme} />
  ))
  .add('PercentageStackedBarChart', () => (
    <PercentageStackedBarChart data={chartData} />
  ));