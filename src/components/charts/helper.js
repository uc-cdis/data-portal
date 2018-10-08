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


const prettifyValueName = (name) => {
  if (name === '__missing__') {
    return 'No Data';
  }
  return name;
};

const transformArrangerDataToChart = (field, sqonValues) => {
  const chartData = [];
  field.buckets
    .filter(bucket => (sqonValues === null || sqonValues.includes(bucket.key)))
    .forEach(bucket =>
      chartData.push({
        name: prettifyValueName(bucket.key),
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

const transformDataToCount = (field, label, sqonValues) => ({
  label,
  value: sqonValues ? Math.min(field.buckets.length, sqonValues.length) : field.buckets.length,
});

/**
 * Return an array of selected values in a given field
 * If no value selected, return null
 */
const getSQONValues = (sqon, field) => {
  if (!sqon || !sqon.content) return null;
  const sqonItems = sqon.content.filter(item => item.content.field === field);
  if (!sqonItems || sqonItems.length !== 1) return null;
  const sqonValues = sqonItems[0].content.value;
  return sqonValues;
};

const getCharts = (data, arrangerConfig, sqon) => {
  const countItems = [];
  const summaries = [];
  const stackedBarCharts = [];

  if (data && data[arrangerConfig.graphqlField].aggregations) {
    const fields = data[arrangerConfig.graphqlField].aggregations;
    Object.keys(fields).forEach((field) => {
      const fieldConfig = arrangerConfig.charts[field];
      const sqonValues = getSQONValues(sqon, field);
      if (fieldConfig) {
        switch (fieldConfig.chartType) {
        case 'count':
          countItems.push(transformDataToCount(fields[field], fieldConfig.title, sqonValues));
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
  getSQONValues,
};
