import { createSlice } from '@reduxjs/toolkit';
import { explorerConfig } from '../../localconf';
import {
  createFilterSet,
  deleteFilterSet,
  fetchFilterSets,
  updateFilterSet,
  updateSurvivalResult,
} from './asyncThunks';
import {
  checkIfFilterEmpty,
  getCurrentConfig,
  initializeWorkspaces,
  parseSurvivalResult,
} from './utils';

/**
 * @template T
 * @typedef {import('@reduxjs/toolkit').PayloadAction<T>} PayloadAction
 */
/** @typedef {import('./types').ExplorerFilter} ExplorerFilter */
/** @typedef {import('./types').ExplorerFilterSet} ExplorerFilterSet */
/** @typedef {import('./types').ExplorerState} ExplorerState */
/** @typedef {import('./types').ExplorerWorkspace} ExplorerWorkspace */
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
      data: [],
      isError: false,
    },
    survivalAnalysisResult: {
      data: null,
      error: null,
      isPending: false,
      parsed: parseSurvivalResult({
        config: initialConfig.survivalAnalysisConfig,
        result: null,
      }),
    },
    workspaces: initialWorkspaces,
  }),
  reducers: {
    clearWorkspaceAllFilterSets: {
      prepare: () => ({ payload: crypto.randomUUID() }),
      /** @param {PayloadAction<string>} action */
      reducer: (state, action) => {
        const newActiveId = action.payload;
        const filterSet = { filter: {} };

        state.workspaces[state.explorerId].activeId = newActiveId;
        state.workspaces[state.explorerId].all = { [newActiveId]: filterSet };

        // sync with exploreFilter
        state.explorerFilter = filterSet.filter;
      },
    },
    clearWorkspaceFilterSet(state) {
      const { activeId } = state.workspaces[state.explorerId];
      const filterSet = { filter: {} };

      state.workspaces[state.explorerId].all[activeId] = filterSet;

      // sync with exploreFilter
      state.explorerFilter = filterSet.filter;
    },
    createWorkspaceFilterSet: {
      prepare: () => ({ payload: crypto.randomUUID() }),
      /** @param {PayloadAction<string>} action */
      reducer: (state, action) => {
        const newActiveId = action.payload;
        const filterSet = { filter: {} };

        state.workspaces[state.explorerId].activeId = newActiveId;
        state.workspaces[state.explorerId].all[newActiveId] = filterSet;

        // sync with exploreFilter
        state.explorerFilter = filterSet.filter;
      },
    },
    duplicateWorkspaceFilterSet: {
      prepare: () => ({ payload: crypto.randomUUID() }),
      /** @param {PayloadAction<string>} action */
      reducer: (state, action) => {
        const newActiveId = action.payload;
        const { activeId } = state.workspaces[state.explorerId];
        const { filter } = state.workspaces[state.explorerId].all[activeId];
        const filterSet = { filter };

        state.workspaces[state.explorerId].activeId = newActiveId;
        state.workspaces[state.explorerId].all[newActiveId] = filterSet;

        // sync with exploreFilter
        state.explorerFilter = filterSet.filter;
      },
    },
    loadWorkspaceFilterSet: {
      /** @param {ExplorerFilterSet | UnsavedExplorerFilterSet} filterSet */
      prepare: (filterSet) => ({
        payload: { filterSet, newActiveId: crypto.randomUUID() },
      }),
      /**
       * @param {PayloadAction<{
       *  filterSet: ExplorerFilterSet | UnsavedExplorerFilterSet;
       *  newActiveId: string;
       * }>} action
       */
      reducer: (state, action) => {
        const { activeId } = state.workspaces[state.explorerId];
        const activeFilterSet =
          state.workspaces[state.explorerId].all[activeId];
        const shouldOverwrite = checkIfFilterEmpty(activeFilterSet.filter);
        const id = shouldOverwrite ? activeId : action.payload.newActiveId;
        const { filterSet } = action.payload;

        state.workspaces[state.explorerId].activeId = id;
        state.workspaces[state.explorerId].all[id] = filterSet;

        // sync with exploreFilter
        state.explorerFilter = filterSet.filter;
      },
    },
    removeWorkspaceFilterSet: {
      prepare: () => ({ payload: crypto.randomUUID() }),
      /** @param {PayloadAction<string>} action */
      reducer: (state, action) => {
        const { activeId, all } = state.workspaces[state.explorerId];
        delete state.workspaces[state.explorerId].all[activeId];

        const [firstEntry] = Object.entries(all);
        const [id, filterSet] = firstEntry ?? [action.payload, { filter: {} }];

        state.workspaces[state.explorerId].activeId = id;
        state.workspaces[state.explorerId].all[id] = filterSet;

        // sync with exploreFilter
        state.explorerFilter = filterSet.filter;
      },
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
    useExplorerById: {
      /** @param {ExplorerState['explorerId']} explorerId */
      prepare: (explorerId) => {
        const activeId = crypto.randomUUID();
        const newWorkspace = { activeId, all: { [activeId]: { filter: {} } } };
        return { payload: { explorerId, newWorkspace } };
      },
      /**
       * @param {PayloadAction<{
       *  explorerId: ExplorerState['explorerId'];
       *  newWorkspace: ExplorerWorkspace;
       * }>} action
       */
      reducer: (state, action) => {
        const { explorerId } = action.payload;
        state.config = getCurrentConfig(explorerId);
        state.explorerId = explorerId;

        // sync with workspaces
        let workspace = state.workspaces[explorerId];
        if (workspace === undefined) {
          workspace = action.payload.newWorkspace;
          state.workspaces[explorerId] = workspace;
        }

        // sync with explorerFilter
        state.explorerFilter = workspace.all[workspace.activeId].filter;
      },
    },
    /** @param {PayloadAction<string>} action */
    useWorkspaceFilterSet(state, action) {
      const newActiveId = action.payload;
      const { explorerId } = state;
      state.workspaces[explorerId].activeId = newActiveId;

      // sync with exploreFilter
      const { filter } = state.workspaces[explorerId].all[newActiveId];
      state.explorerFilter = filter;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createFilterSet.fulfilled, (state, action) => {
        const filterSet = action.payload;
        state.savedFilterSets.data.push(filterSet);

        // sync with workspaces
        const { activeId } = state.workspaces[state.explorerId];
        state.workspaces[state.explorerId].all[activeId] = filterSet;
      })
      .addCase(createFilterSet.rejected, (state) => {
        state.savedFilterSets.isError = true;
      })
      .addCase(deleteFilterSet.fulfilled, (state, action) => {
        const index = state.savedFilterSets.data.findIndex(
          ({ id }) => id === action.payload
        );
        if (index !== undefined) state.savedFilterSets.data.splice(index, 1);
      })
      .addCase(deleteFilterSet.rejected, (state) => {
        state.savedFilterSets.isError = true;
      })
      .addCase(fetchFilterSets.fulfilled, (state, action) => {
        state.savedFilterSets.data = action.payload;
      })
      .addCase(fetchFilterSets.pending, (state) => {
        state.savedFilterSets.isError = false;
      })
      .addCase(fetchFilterSets.rejected, (state) => {
        state.savedFilterSets.isError = true;
      })
      .addCase(updateFilterSet.fulfilled, (state, action) => {
        const filterSet = action.payload;
        const index = state.savedFilterSets.data.findIndex(
          ({ id }) => id === filterSet.id
        );
        state.savedFilterSets.data[index] = filterSet;

        // sync with workspaces
        const { activeId } = state.workspaces[state.explorerId];
        state.workspaces[state.explorerId].all[activeId] = filterSet;
      })
      .addCase(updateFilterSet.rejected, (state) => {
        state.savedFilterSets.isError = true;
      })
      .addCase(updateSurvivalResult.fulfilled, (state, action) => {
        const result = action.payload.data;
        state.survivalAnalysisResult.data = result;
        state.survivalAnalysisResult.isPending = false;
        state.survivalAnalysisResult.parsed = parseSurvivalResult({
          config: state.config.survivalAnalysisConfig,
          result,
        });
      })
      .addCase(updateSurvivalResult.pending, (state) => {
        state.survivalAnalysisResult.error = null;
        state.survivalAnalysisResult.isPending = true;
      })
      .addCase(updateSurvivalResult.rejected, (state, action) => {
        state.survivalAnalysisResult.data = null;
        state.survivalAnalysisResult.error = Error(String(action.payload));
        state.survivalAnalysisResult.isPending = false;
        state.survivalAnalysisResult.parsed = {};
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
  useWorkspaceFilterSet,
} = slice.actions;

export default slice.reducer;
