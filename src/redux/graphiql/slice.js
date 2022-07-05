import { createSlice } from '@reduxjs/toolkit';
import { fetchGuppySchema, fetchSchema } from './asyncThunks';

const slice = createSlice({
  name: 'graphiql',
  initialState: /** @type {import('./types').GraphiqlState} */ ({}),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGuppySchema.fulfilled, (state, action) => {
        if (action.payload !== null) state.guppySchema = action.payload;
      })
      .addCase(fetchSchema.fulfilled, (state, action) => {
        if (action.payload !== null) state.schema = action.payload;
      });
  },
});

export default slice.reducer;
