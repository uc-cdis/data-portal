import { createSlice } from '@reduxjs/toolkit';
import { fetchDataVersion, fetchSurvivalCurveVersion } from './asyncThunks';

const slice = createSlice({
  name: 'versionInfo',
  initialState: /** @type {import("./types").VersionInfoState} */ ({}),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDataVersion.fulfilled, (state, action) => {
      state.dataVersion = action.payload || '';
    });
    builder.addCase(fetchSurvivalCurveVersion.fulfilled, (state, action) => {
      state.survivalCurveVersion = action.payload?.version || '';
    });
  },
});

export default slice.reducer;
