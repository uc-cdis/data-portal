import { createSlice } from '@reduxjs/toolkit';
import { checkJobStatus, dispatchJob } from './asyncThunks';

/**
 * @template T
 * @typedef {import('@reduxjs/toolkit').PayloadAction<T>} PayloadAction
 */
/** @typedef {import('./types').KubeState} KubeState */

const slice = createSlice({
  name: 'kube',
  initialState: /** @type {KubeState} */ ({}),
  reducers: {
    /** @param {PayloadAction<KubeState['job']>} action */
    recieveJobDispatch(state, action) {
      state.job = action.payload;
    },
    resetJob(state) {
      state.job = null;
      state.jobStatusInterval = null;
      state.resultURL = null;
    },
    /** @param {PayloadAction<KubeState['jobStatusInterval']>} action */
    setJobStatusInterval(state, action) {
      state.jobStatusInterval = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(dispatchJob.fulfilled, (state, action) => {
        state.job = action.payload;
      })
      .addCase(checkJobStatus.fulfilled, (state, action) => {
        state.job = action.payload.job;
        state.resultURL = action.payload.resultURL;
      });
  },
});

export const { recieveJobDispatch, resetJob, setJobStatusInterval } =
  slice.actions;

export default slice.reducer;
