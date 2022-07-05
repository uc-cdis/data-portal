import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchGraphvizLayout = createAsyncThunk(
  'ddgraph/fetchGraphvizLayout',
  async (_, { getState }) => {
    const state = /** @type {import('../types').RootState} */ (getState());
    if (state.ddgraph.graphvizLayout === null) return Promise.resolve(null);

    return (await import('../../../data/graphvizLayout.json')).default;
  }
);
