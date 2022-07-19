import { FILTER_TYPE } from '../../GuppyComponents/Utils/const';

export { FILTER_TYPE } from '../../GuppyComponents/Utils/const';

/** @typedef {import("../types").ExplorerFilter} ExplorerFilter */

/**
 * @param {Object} args
 * @param {string} args.field
 * @param {ExplorerFilter} args.filter
 */
export function pluckFromFilter({ field, filter }) {
  /** @type {ExplorerFilter} */
  const newFilter = { ...filter };
  if (Object.keys(newFilter).length === 0) return newFilter;

  newFilter.value = {};
  for (const [key, value] of Object.entries(filter.value))
    if (key !== field) newFilter.value[key] = value;

  if (Object.keys(newFilter.value).length === 0) delete newFilter.value;
  return newFilter;
}

/**
 * @param {Object} args
 * @param {string} args.anchor
 * @param {string} args.field
 * @param {ExplorerFilter} args.filter
 */
export function pluckFromAnchorFilter({ anchor, field, filter }) {
  /** @type {ExplorerFilter} */
  const newFilter = { ...filter };
  if (Object.keys(newFilter).length === 0) return newFilter;

  newFilter.value = {};
  for (const [key, value] of Object.entries(filter.value))
    if (key !== anchor) newFilter.value[key] = value;
    else if (value.__type === FILTER_TYPE.ANCHORED) {
      const newAnchorFilter = pluckFromFilter({ field, filter: value });
      if (Object.keys(newAnchorFilter.value ?? {}).length > 0)
        newFilter.value[key] =
          /** @type {import('../../GuppyComponents/types').AnchoredFilterState} */ ({
            __type: FILTER_TYPE.ANCHORED,
            value: newAnchorFilter.value,
          });
    }

  if (Object.keys(newFilter.value).length === 0) delete newFilter.value;
  return newFilter;
}

/** @param {ExplorerFilter} filter */
export function checkIfFilterEmpty(filter) {
  return Object.keys(filter.value ?? {}).length === 0;
}
