import { createSlice } from '@reduxjs/toolkit';
import { createKey, deleteKey, fetchAccess } from './asyncThunks';

/**
 * @template T
 * @typedef {import('@reduxjs/toolkit').PayloadAction<T>} PayloadAction
 */
/** @typedef {import('./types').UserProfileState} UserProfileState */

const slice = createSlice({
  name: 'userProfile',
  initialState: /** @type {UserProfileState} */ ({}),
  reducers: {
    clearCreationSession(state) {
      state.delete_error = null;
    },
    clearDeleteKeySession(state) {
      state.delete_error = null;
      state.request_delete_key = null;
    },
    /** @param {PayloadAction<Pick<UserProfileState, 'requestDeleteExp' | 'requestDeleteJTI'>>} action */
    requestDeleteKey(state, action) {
      state.requestDeleteExp = action.payload.requestDeleteExp;
      state.requestDeleteJTI = action.payload.requestDeleteJTI;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccess.fulfilled, (state, action) => {
        state.jtis = action.payload;
      })
      .addCase(fetchAccess.rejected, (state, action) => {
        state.userProfile_error = action.payload;
      })
      .addCase(createKey.fulfilled, (state, action) => {
        state.create_error = null;
        state.refreshCred = action.payload;
        state.strRefreshCred = JSON.stringify(action.payload, null, '\t');
      })
      .addCase(createKey.rejected, (state, action) => {
        state.create_error = `Error: ${action.payload}`;
      })
      .addCase(deleteKey.fulfilled, (state) => {
        state.delete_error = null;
        state.request_delete_key = null;
      })
      .addCase(deleteKey.rejected, (state, action) => {
        state.delete_error = action.payload;
      });
  },
});

export const { clearCreationSession, clearDeleteKeySession, requestDeleteKey } =
  slice.actions;

export default slice.reducer;
