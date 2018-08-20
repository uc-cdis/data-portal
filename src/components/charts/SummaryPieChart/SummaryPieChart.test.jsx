import React from 'react';
import { mount } from 'enzyme';
import SummaryPieChart from '.';

describe('<SummaryPieChart />', () => {
  const chartData = [
    { name: 'H1N1', value: 4000 },
    { name: 'VN1203', value: 3000 },
    { name: 'HIV', value: 2800 },
    { name: 'HuCoV_EMC', value: 2000 },
    { name: 'SARS_CoV', value: 2708 },
    { name: 'CA04', value: 1890 },
  ];

  const charts = mount(<SummaryPieChart
    title='test'
    data={chartData}
  />).find(SummaryPieChart);

  it('renders', () => {
    expect(charts.length).toBe(1);
  });

  it('should render all pie sectors', () => {
    expect(charts.find('.recharts-layer.recharts-pie-sector').length).toBe(chartData.length);
  });

  it('should render all legend items', () => {
    expect(charts.find('.summary-pie-chart__legend-item').length).toBe(chartData.length);
  });
});
