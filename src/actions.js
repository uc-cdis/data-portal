import 'isomorphic-fetch';
import _ from 'underscore';
import { requiredCerts, userapiPath, headers, basename, submissionApiOauthPath, graphqlPath } from './configs';


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

/**
 * Little helper issues fetch, then resolves response
 * as text, and tries to JSON.parse the text before resolving, but
 * ignores JSON.parse failure and reponse.status, and returns {response, data} either way.
 * If dispatch is supplied, then dispatch(connectionError()) on fetch reject.
 * 
 * @method fetchJsonOrText
 * @param {path,method=GET,body=null,customHeaders?, dispatch?} opts 
 * @return Promise<{response,data,status,headers}
 */
export const fetchJsonOrText = (opts) => {
  const { path, method = 'GET', body = null, customHeaders, dispatch } = opts;

  const request = {
    credentials: 'same-origin',
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
    credentials: 'same-origin',
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
        data: { auth_popup: true },
      };
    default:
      return {
        type: 'FETCH_ERROR',
        error: data.error,
      };
    }
  },
).then((msg) => { dispatch(msg); });

export const requireAuth = (store, additionalHooks) => (nextState, replace, callback) => {
  window.scrollTo(0, 0);
  const resolvePromise = () => {
    const { user } = store.getState();
    const location = nextState.location;
    if (!user.username) {
      const path = location.pathname === '/' ? '/' : `/${location.pathname}`;
      replace({ pathname: '/login', query: { next: path + nextState.location.search } });
      return Promise.resolve();
    }
    const hasCerts =
      _.intersection(requiredCerts, user.certificates_uploaded).length !== requiredCerts.length;
    // take quiz if this user doesn't have required certificate
    if (location.pathname !== 'quiz' && hasCerts) {
      replace({ pathname: '/quiz' });
    } else if (location.pathname === 'quiz' && !hasCerts) {
      replace({ pathname: '/' });
    } else if (additionalHooks) {
      return additionalHooks(nextState, replace);
    }
    return Promise.resolve();
  };
  store
    .dispatch(fetchUser)
    .then(resolvePromise)
    .then(() => callback());
};

export const enterHook = (store, hookAction) =>
  (nextState, replace, callback) => store.dispatch(hookAction()).then(() => callback());

export const receiveAPILogout = handleResponse('RECEIVE_API_LOGOUT');

export const logoutAPI = () => dispatch => dispatch(fetchWrapper({
  path: `${submissionApiOauthPath}logout`,
  handler: receiveAPILogout,
})).then(() => document.location.replace(`${userapiPath}/logout?next=${basename}`));

export const fetchOAuthURL = oauthPath => dispatch =>
// Get cloud_middleware's authorization url
  fetchJsonOrText({
    path: `${oauthPath}authorization_url`,
    dispatch,
  }).then(
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
  ).then(
    (msg) => {
      dispatch(msg);
      if (msg.url) {
        return msg.url;
      }
      throw new Error('OAuth authorization failed');
    },
  );
