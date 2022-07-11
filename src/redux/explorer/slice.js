import { createSlice } from '@reduxjs/toolkit';
import { explorerConfig } from '../../localconf';
import { getCurrentConfig } from './utils';

/**
 * @template T
 * @typedef {import('@reduxjs/toolkit').PayloadAction<T>} PayloadAction
 */
/** @typedef {import('./types').ExplorerState} ExplorerState */

/** @type {ExplorerState['explorerIds']} */
const explorerIds = [];
for (const { id } of explorerConfig) explorerIds.push(id);
const initialExplorerId = explorerIds[0];

const slice = createSlice({
  name: 'explorer',
  initialState: /** @type {ExplorerState} */ ({
    explorerId: initialExplorerId,
    explorerIds,
    config: getCurrentConfig(initialExplorerId),
  }),
  reducers: {
    /** @param {PayloadAction<ExplorerState['explorerId']>} action */
    setExplorerId(state, action) {
      state.explorerId = action.payload;
      state.config = getCurrentConfig(action.payload);
    },
  },
});

export const { setExplorerId } = slice.actions;

export default slice.reducer;
