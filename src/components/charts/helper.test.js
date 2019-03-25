import {
  percentageFormatter,
  addPercentage,
  calculateChartData,
  getPercentageData,
  getCategoryColor,
  getCategoryColorFrom2Colors,
  getDataKey,
  transformArrangerDataToChart,
  transformDataToCount,
  transformArrangerDataToSummary,
  getCharts,
  getSQONValues,
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
    expect(getPercentageData(chartData, 0)).toEqual([{
      H1N1: 20,
      VN1203: 15,
      HIV: 10,
      HuCoV_EMC: 5,
      SARS_CoV: 50,
    }]);
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

  const noSelectSqonValues = null;
  const selectWhiteSqon = {
    op: 'and',
    content: [
      {
        op: 'in',
        content: {
          field: 'ethnicity',
          value: [
            'White',
          ],
        },
      },
    ],
  };
  const selectWhiteSqonValues = ['White'];

  const ethnicityFieldJSON = {
    buckets: [
      { doc_count: 4, key: 'White' },
      { doc_count: 2, key: 'Hispanic' },
      { doc_count: 5, key: 'Black' },
    ],
  };

  const projectFieldJSON = {
    buckets: [
      { doc_count: 3, key: 'Proj-1' },
      { doc_count: 7, key: 'Proj-2' },
      { doc_count: 1, key: 'Proj-3' },
      { doc_count: 5, key: 'Proj-4' },
    ],
  };

  const ethnicityChartData = [
    { name: 'White', value: 4 },
    { name: 'Hispanic', value: 2 },
    { name: 'Black', value: 5 },
  ];

  const ethnicityChartDataWithOnlyWhiteSelected = [
    { name: 'White', value: 4 },
  ];

  const ethnicityCountData = { label: 'Ethnicity', value: 3 };
  const ethnicityCountDataWithOnlyWhiteSelected = { label: 'Ethnicity', value: 1 };

  const projectCountData = { label: 'Projects', value: 4 };

  const summaryData = {
    title: 'Ethnicity',
    type: 'pie',
    data: ethnicityChartData,
  };

  const summaryDataWithOnlyWhiteSelected = {
    title: 'Ethnicity',
    type: 'pie',
    data: ethnicityChartDataWithOnlyWhiteSelected,
  };

  const rawData = {
    subject: {
      aggregations: {
        ethnicity: ethnicityFieldJSON,
        project: projectFieldJSON,
      },
    },
  };

  const dataExplorerConfig = {
    arrangerConfig: {
      graphqlField: 'subject',
    },
    charts: {
      ethnicity: {
        chartType: 'pie',
        title: 'Ethnicity',
      },
      project: {
        chartType: 'count',
        title: 'Projects',
      },
    },
  };

  it('returns chart data as expected', () => {
    expect(transformArrangerDataToChart(ethnicityFieldJSON, noSelectSqonValues))
      .toEqual(ethnicityChartData);
    expect(transformArrangerDataToChart(ethnicityFieldJSON, selectWhiteSqonValues))
      .toEqual(ethnicityChartDataWithOnlyWhiteSelected);
  });

  it('returns count data as expected', () => {
    expect(transformDataToCount(ethnicityFieldJSON, 'Ethnicity', noSelectSqonValues))
      .toEqual(ethnicityCountData);
    expect(transformDataToCount(ethnicityFieldJSON, 'Ethnicity', selectWhiteSqonValues))
      .toEqual(ethnicityCountDataWithOnlyWhiteSelected);
  });

  it('returns chart summaries as expected', () => {
    expect(transformArrangerDataToSummary(ethnicityFieldJSON, 'pie', 'Ethnicity', noSelectSqonValues)).toEqual(summaryData);
    expect(transformArrangerDataToSummary(ethnicityFieldJSON, 'pie', 'Ethnicity',
      selectWhiteSqonValues)).toEqual(summaryDataWithOnlyWhiteSelected);
  });

  it('gets charts', () => {
    const charts = getCharts(rawData, dataExplorerConfig);
    expect(charts.countItems).toEqual([projectCountData]);
    expect(charts.summaries).toEqual([summaryData]);
    expect(charts.stackedBarCharts).toEqual([]);
  });

  it('return selecetd values from SQON as expected', () => {
    expect(getSQONValues(selectWhiteSqon, 'ethnicity')).toEqual(selectWhiteSqonValues);
    expect(getSQONValues(noSelectSqonValues, 'ethnicity')).toEqual(null);
  });
});
