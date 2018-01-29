import 'isomorphic-fetch';
import { apiPath, userapiPath, headers, basename, submissionApiOauthPath, submissionApiPath, graphqlPath, graphqlSchemaUrl } from './configs';


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
 * @method fetchJsonOrText
 * @param {path,method=GET,body=null,customHeaders?, dispatch?, useCache?} opts
 * @return Promise<{response,data,status,headers}> or Promise<{data,status}> if useCache specified
 */
export const fetchJsonOrText = (opts) => {
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
    response => response.text().then(
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
      }),
    (error) => {
      if (dispatch) { dispatch(connectionError()); }
      return Promise.reject(error);
    },
  );
};

/**
 * Redux 'thunk' wrapper around fetchJsonOrText
 * invokes dispatch(handler( { status, data, headers} ) and callback()
 * and propagates {response,data, status, headers} on resolved fetch,
 * otherwise dipatch(connectionError()) on fetch rejection.
 * May prefer this over straight call to fetchJsonOrText in Redux context due to
 * conectionError() dispatch on fetch rejection.
 *
 * @param {path,method=GET,body=null,customerHeaders,handler,callback} opts
 * @return Promise
 */
export const fetchWrapper = ({ path, method = 'GET', body = null, customHeaders, handler, callback = () => (null) }) =>
  dispatch => fetchJsonOrText({ path, method, body, customHeaders, dispatch },
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

export const fetchGraphQL = (graphQLParams) => {
  const request = {
    credentials: 'include',
    headers: { ...headers },
    method: 'POST',
    body: JSON.stringify(graphQLParams),
  };

  return fetch(graphqlPath, request).then(response => response.text()).then((responseBody) => {
    try {
      return JSON.parse(responseBody);
    } catch (error) {
      return responseBody;
    }
  });
};

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

export const unauthorizedError = () => ({
  type: 'REQUEST_ERROR',
  error: 'unauthorized',
});


export const fetchUser = dispatch => fetchJsonOrText({
  path: `${userapiPath}user/`,
  dispatch,
}).then(
  ({ status, data }) => {
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
  },
).then((msg) => { dispatch(msg); });


export const logoutAPI = () => dispatch => fetchJsonOrText({
  path: `${submissionApiOauthPath}logout`,
  dispatch,
})
  .then(handleResponse('RECEIVE_API_LOGOUT'))
  .then(msg => dispatch(msg))
  .then(
    () => document.location.replace(`${userapiPath}/logout?next=${basename}`),
  );


/**
 * Retrieve the oath endpoint for the service under the given oathPath
 *
 * @param {String} oauthPath
 * @return {(dispatch) => Promise<string>} dispatch function
 */
export const fetchOAuthURL = oauthPath => dispatch =>
  fetchJsonOrText({
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
  fetchJsonOrText({
    path: `${submissionApiPath}graphql`,
    body: JSON.stringify({
      query: 'query Test { project(first:10000) {code, project_id}}',
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
          };
        default:
          return {
            type: 'FETCH_ERROR',
            error: data,
          };
        }
      })
    .then(msg => dispatch(msg));


/**
 * Fetch the schema for graphi, and stuff it into redux -
 * handled by router
 */
export const fetchSchema = dispatch => fetchJsonOrText({ path: graphqlSchemaUrl, dispatch })
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
  fetchJsonOrText({
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


export const fetchVersionInfo = () =>
  fetchJsonOrText({ path: `${apiPath}_version`, method: 'GET', useCache: true });
