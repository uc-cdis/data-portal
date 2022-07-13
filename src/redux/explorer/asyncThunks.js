import { createAsyncThunk } from '@reduxjs/toolkit';
import * as filterSetsAPI from './filterSetsAPI';

/** @typedef {import('../../GuppyDataExplorer/types').ExplorerFilterSet} ExplorerFilterSet */
/** @typedef {import('../types').AppGetState} AppGetState */

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
