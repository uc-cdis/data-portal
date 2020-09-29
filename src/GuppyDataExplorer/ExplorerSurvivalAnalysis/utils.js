import './typedef';

const isString = (x) => Object.prototype.toString.call(x) === '[object String]';

/**
 * Get factor variables to use for survival analysis
 * @param {{ histogram: { key: any }[] }[]} aggsData
 */
export const getFactors = (aggsData) => {
  const factors = [];

  for (const [key, value] of Object.entries(aggsData))
    if (value.histogram.length > 0 && isString(value.histogram[0].key))
      factors.push({
        label: key
          .toLowerCase()
          .replace(/_|\./gi, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase())
          .trim(),
        value: key,
      });

  return factors;
};

/**
 * Builds x-axis ticks array to use in plots
 * @param {{ data: { time: number; }[]}[]} data
 * @param {number} step
 */
export const getXAxisTicks = (data, step = 2) => {
  const times = data.flatMap(({ data }) => data).map(({ time }) => time);
  const minTime = Math.floor(Math.min(...times));
  const maxTime = Math.ceil(Math.max(...times));

  const ticks = [];
  for (let tick = minTime; tick <= maxTime; tick += step) ticks.push(tick);

  return ticks;
};
