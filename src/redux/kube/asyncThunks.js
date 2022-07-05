import { createAsyncThunk } from '@reduxjs/toolkit';
import { jobapiPath } from '../../localconf';
import { fetchWithCreds } from '../../utils.fetch';
import { requestErrored } from '../status/slice';
import { fetchUserErrored } from '../user/slice';

/** @typedef {import('../types').RootState} RootState */

export const checkJobStatus = createAsyncThunk(
  'kube/checkJobStatus',
  async (_, { dispatch, getState }) => {
    try {
      const state = /** @type {RootState} */ (getState());
      const jobId = state.kube.job?.uid ?? null;
      const { status, data } = await fetchWithCreds({
        path: `${jobapiPath}status?UID=${jobId}`,
        method: 'GET',
        onError: () => dispatch(requestErrored()),
      });

      // stop fetching job status once it stops running
      if (data.status !== 'Running')
        window.clearInterval(state.kube.jobStatusInterval);

      if (status !== 200) throw data;

      const { resultURL, ...job } = data;
      return /** @type {Pick<RootState['kube'], 'job' | 'resultURL'> } */ ({
        job,
        resultURL,
      });
    } catch (e) {
      dispatch(fetchUserErrored(e));
      return undefined;
    }
  }
);

export const dispatchJob = createAsyncThunk(
  'kube/dispatchJob',
  /** @param {Object} body */
  async (body, { dispatch }) => {
    try {
      const { status, data } = await fetchWithCreds({
        path: `${jobapiPath}dispatch`,
        body: JSON.stringify(body),
        method: 'POST',
        onError: () => dispatch(requestErrored()),
      });

      if (status !== 200) throw data;

      return /** @type {RootState['kube']['job']} */ (data);
    } catch (e) {
      dispatch(fetchUserErrored(e));
      return null;
    }
  }
);
