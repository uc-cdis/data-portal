import { createSlice } from '@reduxjs/toolkit';
import { fetchUserAccess } from './asyncThunks';

const slice = createSlice({
  name: 'userAccess',
  initialState: /** @type {import('./types').UserAccessState} */ ({}),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserAccess.fulfilled, (state, action) => {
      for (const [k, v] of Object.entries(action.payload)) {
        state[k] = v;
      }
    });
  },
});

export default slice.reducer;
