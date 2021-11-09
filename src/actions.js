import 'isomorphic-fetch';
import { buildClientSchema, getIntrospectionQuery } from 'graphql/utilities';
import {
  userapiPath,
  guppyGraphQLUrl,
  headers,
  hostname,
  submissionApiPath,
  authzPath,
  guppyUrl,
} from './localconf';
import { config } from './params';

/**
 * @typedef {Object} FetchOptions
 * @property {string} path
 * @property {string} [method] Default is "GET"
 * @property {object} [body] Default is null
 * @property {Headers} [customHeaders]
 * @property {import('redux-thunk').ThunkDispatch} [dispatch] Redux store dispatch
 * @property {boolean} [useCache]
 * @property {AbortSignal} [signal]
 */

/**
 * @typedef {Object} FetchResult
 * @property {any} data
 * @property {Headers} [headers]  if not using cache
 * @property {Response} [response]  if not using cache
 * @property {number} status
 */

/** @returns {import('redux').AnyAction} */
export const updatePopup = (state) => ({
  type: 'UPDATE_POPUP',
  data: state,
});

/** @returns {import('redux').AnyAction} */
export const connectionError = () => {
  console.log('connection error');
  return {
    type: 'REQUEST_ERROR',
    error: 'connection_error',
  };
};

/** @type {{ [path: string]: string; }} */
const fetchCache = {};

/**
 * @param {string} path
 * @param {Response} response
 * @param {boolean} useCache
 * @param {string} method
 * @returns {Promise<FetchResult>}
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

/** @type {Promise<FetchResult>} */
let pendingRequest = null;
/**
 * @param {Object} opts
 * @param {string} [opts.path]
 * @param {string} [opts.method]
 * @param {import('redux-thunk').ThunkDispatch} [opts.dispatch]
 */
