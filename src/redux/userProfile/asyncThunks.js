import { createAsyncThunk } from '@reduxjs/toolkit';
import { credentialCdisPath } from '../../localconf';
import { fetchWithCreds } from '../../utils.fetch';
import { updatePopup } from '../popups/slice';
import { requestErrored } from '../status/slice';

export const fetchAccess = createAsyncThunk(
  'userProfile/fetchAccess',
  async (_, { dispatch, rejectWithValue }) => {
    const { data, status } = await fetchWithCreds({
      path: credentialCdisPath,
      onError: () => dispatch(requestErrored()),
    });
    if (status !== 200) throw rejectWithValue(data.error);
    return data.jtis;
  }
);

export const createKey = createAsyncThunk(
  'userProfile/createKey',
  /** @param {string} path */
  async (path, { dispatch, rejectWithValue }) => {
    const { data, status } = await fetchWithCreds({
      path,
      method: 'POST',
      body: JSON.stringify({ scope: ['data', 'user'] }),
      onError: () => dispatch(requestErrored()),
      customHeaders: new Headers({ 'Content-Type': 'application/json' }),
    });

    dispatch(updatePopup({ saveTokenPopup: true }));
    if (status !== 200) throw rejectWithValue(data.error || data.message);

    dispatch(fetchAccess());
    return data;
  }
);

export const deleteKey = createAsyncThunk(
  'userProfile/deleteKey',
  /**
   * @param {Object} args
   * @param {number} args.exp
   * @param {string} args.jti
   * @param {string} args.path
   */
  async ({ exp, jti, path }, { dispatch, rejectWithValue }) => {
    const { data, status } = await fetchWithCreds({
      path: path + jti,
      method: 'DELETE',
      body: JSON.stringify({ exp }),
      onError: () => dispatch(requestErrored()),
    });

    if (status !== 204) throw rejectWithValue(data);

    dispatch(updatePopup({ deleteTokenPopup: false }));
    dispatch(fetchAccess());
  }
);
