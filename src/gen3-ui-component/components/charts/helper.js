/** @param {boolean} showPercentage */
const percentageFormatter = (showPercentage) => (v) =>
  showPercentage ? `${v}%` : v;

const addPercentage = (v) => `${v}%`;

/**
 * @param {{ name: string; value: number }[]} data
 * @param {number} percentageFixedPoint
 */
const calculateChartData = (data, percentageFixedPoint) => {
  const sum = data.reduce((a, entry) => a + entry.value, 0);
  const max = data.reduce((a, entry) => Math.max(a, entry.value), -Infinity);
  return data.map((entry) => {
    let percentage;
    percentage = (entry.value * 100) / sum;
    percentage = Number(Number(percentage).toFixed(percentageFixedPoint));
    const widthPercentage = (entry.value * 100) / max;
    return { percentage, widthPercentage, ...entry };
  });
};

/**
 * @param {{ name: string; value: number }[]} chartData
 * @param {number} percentageFixedPoint
 */
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
    percentage = Number.parseFloat(percentage.toFixed(percentageFixedPoint));
    percentRemaining -= percentage;
    result[entry.name] = percentage;
  });
  return [result];
};

const categoricalColors = [
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

/** @param {number} index */
const getCategoryColor = (index) =>
  categoricalColors[index % categoricalColors.length];

/** @param {number} index */
const getCategoryColorFrom2Colors = (index) => {
  const colors = ['#3283c8', '#e7e7e7'];
  return colors[index % colors.length];
};

/** @param {boolean} showPercentage */
const getDataKey = (showPercentage) =>
  showPercentage ? 'percentage' : 'value';

/** @param {number | string} width */
const parseParamWidth = (width) =>
  typeof width === 'number' ? `${width}px` : width;

/**
 * @param {{ name: string; value: number }[]} data
 * @param {number} lockValue
 */
const shouldHideChart = (data, lockValue) =>
  data.find((item) => item.value === lockValue);

const helper = {
  addPercentage,
  calculateChartData,
  categoricalColors,
  getPercentageData,
  getCategoryColor,
  getCategoryColorFrom2Colors,
  getDataKey,
  parseParamWidth,
  percentageFormatter,
  shouldHideChart,
};

export default helper;
