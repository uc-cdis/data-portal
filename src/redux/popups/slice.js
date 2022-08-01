import { createSlice } from '@reduxjs/toolkit';

/**
 * @template T
 * @typedef {import('@reduxjs/toolkit').PayloadAction<T>} PayloadAction
 */
/** @typedef {import('./types').PopupState} PopupState */

const slice = createSlice({
  name: 'popups',
  initialState: /** @type {PopupState} */ ({}),
  reducers: {
    /** @param {PayloadAction<Partial<PopupState>>} action */
    updatePopup(state, action) {
      for (const [key, value] of Object.entries(action.payload))
        state[key] = value;
    },
  },
});

export const { updatePopup } = slice.actions;

export default slice.reducer;
