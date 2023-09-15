import { createSlice } from '@reduxjs/toolkit';
import { fetchUser, adminFetchUsers } from './asyncThunks';

/**
 * @template T
 * @typedef {import('@reduxjs/toolkit').PayloadAction<T>} PayloadAction
 */
/** @typedef {import('./types').UserState} UserState */
/** @typedef {import('./types').User} User */

const slice = createSlice({
  name: 'user',
  initialState: /** @type {UserState} */ ({}),
  reducers: {
    /** @param {PayloadAction<UserState['fetch_error']>} action */
    fetchUserErrored(state, action) {
      state.fetch_error = action.payload;
      state.fetched_user = true;
    },
    /** @param {PayloadAction<User>} action */
    receiveUser(state, action) {
      for (const [k, v] of Object.entries(action.payload)) {
        state[k] = v;
      }
      state.fetched_user = true;
      state.lastAuthMs = Date.now();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        if (action.payload.status === 200) {
          for (const [k, v] of Object.entries(action.payload.data)) {
            state[k] = v;
          }
          state.fetched_user = true;
          state.lastAuthMs = Date.now();
        }
      })
      .addCase(
        fetchUser.rejected,
        /** @param {PayloadAction<any>} action */ (state, action) => {
          state.fetch_error = action.payload;
          state.fetched_user = true;
        }
      )
      .addCase(adminFetchUsers.fulfilled, (state, action) => {
        if (action.payload.status === 200) {
          state.admin_user_list = action.payload.data.users;
        }
      })
  },
});

export const { fetchUserErrored, receiveUser } = slice.actions;

export default slice.reducer;
