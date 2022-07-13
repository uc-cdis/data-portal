import cloneDeep from 'lodash.clonedeep';

/** @typedef {import("../types").ExplorerFilter} ExplorerFilter */
/** @typedef {import('./types').FilterSetWorkspaceState} FilterSetWorkspaceState */
/** @typedef {import('./types').FilterSetWorkspaceAction} FilterSetWorkspaceAction */

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

/**
 * @param {number} explorerId
 * @returns {FilterSetWorkspaceState}
 */
export function retrieveWorkspaceState(explorerId) {
  try {
    const storageKey = `${workspaceStateSessionStorageKey}:${explorerId}`;
    const str = window.sessionStorage.getItem(storageKey);
    if (str === null) throw new Error('No stored query');
    return JSON.parse(str);
  } catch (e) {
    if (e.message !== 'No stored query') console.error(e);

    const id = crypto.randomUUID();
    const filterSet = { filter: {} };
    return { active: { filterSet, id }, all: { [id]: filterSet } };
  }
}

/**
 * @param {Object} args
 * @param {ExplorerFilter} args.explorerFilter
 * @param {number} args.explorerId
 * @returns {FilterSetWorkspaceState}
 */
export function initializeWorkspaceState({ explorerFilter, explorerId }) {
  const state = retrieveWorkspaceState(explorerId);
  if (checkIfFilterEmpty(state.active.filterSet.filter)) {
    state.active.filterSet.filter = explorerFilter;
    state.all[state.active.id].filter = explorerFilter;
  } else if (
    JSON.stringify(state.active.filterSet.filter) !==
    JSON.stringify(explorerFilter)
  ) {
    const id = crypto.randomUUID();
    const filterSet = { filter: explorerFilter };
    state.active = { filterSet, id };
    state.all[id] = filterSet;
  }

  return state;
}

/**
 * @param {Object} args
 * @param {number} args.explorerId
 * @param {FilterSetWorkspaceState} args.state
 */
export function storeWorkspaceState({ explorerId, state }) {
  const storageKey = `${workspaceStateSessionStorageKey}:${explorerId}`;
  window.sessionStorage.setItem(storageKey, JSON.stringify(state));
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

/**
 * @param {FilterSetWorkspaceState} state
 * @param {FilterSetWorkspaceAction} action
 * @returns {FilterSetWorkspaceState}
 */
export function workspaceReducer(state, action) {
  switch (action.type) {
    case 'CLEAR': {
      const { id } = state.active;
      const filterSet = createEmptyWorkspaceFilterSet();

      const active = { filterSet, id };
      const all = { ...state.all, [id]: filterSet };
      return { active, all };
    }
    case 'CLEAR-ALL': {
      const { newId } = action.payload;
      const filterSet = createEmptyWorkspaceFilterSet();

      const active = { filterSet, id: newId };
      const all = { [newId]: filterSet };
      return { active, all };
    }
    case 'CREATE': {
      const { newId } = action.payload;
      const filterSet = createEmptyWorkspaceFilterSet();

      const active = { filterSet, id: newId };
      const all = { ...state.all, [newId]: filterSet };
      return { active, all };
    }
    case 'DUPLICATE': {
      const { newId } = action.payload;
      const filterSet = { filter: cloneDeep(state.active.filterSet.filter) };

      const active = { filterSet, id: newId };
      const all = { ...state.all, [newId]: filterSet };
      return { active, all };
    }
    case 'LOAD': {
      const id = action.payload.newId ?? state.active.id;
      const filterSet = cloneDeep(action.payload.filterSet);

      const active = { filterSet, id };
      const all = { ...state.all, [id]: filterSet };
      return { active, all };
    }
    case 'REMOVE': {
      const newState = cloneDeep(state);
      delete newState.all[state.active.id];

      const [firstEntry] = Object.entries(newState.all);
      const [id, filterSet] = firstEntry ?? [
        action.payload.newId,
        createEmptyWorkspaceFilterSet(),
      ];

      const active = { filterSet, id };
      const all = { ...newState.all, [id]: filterSet };
      return { active, all };
    }
    case 'SAVE': {
      const { id } = state.active;
      const { filterSet } = action.payload;

      const active = { filterSet, id };
      const all = { ...state.all, [id]: filterSet };
      return { active, all };
    }
    case 'UPDATE': {
      const { id } = state.active;
      const filterSet = {
        ...state.active.filterSet,
        filter: cloneDeep(action.payload.filter),
      };

      const active = { filterSet, id };
      const all = { ...state.all, [id]: filterSet };
      return { active, all };
    }
    case 'USE': {
      const { id } = action.payload;
      const filterSet = state.all[id];

      const active = { filterSet, id };
      return { ...state, active };
    }
    default:
      return state;
  }
}
