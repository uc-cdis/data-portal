import React from 'react';
import { render } from '@testing-library/react';
import SummaryChartGroup from './index';

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

test('renders', () => {
  const { container } = render(
    <SummaryChartGroup summaries={summaries} width={1010} />
  );
  expect(container.firstElementChild).toHaveClass('summary-chart-group');

  const barChartElements = container.querySelectorAll(
    '.summary-horizontal-bar-chart'
  );
  expect(barChartElements).toHaveLength(3);

  const pieChartElements = container.querySelectorAll('.summary-pie-chart');
  expect(pieChartElements).toHaveLength(2);
});
