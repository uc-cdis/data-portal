import { colorsForCharts } from '../../localconf';

const percentageFormatter = showPercentage => v => (showPercentage ? `${v}%` : v);

const addPercentage = v => (percentageFormatter(true)(v));

const calculateChartData = (data, showPercentage, percentageFixedPoint) => {
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

const getPercentageData = (chartData, percentageFixedPoint) => {
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
    percentage = Number(Number.parseFloat(percentage).toFixed(percentageFixedPoint));
    percentRemaining -= percentage;
    result[entry.name] = percentage;
  });
  return [result];
};

const getCategoryColor = index => (colorsForCharts.categorical9Colors[index % 9]);

const getCategoryColorFrom2Colors = index => colorsForCharts.categorical2Colors[index % 2];

const getDataKey = showPercentage => (showPercentage ? 'percentage' : 'value');

const transformArrangerDataToChart = (field, sqonValues) => {
  const chartData = [];
  field.buckets
    .filter(bucket => (sqonValues === undefined || sqonValues.includes(bucket.key)))
    .forEach(bucket =>
      chartData.push({
        name: bucket.key,
        value: bucket.doc_count,
      }),
    );
  return chartData;
};

const transformArrangerDataToSummary = (field, chartType, title, sqonValues) => ({
  type: chartType,
  title,
  data: transformArrangerDataToChart(field, sqonValues),
});

const transformDataToCount = (field, label, sqonCount) => ({
  label,
  value: Math.min(field.buckets.length, sqonCount),
});

const getSQONValues = (sqon, field) => {
  if (!sqon || !sqon.content) return undefined;
  const sqonItems = sqon.content.filter(item => item.content.field === field);
  if (!sqonItems || sqonItems.length !== 1) return undefined;
  const sqonValues = sqonItems[0].content.value;
  return sqonValues;
};

const getSQONCount = (sqon, field) => {
  if (!sqon || !sqon.content) return Infinity;
  const sqonItems = sqon.content.filter(item => item.content.field === field);
  if (!sqonItems || sqonItems.length !== 1) return Infinity;
  const sqonCount = sqonItems[0].content.value.length;
  return sqonCount;
};

const getCharts = (data, arrangerConfig, sqon) => {
  const countItems = [];
  const summaries = [];
  const stackedBarCharts = [];

  if (data && data.subject.aggregations) {
    const fields = data.subject.aggregations;
    Object.keys(fields).forEach((field) => {
      const fieldConfig = arrangerConfig.charts[field];
      const sqonValues = getSQONValues(sqon, field);
      const sqonCount = getSQONCount(sqon, field);
      if (fieldConfig) {
        switch (fieldConfig.chartType) {
        case 'count':
          countItems.push(transformDataToCount(fields[field], fieldConfig.title, sqonCount));
          break;
        case 'pie':
        case 'bar':
          summaries.push(
            transformArrangerDataToSummary(
              fields[field],
              fieldConfig.chartType,
              fieldConfig.title,
              sqonValues),
          );
          break;
        case 'stackedBar':
          stackedBarCharts.push(
            transformArrangerDataToSummary(
              fields[field],
              fieldConfig.chartType,
              fieldConfig.title,
              sqonValues),
          );
          break;
        default:
          break;
        }
      }
    });
  }
  return { summaries, countItems, stackedBarCharts };
};

module.exports = {
  percentageFormatter,
  addPercentage,
  calculateChartData,
  getPercentageData,
  getCategoryColor,
  getCategoryColorFrom2Colors,
  getDataKey,
  transformDataToCount,
  transformArrangerDataToChart,
  transformArrangerDataToSummary,
  getCharts,
  getSQONCount,
  getSQONValues,
};
