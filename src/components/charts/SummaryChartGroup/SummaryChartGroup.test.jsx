import React from 'react';
import { mount } from 'enzyme';
import SummaryChartGroup from '.';
import SummaryPieChart from '../SummaryPieChart';
import SummaryHorizontalBarChart from '../SummaryHorizontalBarChart';

describe('<SummaryChartGroup />', () => {
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

  const charts = mount(<SummaryChartGroup
    summaries={summaries}
    width={1010}
  />);

  it('renders', () => {
    expect(charts.length).toBe(1);
  });

  it('should render 3 bar charts', () => {
    expect(charts.find(SummaryHorizontalBarChart).length).toBe(3);
  });

  it('should render 2 pie charts', () => {
    expect(charts.find(SummaryPieChart).length).toBe(2);
  });
});
