import { createAsyncThunk } from '@reduxjs/toolkit';
import { getGQLFilter } from '../../GuppyComponents/Utils/queries';
import * as filterSetsAPI from './filterSetsAPI';
import * as survivalAnalysisAPI from './survivalAnalysisAPI';

/** @typedef {import('../../GuppyDataExplorer/types').SavedExplorerFilterSet} SavedExplorerFilterSet */
/** @typedef {import('../types').AppGetState} AppGetState */
/** @typedef {import('./types').ExplorerState} ExplorerState */

export const createFilterSet = createAsyncThunk(
  'explorer/createFilterSet',
  /** @param {SavedExplorerFilterSet} filterSet */
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
  /** @param {SavedExplorerFilterSet} filterSet */
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
  /** @param {SavedExplorerFilterSet} filterSet */
  async (filterSet, { getState, rejectWithValue }) => {
    const { explorer } = /** @type {AppGetState} */ (getState)();
    try {
      return filterSetsAPI.updateById(explorer.explorerId, filterSet);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const fetchFederationQuery = createAsyncThunk(
  'explorer/fetchFederationQuery',
  /** @param {string} token */
  async (token, { getState, rejectWithValue }) => {
    try {
      return filterSetsAPI.fetchFederationQueryWithToken(token);
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
   *  usedFilterSets: (SavedExplorerFilterSet & { isStale?: boolean })[];
   * }} args
   */
  async (args, { getState, rejectWithValue }) => {
    const { explorer } = /** @type {AppGetState} */ (getState)();
    const result = explorer.survivalAnalysisResult.data ?? {};

    /** @type {ExplorerState['survivalAnalysisResult']['data']} */
    const cache = {};
    const filterSets = [];
    const usedFilterSetIds = [];
    for (const [index, filterSet] of args.usedFilterSets.entries()) {
      const { filter, id, isStale, name: _name } = filterSet;
      const name = `${index + 1}. ${_name}`;
      const shouldUseCache = id in result && !isStale && !args.shouldRefetch;
      if (shouldUseCache) cache[id] = { ...result[id], name };
      else filterSets.push({ filters: getGQLFilter(filter) ?? {}, id, name });

      usedFilterSetIds.push(id);
    }

    if (filterSets.length === 0) return { data: cache, usedFilterSetIds };

    try {
      const newResult = await survivalAnalysisAPI.fetchResult({
        efsFlag: args.efsFlag,
        explorerId: explorer.explorerId,
        filterSets,
        usedFilterSetIds,
      });
      return { data: { ...cache, ...newResult }, usedFilterSetIds };
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

let shouldFetchSurvivalConfig = true;
export const fetchSurvivalConfig = createAsyncThunk(
  'explorer/fetchSurvivalConfig',
  async () => {
    if (!shouldFetchSurvivalConfig) return undefined;

    shouldFetchSurvivalConfig = false;
    return survivalAnalysisAPI.fetchConfig();
  }
);
