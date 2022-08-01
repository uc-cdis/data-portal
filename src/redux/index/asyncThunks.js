import { createAsyncThunk } from '@reduxjs/toolkit';
import { consortiumList } from '../../params';
import { fetchWithCreds } from '../../utils.fetch';

export const fetchIndexPageCounts = createAsyncThunk(
  'index/fetchIndexPageCounts',
  async (_, { getState }) => {
    const state = /** @type {import('../types').RootState} */ (getState());
    const shouldFetch =
      state.index.updatedAt === undefined ||
      state.index.updatedAt + 300000 < Date.now();
    if (!shouldFetch) return null;

    const { data, response, status } = await fetchWithCreds({
      path: '/analysis/tools/counts',
      method: 'POST',
      body: JSON.stringify({ consortiumList }),
    });

    if (status !== 200) {
      console.error(`WARNING: failed to with status ${response.statusText}`);
      return null;
    }

    return data;
  }
);
