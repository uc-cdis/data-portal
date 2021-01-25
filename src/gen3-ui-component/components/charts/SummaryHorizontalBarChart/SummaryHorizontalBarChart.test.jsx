import React from 'react';
import { mount } from 'enzyme';
import SummaryHorizontalBarChart from '.';

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
    <SummaryHorizontalBarChart data={chartData} title='bar chart title' color='#3283c8' />,
  );
  const charts = wrapper.find(SummaryHorizontalBarChart);

  it('renders', () => {
    expect(charts.length).toBe(1);
  });
});
