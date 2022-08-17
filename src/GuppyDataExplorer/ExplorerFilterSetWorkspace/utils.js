import { FILTER_TYPE } from '../../GuppyComponents/Utils/const';

export { FILTER_TYPE } from '../../GuppyComponents/Utils/const';

/** @typedef {import('../../GuppyComponents/types').AnchoredFilterState} AnchoredFilterState */
/** @typedef {import("../types").ExplorerFilter} ExplorerFilter */
/**
 * @template T
 * @param {Object} args
 * @param {string} args.field
 * @param {T extends AnchoredFilterState ? AnchoredFilterState : ExplorerFilter} args.filter
 */
function _pluckFromFilter({ field, filter }) {
  const newFilter = { ...filter };
  if (Object.keys(newFilter).length === 0) return newFilter;

  newFilter.value = {};
  for (const [key, value] of Object.entries(filter.value))
    if (key !== field) newFilter.value[key] = value;

  if (Object.keys(newFilter.value).length === 0) delete newFilter.value;
  return newFilter;
}

/** @type {typeof _pluckFromFilter<ExplorerFilter>} */
export const pluckFromFilter = _pluckFromFilter;

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
      const newAnchorFilter =
        /** @type {typeof _pluckFromFilter<AnchoredFilterState>} */ (
          _pluckFromFilter
        )({ field, filter: value });
      if (Object.keys(newAnchorFilter.value ?? {}).length > 0)
        newFilter.value[key] = newAnchorFilter;
    }

  if (Object.keys(newFilter.value).length === 0) delete newFilter.value;
  return newFilter;
}

/** @param {ExplorerFilter} filter */
export function checkIfFilterEmpty(filter) {
  return Object.keys(filter.value ?? {}).length === 0;
}
