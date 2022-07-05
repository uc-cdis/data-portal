import { createSlice } from '@reduxjs/toolkit';
import { fetchIndexPageCounts } from './asyncThunks';
import { parseCounts } from './utils';

const slice = createSlice({
  name: 'index',
  initialState: /** @type {import('./types').IndexState} */ ({}),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchIndexPageCounts.fulfilled, (state, action) => {
      if (action.payload === null) return;

      const parsed = parseCounts(action.payload);

      state.countNames = parsed.countNames;
      state.overviewCounts = parsed.overviewCounts;
      state.projectList = parsed.projectList;
      state.updatedAt = Date.now();
    });
  },
});

export default slice.reducer;
