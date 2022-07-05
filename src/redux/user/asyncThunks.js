import { createAsyncThunk } from '@reduxjs/toolkit';
import { hostname, userapiPath } from '../../localconf';
import { fetchCreds } from '../../utils.fetch';
import { updatePopup } from '../popups/slice';
import { requestErrored } from '../status/slice';

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const { status, data } = await fetchCreds({
        onError: () => dispatch(requestErrored()),
      });
      if (status === 200) return data;
      if (status === 401) return 'UPDATE_POPUP';
      throw data.error;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const logoutAPI = createAsyncThunk(
  'user/logoutAPI',
  /** @param {boolean} displayAuthPopup */
  async (displayAuthPopup, { dispatch }) => {
    const { url } = await fetch(
      `${userapiPath}/logout?next=${hostname}${
        process.env.NODE_ENV === 'development' ? 'dev.html' : ''
      }`
    );

    if (displayAuthPopup) dispatch(updatePopup({ authPopup: true }));
    else document.location.replace(url);

    window.localStorage.clear();
    window.sessionStorage.clear();
  }
);
