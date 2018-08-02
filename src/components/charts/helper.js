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

const getCategoryColor = (index, localTheme) => {
  // map index to (1-9)
  const i = (index % 9) + 1;
  return localTheme[`barGraph.bar${i}Color`];
};

const getCategoryColorFrom2Colors = (index, localTheme) => localTheme[`pieChartTwoColor.pie${(index % 2) + 1}Color`];

const getDataKey = showPercentage => (showPercentage ? 'percentage' : 'value');

const transformArrangerDataToChart = (field) => {
  const chartData = [];
  field.buckets.map(bucket =>
    chartData.push({
      name: bucket.key,
      value: bucket.doc_count,
    }),
  );
  return chartData;
};

const transformArrangerDataToSummary = (field, chartType, title) => ({
  type: chartType,
  title,
  data: transformArrangerDataToChart(field),
});

const transformDataToCount = (field, label) => ({
  label,
  value: field.buckets.length,
});

const getCharts = (data, arrangerConfig) => {
  const countItems = [];
  const summaries = [];
  const stackedBarCharts = [];

  if (data && data.subject.aggregations) {
    const fields = data.subject.aggregations;
    Object.keys(fields).forEach((field) => {
      const fieldConfig = arrangerConfig.charts[field];
      if (fieldConfig) {
        switch (fieldConfig.chartType) {
        case 'count':
          countItems.push(transformDataToCount(fields[field], fieldConfig.title));
          break;
        case 'pie':
        case 'bar':
          summaries.push(
            transformArrangerDataToSummary(
              fields[field],
              fieldConfig.chartType,
              fieldConfig.title),
          );
          break;
        case 'stackedBar':
          stackedBarCharts.push(
            transformArrangerDataToSummary(
              fields[field],
              fieldConfig.chartType,
              fieldConfig.title),
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
};
