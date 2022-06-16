/* eslint-disable import/prefer-default-export */

import { connectionError } from '../actions';
import { fetchWithCreds } from '../utils.fetch';
import { loginPath } from '../localconf';
import { loginEndpointErrored, receiveLoginEndpoint } from './actions';

/** @type {import('./types').LoginProvider[]} */
const defaultProviders = [
  {
    idp: 'google',
    name: 'Google OAuth',
    urls: [
      {
        name: 'Google OAuth',
        url: `${loginPath}google/`,
      },
    ],
  },
];

export function fetchLogin() {
  /** @param {import('redux').Dispatch} dispatch */
  return async (dispatch) => {
    const { data, status } = await fetchWithCreds({
      path: loginPath,
      onError: () => dispatch(connectionError()),
    });

    if (status === 200) return dispatch(receiveLoginEndpoint(data.providers));
    if (status === 404) return dispatch(receiveLoginEndpoint(defaultProviders));
    return dispatch(loginEndpointErrored(data.error));
  };
}
