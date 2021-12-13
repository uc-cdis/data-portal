import { render } from '@testing-library/react';
import SummaryPieChart from './index';

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
    <SummaryPieChart title='test' data={chartData} />
  );
  expect(container.firstElementChild).toHaveClass('summary-pie-chart');

  const pieSectorElements = container.querySelectorAll(
    '.recharts-layer.recharts-pie-sector'
  );
  expect(pieSectorElements).toHaveLength(chartData.length);

  const legendElements = container.querySelectorAll(
    '.summary-pie-chart__legend-item'
  );
  expect(legendElements).toHaveLength(chartData.length);
});
