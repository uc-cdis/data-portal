import React from 'react';
import { mount } from 'enzyme';
import { localTheme } from '../../localconf';
import SummaryHorizontalBarChart from './SummaryHorizontalBarChart';

describe('<SummaryHorizontalBarChart />', () => {
  const chartData = [
    { name: 'H1N1', value: 4000 },
    { name: 'VN1203', value: 3000 },
    { name: 'HIV', value: 2800 },
    { name: 'HuCoV_EMC', value: 2000 },
    { name: 'SARS_CoV', value: 2708 },
    { name: 'CA04', value: 1890 },
  ];

  const wrapper = mount(
    <SummaryHorizontalBarChart data={chartData} title="bar chart title" color="#3283c8" localTheme={localTheme} />,
  );
  const charts = wrapper.find(SummaryHorizontalBarChart);

  it('renders', () => {
    expect(charts.length).toBe(1);
  });

  it('should render all bar retangles', () => {
    expect(charts.find('.recharts-layer.recharts-bar-rectangle').length).toBe(chartData.length);
  });

  it('should render all legend items', () => {
    expect(charts.find('.recharts-text.recharts-cartesian-axis-tick-value').length).toBe(chartData.length);
  });
});
