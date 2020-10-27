import './typedef';

const isString = (x) => Object.prototype.toString.call(x) === '[object String]';

/**
 * Get factor variables to use for survival analysis
 * @param {{ [key: string]: { histogram: { key: any }[] }}} aggsData
 * @param {{ field: string; name: string }[]} fieldMapping
 */
export const getFactors = (aggsData, fieldMapping) => {
  const factors = [];
  const exceptions = ['project_id', 'data_contributor_id'];

  /** @type {{ [key: string]: string }} */
  const fieldNameMap = {};
  for (const { field, name } of fieldMapping) fieldNameMap[field] = name;

  for (const [key, value] of Object.entries(aggsData))
    if (
      !exceptions.includes(key) &&
      value.histogram.length > 0 &&
      isString(value.histogram[0].key)
    )
      factors.push({
        label: fieldNameMap.hasOwnProperty(key)
          ? fieldNameMap[key]
          : key
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
