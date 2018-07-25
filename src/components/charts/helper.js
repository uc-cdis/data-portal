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

const transformArrangerDataToSummary = (field, chartType, title) => {
  return {
    type: chartType,
    title: title,
    data: transformArrangerDataToChart(field),
  }
}

const transformArrangerDataToChart = (field) => {
  let chartData = [];
  field.buckets.map(bucket => {
    chartData.push({
      name: bucket.key,
      value: bucket.doc_count,
    })
  })
  return chartData;
}

const transformDataToCount = (field, label) => {
  return {
    label: label,
    value: field.buckets.length,
  }
}

const getSummaries = (data, arrangerConfig) => {
  let countItems = [];
  let charts = [];
  let horizontalBarCharts = [];

  if (data && data.subject.aggregations) {
    let fields = data.subject.aggregations;
    Object.keys(fields).map(field => {
      let fieldConfig = arrangerConfig.charts[field]
      if (fieldConfig) {
        switch(fieldConfig.chartType) {
          case 'count':
            return countItems.push(transformDataToCount(fields[field], fieldConfig.title));
          case 'pie':
          case 'bar':
            return charts.push(transformArrangerDataToSummary(fields[field], fieldConfig.chartType, fieldConfig.title));
          case 'horizontalBar':
            return horizontalBarCharts.push(transformArrangerDataToSummary(fields[field], fieldConfig.chartType, fieldConfig.title));
          default:
            return;
        }
      }
    })
  }
  return { charts: charts, countItems: countItems, horizontalBarCharts: horizontalBarCharts};
}

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
  getSummaries,
};
