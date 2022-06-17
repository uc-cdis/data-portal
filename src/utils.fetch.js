import { headers, userapiPath } from './localconf';

/** @typedef {import('./types').FetchHelperOptions} FetchHelperOptions */
/** @typedef {import('./types').FetchHelperResult} FetchHelperResult */

/** @type {{ [path: string]: string; }} */
const fetchCache = {};

/**
 * @param {string} path
 * @param {Response} response
 * @param {boolean} useCache
 * @param {string} method
 * @returns {Promise<FetchHelperResult>}
 */
const getJsonOrText = (path, response, useCache, method = 'GET') =>
  response.text().then((textData) => {
    let data = textData;
    if (data) {
      try {
        data = JSON.parse(data);
        if (useCache && method === 'GET' && response.status === 200)
          fetchCache[path] = textData;
      } catch (e) {
        // # do nothing
      }
    }
    return {
      response,
      data,
      status: response.status,
      headers: response.headers,
    };
  });

/** @type {Promise<FetchHelperResult>} */
let pendingRequest = null;

/**
 * @param {Object} opts
 * @param {string} [opts.path]
 * @param {string} [opts.method]
 * @param {() => void} [opts.onError]
 */
export const fetchCreds = (opts) => {
  if (pendingRequest) {
    return pendingRequest;
  }
  const { path = `${userapiPath}user/`, method = 'GET', onError } = opts;

  pendingRequest = fetch(path, {
    credentials: 'include',
    headers,
    method,
  })
    .then((response) => {
      pendingRequest = null;
      return getJsonOrText(path, response, false);
    })
    .catch((error) => {
      pendingRequest = null;
      onError?.();
      return error;
    });
  return pendingRequest;
};

/**
 * Little helper issues fetch, then resolves response
 * as text, and tries to JSON.parse the text before resolving, but
 * ignores JSON.parse failure and reponse.status, and returns {response, data} either way.
 * If dispatch is supplied, then dispatch(connectionError()) on fetch reject.
 * If useCache is supplied and method is GET,
 * then text for 200 JSON responses are cached, and re-used, and
 * the result promise only includes {data, status} - where JSON data is re-parsed
 * every time to avoid mutation by the client
 *
 * @param {FetchHelperOptions} opts
 * @return {Promise<FetchHelperResult>}
 */
export const fetchWithCreds = (opts) => {
  const {
    path,
    method = 'GET',
    body = null,
    customHeaders,
    onError,
    useCache,
    signal,
  } = opts;
  if (useCache && method === 'GET' && fetchCache[path]) {
    return Promise.resolve({ status: 200, data: JSON.parse(fetchCache[path]) });
  }
  /** @type {RequestInit} */
  const request = {
    credentials: 'include',
    headers: { ...headers, ...customHeaders },
    method,
    body,
    signal,
  };
  return fetch(path, request)
    .then((response) => {
      if (response.status !== 403 && response.status !== 401)
        return getJsonOrText(path, response, useCache, method);

      return fetchCreds({ onError }).then((resp) => {
        switch (resp.status) {
          case 200:
            return fetch(path, request).then((res) =>
              getJsonOrText(path, res, useCache, method)
            );
          default:
            return {
              response: resp.response,
              data: { data: {} },
              status: resp.status,
              headers: resp.headers,
            };
        }
      });
    })
    .catch((error) => {
      onError?.();
      return Promise.reject(error);
    });
};

/**
 * @param {FetchHelperOptions} opts
 * @param {number} timeoutInMS
 */
export const fetchWithCredsAndTimeout = (opts, timeoutInMS) => {
  let didTimeOut = false;

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      didTimeOut = true;
      reject(new Error('Request timed out'));
    }, timeoutInMS);

    fetchWithCreds(opts)
      .then((response) => {
        // Clear the timeout as cleanup
        clearTimeout(timeout);
        if (!didTimeOut) {
          resolve(response);
        }
      })
      .catch((err) => {
        // Rejection already happened with setTimeout
        if (didTimeOut) return;
        // Reject with error
        reject(err);
      });
  });
};
