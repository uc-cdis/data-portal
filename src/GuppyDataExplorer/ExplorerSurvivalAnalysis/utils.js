/* eslint-disable no-shadow */
import { FILTER_TYPE } from '../ExplorerFilterSetWorkspace/utils';

/** @typedef {import('./types').RisktableData} RisktableData */

/** @typedef {import('./types').SurvivalData} SurvivalData */

/**
 * @param {string[]} consortiums
 * @param {import('../types').ExplorerFilter} filter
 */
export function checkIfFilterInScope(consortiums, filter) {
  if (consortiums.length === 0) return true;

  if (filter.__type === FILTER_TYPE.COMPOSED)
    return filter.value.every((f) => checkIfFilterInScope(consortiums, f));

  for (const [key, val] of Object.entries(filter.value ?? {}))
    if (
      key === 'consortium' &&
      val.__type === FILTER_TYPE.OPTION &&
      val.selectedValues.some((v) => !consortiums.includes(v))
    )
      return false;

  return true;
}

/**
 * @param {string[]} consortiums
 * @param {import('../types').ExplorerFilter} filter
 * @return {boolean}
 */
export function checkIfFilterHasOptedOutConsortiums(consortiums, filter) {
  const optedInConsortiums = ['INRG', 'INSTRuCT'];

  if (!consortiums.length) {
    return false;
  }
  if (!filter.value) {
    // All Subjects
    return consortiums.some((c) => !optedInConsortiums.includes(c));
  } else if (filter.__type === FILTER_TYPE.COMPOSED) {
    return filter.value.some((f) =>
      checkIfFilterHasOptedOutConsortiums(consortiums, f)
    );
  } else {
    for (const [key, val] of Object.entries(filter.value)) {
      if (key === 'consortium' && val.__type === FILTER_TYPE.OPTION) {
        return val.selectedValues.some((c) => !optedInConsortiums.includes(c));
      }
    }
    return false;
  }
}

/**
 * Builds x-axis ticks array to use in plots
 * @param {{ data: { time: number; }[]}[]} data
 * @param {number} step
 * @param {number} endtime
 */
export const getXAxisTicks = (data, step = 2, endtime = undefined) => {
  const times = data.flatMap(({ data }) => data).map(({ time }) => time);
  const minTime = Math.floor(Math.min(...times));
  const maxTime = endtime ?? Math.ceil(Math.max(...times));

  const ticks = [];
  for (let tick = minTime; tick <= maxTime; tick += step) ticks.push(tick);

  return ticks;
};

/**
 * Filter survival by start/end time
 * @param {SurvivalData[]} data
 * @param {number} startTime
 * @param {number} [endTime]
 * @returns {SurvivalData[]}
 */
export const filterSurvivalByTime = (data, startTime, endTime = Infinity) =>
  data.map(({ data, name }) => ({
    data: data.filter(({ time }) => time >= startTime && time <= endTime),
    name,
  }));

/**
 * Filter risktable by start/end time
 * @param {RisktableData[]} data
 * @param {number} startTime
 * @param {number} [endTime]
 * @returns {RisktableData[]}
 */
export const filterRisktableByTime = (data, startTime, endTime = Infinity) =>
  data.map(({ data, name }) => ({
    data: data.filter(({ time }) => time >= startTime && time <= endTime),
    name,
  }));

const userAgreementLocalStorageKey = `survival:userAgreement`;

export function checkUserAgreement() {
  return window.localStorage.getItem(userAgreementLocalStorageKey) === 'true';
}

export function handleUserAgreement() {
  return window.localStorage.setItem(userAgreementLocalStorageKey, 'true');
}
