import React from 'react';
import { render } from '@testing-library/react';
import SummaryHorizontalBarChart from './index';

const chartData = [
  { name: 'H1N1', value: 4000 },
  { name: 'VN1203', value: 3000 },
  { name: 'HIV', value: 2800 },
  { name: 'HuCoV_EMC', value: 2000 },
  { name: 'SARS_CoV', value: 2708 },
  { name: 'CA04', value: 1890 },
];

test('renders', () => {
  const { container } = render(
    <SummaryHorizontalBarChart
      data={chartData}
      title='bar chart title'
      color='#3283c8'
    />
  );
  expect(container.firstElementChild).toHaveClass(
    'summary-horizontal-bar-chart'
  );
});
