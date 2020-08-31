export const getXAxisTicks = (data, step = 2) => {
  const times = data.flatMap(({ data }) => data).map(({ time }) => time);
  const minTime = Math.floor(Math.min(...times));
  const maxTime = Math.floor(Math.max(...times)) + 1;

  const ticks = [];
  for (let tick = minTime; tick <= maxTime; tick += step) ticks.push(tick);

  return ticks;
};
