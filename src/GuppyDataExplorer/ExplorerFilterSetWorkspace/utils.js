/** @typedef {import("../types").ExplorerFilter} ExplorerFilter */
/** @typedef {import("../types").ExplorerFilterSet} ExplorerFilterSet */
/** @typedef {import('./types').FilterSetWorkspaceState} FilterSetWorkspaceState */

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

const workspaceStateSessionStorageKey = 'explorer:filterSetWorkspace';

/** @returns {FilterSetWorkspaceState} */
export function retrieveWorkspaceState() {
  try {
    const str = window.sessionStorage.getItem(workspaceStateSessionStorageKey);
    if (str === null) throw new Error('No stored query');
    return JSON.parse(str);
  } catch (e) {
    if (e.message !== 'No stored query') console.error(e);

    const id = crypto.randomUUID();
    const filterSet = { filter: {} };
    return { active: { filterSet, id }, all: { [id]: filterSet }, size: 1 };
  }
}

/** @param {ExplorerFilter} filter */
export function initializeWorkspaceState(filter) {
  if (checkIfFilterEmpty(filter)) return retrieveWorkspaceState();

  const id = crypto.randomUUID();
  const filterSet = { filter };
  return { active: { filterSet, id }, all: { [id]: filterSet }, size: 1 };
}

/** @param {FilterSetWorkspaceState} state */
export function storeWorkspaceState(state) {
  window.sessionStorage.setItem(
    workspaceStateSessionStorageKey,
    JSON.stringify(state)
  );
}

/**
 * @param {number} filterSetId
 * @param {FilterSetWorkspaceState} state
 */
export function findFilterSetIdInWorkspaceState(filterSetId, state) {
  for (const [id, filterSet] of Object.entries(state.all))
    if ('id' in filterSet && filterSet.id === filterSetId) return id;

  return undefined;
}

/** @returns {import('./types').UnsavedExplorerFilterSet} */
export function createEmptyWorkspaceFilterSet() {
  return { filter: {} };
}
