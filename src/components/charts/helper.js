import { colorsForCharts } from '../../localconf';

export const percentageFormatter = showPercentage => v => (showPercentage ? `${v}%` : v);

export const addPercentage = v => (percentageFormatter(true)(v));

export const calculateChartData = (data, showPercentage, percentageFixedPoint) => {
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
    percentage = Number(Number.parseFloat(percentage).toFixed(percentageFixedPoint));
    percentRemaining -= percentage;
    result[entry.name] = percentage;
  });
  return [result];
};

export const getCategoryColor = index => (colorsForCharts.categorical9Colors[index % 9]);

export const getCategoryColorFrom2Colors = index => colorsForCharts.categorical2Colors[index % 2];

export const getDataKey = showPercentage => (showPercentage ? 'percentage' : 'value');

export const prettifyValueName = (name) => {
  if (name === '__missing__') {
    return 'No Data';
  }
  return name;
};

export const transformArrangerDataToChart = (field, sqonValues) => {
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

export const transformArrangerDataToSummary = (field, chartType, title, sqonValues) => ({
  type: chartType,
  title,
  data: transformArrangerDataToChart(field, sqonValues),
});

export const transformDataToCount = (field, label, sqonValues) => ({
  label,
  value: sqonValues ? Math.min(field.buckets.length, sqonValues.length) : field.buckets.length,
});

/**
 * Return an array of selected values in a given field
 * If no value selected, return null
 */
export const getSQONValues = (sqon, field) => {
  if (!sqon || !sqon.content) return null;
  const sqonItems = sqon.content.filter(item => item.content.field === field);
  if (!sqonItems || sqonItems.length !== 1) return null;
  const sqonValues = sqonItems[0].content.value;
  return sqonValues;
};

export const getCharts = (data, dataExplorerConfig, sqon) => {
  const countItems = [];
  const summaries = [];
  const stackedBarCharts = [];
  const { arrangerConfig } = dataExplorerConfig;

  if (data && data[arrangerConfig.graphqlField].aggregations) {
    const fields = data[arrangerConfig.graphqlField].aggregations;
    Object.keys(fields).forEach((field) => {
      const fieldConfig = dataExplorerConfig.charts[field];
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
