import 'isomorphic-fetch';
import {
  apiPath,
  userapiPath,
  headers,
  basename,
  submissionApiOauthPath,
  submissionApiPath,
  graphqlPath,
  guppyGraphQLUrl,
  arrangerGraphqlPath,
  graphqlSchemaUrl,
  useGuppyForExplorer,
  authzPath,
} from './configs';
import { config } from './params';
import sessionMonitor from './SessionMonitor';

export const updatePopup = state => ({
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

const getJsonOrText = (path, response, useCache, method = 'GET') => response.text().then(
  (textData) => {
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
    return { response, data, status: response.status, headers: response.headers };
  });

let pendingRequest = null;
export const fetchCreds = (opts) => {
  if (pendingRequest) { return pendingRequest; }
  const { path = `${userapiPath}user/`, method = 'GET', dispatch } = opts;
  const request = {
    credentials: 'include',
    headers: { ...headers },
    method,
  };
  pendingRequest = fetch(path, request).then(
    (response) => {
      pendingRequest = null;
      return Promise.resolve(getJsonOrText(path, response, false));
    },
    (error) => {
      pendingRequest = null;
      if (dispatch) { dispatch(connectionError()); }
      return Promise.reject(error);
    },
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
 * @method fetchWithCreds
 * @param {path,method=GET,body=null,customHeaders?, dispatch?, useCache?} opts
 * @return Promise<{response,data,status,headers}> or Promise<{data,status}> if useCache specified
 */
export const fetchWithCreds = (opts) => {
  const { path, method = 'GET', body = null, customHeaders, dispatch, useCache } = opts;
  if (useCache && (method === 'GET') && fetchCache[path]) {
    return Promise.resolve({ status: 200, data: JSON.parse(fetchCache[path]) });
  }
  const request = {
    credentials: 'include',
    headers: { ...headers, ...customHeaders },
    method,
    body,
  };
  return fetch(path, request,
  ).then(
    (response) => {
      if (response.status !== 403 && response.status !== 401) {
        return Promise.resolve(getJsonOrText(path, response, useCache, method));
      }
      return Promise.resolve(fetchCreds({ dispatch }).then(
        (resp) => {
          switch (resp.status) {
          case 200:
            return Promise.resolve(fetch(path, request).then(
              res => getJsonOrText(path, res, useCache, method),
            ));
          default:
            return {
              response: resp,
              data: { data: {} },
              status: resp.status,
              headers: resp.headers,
            };
          }
        },
      ));
    },
    (error) => {
      if (dispatch) { dispatch(connectionError()); }
      return Promise.reject(error);
    },
  );
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
export const fetchWrapper = ({ path, method = 'GET', body = null, customHeaders, handler, callback = () => (null) }) =>
  dispatch => fetchWithCreds({ path, method, body, customHeaders, dispatch },
  ).then(
    ({ response, data }) => {
      const result = { response, data, status: response.status, headers: response.headers };
      const dispatchPromise = handler ? Promise.resolve(dispatch(handler(result))) : Promise.resolve('ok');
      return dispatchPromise.then(
        () => {
          callback();
          return result;
        },
      );
    },
  );

export const fetchGraphQL = graphQLParams =>
  // We first update the session so that the user will be notified
  // if their auth is insufficient to perform the query.
  sessionMonitor.updateSession().then(() => {
    const request = {
      credentials: 'include',
      headers: { ...headers },
      method: 'POST',
      body: JSON.stringify(graphQLParams),
    };

    return fetch(graphqlPath, request)
      .then(response => response.text())
      .then((responseBody) => {
        try {
          return JSON.parse(responseBody);
        } catch (error) {
          return responseBody;
        }
      });
  })
;

export const fetchFlatGraphQL = graphQLParams => sessionMonitor.updateSession().then(() => {
  const request = {
    credentials: 'include',
    headers: { ...headers },
    method: 'POST',
    body: JSON.stringify(graphQLParams),
  };

  const graphqlUrl = useGuppyForExplorer ? guppyGraphQLUrl : arrangerGraphqlPath;
  return fetch(graphqlUrl, request)
    .then(response => response.text())
    .then((responseBody) => {
      try {
        return JSON.parse(responseBody);
      } catch (error) {
        return responseBody;
      }
    });
});

export const handleResponse = type => ({ data, status }) => {
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

export const fetchUser = dispatch => fetchCreds({
  dispatch,
}).then(
  (status, data) => handleFetchUser(status, data),
).then(msg => dispatch(msg));

export const refreshUser = () => fetchUser;

export const logoutAPI = () => (dispatch) => {
  fetchWithCreds({
    path: `${submissionApiOauthPath}logout`,
    dispatch,
  })
    .then(handleResponse('RECEIVE_API_LOGOUT'))
    .then(msg => dispatch(msg))
    .then(
      () => document.location.replace(`${userapiPath}/logout?next=${basename}`),
    );
};

export const fetchIsUserLoggedInNoRefresh = (opts) => {
  const { path = `${submissionApiPath}`, method = 'GET', dispatch } = opts;
  const request = {
    credentials: 'include',
    headers: { ...headers },
    method,
  };
  let requestPromise = fetch(path, request).then(
    (response) => {
      requestPromise = null;
      return Promise.resolve(getJsonOrText(path, response, false));
    },
    (error) => {
      requestPromise = null;
      if (dispatch) { dispatch(connectionError()); }
      return Promise.reject(error);
    },
  );
  return requestPromise;
};

export const fetchUserNoRefresh = dispatch => fetchIsUserLoggedInNoRefresh({
  dispatch,
}).then(
  (status, data) => handleFetchUser(status, data),
).then(msg => dispatch(msg));

/**
 * Retrieve the oath endpoint for the service under the given oathPath
 *
 * @param {String} oauthPath
 * @return {(dispatch) => Promise<string>} dispatch function
 */
export const fetchOAuthURL = oauthPath => dispatch =>
  fetchWithCreds({
    path: `${oauthPath}authorization_url`,
    dispatch,
    useCache: true,
  })
    .then(
      ({ status, data }) => {
        switch (status) {
        case 200:
          return {
            type: 'RECEIVE_AUTHORIZATION_URL',
            url: data,
          };
        default:
          return {
            type: 'FETCH_ERROR',
            error: data.error,
          };
        }
      },
    )
    .then(
      (msg) => {
        dispatch(msg);
        if (msg.url) {
          return msg.url;
        }
        throw new Error('OAuth authorization failed');
      },
    );

/*
 * redux-thunk support asynchronous redux actions via 'thunks' -
 * lambdas that accept dispatch and getState functions as arguments
 */

export const fetchProjects = () => dispatch =>
  fetchWithCreds({
    path: `${submissionApiPath}graphql`,
    body: JSON.stringify({
      query: 'query { project(first:0) {code, project_id, availability_type}}',
    }),
    method: 'POST',
  })
    .then(
      ({ status, data }) => {
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
    .then(msg => dispatch(msg));


/**
 * Fetch the schema for graphi, and stuff it into redux -
 * handled by router
 */
export const fetchSchema = dispatch => fetchWithCreds({ path: graphqlSchemaUrl, dispatch })
  .then(
    ({ status, data }) => {
      switch (status) {
      case 200:
        return dispatch(
          {
            type: 'RECEIVE_SCHEMA_LOGIN',
            schema: data,
          },
        );
      default:
        return Promise.resolve('NOOP');
      }
    },
  );


export const fetchDictionary = dispatch =>
  fetchWithCreds({
    path: `${submissionApiPath}_dictionary/_all`,
    method: 'GET',
    useCache: true,
  })
    .then(
      ({ status, data }) => {
        switch (status) {
        case 200:
          return {
            type: 'RECEIVE_DICTIONARY',
            data,
          };
        default:
          return {
            type: 'FETCH_ERROR',
            error: data,
          };
        }
      })
    .then(msg => dispatch(msg));


export const fetchVersionInfo = dispatch =>
  fetchWithCreds({
    path: `${apiPath}_version`,
    method: 'GET',
    useCache: true,
  })
    .then(
      ({ status, data }) => {
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
      },
    ).then(msg => dispatch(msg));


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
      `${authzPath}?resource=${e.resource}&method=${e.method}&service=${e.service}`,
    )
      .then((fetchRes) => {
        switch (fetchRes.status) {
        case 401: // user is not logged in
        case 403: // user is not allowed to access the resource
          return false;
        case 200: // valid input -> check "ok" field for authorization
          return fetchRes.ok;
        default:
          console.error(`Unknown status "${fetchRes.status}" returned by arborist call`);
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
