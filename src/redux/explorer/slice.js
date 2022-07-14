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

      state.workspaces[state.explorerId].active = { id, filterSet };
      state.workspaces[state.explorerId].all = { [id]: filterSet };

      // sync with exploreFilter
      state.explorerFilter = filterSet.filter;
    },
    clearWorkspaceFilterSet(state) {
      const { id } = state.workspaces[state.explorerId].active;
      const filterSet = { filter: {} };

      state.workspaces[state.explorerId].active = { id, filterSet };
      state.workspaces[state.explorerId].all[id] = filterSet;

      // sync with exploreFilter
      state.explorerFilter = filterSet.filter;
    },
    createWorkspaceFilterSet(state) {
      const id = crypto.randomUUID();
      const filterSet = { filter: {} };

      state.workspaces[state.explorerId].active = { id, filterSet };
      state.workspaces[state.explorerId].all[id] = filterSet;

      // sync with exploreFilter
      state.explorerFilter = filterSet.filter;
    },
    duplicateWorkspaceFilterSet(state) {
      const id = crypto.randomUUID();
      const { filter } = state.workspaces[state.explorerId].active.filterSet;
      const filterSet = { filter };

      state.workspaces[state.explorerId].active = { id, filterSet };
      state.workspaces[state.explorerId].all[id] = filterSet;

      // sync with exploreFilter
      state.explorerFilter = filterSet.filter;
    },
    /** @param {PayloadAction<ExplorerFilterSet | UnsavedExplorerFilterSet>} action */
    loadWorkspaceFilterSet(state, action) {
      const { active } = state.workspaces[state.explorerId];
      const shouldOverwrite = checkIfFilterEmpty(active.filterSet.filter);
      const id = shouldOverwrite ? active.id : crypto.randomUUID();
      const filterSet = action.payload;

      state.workspaces[state.explorerId].active = { id, filterSet };
      state.workspaces[state.explorerId].all[id] = filterSet;

      // sync with exploreFilter
      state.explorerFilter = filterSet.filter;

      // sync with savedFilterSets
      state.savedFilterSets.active = state.savedFilterSets.all.find(
        (fs) => fs.id === filterSet.id
      );
    },
    removeWorkspaceFilterSet(state) {
      const { active, all } = state.workspaces[state.explorerId];
      delete state.workspaces[state.explorerId].all[active.id];

      const [firstEntry] = Object.entries(all);
      const [id, filterSet] = firstEntry ?? [
        crypto.randomUUID(),
        { filter: {} },
      ];

      state.workspaces[state.explorerId].active = { id, filterSet };
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
      const { id } = state.workspaces[state.explorerId].active;
      state.workspaces[state.explorerId].all[id].filter = newFilter;
      state.workspaces[state.explorerId].active.filterSet.filter = newFilter;
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

        workspace = { active: { id, filterSet }, all: { [id]: filterSet } };
        state.workspaces[explorerId] = workspace;
      }

      // sync with explorerFilter
      const { filterSet } = workspace.active;
      state.explorerFilter = filterSet.filter;
    },
    /** @param {PayloadAction<ExplorerState['savedFilterSets']['active']['id']>} action */
    useFilterSetById(state, action) {
      state.savedFilterSets.active = state.savedFilterSets.all.find(
        ({ id }) => id === action.payload
      );
    },
    /** @param {PayloadAction<string>} action */
    useWorkspaceFilterSet(state, action) {
      const id = action.payload;
      const filterSet = state.workspaces[state.explorerId].all[id];

      state.workspaces[state.explorerId].active = { id, filterSet };

      // sync with exploreFilter
      state.explorerFilter = filterSet.filter;

      // sync with savedFilterSets
      state.savedFilterSets.active = state.savedFilterSets.all.find(
        (fs) => fs.id === filterSet.id
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
        const { id } = state.workspaces[state.explorerId].active;
        state.workspaces[state.explorerId].active.filterSet = filterSet;
        state.workspaces[state.explorerId].all[id] = filterSet;
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
          ({ id }) =>
            id === state.workspaces[state.explorerId].active?.filterSet?.id
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
        const { id } = state.workspaces[state.explorerId].active;
        state.workspaces[state.explorerId].active = { id, filterSet };
        state.workspaces[state.explorerId].all[id] = filterSet;
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
