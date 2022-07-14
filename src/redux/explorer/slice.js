import { createSlice } from '@reduxjs/toolkit';
import { explorerConfig } from '../../localconf';
import {
  createFilterSet,
  deleteFilterSet,
  fetchFilterSets,
  updateFilterSet,
} from './asyncThunks';
import {
  checkIfFilterEmpty,
  getCurrentConfig,
  initializeWorkspaces,
} from './utils';

/**
 * @template T
 * @typedef {import('@reduxjs/toolkit').PayloadAction<T>} PayloadAction
 */
/** @typedef {import('./types').ExplorerFilter} ExplorerFilter */
/** @typedef {import('./types').ExplorerFilterSet} ExplorerFilterSet */
/** @typedef {import('./types').ExplorerState} ExplorerState */
/** @typedef {import('./types').UnsavedExplorerFilterSet} UnsavedExplorerFilterSet */

/** @type {ExplorerState['explorerIds']} */
const explorerIds = [];
for (const { id } of explorerConfig) explorerIds.push(id);
const initialExplorerId = explorerIds[0];
const initialConfig = getCurrentConfig(initialExplorerId);
const initialPatientIds = initialConfig.patientIdsConfig?.filter
  ? []
  : undefined;
const initialWorkspaces = initializeWorkspaces(initialExplorerId);

