import { createSlice } from '@reduxjs/toolkit';
import { fetchLoginProviders } from './asyncThunks';

const slice = createSlice({
  name: 'login',
  initialState: /** @type {import('./types').LoginState} */ ({}),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoginProviders.fulfilled, (state, action) => {
        state.providers = action.payload;
      })
      .addCase(fetchLoginProviders.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default slice.reducer;
