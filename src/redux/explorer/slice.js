import { createSlice } from '@reduxjs/toolkit';
import { explorerConfig } from '../../localconf';
import {
  createFilterSet,
  deleteFilterSet,
  fetchFilterSets,
  updateFilterSet,
} from './asyncThunks';
import { getCurrentConfig } from './utils';

/**
 * @template T
 * @typedef {import('@reduxjs/toolkit').PayloadAction<T>} PayloadAction
 */
/** @typedef {import('./types').ExplorerFilter} ExplorerFilter */
/** @typedef {import('./types').ExplorerState} ExplorerState */

/** @type {ExplorerState['explorerIds']} */
const explorerIds = [];
for (const { id } of explorerConfig) explorerIds.push(id);
const initialExplorerId = explorerIds[0];
const initialConfig = getCurrentConfig(initialExplorerId);
const initialPatientIds = initialConfig.patientIdsConfig?.filter
  ? []
  : undefined;

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
  }),
  reducers: {
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
    },
    /** @param {PayloadAction<ExplorerState['patientIds']>} action */
    updatePatientIds(state, action) {
      if (state.config.patientIdsConfig?.filter !== undefined)
        state.patientIds = action.payload;
    },
    /** @param {PayloadAction<ExplorerState['explorerId']>} action */
    useExplorerById(state, action) {
      state.config = getCurrentConfig(action.payload);
      state.explorerFilter = {};
      state.explorerId = action.payload;
    },
    /** @param {PayloadAction<ExplorerState['savedFilterSets']['active']['id']>} action */
    useFilterSetById(state, action) {
      state.savedFilterSets.active = state.savedFilterSets.all.find(
        ({ id }) => id === action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createFilterSet.fulfilled, (state, action) => {
        const filterSet = action.payload;
        state.savedFilterSets.active = filterSet;
        state.savedFilterSets.all.push(filterSet);
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
          ({ id }) => id === state.savedFilterSets.active?.id
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
      })
      .addCase(updateFilterSet.rejected, (state) => {
        state.savedFilterSets.isError = true;
      });
  },
});

export const {
  updateExplorerFilter,
  updatePatientIds,
  useExplorerById,
  useFilterSetById,
} = slice.actions;

export default slice.reducer;
