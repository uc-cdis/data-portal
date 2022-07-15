import { createAsyncThunk } from '@reduxjs/toolkit';
import { getGQLFilter } from '../../GuppyComponents/Utils/queries';
import * as filterSetsAPI from './filterSetsAPI';
import * as survivalAnalysisAPI from './survivalAnalysisAPI';

/** @typedef {import('../../GuppyDataExplorer/types').ExplorerFilterSet} ExplorerFilterSet */
/** @typedef {import('../types').AppGetState} AppGetState */
/** @typedef {import('./types').ExplorerState} ExplorerState */

export const createFilterSet = createAsyncThunk(
  'explorer/createFilterSet',
  /** @param {ExplorerFilterSet} filterSet */
  async (filterSet, { getState, rejectWithValue }) => {
    const { explorer } = /** @type {AppGetState} */ (getState)();
    try {
      return filterSetsAPI.createNew(explorer.explorerId, filterSet);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const deleteFilterSet = createAsyncThunk(
  'explorer/deleteFilterSet',
  /** @param {ExplorerFilterSet} filterSet */
  async (filterSet, { getState, rejectWithValue }) => {
    const { explorer } = /** @type {AppGetState} */ (getState)();
    try {
      return filterSetsAPI.deleteById(explorer.explorerId, filterSet);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const fetchFilterSets = createAsyncThunk(
  'explorer/fetchFilterSets',
  async (_, { getState, rejectWithValue }) => {
    const { explorer } = /** @type {AppGetState} */ (getState)();
    try {
      return filterSetsAPI.fetchAll(explorer.explorerId);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const updateFilterSet = createAsyncThunk(
  'explorer/updateFilterSet',
  /** @param {ExplorerFilterSet} filterSet */
  async (filterSet, { getState, rejectWithValue }) => {
    const { explorer } = /** @type {AppGetState} */ (getState)();
    try {
      return filterSetsAPI.updateById(explorer.explorerId, filterSet);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const updateSurvivalResult = createAsyncThunk(
  'explorer/updateSurvivalResult',
  /**
   * @param {{
   *  efsFlag: boolean;
   *  shouldRefetch?: boolean
   *  usedFilterSets: ExplorerFilterSet[];
   * }} args
   */
  async (args, { getState, rejectWithValue }) => {
    const { explorer } = /** @type {AppGetState} */ (getState)();
    const result = explorer.survivalAnalysisResult.data;

    /** @type {ExplorerState['survivalAnalysisResult']['data']} */
    const cache = {};
    const filterSets = [];
    const usedFilterSetIds = [];
    for (const [index, filterSet] of args.usedFilterSets.entries()) {
      const { filter, id, name } = filterSet;
      usedFilterSetIds.push(id);
      if (result !== null && id in result && !args.shouldRefetch)
        cache[id] = { ...result[id], name: `${index + 1}. ${name}` };
      else
        filterSets.push({
          filters: getGQLFilter(filter) ?? {},
          id,
          name: `${index + 1}. ${name}`,
        });
    }

    if (filterSets.length === 0) return { data: cache };

    try {
      const newResult = await survivalAnalysisAPI.fetchResult({
        efsFlag: args.efsFlag,
        explorerId: explorer.explorerId,
        filterSets,
        result: explorer.config.survivalAnalysisConfig.result,
        usedFilterSetIds,
      });
      return { data: { ...cache, ...newResult } };
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);