const slice = createSlice({
  name: 'explorer',
  initialState: /** @type {ExplorerState} */ ({
    config: initialConfig,
    explorerFilter: {},
    explorerId: initialExplorerId,
    explorerIds,
    patientIds: initialPatientIds,
    savedFilterSets: {
      active: undefined,
      all: [],
      isError: false,
    },
    workspaces: initialWorkspaces,
  }),
  reducers: {
    clearWorkspaceAllFilterSets(state) {
      const id = crypto.randomUUID();
      const filterSet = { filter: {} };

      state.workspaces[state.explorerId].activeId = id;
      state.workspaces[state.explorerId].all = { [id]: filterSet };

      // sync with exploreFilter
      state.explorerFilter = filterSet.filter;
    },
    clearWorkspaceFilterSet(state) {
      const id = state.workspaces[state.explorerId].activeId;
      const filterSet = { filter: {} };

      state.workspaces[state.explorerId].all[id] = filterSet;

      // sync with exploreFilter
      state.explorerFilter = filterSet.filter;
    },
    createWorkspaceFilterSet(state) {
      const id = crypto.randomUUID();
      const filterSet = { filter: {} };

      state.workspaces[state.explorerId].activeId = id;
      state.workspaces[state.explorerId].all[id] = filterSet;

      // sync with exploreFilter
      state.explorerFilter = filterSet.filter;
    },
    duplicateWorkspaceFilterSet(state) {
      const id = crypto.randomUUID();
      const { activeId } = state.workspaces[state.explorerId];
      const { filter } = state.workspaces[state.explorerId].all[activeId];
      const filterSet = { filter };

      state.workspaces[state.explorerId].activeId = id;
      state.workspaces[state.explorerId].all[id] = filterSet;

      // sync with exploreFilter
      state.explorerFilter = filterSet.filter;
    },
    /** @param {PayloadAction<ExplorerFilterSet | UnsavedExplorerFilterSet>} action */
    loadWorkspaceFilterSet(state, action) {
      const { activeId } = state.workspaces[state.explorerId];
      const activeFilterSet = state.workspaces[state.explorerId].all[activeId];
      const shouldOverwrite = checkIfFilterEmpty(activeFilterSet.filter);
      const id = shouldOverwrite ? activeId : crypto.randomUUID();
      const filterSet = action.payload;

      state.workspaces[state.explorerId].activeId = id;
      state.workspaces[state.explorerId].all[id] = filterSet;

      // sync with exploreFilter
      state.explorerFilter = filterSet.filter;

      // sync with savedFilterSets
      state.savedFilterSets.active = state.savedFilterSets.all.find(
        (fs) => fs.id === filterSet.id
      );
    },
    removeWorkspaceFilterSet(state) {
      const { activeId, all } = state.workspaces[state.explorerId];
      delete state.workspaces[state.explorerId].all[activeId];

      const [firstEntry] = Object.entries(all);
      const [id, filterSet] = firstEntry ?? [
        crypto.randomUUID(),
        { filter: {} },
      ];

      state.workspaces[state.explorerId].activeId = id;
      state.workspaces[state.explorerId].all[id] = filterSet;

      // sync with exploreFilter
      state.explorerFilter = filterSet.filter;

      // sync with savedFilterSets
      state.savedFilterSets.active = state.savedFilterSets.all.find(
        (fs) => fs.id === filterSet.id
      );
    },
    /** @param {PayloadAction<ExplorerState['explorerFilter']>} action */
    updateExplorerFilter(state, action) {
      const filter = action.payload;

      let newFilter = /** @type {ExplorerFilter} */ ({});
      if (filter && Object.keys(filter).length > 0) {
        const allSearchFieldSet = new Set();
        for (const { searchFields } of state.config.filterConfig.tabs)
          for (const field of searchFields ?? []) allSearchFieldSet.add(field);

        if (allSearchFieldSet.size === 0) {
          newFilter = /** @type {ExplorerFilter} */ ({
            __combineMode: state.explorerFilter.__combineMode,
            ...filter,
          });
        } else {
          const filterWithoutSearchFields = /** @type {ExplorerFilter} */ ({});
          for (const field of Object.keys(filter))
            if (!allSearchFieldSet.has(field))
              filterWithoutSearchFields[field] = filter[field];

          if (Object.keys(filterWithoutSearchFields).length > 0)
            newFilter = /** @type {ExplorerFilter} */ ({
              __combineMode: state.explorerFilter.__combineMode,
              ...filterWithoutSearchFields,
            });
        }
      }

      state.explorerFilter = newFilter;

      // sync with workspaces
      const { activeId } = state.workspaces[state.explorerId];
      state.workspaces[state.explorerId].all[activeId].filter = newFilter;
    },
    /** @param {PayloadAction<ExplorerState['patientIds']>} action */
    updatePatientIds(state, action) {
      if (state.config.patientIdsConfig?.filter !== undefined)
        state.patientIds = action.payload;
    },
    /** @param {PayloadAction<ExplorerState['explorerId']>} action */
    useExplorerById(state, action) {
      const explorerId = action.payload;
      state.config = getCurrentConfig(explorerId);
      state.explorerId = explorerId;

      // sync with workspaces
      let workspace = state.workspaces[explorerId];
      if (workspace === undefined) {
        const id = crypto.randomUUID();
        const filterSet = { filter: {} };

        workspace = { activeId: id, all: { [id]: filterSet } };
        state.workspaces[explorerId] = workspace;
      }

      // sync with explorerFilter
      state.explorerFilter = workspace.all[workspace.activeId].filter;
    },
    /** @param {PayloadAction<ExplorerState['savedFilterSets']['active']['id']>} action */
    useFilterSetById(state, action) {
      state.savedFilterSets.active = state.savedFilterSets.all.find(
        ({ id }) => id === action.payload
      );
    },
    /** @param {PayloadAction<string>} action */
    useWorkspaceFilterSet(state, action) {
      const newActiveId = action.payload;
      const { explorerId } = state;
      state.workspaces[explorerId].activeId = newActiveId;

      // sync with exploreFilter
      const { filter, id } = state.workspaces[explorerId].all[newActiveId];
      state.explorerFilter = filter;

      // sync with savedFilterSets
      state.savedFilterSets.active = state.savedFilterSets.all.find(
        (filterSet) => filterSet.id === id
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createFilterSet.fulfilled, (state, action) => {
        const filterSet = action.payload;
        state.savedFilterSets.active = filterSet;
        state.savedFilterSets.all.push(filterSet);

        // sync with workspaces
        const { activeId } = state.workspaces[state.explorerId];
        state.workspaces[state.explorerId].all[activeId] = filterSet;
      })
      .addCase(createFilterSet.rejected, (state) => {
        state.savedFilterSets.isError = true;
      })
      .addCase(deleteFilterSet.fulfilled, (state) => {
        const index = state.savedFilterSets.all.findIndex(
          ({ id }) => id === state.savedFilterSets.active.id
        );
        if (index !== undefined) state.savedFilterSets.all.splice(index, 1);
        state.savedFilterSets.active = undefined;
      })
      .addCase(deleteFilterSet.rejected, (state) => {
        state.savedFilterSets.isError = true;
      })
      .addCase(fetchFilterSets.fulfilled, (state, action) => {
        state.savedFilterSets.all = action.payload;
        state.savedFilterSets.active = state.savedFilterSets.all.find(
          ({ id }) => {
            const { activeId, all } = state.workspaces[state.explorerId];
            return id === all[activeId]?.id;
          }
        );
      })
      .addCase(fetchFilterSets.pending, (state) => {
        state.savedFilterSets.isError = false;
      })
      .addCase(fetchFilterSets.rejected, (state) => {
        state.savedFilterSets.isError = true;
      })
      .addCase(updateFilterSet.fulfilled, (state, action) => {
        const filterSet = {
          ...state.savedFilterSets.active,
          ...action.payload,
        };
        const index = state.savedFilterSets.all.findIndex(
          ({ id }) => id === filterSet.id
        );

        state.savedFilterSets.active = filterSet;
        state.savedFilterSets.all[index] = filterSet;

        // sync with workspaces
        const { activeId } = state.workspaces[state.explorerId];
        state.workspaces[state.explorerId].all[activeId] = filterSet;
      })
      .addCase(updateFilterSet.rejected, (state) => {
        state.savedFilterSets.isError = true;
      });
  },
});

export const {
  clearWorkspaceAllFilterSets,
  clearWorkspaceFilterSet,
  createWorkspaceFilterSet,
  duplicateWorkspaceFilterSet,
  loadWorkspaceFilterSet,
  removeWorkspaceFilterSet,
  updateExplorerFilter,
  updatePatientIds,
  useExplorerById,
  useFilterSetById,
  useWorkspaceFilterSet,
} = slice.actions;

export default slice.reducer;
