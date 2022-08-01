import { createSlice } from '@reduxjs/toolkit';
import { fetchDataVersion } from './asyncThunks';

const slice = createSlice({
  name: 'versionInfo',
  initialState: /** @type {import('./types').VersionInfoState} */ ({}),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDataVersion.fulfilled, (state, action) => {
      state.dataVersion = action.payload || '';
    });
  },
});

export default slice.reducer;
