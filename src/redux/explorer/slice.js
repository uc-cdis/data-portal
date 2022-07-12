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
    filterSetActive: undefined,
    filterSets: [],
    filterSetsErrored: false,
    patientIds: initialPatientIds,
  }),
  reducers: {
    /** @param {PayloadAction<ExplorerState['explorerId']>} action */
    setExplorerId(state, action) {
      state.explorerId = action.payload;
      state.config = getCurrentConfig(action.payload);
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
    },
    /** @param {PayloadAction<ExplorerState['patientIds']>} action */
    updatePatientIds(state, action) {
      if (state.config.patientIdsConfig?.filter !== undefined)
        state.patientIds = action.payload;
    },
    /** @param {PayloadAction<ExplorerState['filterSetActive']['id']>} action */
    useFilterSetById(state, action) {
      state.filterSetActive = state.filterSets.find(
        ({ id }) => id === action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createFilterSet.rejected, (state) => {
        state.filterSetsErrored = true;
      })
      .addCase(deleteFilterSet.rejected, (state) => {
        state.filterSetsErrored = true;
      })
      .addCase(fetchFilterSets.fulfilled, (state, action) => {
        state.filterSets = action.payload;
        state.filterSetActive = state.filterSets.find(
          ({ id }) => id === state.filterSetActive?.id
        );
      })
      .addCase(fetchFilterSets.pending, (state) => {
        state.filterSetsErrored = false;
      })
      .addCase(fetchFilterSets.rejected, (state) => {
        state.filterSetsErrored = true;
      })
      .addCase(updateFilterSet.rejected, (state) => {
        state.filterSetsErrored = true;
      });
  },
});

export const {
  setExplorerId,
  updateExplorerFilter,
  updatePatientIds,
  useFilterSetById,
} = slice.actions;

export default slice.reducer;
