import ReactGA from 'react-ga4';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { hostname, userapiPath } from '../../localconf';
import { fetchCreds, fetchWithCreds } from '../../utils.fetch';
import { updatePopup } from '../popups/slice';
import { requestErrored } from '../status/slice';

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const { status, data } = await fetchCreds({
        onError: () => dispatch(requestErrored()),
      });
      if (status === 200) {
        const userId = data.user_id.toString();
        ReactGA.set({ userId });
        ReactGA.gtag('set', 'user_properties', {
          userId,
        });
        return { data, status };
      }
      if (status === 401) return { data: 'UPDATE_POPUP', status };
      throw data.error;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

export const adminFetchUsers = createAsyncThunk(
  'user/admin/fetchUsers',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const { status, data } = await fetchWithCreds({
        path: `${hostname}amanuensis/admin/get_users`,
        onError: () => dispatch(requestErrored()),
      });
      if (status === 200) return { data, status };
      if (status === 401) return { data: { users: [] }, status: 200 };
      throw data.error;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

export const logoutAPI = createAsyncThunk(
  'user/logoutAPI',
  /** @param {boolean} displayAuthPopup */
  async (displayAuthPopup, { dispatch }) => {
    const { url } = await fetch(
      `${userapiPath}/logout?next=${hostname}${
        process.env.NODE_ENV === 'development' ? 'dev.html' : ''
      }`,
    );

    if (displayAuthPopup) dispatch(updatePopup({ authPopup: true }));
    else document.location.replace(url);

    window.localStorage.clear();
    window.sessionStorage.clear();
  },
);
