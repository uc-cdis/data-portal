import { hostname } from './localconf';

export * from './localconf'; // / eslint-disable-line
const csrftoken = document.cookie.replace(/(?:(?:^|.*;\s*)csrftoken\s*=\s*([^;]*).*$)|^.*$/, '$1');

export const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'x-csrf-token': csrftoken,
};

/**
 * Soon the CSRF cookie will not be readable, as
 * verracode cannot deal with cookies that are not http only.
 *
 * @return the csrf token, and set headers.x-csrf-token as a side effect
 */
export async function fetchAndSetCsrfToken() {
  return fetch(`${hostname}_status`).then(
    (res) => {
      if (res.status < 200 || res.status > 210) {
        throw new Error('Failed to retrieve CSRF token');
      }
      return res.json();
    },
  ).then(
    (info) => {
      if (!info.csrf) {
        throw new Error('Retrieved empty CSRF token');
      }
      headers['x-csrf-token'] = info.csrf;
      return info.csrf;
    },
  );
}
