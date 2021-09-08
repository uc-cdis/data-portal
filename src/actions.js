import 'isomorphic-fetch';
import { buildClientSchema, getIntrospectionQuery } from 'graphql/utilities';
import {
  apiPath,
  userapiPath,
  guppyGraphQLUrl,
  headers,
  hostname,
  submissionApiOauthPath,
  submissionApiPath,
  authzPath,
} from './localconf';
import { config } from './params';

export const updatePopup = (state) => ({
  type: 'UPDATE_POPUP',
  data: state,
});

export const connectionError = () => {
  console.log('connection error');
  return {
    type: 'REQUEST_ERROR',
    error: 'connection_error',
  };
};

const fetchCache = {};

const getJsonOrText = (path, response, useCache, method = 'GET') =>
  response.text().then((textData) => {
    let data = textData;
    if (data) {
      try {
        data = JSON.parse(data);
        if (useCache && method === 'GET' && response.status === 200) {
          fetchCache[path] = textData;
        }
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

let pendingRequest = null;
export const fetchCreds = (opts) => {
  if (pendingRequest) {
    return pendingRequest;
  }
  const { path = `${userapiPath}user/`, method = 'GET', dispatch } = opts;

  pendingRequest = fetch(path, {
    credentials: 'include',
    headers: { ...headers },
    method,
  }).then(
    (response) => {
      pendingRequest = null;
      return Promise.resolve(getJsonOrText(path, response, false));
    },
    (error) => {
      pendingRequest = null;
      if (dispatch) {
        dispatch(connectionError());
      }
      return Promise.reject(error);
    }
  );
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
 * @param {object} opts
 * @param {string} opts.path
 * @param {string} [opts.method] Default is "GET"
 * @param {object} [opts.body] Default is null
 * @param {object} [opts.customHeaders]
 * @param {Function} [opts.dispatch] Redux store dispatch
 * @param {boolean} [opts.useCache]
 * @param {AbortSignal} [opts.signal]
 * @return Promise<{response,data,status,headers}> or Promise<{data,status}> if useCache specified
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
  return fetch(path, request).then(
    (response) => {
      if (response.status !== 403 && response.status !== 401) {
        return Promise.resolve(getJsonOrText(path, response, useCache, method));
      }
      return Promise.resolve(
        fetchCreds({ dispatch }).then((resp) => {
          switch (resp.status) {
            case 200:
              return Promise.resolve(
                fetch(path, request).then((res) =>
                  getJsonOrText(path, res, useCache, method)
                )
              );
            default:
              return {
                response: resp,
                data: { data: {} },
                status: resp.status,
                headers: resp.headers,
              };
          }
        })
      );
    },
    (error) => {
      if (dispatch) {
        dispatch(connectionError());
      }
      return Promise.reject(error);
    }
  );
};

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
 * Redux 'thunk' wrapper around fetchWithCreds
 * invokes dispatch(handler( { status, data, headers} ) and callback()
 * and propagates {response,data, status, headers} on resolved fetch,
 * otherwise dipatch(connectionError()) on fetch rejection.
 * May prefer this over straight call to fetchWithCreds in Redux context due to
 * conectionError() dispatch on fetch rejection.
 *
 * @param { path, method=GET, body=null, customerHeaders, handler, callback } opts
 * @return Promise
 */
export const fetchWrapper = ({
  path,
  method = 'GET',
  body = null,
  customHeaders,
  handler,
  callback = () => null,
}) => (dispatch) =>
  fetchWithCreds({ path, method, body, customHeaders, dispatch }).then(
    ({ response, data }) => {
      const result = {
        response,
        data,
        status: response.status,
        headers: response.headers,
      };
      const dispatchPromise = handler
        ? Promise.resolve(dispatch(handler(result)))
        : Promise.resolve('ok');
      return dispatchPromise.then(() => {
        callback();
        return result;
      });
    }
  );

export const handleResponse = (type) => ({ data, status }) => {
  switch (status) {
    case 200:
      return {
        type,
        data,
      };
    default:
      return {
        type: 'FETCH_ERROR',
        error: data,
      };
  }
};

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

export const fetchUser = (dispatch) =>
  fetchCreds({
    dispatch,
  })
    .then((res) => handleFetchUser(res))
    .then((msg) => dispatch(msg));

export const refreshUser = () => fetchUser;

export const logoutAPI = () => (dispatch) => {
  fetchWithCreds({
    path: `${submissionApiOauthPath}logout`,
    dispatch,
  })
    .then(handleResponse('RECEIVE_API_LOGOUT'))
    .then((msg) => dispatch(msg))
    .then(() =>
      document.location.replace(
        `${userapiPath}/logout?next=${hostname}${
          process.env.NODE_ENV === 'dev' ? 'dev.html' : ''
        }`
      )
    );
};

export const fetchIsUserLoggedInNoRefresh = (opts) => {
  const { path = `${submissionApiPath}`, method = 'GET', dispatch } = opts;

  let requestPromise = fetch(path, {
    credentials: 'include',
    headers: { ...headers },
    method,
  }).then(
    (response) => {
      requestPromise = null;
      return Promise.resolve(getJsonOrText(path, response, false));
    },
    (error) => {
      requestPromise = null;
      if (dispatch) {
        dispatch(connectionError());
      }
      return Promise.reject(error);
    }
  );
  return requestPromise;
};

export const fetchUserNoRefresh = (dispatch) =>
  fetchIsUserLoggedInNoRefresh({
    dispatch,
  })
    .then((res) => handleFetchUser(res))
    .then((msg) => dispatch(msg));

/*
 * redux-thunk support asynchronous redux actions via 'thunks' -
 * lambdas that accept dispatch and getState functions as arguments
 */

export const fetchProjects = () => (dispatch) =>
  fetchWithCreds({
    path: `${submissionApiPath}graphql`,
    body: JSON.stringify({
      query: 'query { project(first:0) {code, project_id, availability_type}}',
    }),
    method: 'POST',
  })
    .then(({ status, data }) => {
      switch (status) {
        case 200:
          return {
            type: 'RECEIVE_PROJECTS',
            data: data.data.project,
            status,
          };
        default:
          return {
            type: 'FETCH_ERROR',
            error: data,
            status,
          };
      }
    })
    .then((msg) => dispatch(msg));

/**
 * Fetch the schema for graphi, and stuff it into redux -
 * handled by router
 */
export const fetchSchema = (dispatch) =>
  fetch('../data/schema.json')
    .then((response) => response.json())
    .then(({ data }) =>
      dispatch({ type: 'RECEIVE_SCHEMA', schema: buildClientSchema(data) })
    );

export const fetchGuppySchema = (dispatch) =>
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

export const fetchDictionary = (dispatch) =>
  fetch('../data/dictionary.json')
    .then((response) => response.json())
    .then((data) => dispatch({ type: 'RECEIVE_DICTIONARY', data }));

export const fetchVersionInfo = (dispatch) =>
  fetchWithCreds({
    path: `${apiPath}_version`,
    method: 'GET',
    useCache: true,
  })
    .then(({ status, data }) => {
      switch (status) {
        case 200:
          return {
            type: 'RECEIVE_VERSION_INFO',
            data,
          };
        default:
          return {
            type: 'FETCH_ERROR',
            error: data,
          };
      }
    })
    .then((msg) => dispatch(msg));

// asks arborist which restricted access components the user has access to
export const fetchUserAccess = async (dispatch) => {
  // restricted access components and their associated arborist resources:
  const mapping = config.componentToResourceMapping || {};

  const userAccess = await Object.keys(mapping).reduce(async (res, name) => {
    const dict = await res;
    const e = mapping[name];

    // makes a call to arborist's auth/proxy endpoint
    // returns true if the user has access to the resource, false otherwise
    dict[name] = await fetch(
      `${authzPath}?resource=${e.resource}&method=${e.method}&service=${e.service}`
    ).then((fetchRes) => {
      switch (fetchRes.status) {
        case 401: // user is not logged in
        case 403: // user is not allowed to access the resource
          return false;
        case 200: // valid input -> check "ok" field for authorization
          return fetchRes.ok;
        default:
          console.error(
            `Unknown status "${fetchRes.status}" returned by arborist call`
          );
          return false;
      }
    });
    return dict;
  }, {});

  dispatch({
    type: 'RECEIVE_USER_ACCESS',
    data: userAccess,
  });
};
