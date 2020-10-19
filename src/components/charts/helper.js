import { colorsForCharts } from '../../localconf';

export const percentageFormatter = (showPercentage) => (v) =>
  showPercentage ? `${v}%` : v;

export const addPercentage = (v) => percentageFormatter(true)(v);

export const calculateChartData = (
  data,
  showPercentage,
  percentageFixedPoint
) => {
  if (showPercentage) {
    const sum = data.reduce((a, entry) => a + entry.value, 0);
    let percentRemaining = 100;
    return data.map((entry, index, array) => {
      let percentage;
      if (index < array.length - 1) {
        percentage = (entry.value * 100) / sum;
      } else {
        percentage = percentRemaining;
      }
      percentage = Number(Number(percentage).toFixed(percentageFixedPoint));
      percentRemaining -= percentage;
      return Object.assign({ percentage }, entry);
    });
  }
  return data;
};

export const getPercentageData = (chartData, percentageFixedPoint) => {
  const result = {};
  const sum = chartData.reduce((a, entry) => a + entry.value, 0);
  let percentRemaining = 100;
  chartData.forEach((entry, index, array) => {
    let percentage;
    if (index < array.length - 1) {
      percentage = (entry.value * 100) / sum;
    } else {
      percentage = percentRemaining;
    }
    percentage = Number(
      Number.parseFloat(percentage).toFixed(percentageFixedPoint)
    );
    percentRemaining -= percentage;
    result[entry.name] = percentage;
  });
  return [result];
};

export const getCategoryColor = (index) =>
  colorsForCharts.categorical9Colors[index % 9];

export const getCategoryColorFrom2Colors = (index) =>
  colorsForCharts.categorical2Colors[index % 2];

export const getDataKey = (showPercentage) =>
  showPercentage ? 'percentage' : 'value';
