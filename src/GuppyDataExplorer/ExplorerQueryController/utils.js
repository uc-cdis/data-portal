/** @typedef {import("../types").ExplorerFilter} ExplorerFilter */
/** @typedef {import('./types').QueryState} QueryState */

/**
 * @param {Object} args
 * @param {string} args.field
 * @param {ExplorerFilter} args.filter
 */
export function pluckFromFilter({ field, filter }) {
  const newFilter = {};
  for (const [key, value] of Object.entries(filter))
    if (key !== field) newFilter[key] = value;

  return /** @type {ExplorerFilter} */ (newFilter);
}

/**
 * @param {Object} args
 * @param {string} args.anchor
 * @param {string} args.field
 * @param {ExplorerFilter} args.filter
 */
export function pluckFromAnchorFilter({ anchor, field, filter }) {
  const newFilter = {};
  for (const [key, value] of Object.entries(filter))
    if (key !== anchor) newFilter[key] = value;
    else if (typeof value === 'object' && 'filter' in value) {
      const newAnchorFilter = pluckFromFilter({ field, filter: value.filter });
      if (Object.keys(newAnchorFilter).length > 0)
        newFilter[key] = { filter: newAnchorFilter };
    }

  return /** @type {ExplorerFilter} */ (newFilter);
}

/** @param {ExplorerFilter} filter */
export function checkIfFilterEmpty(filter) {
  const { __combineMode, ..._filter } = filter;
  return Object.keys(_filter).length === 0;
}

const queryStateSessionStorageKey = 'explorer:queryState';

/** @returns {QueryState} */
export function retrieveQueryState() {
  try {
    const str = window.sessionStorage.getItem(queryStateSessionStorageKey);
    if (str === null) throw new Error('No stored query');
    return JSON.parse(str);
  } catch (e) {
    if (e.message !== 'No stored query') console.error(e);
    return { [crypto.randomUUID()]: {} };
  }
}

/** @param {ExplorerFilter} filter */
export function getInitialQueryState(filter) {
  return checkIfFilterEmpty(filter)
    ? retrieveQueryState()
    : { [crypto.randomUUID()]: filter };
}

/** @param {QueryState} state */
export function storeQueryState(state) {
  window.sessionStorage.setItem(
    queryStateSessionStorageKey,
    JSON.stringify(state)
  );
}
