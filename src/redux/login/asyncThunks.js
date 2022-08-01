import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginPath } from '../../localconf';
import { fetchWithCreds } from '../../utils.fetch';
import { requestErrored } from '../status/slice';

/** @typedef {import('../types').RootState['login']['providers']} Providers */

/** @type {Providers} */
const DEFAULT_PROVIDERS = [
  {
    idp: 'google',
    name: 'Google OAuth',
    urls: [{ name: 'Google OAuth', url: `${loginPath}google/` }],
  },
];

export const fetchLoginProviders = createAsyncThunk(
  'login/fetchLoginProviders',
  async (_, { dispatch, rejectWithValue }) => {
    const { data, status } = await fetchWithCreds({
      path: loginPath,
      onError: () => dispatch(requestErrored()),
    });

    if (status === 404) return DEFAULT_PROVIDERS;
    if (status === 200) return /** @type {Providers} */ (data.providers);
    throw rejectWithValue(data.error);
  }
);
