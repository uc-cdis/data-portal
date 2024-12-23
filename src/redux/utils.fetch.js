import { headers, userapiPath } from '../localconf';

/** @typedef {import('../types').FetchHelperOptions} FetchHelperOptions */
/** @typedef {import('../types').FetchHelperResult} FetchHelperResult */

/** @type {{ [path: string]: string; }} */
const fetchCache = {};

/**
 * @param {string} path
 * @param {Response} response
 * @param {boolean} useCache
 * @param {string} method
 * @returns {Promise<FetchHelperResult>}
 */
async function parseResponse(path, response, useCache, method) {
  let data;
  const textData = await response.text();
  if (textData)
    try {
      data = JSON.parse(textData);

      if (useCache && method === 'GET' && response.status === 200)
        fetchCache[path] = textData;
    } catch (e) {
      // textData is not JSON; use as is
      data = textData;
    }

  return {
    response,
    data,
    status: response.status,
    headers: response.headers,
  };
}

/** @type {Promise<FetchHelperResult>} */
let pendingUserResponse = null;

/**
 * @param {Object} opts
 * @param {string} [opts.method]
 * @param {() => void} [opts.onError]
 * @param {string} [opts.path]
 */
export async function fetchCreds(opts) {
  if (pendingUserResponse) return pendingUserResponse;

  const { method = 'GET', onError, path = `${userapiPath}user/` } = opts;
  try {
    const response = await fetch(path, {
      credentials: 'include',
      headers,
      method,
    });
    pendingUserResponse = parseResponse(path, response, false, method);
    return pendingUserResponse;
  } catch (error) {
    onError?.();
    pendingUserResponse = null;
    return error;
  }
}

/**
 * Little helper issues fetch, then resolves response
 * as text, and tries to JSON.parse the text before resolving, but
 * ignores JSON.parse failure and reponse.status, and returns {response, data} either way.
 * If onError is supplied, then onError() on fetch reject.
 * If useCache is supplied and method is GET,
 * then text for 200 JSON responses are cached, and re-used, and
 * the result promise only includes {data, status} - where JSON data is re-parsed
 * every time to avoid mutation by the client
 *
 * @param {FetchHelperOptions} opts
 * @return {Promise<FetchHelperResult>}
 */
export async function fetchWithCreds(opts) {
  const { method = 'GET', onError, path, useCache } = opts;

  // cache requested & available; return cached data
  if (useCache && method === 'GET' && fetchCache[path])
    return Promise.resolve({ status: 200, data: JSON.parse(fetchCache[path]) });

  try {
    const { body = null, customHeaders, signal } = opts;

    /** @type {RequestInit} */
    const request = {
      credentials: 'include',
      headers: { ...headers, ...customHeaders },
      method,
      body,
      signal,
    };

    let response = await fetch(path, request);

    // user is authorized; return data
    if (response.status !== 403 && response.status !== 401)
      return parseResponse(path, response, useCache, method);

    // user not authorized; re-fetch user info
    const credsResponse = await fetchCreds({ onError });

    // failed to re-fetch user info; return empty data
    if (credsResponse.status !== 200)
      return {
        response: credsResponse.response,
        data: { data: {} },
        status: credsResponse.status,
        headers: credsResponse.headers,
      };

    // re-fetch
    response = await fetch(path, request);
    return parseResponse(path, response, useCache, method);
  } catch (error) {
    onError?.();
    throw error;
  }
}

/**
* @param {FetchHelperOptions} opts
* @return {Promise<FetchHelperResult>}
*/
export async function fetchWithOpts(opts) {
  const { method = 'GET', onError, path, useCache } = opts;

  // cache requested & available; return cached data
  if (useCache && method === 'GET' && fetchCache[path])
    return Promise.resolve({ status: 200, data: JSON.parse(fetchCache[path]) });

  try {
    const { body = null, customHeaders, signal } = opts;

    /** @type {RequestInit} */
    const request = {
      credentials: 'omit',
      headers: { ...headers, ...customHeaders },
      method,
      body,
      signal,
    };

    let response = await fetch(path, request);

    // user is authorized; return data
    if (response.status !== 403 && response.status !== 401)
      return parseResponse(path, response, useCache, method);

    // user not authorized; re-fetch user info
    const credsResponse = await fetchCreds({ onError });

    // failed to re-fetch user info; return empty data
    if (credsResponse.status !== 200)
      return {
        response: credsResponse.response,
        data: { data: {} },
        status: credsResponse.status,
        headers: credsResponse.headers,
      };

    // re-fetch
    response = await fetch(path, request);
  } catch (error) {
    onError?.();
    throw error;
  }
}

/**
 * @param {FetchHelperOptions} opts
 * @param {number} timeoutInMS
 */
export async function fetchWithCredsAndTimeout(opts, timeoutInMS) {
  let isTimedOut = false;
  try {
    const timeout = setTimeout(() => {
      isTimedOut = true;
      throw Error('Request timed out');
    }, timeoutInMS);

    const response = await fetchWithCreds(opts);
    clearTimeout(timeout);

    if (isTimedOut) return null;
    return response;
  } catch (err) {
    if (isTimedOut) return null;
    throw err;
  }
}
