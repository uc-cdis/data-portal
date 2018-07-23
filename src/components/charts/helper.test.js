import React from 'react';
import helper from './helper';
import { localTheme } from '../../localconf';

describe('helper', () => {
  it('percentage formatter', () => {
    expect(helper.percentageFormatter(true)(20)).toBe('20%');
    expect(helper.percentageFormatter(false)(20)).toBe(20);
    expect(helper.addPercentage(20)).toBe('20%');
  });

  const chartData = [
    { name: 'H1N1', value: 4000 },
    { name: 'VN1203', value: 3000 },
    { name: 'HIV', value: 2000 },
    { name: 'HuCoV_EMC', value: 1000 },
    { name: 'SARS_CoV', value: 10000 },
  ];
  
  it('calculate chart data', () => {
    expect(helper.calculateChartData(chartData, true, 0)).toEqual([
      { percentage: 20, name: 'H1N1', value: 4000 },
      { percentage: 15, name: 'VN1203', value: 3000 },
      { percentage: 10, name: 'HIV', value: 2000 },
      { percentage: 5, name: 'HuCoV_EMC', value: 1000 },
      { percentage: 50, name: 'SARS_CoV', value: 10000 },
    ]);
    expect(helper.calculateChartData(chartData, false, 0)).toEqual(chartData);
    expect(helper.getPercentageData(chartData, 0)).toEqual([{
      'H1N1': 20,
      'VN1203': 15,
      'HIV': 10,
      'HuCoV_EMC': 5,
      'SARS_CoV': 50,
    }]);
  });

  it('get color', () => {
    const expectColors9 = [
      '#3283c8',
      '#7ec500',
      '#ad91ff',
      '#f4b940',
      '#e74c3c',
      '#05b8ee',
      '#ff7abc',
      '#ef8523',
      '#26d9b1',
    ];
    let colors9 = [];
    for (let i = 0; i < 9; i ++) {
      colors9.push(helper.getCategoryColor(i, localTheme));
    }
    expect(colors9).toEqual(expectColors9);

    const expectColors2 = ['#3283c8', '#e7e7e7'];
    let colors2 = [];
    colors2.push(helper.getCategoryColorFrom2Colors(0, localTheme));
    colors2.push(helper.getCategoryColorFrom2Colors(1, localTheme));
    expect(colors2).toEqual(expectColors2);
  });

  it('get data key', () => {
    expect(helper.getDataKey(true)).toBe('percentage');
    expect(helper.getDataKey(false)).toBe('value');
  });

});