export const fetchCreds = (opts) => {
  if (pendingRequest) {
    return pendingRequest;
  }
  const { path = `${userapiPath}user/`, method = 'GET', dispatch } = opts;

  pendingRequest = fetch(path, {
    credentials: 'include',
    headers: { ...headers },
    method,
  })
    .then((response) => {
      pendingRequest = null;
      return getJsonOrText(path, response, false);
    })
    .catch((error) => {
      pendingRequest = null;
      if (dispatch) {
        dispatch(connectionError());
      }
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
 * @param {FetchOptions} opts
 * @return {Promise<FetchResult>}
 */
export const fetchWithCreds = (opts) => {
  const {
    path,
    method = 'GET',
    body = null,
    customHeaders,
    dispatch,
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

      return fetchCreds({ dispatch }).then((resp) => {
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
      if (dispatch) {
        dispatch(connectionError());
      }
      return Promise.reject(error);
    });
};

/**
 *
 * @param {FetchOptions} opts
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

/**
 * @param {FetchResult} result
 * @returns {import('redux').AnyAction}
 */
const handleFetchUser = ({ status, data }) => {
  switch (status) {
    case 200:
      return {
        type: 'RECEIVE_USER',
        user: data,
      };
    case 401:
      return {
        type: 'UPDATE_POPUP',
        data: { authPopup: true },
      };
    default:
      return {
        type: 'FETCH_ERROR',
        error: data.error,
      };
  }
};

/** @returns {import('redux-thunk').ThunkAction<Promise, any, any, any>} */
export const fetchUser = () => (dispatch) =>
  fetchCreds({ dispatch }).then((res) => dispatch(handleFetchUser(res)));

/**
 * @param {boolean} displayAuthPopup
 * @returns {import('redux-thunk').ThunkAction<Promise, any, any, any>}
 */
export const logoutAPI = (displayAuthPopup = false) => (dispatch) =>
  fetch(
    `${userapiPath}/logout?next=${hostname}${
      process.env.NODE_ENV === 'development' ? 'dev.html' : ''
    }`
  ).then((response) => {
    if (displayAuthPopup)
      dispatch({
        type: 'UPDATE_POPUP',
        data: {
          authPopup: true,
        },
      });
    else document.location.replace(response.url);
  });

/**
 * @param {Object} opts
 * @param {string} [opts.path]
 * @param {string} [opts.method]
 * @param {import('redux-thunk').ThunkDispatch} [opts.dispatch]
 * @returns {?Promise<FetchResult>}
 */
export const fetchIsUserLoggedInNoRefresh = (opts) => {
  const { path = `${submissionApiPath}`, method = 'GET', dispatch } = opts;

  let requestPromise = fetch(path, {
    credentials: 'include',
    headers: { ...headers },
    method,
  }).then(
    (response) => {
      requestPromise = null;
      return getJsonOrText(path, response, false);
    },
    (error) => {
      requestPromise = null;
      if (dispatch) dispatch(connectionError());

      return error;
    }
  );
  return requestPromise;
};

/** @returns {import('redux-thunk').ThunkAction<Promise, any, any, any>} */
export const fetchUserNoRefresh = () => (dispatch) =>
  fetchIsUserLoggedInNoRefresh({
    dispatch,
  }).then((res) => dispatch(handleFetchUser(res)));

/**
 * redux-thunk support asynchronous redux actions via 'thunks' -
 * lambdas that accept dispatch and getState functions as arguments
 * @returns {import('redux-thunk').ThunkAction<Promise, any, any, any>}
 */
export const fetchProjects = () => (dispatch) =>
  fetchWithCreds({
    path: `${submissionApiPath}graphql`,
    body: JSON.stringify({
      query: 'query { project(first:0) {code, project_id, availability_type}}',
    }),
    method: 'POST',
  }).then(({ status, data }) => {
    if (status === 200)
      dispatch({
        type: 'RECEIVE_PROJECTS',
        data: data.data.project,
        status,
      });
    else
      dispatch({
        type: 'FETCH_ERROR',
        error: data,
        status,
      });
  });

/**
 * Fetch the schema for graphi, and stuff it into redux - handled by router
 * @returns {import('redux-thunk').ThunkAction<Promise, any, any, any>}
 */
export const fetchSchema = () => (dispatch) =>
  fetch('../data/schema.json')
    .then((response) => response.json())
    .then(({ data }) =>
      dispatch({ type: 'RECEIVE_SCHEMA', schema: buildClientSchema(data) })
    );

/** @returns {import('redux-thunk').ThunkAction<Promise, any, any, any>} */
export const fetchGuppySchema = () => (dispatch) =>
  fetch(guppyGraphQLUrl, {
    credentials: 'include',
    headers: { ...headers },
    method: 'POST',
    body: JSON.stringify({
      query: getIntrospectionQuery(),
      operationName: 'IntrospectionQuery',
    }),
  })
    .then((response) => response.json())
    .then(({ data }) =>
      dispatch({ type: 'RECEIVE_GUPPY_SCHEMA', data: buildClientSchema(data) })
    );

/** @returns {import('redux-thunk').ThunkAction<Promise, any, any, any>} */
export const fetchDictionary = () => (dispatch) =>
  fetch('../data/dictionary.json')
    .then((response) => response.json())
    .then((data) => dispatch({ type: 'RECEIVE_DICTIONARY', data }));

/** @returns {import('redux-thunk').ThunkAction<Promise, any, any, any>} */
export const fetchVersionInfo = () => (dispatch) =>
  fetchWithCreds({
    path: `${guppyUrl}/_data_version`,
    method: 'GET',
    useCache: true,
  }).then(({ status, data }) => {
    if (status === 200)
      dispatch({
        type: 'RECEIVE_VERSION_INFO',
        data,
      });
    else
      dispatch({
        type: 'FETCH_ERROR',
        error: data,
      });
  });

/**
 * Asks arborist which restricted access components the user has access to
 * @returns {import('redux-thunk').ThunkAction<Promise, any, any, any>}
 */
export const fetchUserAccess = () => async (dispatch) => {
  /**
   * restricted access components and their associated arborist resources:
   * @type {{ [name: string]: { [key: string]: string } }}
   */
  const resourceMapping = config.componentToResourceMapping || {};
  const resourceNames = Object.keys(resourceMapping);

  const userAccessResults = await Promise.all(
    resourceNames.map((name) => {
      const { resource, method, service } = resourceMapping[name];
      return fetch(
        `${authzPath}?resource=${resource}&method=${method}&service=${service}`
      ).then(({ status, ok }) => {
        switch (status) {
          case 401: // user is not logged in
          case 403: // user is not allowed to access the resource
            return false;
          case 200: // valid input -> check "ok" field for authorization
            return ok;
          default:
            console.error(
              `Unknown status "${status}" returned by arborist call`
            );
            return false;
        }
      });
    })
  );

  /** @type {{ [name: string]: boolean }} */
  const userAccess = {};
  userAccessResults.forEach((hasAccess, i) => {
    userAccess[resourceNames[i]] = hasAccess;
  });

  dispatch({
    type: 'RECEIVE_USER_ACCESS',
    data: userAccess,
  });
};
