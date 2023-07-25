import { createSlice } from '@reduxjs/toolkit';
import { FILTER_TYPE } from '../../GuppyComponents/Utils/const';
import { explorerConfig } from '../../localconf';
import {
  createFilterSet,
  deleteFilterSet,
  fetchFilterSets,
  fetchSurvivalConfig,
  updateFilterSet,
  updateSurvivalResult,
} from './asyncThunks';
import {
  checkIfFilterEmpty,
  dereferenceFilter,
  getCurrentConfig,
  initializeWorkspaces,
  parseSurvivalResult,
  updateFilterRefs,
} from './utils';

/**
 * @template T
 * @typedef {import('@reduxjs/toolkit').PayloadAction<T>} PayloadAction
 */
/** @typedef {import('./types').ExplorerFilter} ExplorerFilter */
/** @typedef {import('./types').ExplorerFilterSet} ExplorerFilterSet */
/** @typedef {import('./types').ExplorerState} ExplorerState */
/** @typedef {import('./types').ExplorerWorkspace} ExplorerWorkspace */

/** @type {ExplorerState['explorerIds']} */
const explorerIds = [];
for (const { id } of explorerConfig) explorerIds.push(id);
const initialExplorerId = explorerIds[0];
const initialConfig = getCurrentConfig(initialExplorerId);
const initialPatientIds = initialConfig.patientIdsConfig?.filter
  ? []
  : undefined;
const initialWorkspaces = initializeWorkspaces(initialExplorerId);
const initialExplorerFilter = dereferenceFilter(
  initialWorkspaces[initialExplorerId].all[
    initialWorkspaces[initialExplorerId].activeId
  ].filter,
  initialWorkspaces[initialExplorerId]
);

const slice = createSlice({
  name: 'explorer',
  initialState: /** @type {ExplorerState} */ ({
    config: initialConfig,
    explorerFilter: initialExplorerFilter,
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
      staleFilterSetIds: [],
      usedFilterSetIds: [],
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
        const workspace = state.workspaces[state.explorerId];
        state.explorerFilter = dereferenceFilter(filterSet.filter, workspace);
      },
    },
    loadWorkspaceFilterSet: {
      /** @param {ExplorerFilterSet} filterSet */
      prepare: (filterSet) => ({
        payload: { filterSet, newActiveId: crypto.randomUUID() },
      }),
      /**
       * @param {PayloadAction<{
       *  filterSet: ExplorerFilterSet;
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
        const workspace = state.workspaces[state.explorerId];
        state.explorerFilter = dereferenceFilter(filterSet.filter, workspace);
      },
    },
    removeWorkspaceFilterSet: {
      prepare: () => ({ payload: crypto.randomUUID() }),
      /** @param {PayloadAction<string>} action */
      reducer: (state, action) => {
        const { activeId, all } = state.workspaces[state.explorerId]

        delete state.workspaces[state.explorerId].all[activeId];

        const [firstEntry] = Object.entries(all);
        const [id, filterSet] = firstEntry ?? [action.payload, { filter: {} }];

        state.workspaces[state.explorerId].activeId = id;
        state.workspaces[state.explorerId].all[id] = filterSet;
        updateFilterRefs(state.workspaces[state.explorerId]);

        // sync with exploreFilter
        const workspace = state.workspaces[state.explorerId];
        state.explorerFilter = dereferenceFilter(filterSet.filter, workspace);
      },
    },
    /** @param {PayloadAction<ExplorerState['explorerFilter']>} action */
    updateExplorerFilter(state, action) {
      const newFilter = {
        /** @type {ExplorerFilter['__combineMode']} */
        __combineMode: 'AND',
        __type: FILTER_TYPE.STANDARD,
        ...action.payload,
      };
      const fields = Object.keys(newFilter.value ?? {});
      if (fields.length > 0) {
        const allSearchFieldSet = new Set();
        for (const { searchFields } of state.config.filterConfig.tabs)
          for (const field of searchFields ?? []) allSearchFieldSet.add(field);

        if (allSearchFieldSet.size > 0) {
          /** @type {ExplorerFilter['value']} */
          const filterWithoutSearchFields = {};
          for (const field of fields)
            if (!allSearchFieldSet.has(field))
              filterWithoutSearchFields[field] = newFilter.value[field];

          if (Object.keys(filterWithoutSearchFields).length > 0)
            newFilter.value = filterWithoutSearchFields;
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
        state.config = {
          ...getCurrentConfig(explorerId),
          // keep survival config
          survivalAnalysisConfig: state.config.survivalAnalysisConfig,
        };
        state.explorerId = explorerId;

        // sync with workspaces
        let workspace = state.workspaces[explorerId];
        if (workspace === undefined) {
          workspace = action.payload.newWorkspace;
          state.workspaces[explorerId] = workspace;
        }

        // sync with explorerFilter
        const { filter } = workspace.all[workspace.activeId];
        state.explorerFilter = dereferenceFilter(filter, workspace);
      },
    },
    /** @param {PayloadAction<string>} action */
    useWorkspaceFilterSet(state, action) {
      const newActiveId = action.payload;
      const { explorerId } = state;
      state.workspaces[explorerId].activeId = newActiveId;

      // sync with exploreFilter
      const workspace = state.workspaces[explorerId];
      const { filter } = workspace.all[newActiveId];
      state.explorerFilter = dereferenceFilter(filter, workspace);
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

        // sync with survival result
        const { id } = filterSet;
        if (state.survivalAnalysisResult.usedFilterSetIds.includes(id))
          state.survivalAnalysisResult.staleFilterSetIds.push(id);
      })
      .addCase(updateFilterSet.rejected, (state) => {
        state.savedFilterSets.isError = true;
      })
      .addCase(updateSurvivalResult.fulfilled, (state, action) => {
        const { data, usedFilterSetIds } = action.payload;
        state.survivalAnalysisResult.data = data;
        state.survivalAnalysisResult.isPending = false;
        state.survivalAnalysisResult.parsed = parseSurvivalResult({
          config: state.config.survivalAnalysisConfig,
          result: data,
        });
        state.survivalAnalysisResult.staleFilterSetIds = [];
        state.survivalAnalysisResult.usedFilterSetIds = usedFilterSetIds;
      })
      .addCase(updateSurvivalResult.pending, (state) => {
        state.survivalAnalysisResult.error = null;
        state.survivalAnalysisResult.isPending = true;
      })
      .addCase(updateSurvivalResult.rejected, (state, action) => {
        state.survivalAnalysisResult.data = null;
        state.survivalAnalysisResult.error = action.payload;
        state.survivalAnalysisResult.isPending = false;
        state.survivalAnalysisResult.parsed = {};
        state.survivalAnalysisResult.staleFilterSetIds = [];
        state.survivalAnalysisResult.usedFilterSetIds = [];
      })
      .addCase(fetchSurvivalConfig.fulfilled, (state, action) => {
        const config = action.payload;
        if (config === undefined) return;

        state.config.survivalAnalysisConfig = config;
        state.survivalAnalysisResult.parsed = parseSurvivalResult({
          config,
          result: null,
        });
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
