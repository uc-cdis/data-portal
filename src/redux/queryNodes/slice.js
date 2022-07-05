import { createSlice } from '@reduxjs/toolkit';
import { deleteNode, fetchQueryNode, submitSearchForm } from './asyncThunks';

/**
 * @template T
 * @typedef {import('@reduxjs/toolkit').PayloadAction<T>} PayloadAction
 */
/** @typedef {import('./types').QueryNodeState} QueryNodeState */

const slice = createSlice({
  name: 'queryNodes',
  initialState: /** @type {QueryNodeState} */ ({}),
  reducers: {
    clearDeleteSession(state) {
      state.query_node = null;
      state.delete_error = null;
    },
    clearQueryNodes(state) {
      state.query_node = null;
    },
    /** @param {PayloadAction<QueryNodeState['stored_node_info']>} action */
    storeNodeInfo(state, action) {
      state.stored_node_info = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteNode.fulfilled, (state, action) => {
        state.query_node = null;
        state.delete_error = null;

        const [nodeType] = Object.keys(state.search_result.data);
        function isNotDeleted({ id }) {
          return id !== action.payload;
        }
        /** Filter out deleted from search result data */
        state.search_result.data[nodeType] =
          state.search_result.data[nodeType].filter(isNotDeleted);
      })
      .addCase(deleteNode.rejected, (state, action) => {
        state.delete_error = action.payload;
      })
      .addCase(fetchQueryNode.fulfilled, (state, action) => {
        state.query_node = action.payload;
      })
      .addCase(submitSearchForm.fulfilled, (state, action) => {
        state.search_result = action.payload.search_result;
        state.search_status = action.payload.search_status;
      });
  },
});

export const { clearDeleteSession, clearQueryNodes, storeNodeInfo } =
  slice.actions;

export default slice.reducer;
