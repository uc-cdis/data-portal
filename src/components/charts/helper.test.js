import {
  percentageFormatter,
  addPercentage,
  calculateChartData,
  getPercentageData,
  getCategoryColor,
  getCategoryColorFrom2Colors,
  getDataKey,
} from './helper';
import { colorsForCharts } from '../../localconf';

describe('helper', () => {
  it('percentage formatter', () => {
    expect(percentageFormatter(true)(20)).toBe('20%');
    expect(percentageFormatter(false)(20)).toBe(20);
    expect(addPercentage(20)).toBe('20%');
  });

  const chartData = [
    { name: 'H1N1', value: 4000 },
    { name: 'VN1203', value: 3000 },
    { name: 'HIV', value: 2000 },
    { name: 'HuCoV_EMC', value: 1000 },
    { name: 'SARS_CoV', value: 10000 },
  ];

  it('calculate chart data', () => {
    expect(calculateChartData(chartData, true, 0)).toEqual([
      { percentage: 20, name: 'H1N1', value: 4000 },
      { percentage: 15, name: 'VN1203', value: 3000 },
      { percentage: 10, name: 'HIV', value: 2000 },
      { percentage: 5, name: 'HuCoV_EMC', value: 1000 },
      { percentage: 50, name: 'SARS_CoV', value: 10000 },
    ]);
    expect(calculateChartData(chartData, false, 0)).toEqual(chartData);
    expect(getPercentageData(chartData, 0)).toEqual([
      {
        H1N1: 20,
        VN1203: 15,
        HIV: 10,
        HuCoV_EMC: 5,
        SARS_CoV: 50,
      },
    ]);
  });

  it('get color', () => {
    const expectColors9 = colorsForCharts.categorical9Colors;
    const colors9 = [];
    for (let i = 0; i < 9; i += 1) {
      colors9.push(getCategoryColor(i));
    }
    expect(colors9).toEqual(expectColors9);

    const expectColors2 = ['#3283c8', '#e7e7e7'];
    const colors2 = [];
    colors2.push(getCategoryColorFrom2Colors(0));
    colors2.push(getCategoryColorFrom2Colors(1));
    expect(colors2).toEqual(expectColors2);
  });

  it('get data key', () => {
    expect(getDataKey(true)).toBe('percentage');
    expect(getDataKey(false)).toBe('value');
  });
});
