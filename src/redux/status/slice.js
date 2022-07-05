import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'status',
  initialState: /** @type {import('./types').StatusState} */ ({}),
  reducers: {
    requestErrored(state, action) {
      state.error_type = action.payload;
      state.request_state = 'error';
    },
  },
});

export const { requestErrored } = slice.actions;

export default slice.reducer;
